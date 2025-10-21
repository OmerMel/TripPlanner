// llmService.js
import OpenAI from "openai";
import { fetchImage } from "./imageService.js";
import { validateRouteOnLandLocal } from "./localGeoService.js";

const BASE_PROMPT = (input, extraNote = "") => `
You are a trip planner.  
Important: Return **RAW JSON only**.  
Do not use \`\`\`json or code blocks.  
Do not add any text, titles, explanations, or anything outside the JSON.  
The output must be **only** the JSON in the structure detailed below.

Task:  
Create a detailed trip description based on the following details (max 20 words):  
Trip name: ${input.tripName}  
Trip type: ${input.tripType}  
Country: ${input.country}  
City: ${input.city}

In the description include:
- The nature of the trip (natural / urban / cultural / historical / mixed).  
- The overall experience (landscape, atmosphere, local culture, unique activities).  
- broken down by day, with map-ready geodata.

Mandatory guidelines:

If the trip type is "bicycle":
- The route lasts for **two consecutive days**.  
- The start and end points are different (not a circular route).  
- Maximum daily distance: **60 km**.  
- Specify for each day: description, distance, and points of interest.

If the trip type is "trek":
- The route is circular (start and end points are the same).  
- Number of days: at least one.  
- Each day’s distance is between **5–15 km**.  
- Specify description, distance, and points of interest.

Additionally:
- The route must be **realistic and winding**, not a straight line — use existing roads or trails only.  
- The route must include at least 10 intermediate waypoints with geographic coordinates (lat, lng) and order.  
- Specify real coordinates (not imaginary) for the start and end points.  
- Each point of interest should appear as free text within the daily description.  
- If any generated point is in the sea, replace it with a nearby land point.  
- Ensure the response is returned **in Hebrew only**.

Output format (must follow exactly):
{
  "tripDescription": "...",
  "route": {
    "startPoint": { "lat": number, "lng": number },
    "endPoint": { "lat": number, "lng": number },
    "waypoints": [ { "lat": number, "lng": number, "order": number } ]
  },
  "dailyBreakdown": [
    { "day": number, "distance": number, "description": "..." }
  ],
  "totalDistance": number,
  "totalDays": number,
  "image": {
    "url": "image link",
    "description": "..."
  },
  "difficulty": "קל|בינוני|קשה"
}

Important:
- Return **RAW JSON only**.  
- Do not return free text, explanations, or code blocks (\`\`\`json).  
- Strictly follow the output structure.  
- Maintain variety and creativity between different routes.  
If you detect that a coordinate you provided is in the sea, adjust the route so that all points are on land.
`.trim();

async function callOnce(openai, prompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-5-mini-2025-08-07",
        messages: [
            { role: "system", content: "You are a expert trip planner." },
            { role: "user", content: prompt },
        ],
        temperature: 1
    });

    const textResponse = completion.choices[0].message.content;
    let parsedTrip;
    try {
        parsedTrip = JSON.parse(textResponse);
    } catch (err) {
        console.error("Failed to parse JSON:", err);
        throw new Error("Invalid JSON response from LLM");
    }
    return parsedTrip;
}

export async function callLLMService(input) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    let extraNote = "";
    let lastTrip = null;
    const MAX_TRIES = 3;

    for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
        const prompt = BASE_PROMPT(input, extraNote);
        const trip = await callOnce(openai, prompt);

        // Local land/water validation
        const { ok, waterPoints } = validateRouteOnLandLocal(trip.route);
        if (ok) {
            lastTrip = trip;
            break;
        }

        const badList = waterPoints
            .map(p => `${p.where} (lat: ${p.lat.toFixed(6)}, lng: ${p.lng.toFixed(6)})`)
            .join("; ");

        extraNote = `
        Some of the points you suggested are located in water instead of on land: ${badList}.
        Please replace them with land-based points only (on paths/roads), and keep the same JSON format (RAW only).
        `.trim();

        lastTrip = trip;
    }

    if (!lastTrip) {
        throw new Error("Failed to generate a valid land-only route");
    }

    // Optional image enrichment (best-effort)
    try {
        const imageUrl = await fetchImage(`${input.country}, ${input.city}`);
        lastTrip.image = {
            url: imageUrl,
            description: `תמונה של ${input.city} או הסביבה.`,
            isGenerated: true
        };
    } catch {
        lastTrip.image = {
            url: "/images/default_trip.png",
            description: "תמונה ברירת מחדל.",
        };
    }

    return lastTrip;
}
