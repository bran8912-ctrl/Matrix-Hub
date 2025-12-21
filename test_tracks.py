import requests
import re

# Path to your index.html
INDEX_HTML = "docs/index.html"

# Regex to extract URLs from matrixPlaylist and layersPlaylist
URL_REGEX = re.compile(r'url:\s*"(https?://[^"]+)"')

# Only test real tracks (not example.com)
def extract_real_urls():
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()
    urls = URL_REGEX.findall(content)
    return [u for u in urls if not u.startswith("https://example.com")]  # skip placeholders

def test_url(url):
    try:
        resp = requests.head(url, allow_redirects=True, timeout=10)
        if resp.status_code == 200 and 'audio' in resp.headers.get('Content-Type', ''):
            return True, resp.status_code, resp.headers.get('Content-Type')
        else:
            return False, resp.status_code, resp.headers.get('Content-Type')
    except Exception as e:
        return False, str(e), None

def main():
    urls = extract_real_urls()
    print(f"Testing {len(urls)} real track URLs...")
    for url in urls:
        ok, status, ctype = test_url(url)
        if ok:
            print(f"OK:     {url} [{status} {ctype}]")
        else:
            print(f"BROKEN: {url} [{status} {ctype}]")

if __name__ == "__main__":
    main()
