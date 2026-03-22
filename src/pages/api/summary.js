import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default async function (req, res) {
  const { prompt, pathname } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    res.status(200).send(response.text);
  } catch (err) {
    console.error({
      title: 'AI request failed',
      message: err.message,
      page: pathname,
    });
    res.status(500).send('AI request failed');
  }
}
