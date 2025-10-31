import crypto from "node:crypto";

export function canonicalize({ name, idNumber, issueDate }) {
  const cleanName = String(name || "").trim().toLowerCase();
  const cleanId   = String(idNumber || "").replace(/\s+/g, "");
  const cleanDate = String(issueDate || "").trim(); // YYYY-MM-DD
  return `${cleanName}|${cleanId}|${cleanDate}`;
}

export function sha256Hex(input) {
  return "0x" + crypto.createHash("sha256").update(input).digest("hex");
}
