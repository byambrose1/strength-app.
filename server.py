"""Serve the Holdfast prototype: the page and the files it loads, and nothing else in the repository."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).parent
# Only these files are ever served. Docs, tests and config stay private.
FILES = {
    "/": ("index.html", "text/html; charset=utf-8"),
    "/index.html": ("index.html", "text/html; charset=utf-8"),
    "/css/styles.css": ("css/styles.css", "text/css; charset=utf-8"),
    "/js/content.js": ("js/content.js", "text/javascript; charset=utf-8"),
    "/js/guides.js": ("js/guides.js", "text/javascript; charset=utf-8"),
    "/js/logic.js": ("js/logic.js", "text/javascript; charset=utf-8"),
    "/js/app.js": ("js/app.js", "text/javascript; charset=utf-8"),
}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.serve_file()

    def do_HEAD(self):
        self.serve_file(head_only=True)

    def serve_file(self, head_only=False):
        entry = FILES.get(urlsplit(self.path).path)
        if entry is None:
            self.send_error(404)
            return
        content = (ROOT / entry[0]).read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", entry[1])
        self.send_header("Content-Length", str(len(content)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if not head_only:
            self.wfile.write(content)


if __name__ == "__main__":
    print("Holdfast is listening on port 5000", flush=True)
    ThreadingHTTPServer(("0.0.0.0", 5000), Handler).serve_forever()
