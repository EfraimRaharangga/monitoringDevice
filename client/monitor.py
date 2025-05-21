# monitor.py
import psutil
import time
import requests
import threading

SERVER_URL = "http://127.0.0.1:5000/data"  # Ganti dengan IP server Flask

def get_system_data():
    return {
        "cpu_percent": psutil.cpu_percent(interval=1),
        "ram_percent": psutil.virtual_memory().percent
    }

def send_data():
    while True:
        try:
            data = get_system_data()
            requests.post(SERVER_URL, json=data, timeout=5)
        except Exception as e:
            print(f"Failed to send data: {e}")
        time.sleep(5)

if __name__ == "__main__":
    thread = threading.Thread(target=send_data)
    thread.daemon = True
    thread.start()

    while True:
        time.sleep(1)  # Menjaga program tetap berjalan
