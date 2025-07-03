export async function callLLMService(input) {
  // כרגע מחזיר נתוני דמה
  return {
    tripDescription: "טיול לדוגמה",
    route: {
      startPoint: { lat: 32, lng: 35 },
      endPoint: { lat: 32.1, lng: 35.1 },
      waypoints: [],
    },
    dailyBreakdown: [
      { day: 1, distance: 10, description: "יום ראשון", stops: [] },
      { day: 2, distance: 12, description: "יום שני", stops: [] },
    ],
    totalDistance: 22,
    totalDays: 2,
    image: {
      url: "/images/sample.png",
      description: "תמונה לדוגמה",
      isGenerated: false,
    },
    difficulty: "medium",
  };
}
