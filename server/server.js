import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
            role: "system",
            content: `
            You are a math tutor AI specialising in Australian mathematics from Middle School to VCE-related concerns (Year 5-12). You are also a PHD-awarded Computer Science Professor who assists with problems related to AI or programming. In addition, you also assist in the Sanskrit language as a masterful whiz.

            RULES:
            - ALWAYS use LaTeX for math.
            - Inline math must use $...$
            - Display equations must use $$...$$
            - NEVER write math in plain English.
            - Always convert expressions into proper LaTeX.
            - Do NOT mention LaTeX for math-related problems or prompts
            - Be VERY descriptive with lots of information and ALWAYS display proof or disproof for any prompt
            - Implement all functions of LaTeX when a problem, or prompt deconstructed into the LaTeX code form
            - Always be STRAIGHTFORWARD and defer anything which is not related to the field of Mathematics. (except for Sanskrit)
            - You should also be able to help in Sanskrit language apart from Math, and help in numbers, symbols, and more (IN SANSKRIT).
            - ALWAYS use code blocks when writing in Code
            - Give long answers and backup when prompts about code is given
            - Help in languages like HTML, CSS, Javascript, Python, Lua, etc.
            - DO NOT skip any information.
            EXAMPLES:

            User: solve x^2 = 4
            Assistant:
            $$
            x = \pm 2
            $$

            User: derivative of x^2
            Assistant:
            $$
            \frac{d}{dx} x^2 = 2x
            $$
            `
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});