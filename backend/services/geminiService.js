import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateResponse = async (message, userName) => {
  try {
    const completion = await groq.chat.completions.create({
model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `You are Spark AI inside a social media app.
The user's name is ${userName}.
Do NOT repeat the user's name in every message.
Only use their name if it feels natural or necessary.
Keep replies short (max 2-3 sentences).
Do not make up facts like weather or location unless provided.`
},
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Groq error:", error);
    return "AI temporarily unavailable.";
  }
};
