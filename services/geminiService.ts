
import { GoogleGenAI, Type } from "@google/genai";
import { Lesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const lessonSchema = {
  type: Type.OBJECT,
  properties: {
    snippet: {
      type: Type.STRING,
      description: "A short, engaging passage from the book, approximately 150-200 words long. This is the next logical part of the story."
    },
    quiz: {
      type: Type.ARRAY,
      description: "An array of 2-3 multiple-choice questions based ONLY on the provided snippet.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { 
            type: Type.STRING, 
            description: "The question testing comprehension of the snippet."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 4 possible answers, with one being correct.",
            items: { 
              type: Type.STRING 
            }
          },
          correctAnswerIndex: { 
            type: Type.INTEGER,
            description: "The 0-based index of the correct answer in the 'options' array."
          }
        },
        required: ["question", "options", "correctAnswerIndex"]
      }
    }
  },
  required: ["snippet", "quiz"]
};

export const generateLesson = async (bookTitle: string, chapter: number): Promise<Lesson | null> => {
  try {
    const prompt = `I am reading the book "${bookTitle}". Please provide me with the next part of the story from chapter ${chapter}. It should be a small, digestible snippet. After the snippet, create a short, interactive quiz with 2-3 multiple-choice questions to test my understanding of what I just read. The questions must be based exclusively on the snippet you provide.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.7,
      },
    });
    
    const jsonText = response.text.trim();
    const lessonData = JSON.parse(jsonText);
    
    // Basic validation
    if (lessonData.snippet && Array.isArray(lessonData.quiz)) {
      return lessonData as Lesson;
    } else {
      console.error("Invalid lesson format received from API:", lessonData);
      return null;
    }

  } catch (error) {
    console.error("Error generating lesson with Gemini API:", error);
    return null;
  }
};
