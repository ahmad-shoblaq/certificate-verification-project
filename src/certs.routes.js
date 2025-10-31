import { Router } from "express";
import { z } from "zod";
import { nanoid } from "nanoid";
import { loadDb, saveDb } from "./db.js";
import { canonicalize, sha256Hex } from "./hash.js";
import multer from "multer";

const router = Router();

// ✅ enable uploads to /uploads folder
const upload = multer({ dest: "uploads/" });

const IssueSchema = z.object({
  name: z.string().min(1),
  idNumber: z.string().min(1),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  program: z.string().optional()
});

// ✅ ISSUE certificate (with uploaded file)
router.post("/issue", upload.single("certificateFile"), async (req, res) => {
  const parsed = IssueSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ ok: false, error: parsed.error.format() });

  const payload = parsed.data;
  const canon = canonicalize(payload);
  const hash = sha256Hex(canon);

  const db = await loadDb();

  if (!db.certs[hash]) {
    db.certs[hash] = {
      id: nanoid(),
      ...payload,
      hash,
      file: req.file?.filename || null,  // ✅ store uploaded file reference
      createdAt: new Date().toISOString()
    };
    await saveDb(db);
  }

  res.json({
    ok: true,
    hash,
    certificate: db.certs[hash],
    verifyUrl: `/api/certs/verify?name=${encodeURIComponent(payload.name)}&idNumber=${encodeURIComponent(payload.idNumber)}&issueDate=${encodeURIComponent(payload.issueDate)}`
  });
});

// ✅ VERIFY certificate
router.get("/verify", async (req, res) => {
  const parsed = IssueSchema.pick({
    name: true,
    idNumber: true,
    issueDate: true
  }).safeParse(req.query);

  if (!parsed.success)
    return res.status(400).json({ ok: false, error: parsed.error.format() });

  const canon = canonicalize(parsed.data);
  const hash = sha256Hex(canon);
  const db = await loadDb();
  const cert = db.certs[hash];

  if (!cert) return res.json({ ok: true, match: false, hash });

  res.json({
    ok: true,
    match: true,
    hash,
    certificate: cert
  });
});

export default router;
