import 'dotenv/config';
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import menuRoutes from "./routes/menu.js";
import ordersRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import vendorsRoutes from "./routes/vendors.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/menu", menuRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorsRoutes);

// AI Recommender endpoint using Groq (free)
app.post("/api/ai/recommend", async (req, res) => {
  const { prompt, menuItems } = req.body;

  if (!prompt || !menuItems) {
    return res.status(400).json({ error: "Missing prompt or menuItems" });
  }

  const menuSummary = menuItems.map(item =>
    `ID:${item.id} | ${item.name} | $${item.price} | ${item.category} | ${item.description} | By: ${item.vendorName || 'Unknown'}`
  ).join('\n');

  const systemPrompt = `You are a friendly food recommendation AI for FoodFusion, a food delivery app.
Given the customer's mood/craving and the available menu, recommend 2-3 specific dishes.

Available menu:
${menuSummary}

IMPORTANT: You MUST respond with ONLY valid JSON in this exact format, no other text, no markdown:
{
  "message": "A warm 1-2 sentence intro based on their mood",
  "recommendations": [
    {
      "id": <item id as number>,
      "name": "<item name>",
      "reason": "<1 sentence why this matches their mood>",
      "emoji": "<one relevant emoji>"
    }
  ],
  "tip": "<A fun food tip or pairing suggestion>"
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `My mood/craving: ${prompt}` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    console.log("Groq response:", JSON.stringify(data));
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI request failed" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
