const Groq = require("groq-sdk");
const express = require("express");
const router = express.Router();

const client = new Groq({ apiKey: process.env.GROQ_KEY });

router.post("/generate-routine", async (req, res) => {
  try {
    console.log("API HIT 🔥");
    const { age, goal, profession } = req.body;

    if (!age || !goal || !profession) {
      return res.status(400).json({ error: "All fields required" });
    }

    const result = await client.chat.completions.create({
   model: "llama-3.1-8b-instant",
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `You are a routine generator.
Return ONLY a JSON array, no explanation, no code fences:
[{ "habit": "Wake up", "time": "6:00 AM" }]
Max 10 habits.`,
        },
        {
          role: "user",
          content: `Age: ${age}\nGoal: ${goal}\nProfession: ${profession}`,
        },
      ],
    });

    const aiText = result.choices[0].message.content;
    const start = aiText.indexOf("[");
    const end = aiText.lastIndexOf("]") + 1;
    const habits = JSON.parse(aiText.slice(start, end));

    res.json({ habits });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI failed" });
  }
});

module.exports = router;