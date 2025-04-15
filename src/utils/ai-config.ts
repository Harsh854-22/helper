
// AI Configuration and Response Templates

interface ResponseTemplate {
  keywords: string[];
  response: string;
}

const responseTemplates: ResponseTemplate[] = [
  {
    keywords: ['earthquake', 'shaking', 'tremor'],
    response: "During an earthquake: 1) DROP to the ground, 2) Take COVER under sturdy furniture, and 3) HOLD ON until the shaking stops. Stay away from windows and exterior walls. If you're in bed, stay there and protect your head with a pillow."
  },
  {
    keywords: ['hurricane', 'storm', 'cyclone', 'typhoon'],
    response: "For hurricane safety: 1) Create an emergency kit with water, food, and supplies, 2) Board up windows and secure outdoor items, 3) Follow evacuation orders immediately, 4) Stay informed through official channels, 5) Have a family communication plan ready."
  },
  {
    keywords: ['flood', 'flooding', 'water level'],
    response: "During floods: 1) Move to higher ground immediately, 2) Avoid walking or driving through flood waters - just 6 inches of moving water can knock you down, 3) Follow evacuation orders, 4) Keep emergency supplies ready, 5) Stay tuned to weather updates."
  },
  {
    keywords: ['fire', 'smoke', 'burning'],
    response: "If there's a fire: 1) GET OUT immediately, 2) STAY OUT - never go back inside a burning building, 3) Call emergency services from outside, 4) If smoke is present, stay low where the air is clearer, 5) Test doors for heat before opening them."
  },
  {
    keywords: ['prepare', 'kit', 'emergency kit', 'supplies'],
    response: "Essential emergency kit items: 1) Water (1 gallon per person per day for 3 days), 2) Non-perishable food, 3) Flashlight and batteries, 4) First aid kit, 5) Important documents, 6) Battery-powered radio, 7) Manual can opener, 8) Cell phone chargers, 9) Medications, 10) Cash and change."
  },
  {
    keywords: ['evacuation', 'evacuate', 'leave'],
    response: "Evacuation steps: 1) Leave immediately when ordered, 2) Take your emergency kit, 3) Follow recommended routes, 4) Bring essential medications and documents, 5) Take pets with carriers and food, 6) Lock your home, 7) Keep your gas tank at least half full, 8) Stay informed through official channels."
  }
];

export const generateAIResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  // Find matching template based on keywords
  const matchingTemplate = responseTemplates.find(template =>
    template.keywords.some(keyword => lowercaseInput.includes(keyword))
  );

  // Default response if no matching template is found
  if (!matchingTemplate) {
    return "I'm here to help with disaster management questions. Could you please ask about specific topics like earthquakes, hurricanes, floods, fires, emergency preparation, or evacuation procedures?";
  }

  return matchingTemplate.response;
};

// Export the response time (in ms) for simulating AI processing
export const RESPONSE_DELAY = 800;

