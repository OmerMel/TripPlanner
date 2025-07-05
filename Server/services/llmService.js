// Server/services/llmService.js
import OpenAI from "openai";

export async function callLLMService(input) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const prompt = `
אתה מתכנן טיולים עבור מערכת תכנון מסלולים.
החזר אך ורק JSON חוקי, ללא מלל נוסף.

יצר לי תיאור טיול מפורט בהתאם לפרטים הבאים:
שם טיול: ${input.tripName}
סוג טיול: ${input.tripType}
מדינה: ${input.country}
עיר: ${input.city}

הנחיות נוספות:
- אם סוג הטיול הוא "bicycle":
  - המסלול חייב להיות בן שני ימים רצופים.
  - מתחיל בעיר שנבחרה ומסתיים בעיר אחרת סמוכה במדינה.
  - אורך כל יום עד 60 ק"מ לכל היותר.
- אם סוג הטיול הוא "trek":
  - המסלול חייב להיות מעגלי (התחלה וסיום באותה נקודה).
  - כל יום בטווח 5 עד 15 ק"מ.
- יש להקפיד שהמסלול יהיה ריאלי ולא קו ישר, אלא מבוסס כבישים או שבילים.

פורמט JSON מבוקש:
{
  "tripDescription": "...",
  "route": {
    "startPoint": { "lat": מספר, "lng": מספר },
    "endPoint": { "lat": מספר, "lng": מספר },
    "waypoints": [ { "lat": מספר, "lng": מספר, "order": מספר } ]
  },
  "dailyBreakdown": [
    { "day": מספר, "distance": מספר, "description": "..." }
  ],
  "totalDistance": מספר,
  "totalDays": מספר,
  "image": {
    "url": "קישור תמונה",
    "description": "..."
  },
  "difficulty": "קל|בינוני|קשה"
}

החזר את התשובה בשפה העברית בלבד.
`;

  const completion = await openai.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: "אתה מסייע ביצירת תוכן טיולים." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  const textResponse = completion.choices[0].message.content; // The location of the text returned by the model.
  console.log("Raw response:", textResponse);

  try {
    return JSON.parse(textResponse);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    throw new Error("Invalid JSON response from LLM");
  }
}
