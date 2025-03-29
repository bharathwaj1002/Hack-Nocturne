from sklearn.preprocessing import LabelEncoder
import random
import string
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import InteractionData
import joblib
import numpy as np
import os

# Load the model
# model_path = os.path.join(os.path.dirname(__file__), 'models/Voting_Classifier_with_9_models.pkl')
model_path = os.path.join(os.path.dirname(__file__), 'models/Voting_Classifier_with_13_models.pkl')
model = joblib.load(model_path)
otp_storage = {}
@csrf_exempt
def store_interaction_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        ip_address = get_client_ip(request)

        # Extract features and make prediction
        
        features = extract_features(data)
        prediction = model.predict([features])
        is_human = bool(prediction[0])
        if is_human:
            client = 'Human'
            sendOtp()
        else:    
            client = 'Bot'

        # Save interaction data
        interaction = InteractionData(
            mouse_movements=data['mouse_movements'],
            click_intervals=data['click_intervals'],
            keypress_intervals=data['keypress_intervals'],
            scroll_positions=data.get('scroll_positions', []),
            idle_times=data.get('idle_times', []),
            color_depth=data.get('color_depth', ''),
            os=data.get('os',''),
            browser=data.get('browser',''),
            screen_resolution=data.get('screen_resolution', ''),
            installed_plugins=data.get('installed_plugins', []),
            installed_extensions=data.get('installed_extensions', []),
            # browser=data.get('browser', ''),
            browser_rendering_engine=data.get('browser_rendering_engine', ''),
            client=client,
            ip_address=ip_address
        )
        interaction.save()

        return JsonResponse({'is_human': is_human})
    return JsonResponse({'error': 'Invalid request'}, status=400)


# Initialize label encoders
os_encoder = LabelEncoder()
browser_encoder = LabelEncoder()
screen_res_encoder = LabelEncoder()
rendering_engine_encoder = LabelEncoder()

# Fit encoders with known categories (should be done once)
os_encoder.fit(['Windows', 'MacOS', 'Linux', 'iOS', 'Android'])
browser_encoder.fit(['Chrome', 'Firefox', 'Safari', 'Edge'])
screen_res_encoder.fit(['1920x1080', '1366x768', '1280x1024', '1440x900'])
rendering_engine_encoder.fit(['Blink', 'Gecko', 'WebKit', 'Trident'])


def extract_features(data):
    features = []

    # Mouse movements
    mouse_movements = data.get('mouse_movements', [])
    features.append(len(mouse_movements))

    if mouse_movements:
        speeds = [movement.get('speed', 0) for movement in mouse_movements]
        distances = [movement.get('distance', 0) for movement in mouse_movements]
        features.append(np.mean(speeds) if speeds else 0)
        features.append(np.mean(distances) if distances else 0)
    else:
        features.extend([0, 0])  # Add two features for mouse speed and distance

    # Click intervals
    click_intervals = data.get('click_intervals', [])
    features.append(np.mean([click.get('interval', 0) for click in click_intervals]) if click_intervals else 0)

    # Keypress intervals
    keypress_intervals = data.get('keypress_intervals', [])
    features.append(np.mean([keypress.get('interval', 0) for keypress in keypress_intervals]) if keypress_intervals else 0)

    # Scroll positions
    scroll_positions = data.get('scroll_positions', [])
    features.append(len(scroll_positions))

    # Idle times
    idle_times = data.get('idle_times', [])
    features.append(np.mean(idle_times) if idle_times else 0)

    # Additional device info features
    device_info = {
        'os': data.get('os', ''),
        'browser': data.get('browser', ''),
        'screen_resolution': data.get('screen_resolution', ''),
        'color_depth': data.get('color_depth', 0),
        'installed_plugins': data.get('installed_plugins', []),  # Default to empty list
        'extensions': data.get('installed_extensions', []),    # Default to empty list
        'rendering_engine': data.get('browser_rendering_engine', '')
    }
    
    # Ensure installed_plugins and extensions are lists
    if not isinstance(device_info['installed_plugins'], list):
        device_info['installed_plugins'] = []
    if not isinstance(device_info['extensions'], list):
        device_info['extensions'] = []

    # Encode categorical features with safe fallback
    features.extend([
        os_encoder.transform([device_info['os']])[0] if device_info['os'] in os_encoder.classes_ else 0,
        browser_encoder.transform([device_info['browser']])[0] if device_info['browser'] in browser_encoder.classes_ else 0,
        screen_res_encoder.transform([device_info['screen_resolution']])[0] if device_info['screen_resolution'] in screen_res_encoder.classes_ else 0,
        device_info['color_depth'],
        len(device_info['installed_plugins']),  # Use len safely now
        len(device_info['extensions']),        # Use len safely now
        rendering_engine_encoder.transform([device_info['rendering_engine']])[0] if device_info['rendering_engine'] in rendering_engine_encoder.classes_ else 0
    ])

    # Ensure exactly 17 features
    while len(features) < 17:
        features.append(0)

    assert len(features) == 17, "Feature extraction did not produce 17 features"

    return features


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def sendOtp(length=6):
    if length < 1:
        raise ValueError("Length of OTP must be at least 1")
    
    # Generate a random OTP using digits
    otp = ''.join(random.choices(string.digits, k=length))
    otp_storage['otp'] = otp
    print("STORED OTP: ",otp_storage)
    print(f"Generated OTP: {otp}")
    return otp

@csrf_exempt
def verify_otp(request):
    data = json.loads(request.body)
    verification=False
    stored_otp = otp_storage.get('otp', None)
    # Check if the provided OTP matches the stored OTP
    verification = str(data) == str(stored_otp)
    otp_storage.clear()
    
    return JsonResponse({'verification': verification})