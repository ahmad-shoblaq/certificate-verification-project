import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import certRoutes from "./certs.routes.js";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public"));

app.use("/api/certs", certRoutes);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Certificate API (Node.js)",
    routes: ["/api/certs/issue", "/api/certs/verify"]
  });
});

const PORT = 5500;
app.listen(PORT, () => console.log(`All running at http://localhost:${PORT}`));
