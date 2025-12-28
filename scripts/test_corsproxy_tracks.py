import requests

track_urls = [
    "https://corsproxy.io/?https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Matrix_Music/Digital_Ghost.mp3",
    "https://corsproxy.io/?https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    "https://corsproxy.io/?https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/Matrix_Music/Cipher.mp3",
    "https://corsproxy.io/?https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Ketsa/Ascendance/Ketsa_-_The_Ambient.mp3",
    "https://corsproxy.io/?https://assets.mixkit.co/music/preview/mixkit-dark-sci-fi-synth-948.mp3"
]

for url in track_urls:
    try:
        resp = requests.head(url, allow_redirects=True)
        cors = resp.headers.get('Access-Control-Allow-Origin', None)
        print(f"{url} | Status: {resp.status_code} | CORS: {cors}")
    except Exception as e:
        print(f"{url} | ERROR: {e}")
