
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FormData, NutritionPlan, LiteracyLevel } from '../types';

function buildPrompt(formData: FormData): string {
  const {
    medicalAnalyses,
    weight,
    dietaryHabits,
    allergies,
    calorieTarget,
    incomeLevel,
    location,
    educationLevel,
    literacyLevel
  } = formData;

  const commonInstructions = `
You are an AI assistant specializing in creating personalized nutrition plans for individuals with diabetes.
Your goal is to provide helpful, safe, and practical dietary advice.
Given the following user information:
- Health Metrics:
  - Medical Analyses/Conditions: ${medicalAnalyses || 'Not specified'}
  - Weight: ${weight} kg
  - Dietary Habits: ${dietaryHabits}
  - Allergies or Foods to Avoid: ${allergies}
  - Daily Calorie Target: ${calorieTarget} kcal
- Socioeconomic Factors:
  - Income Level: ${incomeLevel}
  - Location Type (Urban/Rural): ${location}
  - Education Level: ${educationLevel}
  - Literacy Level: ${literacyLevel}

Please generate a 3-day sample nutrition plan.

The plan MUST:
1. Be suitable for managing diabetes (e.g., focus on low glycemic index foods, controlled carbohydrate intake, balanced macronutrients).
2. Adhere to the specified daily calorie target (approximately).
3. Consider the user's dietary habits (e.g., vegetarian, vegan) and allergies.
4. Be feasible based on their income level and location (e.g., suggest affordable and commonly available foods. For rural locations, consider less access to specialty items).
5. Be presented in a clear, structured format as a valid JSON object. Do not include any text before or after the JSON object.
`;

  if (literacyLevel === LiteracyLevel.LOW) {
    return `
${commonInstructions}
IMPORTANT: The user has low literacy. Therefore, the plan MUST:
- Use very simple language and short sentences.
- For each meal (breakfast, lunch, dinner, snacks), suggest 1-3 specific, common food items that are easy to recognize and prepare (e.g., "an apple", "a bowl of oatmeal", "grilled chicken breast", "steamed broccoli").
- Include portion size estimations in simple terms (e.g., "1 small bowl", "2 slices", "a handful").

The JSON response MUST follow this exact structure:
{
  "planTitle": "Your Simple 3-Day Diabetes Meal Plan",
  "days": [
    {
      "day": "Day 1",
      "meals": {
        "breakfast": {"description": "Simple description of breakfast. Example: Small bowl of oatmeal with a few berries.", "visualFoodItems": ["oatmeal", "berries"]},
        "lunch": {"description": "Simple description of lunch. Example: Chicken salad with lettuce and tomato, 1 slice whole wheat bread.", "visualFoodItems": ["chicken salad", "lettuce", "tomato", "whole wheat bread"]},
        "dinner": {"description": "Simple description of dinner. Example: Baked fish with green beans and a small sweet potato.", "visualFoodItems": ["baked fish", "green beans", "sweet potato"]},
        "snacks": {"description": "Simple description of snacks. Example: A handful of almonds or a piece of fruit.", "visualFoodItems": ["almonds", "apple"]}
      }
    },
    {
      "day": "Day 2",
      "meals": { /* ... similar structure ... */ }
    },
    {
      "day": "Day 3",
      "meals": { /* ... similar structure ... */ }
    }
  ],
  "generalTips": [
    "Drink plenty of water.",
    "Try to eat meals at regular times.",
    "Move your body a little bit each day, like taking a short walk."
  ]
}
`;
  } else {
    return `
${commonInstructions}
The JSON response MUST follow this exact structure:
{
  "planTitle": "Your Personalized 3-Day Diabetes Nutrition Plan",
  "days": [
    {
      "day": "Day 1",
      "meals": {
        "breakfast": "Detailed description of breakfast, including ingredients, approximate portion sizes (e.g., 1/2 cup cooked oatmeal, 1 small apple), and simple preparation suggestions.",
        "lunch": "Detailed description of lunch...",
        "dinner": "Detailed description of dinner...",
        "snacks": "Detailed description of snacks..."
      },
      "micronutrientsFocus": ["Fiber", "Magnesium", "Omega-3 fatty acids"],
      "notes": "E.g., Ensure adequate hydration throughout the day. Adjust portion sizes based on activity level."
    },
    {
      "day": "Day 2",
      "meals": { /* ... similar structure ... */ },
      "micronutrientsFocus": ["Vitamin D", "Potassium"],
      "notes": "E.g., Consider preparing some components in advance."
    },
    {
      "day": "Day 3",
      "meals": { /* ... similar structure ... */ },
      "micronutrientsFocus": ["Calcium", "Lean Protein"],
      "notes": "E.g., Experiment with different herbs and spices for flavor instead of salt."
    }
  ],
  "generalRecommendations": [
    "Monitor blood glucose levels as advised by your healthcare provider.",
    "Prioritize whole grains, lean proteins, healthy fats, and plenty of non-starchy vegetables.",
    "Limit processed foods, sugary drinks, and excessive saturated/trans fats."
  ],
  "foodShoppingSuggestions": {
    "proteins": ["Skinless chicken breast", "Fish (salmon, cod)", "Tofu", "Lentils", "Beans"],
    "vegetables": ["Leafy greens (spinach, kale)", "Broccoli", "Cauliflower", "Bell peppers", "Carrots"],
    "fruits": ["Berries", "Apples", "Pears", "Oranges (in moderation)"],
    "grains": ["Oats", "Quinoa", "Brown rice", "Whole wheat bread (check labels for sugar)"],
    "healthyFats": ["Avocado", "Nuts (almonds, walnuts)", "Seeds (chia, flax)", "Olive oil"],
    "notes": "Focus on fresh, whole foods. Read labels carefully for added sugars and sodium. Consider seasonal produce for affordability, especially if ${location}."
  }
}
`;
  }
}

export const generateNutritionPlan = async (formData: FormData, apiKey: string): Promise<NutritionPlan> => {
  if (!apiKey) {
    throw new Error("API Key is not provided or configured.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-2.5-flash-preview-04-17'; // Using the specified model

  const prompt = buildPrompt(formData);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5, // Slightly more creative but still factual for planning
            topP: 0.9,
            topK: 40
        }
    });

    let jsonStr = response.text.trim();
    
    // Remove markdown fences if present
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      return parsedData as NutritionPlan;
    } catch (e) {
      console.error("Failed to parse JSON response from AI:", jsonStr);
      throw new Error(`AI returned a response that was not valid JSON. Raw response: ${jsonStr.substring(0,500)}...`);
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Check for common API key errors or permission issues
        if (error.message.includes("API key not valid") || error.message.includes("PERMISSION_DENIED")) {
            throw new Error("Invalid API Key or insufficient permissions. Please check your Gemini API key and project settings.");
        }
         throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
