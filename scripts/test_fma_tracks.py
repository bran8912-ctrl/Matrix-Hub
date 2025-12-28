import requests

track_urls = [
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Twin_Musicom/Space_Cadet/Digital_Voyage.mp3",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/No_Copyright/Cipher.mp3",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Broke_For_Free/Directionless_EP/Broke_For_Free_-_05_-_The_Lounge.mp3",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kevin_MacLeod/No_Copyright/Space_Chillout.mp3",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Best_Off/Komiku_-_10_-_Ambient_Electronic.mp3",
    "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Electronic_Senses/Matrix/Electronic_Senses_-_01_-_Matrix.mp3"
]

for url in track_urls:
    try:
        resp = requests.head(url, allow_redirects=True)
        cors = resp.headers.get('Access-Control-Allow-Origin', None)
        print(f"{url} | Status: {resp.status_code} | CORS: {cors}")
    except Exception as e:
        print(f"{url} | ERROR: {e}")
