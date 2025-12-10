import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/create-lead", async (req, res) => {
  try {
    console.log("📩 Body recebido do front:", req.body);

    const response = await fetch("https://api.contact2sale.com/integration/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer b655e508c54b101ba325e5de750db7d750b789c70e0c8b3402`
      },
      body: JSON.stringify(req.body)
    });

    // Se a API NÃO retornar JSON, captura texto para debug
    let data;
    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      console.error("❌ A API retornou HTML ao invés de JSON:");
      console.error(text);
      return res.status(500).json({
        error: "Resposta inválida da API C2S",
        body: text,
      });
    }

    console.log("📨 Resposta da API C2S:", data);

    if (!response.ok) {
      return res.status(500).json({
        error: "Erro ao enviar lead para C2S",
        details: data,
      });
    }

    return res.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("❌ Erro interno:", error);
    res.status(500).json({
      error: "Erro interno no servidor",
      message: error.message,
    });
  }
});

app.listen(3001, () => {
  console.log("🚀 Backend rodando na porta 3001");
});
