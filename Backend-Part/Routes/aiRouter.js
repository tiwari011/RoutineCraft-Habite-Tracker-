// const Groq = require("groq-sdk");
// const express = require("express");
// const router = express.Router();

// const client = new Groq({ apiKey: process.env.GROQ_KEY });

// router.post("/generate-routine", async (req, res) => {
//   try {
//     console.log("API HIT 🔥");
//     const { age, goal, profession } = req.body;

//     if (!age || !goal || !profession) {
//       return res.status(400).json({ error: "All fields required" });
//     }

//     const result = await client.chat.completions.create({
//    model: "llama-3.1-8b-instant",
//       max_tokens: 500,
//       messages: [
//         {
//           role: "system",
//           content: `You are a routine generator.
// Return ONLY a JSON array, no explanation, no code fences:
// [{ "habit": "Wake up", "time": "6:00 AM" }]
// Max 10 habits.`,
//         },
//         {
//           role: "user",
//           content: `Age: ${age}\nGoal: ${goal}\nProfession: ${profession}`,
//         },
//       ],
//     });

//     const aiText = result.choices[0].message.content;
//     const start = aiText.indexOf("[");
//     const end = aiText.lastIndexOf("]") + 1;
//     const habits = JSON.parse(aiText.slice(start, end));

//     res.json({ habits });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "AI failed" });
//   }
// });

// module.exports = router;





// // routes/routine.js ---------------------------------------------------------
// require("dotenv").config();               // <-- make sure env is loaded early
// const Groq = require("groq-sdk");
// const express = require("express");
// const router = express.Router();

// // ---------------------------------------------------------------
// // 1️⃣ Validate that the API key exists *once* at startup
// if (!process.env.GROQ_KEY) {
//   throw new Error("❌ Missing GROQ_KEY in environment variables");
// }

// // 2️⃣ Initialise the SDK (once per process)
// const client = new Groq({ apiKey: process.env.GROQ_KEY });

// // 3️⃣ Ensure JSON bodies are parsed (if the parent app hasn't already)
// router.use(express.json());

// // ----------------------------------------------------------------
// // Helper: safe extraction of the model's answer
// function extractArrayFromText(text) {
//   // Grab the *first* JSON array we see (including newlines)
//   const match = text.match(/$$.*?$$/s);
//   if (!match) throw new Error("AI response does not contain a JSON array");
//   return JSON.parse(match[0]);
// }

// // ----------------------------------------------------------------
// // POST /generate-routine
// router.post("/generate-routine", async (req, res) => {
//   try {
//     console.log("🚀 API HIT /generate-routine");

//     const { age, goal, profession } = req.body ?? {};

//     // 4️⃣ Basic validation
//     if (!age || !goal || !profession) {
//       return res
//         .status(400)
//         .json({ error: "All fields (age, goal, profession) are required" });
//     }

//     // 5️⃣ Call Groq – note the camelCase option name
//     const result = await client.chat.completions.create({
//       model: "llama-3.1-8b-instant",
//       maxTokens: 500,               // <-- correct key
//       messages: [
//         {
//           role: "system",
//           content:
//             `You are a routine generator. Return ONLY a JSON array, no explanation, no code fences:
// [
//   { "habit": "Wake up", "time": "6:00 AM" }
// ]
// Maximum 10 habits. Do NOT wrap the array in additional text.`,
//         },
//         {
//           role: "user",
//           content: `Age: ${age}
// Goal: ${goal}
// Profession: ${profession}`,
//         },
//       ],
//     });

//     // 6️⃣ Guard against an empty AI response
//     const aiText = result?.choices?.[0]?.message?.content;
//     if (!aiText) {
//       throw new Error("Empty response from Groq");
//     }

//     // 7️⃣ Parse the JSON array safely
//     let habits;
//     try {
//       habits = extractArrayFromText(aiText);
//     } catch (parseErr) {
//       console.error("❗ JSON parse error:", parseErr, "Raw AI:", aiText);
//       return res
//         .status(502)
//         .json({ error: "Could not parse AI response into JSON" });
//     }

//     // 8️⃣ Return the structured data
//     return res.json({ habits });
//   } catch (err) {
//     console.error("🚨 /generate-routine error:", err);
//     // Differentiate between our own validation errors and true 5xx failures
//     const status = err.message?.includes("parse") ? 502 : 500;
//     return res.status(status).json({ error: err.message || "AI failed" });
//   }
// });

// // ----------------------------------------------------------------
// module.exports = router;



// ------------------------------------------------------------
//  generate-routine.js  (robust version)
// ------------------------------------------------------------
require('dotenv').config();               // Load .env before anything else

const Groq = require('groq-sdk');
const express = require('express');
const router = express.Router();

// ------------------------------------------------------------------
// 1️⃣  Validate environment
if (!process.env.GROQ_KEY) {
  console.warn('⚠️ GROQ_KEY missing in environment variables (.env)');
}

// 2️⃣  Initialise SDK (once)
const client = new Groq({ apiKey: process.env.GROQ_KEY });

// 3️⃣  Ensure JSON bodies are parsed (if the parent app forgot)
router.use(express.json());

// ------------------------------------------------------------------
// Helper: pull the first JSON array out of a string
function extractJsonArray(text) {
  const match = text.match(/\[[\s\S]*\]/); // Extract JSON array [...] across newlines
  if (!match) throw new Error('AI response does not contain a JSON array');
  return JSON.parse(match[0]); // will throw if malformed
}

// ------------------------------------------------------------------
// POST /generate-routine
router.post('/generate-routine', async (req, res) => {
  console.log('🔥 /generate-routine hit');

  const { age, goal, profession } = req.body ?? {};
  console.log('🔎 Payload received:', { age, goal, profession });

  // ---- Input validation -------------------------------------------------
  if (!age || !goal || !profession) {
    return res.status(400).json({ error: 'All fields (age, goal, profession) are required' });
  }

  // ---- Call Groq ---------------------------------------------------------
  let result;
  try {
    // Optional: abort after 20 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    result = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `You are a routine generator.
Return ONLY a JSON array (no explanations, no markdown, no code fences) that looks like:
[
  { "habit": "Wake up", "time": "6:00 AM" }
]
Maximum 10 habits. Do NOT wrap the array in any extra text.`,
        },
        {
          role: 'user',
          content: `Age: ${age}
Goal: ${goal}
Profession: ${profession}`,
        },
      ],
    });

    clearTimeout(timeout);
  } catch (apiErr) {
    console.error('❗ Groq API error:', apiErr);
    const status = apiErr?.statusCode || 502; // 502 = Bad Gateway (upstream failed)
    return res.status(status).json({
      error: 'Failed to get a response from the AI service',
      details: apiErr.message,
    });
  }

  // ---- Extract raw text ---------------------------------------------------
  const aiText = result?.choices?.[0]?.message?.content;
  console.log('🤖 Raw AI output:\n', aiText);

  if (!aiText) {
    return res.status(502).json({ error: 'Empty response from AI' });
  }

  // ---- Parse JSON ---------------------------------------------------------
  let habits;
  try {
    habits = extractJsonArray(aiText);
  } catch (parseErr) {
    console.error('❗ JSON parse error:', parseErr);
    return res.status(502).json({
      error: 'Could not parse AI output into JSON',
      details: parseErr.message,
    });
  }

  // ---- Success ------------------------------------------------------------
  console.log('✅ Parsed habits:', habits);
  return res.json({ habits });
});

// ------------------------------------------------------------------
module.exports = router;