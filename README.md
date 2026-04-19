# Femlytix Platform

A full-stack, multimodal medical AI application engineered to analyze clinical data and ultrasound imaging for the early detection and management of Polycystic Ovary Syndrome (PCOS). The platform leverages deep learning, reinforcement learning, and Google Gemini 2.5 Flash to automatically interpret medical data, provide actionable lifestyle prescriptions, and generate comprehensive PDF medical reports.

## Architecture

The system operates across three interconnected microservices:

1. **Next.js Frontend (Port 3000)**
   - Modern React 19 UI built with Tailwind CSS v4 and Framer Motion.
   - Interactive intake form with strict data collection parameters for PCOS diagnostics.
   - Dynamic patient dashboard mapping 12+ biometrics and visual bounding boxes over ultrasound scans.

2. **FastAPI Backend (Port 8000)**
   - API orchestration and Report Generation service.
   - Interfaces heavily with Google's Gemini 2.5 Flash multimodal AI to analyze the bounding-box ultrasound output alongside clinical markers.
   - Compiles personalized AI-driven Lifestyle Prescriptions and generates downloadable PDF reports for patients and physicians.

3. **PyTorch ML Service (Port 8001)**
   - Local PyTorch microservice using a FastAPI endpoint.
   - Runs a hybrid Ensemble Classifier (`classifier.pt`) combining Tabular Data via Multi-Layer Perceptrons and Image embeddings via `EfficientNet_B4`.
   - Runs a `UNet` for pixel-perfect semantic segmentation of ovarian follicles/cysts on Ultrasound imagery.
   - Runs a Deep Q-Network Reinforcement Learning Agent (`dqn_agent.pt`) that scores and generates weighted behavioral interventions (Diet, Exercise, Supplements, Sleep).

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pcos-platform.git
   ```

2. **Setup the ML Microservice:**
   ```bash
   cd ml_service
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
   *Note: Place all pre-trained PyTorch weights (`classifier (1).pt`, `unet_seg (1).pt`, `dqn_agent (1).pt`, `preprocessor (1).pkl`) in the root `PCOS` directory before running.*
   ```bash
   python -m uvicorn main:app --port 8001
   ```

3. **Setup the Backend Orchestrator:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```
   Ensure you create a `.env` file in the `backend` directory containing:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
   ```bash
   python -m uvicorn main:app --port 8000
   ```

4. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Usage
Navigate to `http://localhost:3000` to begin an AI Assessment. Upload your clinical data alongside a valid ovarian ultrasound image to evaluate the multimodal diagnostic pipeline.

## Advanced AI Mechanics
* **Multimodal Consensus:** If the local PyTorch system classifies an image as normal (`pcos_probability < 0.5`), but Google Gemini Flash explicitly identifies a follicle cyst with high-confidence, the orchestrator intelligently overrides the internal consensus to surface the anomaly.
* **Intelligent Weights Bypassing:** The `ml_service` intelligently initializes neural network layers (`weights=None`) to instantiate un-trained networks in milliseconds and immediately injects local `state_dict` weights, avoiding heavy ImageNet download locks.
