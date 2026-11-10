#!/usr/bin/env node
// Serves this folder on 127.0.0.1 for the gold demo scripts.
//   node examples/app/serve.mjs [port]     port 0 (the default) picks a free one
// Prints "listening http://127.0.0.1:<port>/" and its pid. Stop it by that pid.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = normalize(join(ROOT, path === "/" ? "index.html" : path));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" }).end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});

server.listen(Number(process.argv[2] || 0), "127.0.0.1", () => {
  console.log(`listening http://127.0.0.1:${server.address().port}/ pid ${process.pid}`);
});
