import psutil
import time
import requests
import threading
import socket  # Untuk mendapatkan nama komputer

SERVER_URL = "https://41aa-103-214-229-137.ngrok-free.app/data" 

def get_system_data():
    return {
        "hostname": socket.gethostname(),  # Menambahkan nama komputer
        "cpu_percent": psutil.cpu_percent(interval=1),
        "ram_percent": psutil.virtual_memory().percent
    }

def send_data():
    while True:
        try:
            data = get_system_data()
            response = requests.post(SERVER_URL, json=data, timeout=5)
            print(f"Data sent. Status code: {response.status_code}")
        except Exception as e:
            print(f"Failed to send data: {e}")
        time.sleep(5)

if __name__ == "__main__":
    thread = threading.Thread(target=send_data)
    thread.daemon = True
    thread.start()

    while True:
        time.sleep(1)  # Menjaga program tetap berjalan