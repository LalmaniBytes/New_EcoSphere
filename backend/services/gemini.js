import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

const env = dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateReply({ message }) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

export async function generateReplyHome({ message }) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are PeerBot – a supportive study buddy for quick doubts
on the home screen. Give crisp, helpful answers that encourage
learning and curiosity:\n\n${message}`,
            },
          ],
        },
      ],
    });

    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}
