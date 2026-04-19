import tensorflow as tf
import joblib
import sys
import traceback

with open('inspect_result.txt', 'w') as f:
    for name in ['pcos_multimodal_fusion', 'pcos_rl_policy', 'pcos_temporal_gru']:
        path = f'models/{name}.h5'
        f.write(f'--- {name} ---\n')
        try:
            m = tf.keras.models.load_model(path, compile=False)
            m.summary(print_fn=lambda x: f.write(x + '\n'))
            for i in m.inputs:
                f.write(f'  INPUT: {i.name} shape={i.shape}\n')
            for o in m.outputs:
                f.write(f'  OUTPUT: {o.name} shape={o.shape}\n')
        except Exception as e:
            f.write(f'  ERROR: {e}\n')
            traceback.print_exc(file=f)
        f.write('\n')

    f.write('--- RF Explainer ---\n')
    try:
        rf = joblib.load('models/pcos_rf_explainer.pkl')
        f.write(f'Type: {type(rf).__name__}\n')
        n_feat = getattr(rf, 'n_features_in_', 'N/A')
        f.write(f'N_features: {n_feat}\n')
        classes = getattr(rf, 'classes_', 'N/A')
        f.write(f'Classes: {classes}\n')
        if hasattr(rf, 'feature_importances_'):
            f.write(f'Feature importances: {rf.feature_importances_}\n')
    except Exception as e:
        f.write(f'  ERROR: {e}\n')
        traceback.print_exc(file=f)
