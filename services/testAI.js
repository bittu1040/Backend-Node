import dotenv from 'dotenv';
import OpenAI from "openai";

// load .env when present (safe no-op if running in environment where vars are set)
dotenv.config();

// fail early with a friendly message if API key is missing
if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY. Create a .env file with OPENAI_API_KEY or set the environment variable and retry.');
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",  // or another supported model
      messages: [
        { role: "user", content: "Explain JavaScript closures." }
      ],
    });

    console.log(response.choices?.[0]?.message?.content ?? JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('OpenAI request failed:', err.message ?? err);
    process.exit(1);
  }
}

run();
