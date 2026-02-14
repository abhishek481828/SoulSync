
import { GoogleGenAI } from "@google/genai";
import { Mood } from "../types";

export const getEmpatheticResponse = async (userText: string, currentMood: Mood) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is feeling ${currentMood} and said: "${userText}". 
      Respond as a supportive, empathetic university peer. Keep it short (2-3 sentences), warm, and non-judgmental. 
      Do not give clinical advice, just human-to-human connection.`,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm here for you. Just remember you're not alone in this journey.";
  }
};

export const chatWithAI = async (message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[], currentMood: Mood) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are SoulAI, a kind and deeply empathetic companion for university students. 
        The user is currently feeling ${currentMood}. Your goal is to listen, provide comfort, and offer gentle 
        encouragement. Keep your tone human, warm, and supportive. Avoid clinical terminology or medical advice. 
        Focus on validation and emotional connection.`,
        temperature: 0.9,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: message });
    return result.text;
  } catch (error) {
    console.error("Chat AI Error:", error);
    return "I'm sorry, I'm having a little trouble connecting right now, but I'm still listening. Can you tell me more?";
  }
};

export const analyzeMoodTrend = async (moodHistory: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given this mood history over the past week: ${moodHistory}, provide a one-sentence encouraging summary or observation about the trend.`,
    });

    return response.text;
  } catch (error) {
    return "Keep taking it one day at a time. Every small step counts.";
  }
};
