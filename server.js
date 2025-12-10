// server.js - substituir pelo conteúdo abaixo ou adaptar
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve assets versionados (dist/assets) com cache longo
app.use(
  "/assets",
  express.static(path.join(__dirname, "dist", "assets"), {
    maxAge: "1y", // 1 ano
    immutable: true,
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

// Serve imagens/fonts/etc do dist com cache longo
app.use(
  express.static(path.join(__dirname, "dist"), {
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filepath) => {
      if (filepath.endsWith(".html")) {
        // evita cache para HTML
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      } else {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  })
);

// Rotas API existentes (copie/cole seu código atual)
app.post("/api/create-lead", async (req, res) => {
  try {
    // ... seu código atual para enviar lead (mantive seu comportamento)
    const response = await fetch("https://api.contact2sale.com/integration/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    return res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno", message: error.message });
  }
});

// SPA fallback: sempre retornar index.html sem cache
app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));
