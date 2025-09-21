import OpenAI from "openai";
import axios from "axios";
import { fetchImage } from "./imageService.js"; // ודא שזו הפונקציה שצירפת

export async function callLLMService(input) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

//   const prompt = `
// אתה מתכנן טיולים. החזר JSON בלבד (ללא מלל נוסף).
//
// המשימה:
// יצר לי תיאור טיול מפורט לפי הפרטים שלהלן:
// שם טיול: ${input.tripName}
// סוג טיול: ${input.tripType}
// מדינה: ${input.country}
// עיר: ${input.city}
// בתיאור תכלול גם פירוט על אופי הטיול, ומה הוא כולל מבחינת החוויה.
//
// הנחיות מחייבות:
//
// אם סוג הטיול הוא "bicycle":
// - המסלול נמשך **שני ימים רציפים**.
// - נקודת ההתחלה והסיום שונות (לא מסלול מעגלי).
// - מרחק יומי מקסימלי: **60 ק"מ**.
// - ציין לכל יום תיאור ומרחק.
//
// אם סוג הטיול הוא "trek":
// - המסלול מעגלי (נקודת ההתחלה והסיום זהות).
// - מספר הימים: לפחות יום אחד, אפשר יותר.
// - לכל יום מרחק בין **5–15 ק"מ**.
// - ציין תיאור ומרחק לכל יום.
//
// בנוסף:
// -  המסלולים צריכים להיות ריאליים (לא קו ישר), עם לפחות 10 נקודות ביניים על מנת לבנות מסלול רציף על המפה.
// - ציין את נקודות ההתחלה והסיום עם קואורדינטות גאוגרפיות (lat, lng).
// - ציין את נקודות הביניים עם קואורדינטות גאוגרפיות (lat, lng) וסדר (order).
// - שים לב שהנקודות הן על שבילים / כבישים בלבד.
// - החזר תשובה בשפה **העברית בלבד**.
//
// פורמט הפלט:
// {
//   "tripDescription": "...",
//   "route": {
//     "startPoint": { "lat": מספר, "lng": מספר },
//     "endPoint": { "lat": מספר, "lng": מספר },
//     "waypoints": [ { "lat": מספר, "lng": מספר, "order": מספר } ]
//   },
//   "dailyBreakdown": [
//     { "day": מספר, "distance": מספר, "description": "..." }
//   ],
//   "totalDistance": מספר,
//   "totalDays": מספר,
//   "image": {
//     "url": "קישור תמונה",
//     "description": "..."
//   },
//   "difficulty": "קל|בינוני|קשה"
// }
//
// דוגמאות לפלט תקין:
//
// דוגמה לטיול אופניים:
// {
//   "tripDescription": "מסלול רכיבה מהנה מהעיר תל אביב לחיפה לאורך החוף.",
//   "route": {
//     "startPoint": { "lat": 32.0853, "lng": 34.7818 },
//     "endPoint": { "lat": 32.7940, "lng": 34.9896 },
//     "waypoints": [
//       { "lat": 32.2000, "lng": 34.9000, "order": 1 },
//       { "lat": 32.4000, "lng": 34.9500, "order": 2 }
//     ]
//   },
//   "dailyBreakdown": [
//     { "day": 1, "distance": 55, "description": "רכיבה מתל אביב לנתניה לאורך קו החוף." },
//     { "day": 2, "distance": 50, "description": "המשך רכיבה מנתניה לחיפה." }
//   ],
//   "totalDistance": 105,
//   "totalDays": 2,
//   "image": {
//     "url": "https://example.com/bike_trip.jpg",
//     "description": "תמונה של רוכבי אופניים על רקע הים."
//   },
//   "difficulty": "בינוני"
// }
//
// דוגמה לטרק רגלי:
// {
//   "tripDescription": "טרק מעגלי של יומיים סביב ירושלים.",
//   "route": {
//     "startPoint": { "lat": 31.7683, "lng": 35.2137 },
//     "endPoint": { "lat": 31.7683, "lng": 35.2137 },
//     "waypoints": [
//       { "lat": 31.7700, "lng": 35.2200, "order": 1 },
//       { "lat": 31.7720, "lng": 35.2150, "order": 2 }
//     ]
//   },
//   "dailyBreakdown": [
//     { "day": 1, "distance": 12, "description": "הליכה בין השבילים המיוערים באזור מערב ירושלים." },
//     { "day": 2, "distance": 14, "description": "מסלול חזרה עם נוף לתצפיות הר הצופים." }
//   ],
//   "totalDistance": 26,
//   "totalDays": 2,
//   "image": {
//     "url": "https://example.com/hike_trip.jpg",
//     "description": "נוף יפה מהשבילים."
//   },
//   "difficulty": "בינוני"
// }
//
// חשוב:
// - אל תוסיף שום מלל חופשי מחוץ ל־JSON.
// - הקפד להחזיר בדיוק את המבנה של הדוגמאות.
// `;

    const prompt = `
אתה מתכנן טיולים. 
חשוב מאוד: החזר **RAW JSON בלבד**. 
אסור להשתמש ב-\\\`\\\`\\\`json או בבלוקים של קוד. 
אסור להוסיף טקסט, כותרות, הסברים או כל דבר מחוץ ל-JSON. 
הפלט חייב להיות אך ורק ה-JSON במבנה שיפורט להלן.

המשימה:
צור תיאור טיול מפורט לפי הפרטים שלהלן:
שם טיול: ${input.tripName}
סוג טיול: ${input.tripType}
מדינה: ${input.country}
עיר: ${input.city}

בתיאור כלול:
- אופי הטיול (טבעי / אורבני / תרבותי / היסטורי / משולב).
- החוויה הכוללת (נוף, אווירה, תרבות מקומית, פעילויות ייחודיות).
- גיוון בין מסלולים: בכל יצירה השתדל לבחור סגנון שונה (חופי, הררי, עירוני, כפרי).

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
- המסלולים צריכים להיות ריאליים (על שבילים/כבישים קיימים בלבד).
- המסלול יכלול לפחות 10 נקודות ביניים עם קואורדינטות גאוגרפיות (lat, lng) וסדר (order).
- ציין את נקודות ההתחלה והסיום עם קואורדינטות.
- הגיוון חשוב: כל יצירת מסלול תשלב אזורים מעניינים (כפרים, יערות, חופים, שווקים מקומיים, נקודות תצפית).
- הקפד להחזיר תשובה בשפה **העברית בלבד**.

פורמט הפלט (חובה לעמוד בו בדיוק):
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

חשוב:
- החזר אך ורק RAW JSON.
- אסור להחזיר טקסט חופשי, הסברים, או בלוקים של קוד (\`\`\`json).
- שמור בדיוק על המבנה של הפלט.
- השתדל לשלב רעיונות מגוונים וייחודיים שלא מופיעים בדוגמאות.
אם אתה מזהה שהנקודת ציון שהבאת היא בים, תשנה את המסלול כך שכל הנקודות יהיו ביבשה.
`;



    const completion = await openai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "אתה מסייע ביצירת תוכן טיולים." },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
  });

  const textResponse = completion.choices[0].message.content; // The location of the text returned by the model.
  console.log("Raw response:", textResponse);

  let parsedTrip;
  try {
    parsedTrip = JSON.parse(textResponse);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    throw new Error("Invalid JSON response from LLM");
  }

  // Added image fetching logic
  try {
    const imageUrl = await fetchImage(`${input.country}, ${input.city}`);
    parsedTrip.image = {
      url: imageUrl,
      description: `תמונה של ${input.city} או הסביבה.`,
    };
  } catch (err) {
    console.warn("Failed to fetch image, using default.");
    parsedTrip.image = {
      url: "/images/default_trip.png",
      description: "תמונה ברירת מחדל.",
    };
  }

  return parsedTrip;
}
