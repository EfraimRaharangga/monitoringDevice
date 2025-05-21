# data_store.py
from threading import Lock

# Menyimpan data client sementara di RAM
client_data = {}
data_lock = Lock()

def update_client(ip, data):
    with data_lock:
        client_data[ip] = data

def get_all_clients():
    with data_lock:
        return dict(client_data)
