import tensorflow as tf

try:
    model = tf.keras.models.load_model('models/pcos_cnn_model.h5', compile=False, custom_objects={'quantization_config': None})
    print('Success')
except Exception as e:
    print('Error:', str(e))

