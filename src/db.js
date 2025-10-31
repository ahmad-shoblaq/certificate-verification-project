import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path: <project>/data/certs.json
const DATA_FILE = path.join(__dirname, "..", "data", "certs.json");

export async function loadDb() {
  // ensure folder exists
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  // ensure file exists
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ certs: {} }, null, 2));
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return { certs: data.certs || {} };
  } catch {
    return { certs: {} };
  }
}

export async function saveDb(db) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}
