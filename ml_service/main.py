import io
import os
import math
import cv2
import joblib
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form
from contextlib import asynccontextmanager

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms

# ── Environment ──
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── Constants from the training script ──
IMG_SIZE_CLS = 224
IMG_SIZE_SEG = 256
STATE_DIM = 12
ACTIONS = [
    "Increase Aerobic Exercise (150 min/wk)",  
    "Reduce Refined Sugars & Fast Food",       
    "High-Protein & High-Fiber Diet",          
    "Hormonal Contraceptive / Therapy",        
    "Improve Sleep Hygiene & Stress",          
    "Aggressive Weight Loss Program",          
    "Metformin / Insulin Sensitizer"           
]
N_ACTIONS = len(ACTIONS)

# ── Preprocessor Class ──
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
import pandas as pd

import sys

class TabularPreprocessor:
    def __init__(self, features):
        self.features = features
        self.imputer = SimpleImputer(strategy="median")
        self.scaler = StandardScaler()
        self.cols = []
    
    def fit(self, df):
        self.cols = [c for c in self.features if c in df.columns]
        X = df[self.cols].apply(pd.to_numeric, errors="coerce")
        self.scaler.fit(self.imputer.fit_transform(X))
        
    def transform(self, df):
        X = df[self.cols].apply(pd.to_numeric, errors="coerce")
        return self.scaler.transform(self.imputer.transform(X)).astype(np.float32)
        
    @property
    def n_features(self) -> int:
        return len(self.cols)

try:
    if "uvicorn.__main__" in sys.modules:
        sys.modules["uvicorn.__main__"].TabularPreprocessor = TabularPreprocessor
    else:
        sys.modules["__main__"].TabularPreprocessor = TabularPreprocessor
except Exception:
    pass

# ── Model Architectures ──
class PCOSClassifier(nn.Module):
    def __init__(self, n_tab, hidden=128):
        super().__init__()
        base = models.efficientnet_b4(weights=None)
        self.img_enc = nn.Sequential(base.features, nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(1792, 512), nn.SiLU())
        self.tab_enc = nn.Sequential(nn.Linear(n_tab, hidden), nn.LayerNorm(hidden), nn.SiLU(), nn.Linear(hidden, hidden), nn.LayerNorm(hidden), nn.SiLU())

        self.Wq = nn.Linear(512, hidden)
        self.Wk = nn.Linear(hidden, hidden)
        self.Wv = nn.Linear(hidden, hidden)
        self.scale = math.sqrt(hidden)

        self.head = nn.Sequential(nn.Linear(512 + hidden + hidden, 256), nn.SiLU(), nn.Dropout(0.4), nn.Linear(256, 2))

    def forward(self, img, tab):
        i, t = self.img_enc(img), self.tab_enc(tab)
        w = torch.softmax(torch.bmm(self.Wq(i).unsqueeze(1), self.Wk(t).unsqueeze(1).transpose(1, 2)) / self.scale, dim=-1)
        ctx = torch.bmm(w, self.Wv(t).unsqueeze(1)).squeeze(1)
        logits = self.head(torch.cat([i, t, ctx], dim=-1))
        return logits, torch.softmax(logits, dim=-1)

class UNet(nn.Module):
    def __init__(self):
        super().__init__()
        def CBR(in_c, out_c): return nn.Sequential(nn.Conv2d(in_c, out_c, 3, padding=1), nn.BatchNorm2d(out_c), nn.ReLU(True), nn.Conv2d(out_c, out_c, 3, padding=1), nn.BatchNorm2d(out_c), nn.ReLU(True))
        self.enc1 = CBR(3, 64)
        self.enc2 = CBR(64, 128)
        self.enc3 = CBR(128, 256)
        self.bot  = CBR(256, 512)
        self.up3 = nn.ConvTranspose2d(512, 256, 2, 2)
        self.dec3 = CBR(512, 256)
        self.up2 = nn.ConvTranspose2d(256, 128, 2, 2)
        self.dec2 = CBR(256, 128)
        self.up1 = nn.ConvTranspose2d(128, 64, 2, 2)
        self.dec1 = CBR(128, 64)
        self.final = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        e1 = self.enc1(x)
        e2 = self.enc2(F.max_pool2d(e1, 2))
        e3 = self.enc3(F.max_pool2d(e2, 2))
        b  = self.bot(F.max_pool2d(e3, 2))
        d3 = self.dec3(torch.cat([e3, self.up3(b)], 1))
        d2 = self.dec2(torch.cat([e2, self.up2(d3)], 1))
        d1 = self.dec1(torch.cat([e1, self.up1(d2)], 1))
        return self.final(d1)

class DuelingDQN(nn.Module):
    def __init__(self, state_dim, action_dim):
        super().__init__()
        self.feature = nn.Sequential(nn.Linear(state_dim, 128), nn.ReLU(), nn.Linear(128, 128), nn.ReLU())
        self.val = nn.Sequential(nn.Linear(128, 64), nn.ReLU(), nn.Linear(64, 1))
        self.adv = nn.Sequential(nn.Linear(128, 64), nn.ReLU(), nn.Linear(64, action_dim))

    def forward(self, x):
        f = self.feature(x)
        v, a = self.val(f), self.adv(f)
        return v + (a - a.mean(dim=1, keepdim=True))

class DQNAgent:
    def __init__(self, state_dim, action_dim):
        self.action_dim = action_dim
        self.policy = DuelingDQN(state_dim, action_dim).to(DEVICE)
        self.policy.eval()

# ── Global Objects ──
preprocessor = None
classifier = None
unet = None
agent = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global preprocessor, classifier, unet, agent
    print(f"[{DEVICE}] Loading PyTorch Models...")
    try:
        # Load preprocessor
        prep_path = r"d:\PCOS\preprocessor (1).pkl"
        if os.path.exists(prep_path):
            preprocessor = joblib.load(prep_path)
            if hasattr(preprocessor.imputer, 'strategy') and not hasattr(preprocessor.imputer, '_fill_dtype'):
                preprocessor.imputer._fill_dtype = np.dtype('float64')
                preprocessor.imputer.keep_empty_features = False
            print(f" [OK] Preprocessor loaded. Features: {preprocessor.n_features}")
        else:
            print(f" [FAIL] Preprocessor not found at {prep_path}")

        # Load Classifier
        cls_path = r"d:\PCOS\classifier (1).pt"
        if os.path.exists(cls_path) and preprocessor:
            classifier = PCOSClassifier(preprocessor.n_features).to(DEVICE)
            classifier.load_state_dict(torch.load(cls_path, map_location=DEVICE))
            classifier.eval()
            print(" [OK] Classifier loaded")
        
        # Load UNet
        unet_path = r"d:\PCOS\unet_seg (1).pt"
        if os.path.exists(unet_path):
            unet = UNet().to(DEVICE)
            unet.load_state_dict(torch.load(unet_path, map_location=DEVICE))
            unet.eval()
            print(" [OK] UNet loaded")
            
        # Load RL Agent
        rl_path = r"d:\PCOS\dqn_agent (1).pt"
        if os.path.exists(rl_path):
            agent = DQNAgent(STATE_DIM, N_ACTIONS)
            agent.policy.load_state_dict(torch.load(rl_path, map_location=DEVICE))
            print(" [OK] RL Agent loaded")

    except Exception as e:
        print(f"Error during model loading: {str(e)}")
        
    yield
    print("Shutting down ML Service.")

app = FastAPI(title="PCOS PyTorch ML Service", lifespan=lifespan)

# ── Prediction Endpoint ──
@app.post("/predict")
async def predict(
    image: UploadFile = File(None),
    bmi: float = Form(22.0),
    insulin: float = Form(10.0), # mapped to random/default if missing since we lack some fields
    glucose: float = Form(90.0), # mapped to rbs_mg_dl
    lh: float = Form(5.0), # mapped to lh_miu_ml
    fsh: float = Form(5.0), # mapped to fsh_miu_ml
    testosterone: float = Form(0.5), # not strictly in tabular 38 features but can be passed
    cycle_length: int = Form(28), # mapped to cycle_length_days
    hair_growth: int = Form(0), # hair_growth_yn
    weight_gain: int = Form(0), # weight_gain_yn
    age: int = Form(25),
    weight: float = Form(65.0),
    height: float = Form(165.0),
    irregular_cycle: int = Form(0) # cycle_ri mapped to 4 if irregular
):
    result = {"model_status": "pytorch_active"}
    
    # 1. Image Processing
    image_bytes = await image.read() if image else b""
    has_image = len(image_bytes) > 1000
    
    img_tensor_cls = torch.zeros(3, IMG_SIZE_CLS, IMG_SIZE_CLS).to(DEVICE)
    img_tensor_seg = torch.zeros(3, IMG_SIZE_SEG, IMG_SIZE_SEG).to(DEVICE)
    
    if has_image:
        try:
            pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            transform_cls = transforms.Compose([
                transforms.Resize((IMG_SIZE_CLS, IMG_SIZE_CLS)),
                transforms.ToTensor(),
                transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
            ])
            transform_seg = transforms.Compose([
                transforms.Resize((IMG_SIZE_SEG, IMG_SIZE_SEG)),
                transforms.ToTensor()
            ])
            img_tensor_cls = transform_cls(pil_img).to(DEVICE)
            img_tensor_seg = transform_seg(pil_img).to(DEVICE)
        except Exception as e:
            print(f"Image load error: {e}")
            has_image = False

    # 2. Build Tabular DataFrame for Preprocessor
    # Map the incoming Form data to the precise column names expected by the preprocessor
    # We create a dummy row. 
    row_data = {
        "age": age,
        "bmi": bmi,
        "weight_kg": weight,
        "height_cm": height,
        "cycle_length_days": cycle_length,
        "fsh_miu_ml": fsh,
        "lh_miu_ml": lh,
        "lh_fsh_ratio": lh / fsh if fsh > 0 else lh,
        "rbs_mg_dl": glucose,
        "weight_gain_yn": weight_gain,
        "hair_growth_yn": hair_growth,
        "cycle_ri": 4 if irregular_cycle == 1 else 2, # 4 is irregular according to common PCOS datasets
    }
    df_single = pd.DataFrame([row_data])
    
    # Ensure all required columns by preprocessor exist, fill missing with defaults/medians
    tab_transformed = np.zeros((1, preprocessor.n_features if preprocessor else 38), dtype=np.float32)
    if preprocessor:
        try:
            # Add missing columns with nan so SimpleImputer handles them
            for col in preprocessor.features:
                if col not in df_single.columns:
                    df_single[col] = np.nan
            tab_transformed = preprocessor.transform(df_single)
        except Exception as e:
            print(f"Preproc error: {e}")

    tab_tensor = torch.tensor(tab_transformed[0], dtype=torch.float32).to(DEVICE)

    # 3. Model Inference
    with torch.no_grad():
        probs = 0.0
        if classifier:
            ib = img_tensor_cls.unsqueeze(0)
            tb = tab_tensor.view(1, -1)
            probs = classifier(ib, tb)[1][0, 1].item()
            
        result["pcos_probability"] = float(probs)
        result["cysts_detected"] = float(probs) >= 0.5
        
        # Segmentation & Spots extraction
        result["spots"] = []
        result["cyst_area"] = 0.0
        if unet and has_image:
            ib_seg = img_tensor_seg.unsqueeze(0)
            pred_mask = torch.sigmoid(unet(ib_seg)) > 0.5
            pred_mask = pred_mask[0, 0].cpu().numpy().astype(np.uint8) * 255
            
            # Find contours inside the mask to identify discrete "spots"
            contours, _ = cv2.findContours(pred_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            spots = []
            for cnt in contours:
                M = cv2.moments(cnt)
                if M["m00"] > 5: # Filter out noise
                    cx = int(M["m10"] / M["m00"])
                    cy = int(M["m01"] / M["m00"])
                    area = float(cv2.contourArea(cnt))
                    # Scale coordinates from 256x256 to percentages
                    spots.append({
                        "x": round((cx / IMG_SIZE_SEG) * 100, 2),
                        "y": round((cy / IMG_SIZE_SEG) * 100, 2),
                        "area": round(area, 2)
                    })
            
            # Sort by area descending and limit to top 15 spots to prevent frontend crash
            spots = sorted(spots, key=lambda s: s["area"], reverse=True)[:15]
            result["spots"] = spots
            result["cyst_area"] = float((pred_mask > 0).mean() * 100)

        # 4. RL Agent Recommendations
        if agent:
            # We must reconstruct the 12D state expected by the DQN
            # [probs, sev_score, bmi, lh_fsh, amh, rbs, tsh, exer, ff, foll, irr, bmi_norm]
            rl_state = np.array([
                probs, 
                0.0, # severity placeholder
                bmi / 50.0, 
                (lh / fsh if fsh > 0 else lh) / 10.0, 
                3.0 / 15.0, # dummy AMH
                glucose / 200.0, 
                2.5 / 10.0, # dummy TSH
                0.0, # exercise norm
                1.0, # fast food norm
                8.0 / 30.0, # dummy follicles
                float(irregular_cycle == 1), 
                bmi / 45.0
            ], dtype=np.float32)
            
            state_tensor = torch.FloatTensor(rl_state).unsqueeze(0).to(DEVICE)
            q_vals = agent.policy(state_tensor)[0].cpu().numpy()
            
            recs = [{"action": ACTIONS[i], "q": round(float(q_vals[i]), 2)} for i in q_vals.argsort()[::-1]]
            result["rl_recommendations"] = recs

    return result

@app.get("/health")
def health():
    return {"status": "ok", "pytorch": True}
