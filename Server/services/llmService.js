// Server/services/llmService.js
import OpenAI from "openai";

export async function callLLMService(input) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const prompt = `
אתה מתכנן טיולים. החזר JSON בלבד (ללא מלל נוסף).

המשימה:
יצר לי תיאור טיול מפורט לפי הפרטים שלהלן:
שם טיול: ${input.tripName}
סוג טיול: ${input.tripType}
מדינה: ${input.country}
עיר: ${input.city}
בתיאור תכלול גם פירוט על אופי הטיול, ומה הוא כולל מבחינת החוויה.

הנחיות מחייבות:

אם סוג הטיול הוא "bicycle":
- המסלול נמשך **שני ימים רציפים**.
- נקודת ההתחלה והסיום שונות (לא מסלול מעגלי).
- מרחק יומי מקסימלי: **60 ק"מ**.
- ציין לכל יום תיאור ומרחק.

אם סוג הטיול הוא "trek":
- המסלול מעגלי (נקודת ההתחלה והסיום זהות).
- מספר הימים: לפחות יום אחד, אפשר יותר.
- לכל יום מרחק בין **5–15 ק"מ**.
- ציין תיאור ומרחק לכל יום.

בנוסף:
-  המסלולים צריכים להיות ריאליים (לא קו ישר), עם לפחות 10 נקודות ביניים על מנת לבנות מסלול רציף על המפה.
- ציין את נקודות ההתחלה והסיום עם קואורדינטות גאוגרפיות (lat, lng).
- ציין את נקודות הביניים עם קואורדינטות גאוגרפיות (lat, lng) וסדר (order).
- שים לב שהנקודות הן על שבילים / כבישים בלבד.
- החזר תשובה בשפה **העברית בלבד**.

פורמט הפלט:
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

דוגמאות לפלט תקין:

דוגמה לטיול אופניים:
{
  "tripDescription": "מסלול רכיבה מהנה מהעיר תל אביב לחיפה לאורך החוף.",
  "route": {
    "startPoint": { "lat": 32.0853, "lng": 34.7818 },
    "endPoint": { "lat": 32.7940, "lng": 34.9896 },
    "waypoints": [
      { "lat": 32.2000, "lng": 34.9000, "order": 1 },
      { "lat": 32.4000, "lng": 34.9500, "order": 2 }
    ]
  },
  "dailyBreakdown": [
    { "day": 1, "distance": 55, "description": "רכיבה מתל אביב לנתניה לאורך קו החוף." },
    { "day": 2, "distance": 50, "description": "המשך רכיבה מנתניה לחיפה." }
  ],
  "totalDistance": 105,
  "totalDays": 2,
  "image": {
    "url": "https://example.com/bike_trip.jpg",
    "description": "תמונה של רוכבי אופניים על רקע הים."
  },
  "difficulty": "בינוני"
}

דוגמה לטרק רגלי:
{
  "tripDescription": "טרק מעגלי של יומיים סביב ירושלים.",
  "route": {
    "startPoint": { "lat": 31.7683, "lng": 35.2137 },
    "endPoint": { "lat": 31.7683, "lng": 35.2137 },
    "waypoints": [
      { "lat": 31.7700, "lng": 35.2200, "order": 1 },
      { "lat": 31.7720, "lng": 35.2150, "order": 2 }
    ]
  },
  "dailyBreakdown": [
    { "day": 1, "distance": 12, "description": "הליכה בין השבילים המיוערים באזור מערב ירושלים." },
    { "day": 2, "distance": 14, "description": "מסלול חזרה עם נוף לתצפיות הר הצופים." }
  ],
  "totalDistance": 26,
  "totalDays": 2,
  "image": {
    "url": "https://example.com/hike_trip.jpg",
    "description": "נוף יפה מהשבילים."
  },
  "difficulty": "בינוני"
}

חשוב:
- אל תוסיף שום מלל חופשי מחוץ ל־JSON.
- הקפד להחזיר בדיוק את המבנה של הדוגמאות.
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
