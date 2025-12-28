import requests

# List of all track URLs from both playlists
track_urls = [
    "https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b7b7e2.mp3",
    "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b4b2b.mp3"
]

# Add more URLs if needed (all unique URLs from both playlists)
track_urls = list(set(track_urls))

for url in track_urls:
    try:
        resp = requests.head(url, allow_redirects=True)
        cors = resp.headers.get('Access-Control-Allow-Origin', None)
        print(f"{url} | Status: {resp.status_code} | CORS: {cors}")
    except Exception as e:
        print(f"{url} | ERROR: {e}")
