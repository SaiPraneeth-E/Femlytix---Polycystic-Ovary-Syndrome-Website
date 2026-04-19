import h5py
import json

def inspect_h5(path, out_file):
    out_file.write(f'\n--- {path} ---\n')
    try:
        with h5py.File(path, 'r') as f:
            if 'model_config' in f.attrs:
                config_str = f.attrs.get('model_config')
                if isinstance(config_str, bytes):
                    config_str = config_str.decode('utf-8')
                config = json.loads(config_str)
                config_class = config.get('class_name', 'Unknown')
                layers = config.get('config', {}).get('layers', [])
                if not layers:
                    layers = config.get('config', [])
                out_file.write(f'Model Class: {config_class}\n')
                
                out_file.write("Layers:\n")
                for layer in layers:
                    cname = layer.get('class_name')
                    lcfg = layer.get('config', {})
                    in_s = lcfg.get('batch_input_shape') or lcfg.get('input_shape')
                    if in_s is not None or cname == 'InputLayer':
                        out_file.write(f"  {lcfg.get('name', cname)} ({cname}): input_shape={in_s}\n")
            else:
                out_file.write('No model_config found in attrs.\n')
    except Exception as e:
        out_file.write(f'Error: {e}\n')

with open('inspect_output.txt', 'w', encoding='utf-8') as f:
    inspect_h5(r'D:\PCOS\pcos_multimodal_fusion.h5', f)
    inspect_h5(r'D:\PCOS\pcos_rl_policy.h5', f)
    inspect_h5(r'D:\PCOS\pcos_temporal_gru.h5', f)
