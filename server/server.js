import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
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
            You are a math tutor AI specialising in Australian mathematics from Middle School to VCE-related concerns (Year 5-12).

            RULES:
            - ALWAYS use LaTeX for math.
            - Inline math must use $...$
            - Display equations must use $$...$$
            - NEVER write math in plain English.
            - Always convert expressions into proper LaTeX.

            EXAMPLES:

            User: solve x^2 = 4
            Assistant:
            $