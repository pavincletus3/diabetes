import React, { useState, useCallback } from "react";
import {
  LiteracyLevel,
  IncomeLevel,
  LocationType,
  FormData,
  NutritionPlan,
  LowLiteracyNutritionPlan,
} from "./types";
import { generateNutritionPlan } from "./services/geminiService";
import {
  InputField,
  SelectField,
  TextareaField,
} from "./components/FormControls";
import { PlanDisplay } from "./components/PlanDisplay";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { SparklesIcon, InformationCircleIcon } from "./components/Icons";

// Moved Card component outside of App component
const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => (
  <div className={`bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8 ${className}`}>
    {title && (
      <h2 className="text-2xl font-semibold text-sky-400 mb-6">{title}</h2>
    )}
    {children}
  </div>
);

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    medicalAnalyses: "",
    weight: "",
    dietaryHabits: "Omnivore",
    allergies: "None",
    calorieTarget: "2000",
    incomeLevel: IncomeLevel.MEDIUM,
    location: LocationType.URBAN,
    educationLevel: "High School",
    literacyLevel: LiteracyLevel.MEDIUM,
  });

  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyNote, setShowApiKeyNote] = useState<boolean>(true);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNutritionPlan(null);
    setShowApiKeyNote(false);

    if (!process.env.API_KEY) {
      setError(
        "API Key is not configured. Please set the API_KEY environment variable."
      );
      setIsLoading(false);
      return;
    }

    try {
      const plan = await generateNutritionPlan(formData, process.env.API_KEY);
      setNutritionPlan(plan);
    } catch (err) {
      if (err instanceof Error) {
        setError(
          `Failed to generate plan: ${err.message}. Ensure your API key is valid and has access to the Gemini API.`
        );
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 mb-3">
          AI Diabetes Nutrition Planner
        </h1>
        <p className="text-slate-400 text-lg">
          Personalized nutrition plans, tailored to your needs.
        </p>
      </header>

      {showApiKeyNote && (
        <div
          className="bg-sky-900/70 border border-sky-700 text-sky-300 px-4 py-3 rounded-lg relative mb-6 max-w-2xl text-sm flex items-start"
          role="alert"
        >
          <InformationCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>
            <strong>Important:</strong> This application requires a Gemini API
            key to be configured in the environment variable
            `process.env.API_KEY`. The key is used directly and not stored by
            this frontend.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card title="Your Details" className="md:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextareaField
              label="Medical Analyses Summary"
              name="medicalAnalyses"
              value={formData.medicalAnalyses}
              onChange={handleChange}
              placeholder="Brief summary of relevant medical conditions, blood sugar levels, HbA1c, etc."
              rows={3}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 70"
                required
              />
              <InputField
                label="Daily Calorie Target (kcal)"
                name="calorieTarget"
                type="number"
                value={formData.calorieTarget}
                onChange={handleChange}
                placeholder="e.g., 1800"
                required
              />
            </div>
            <InputField
              label="Dietary Habits"
              name="dietaryHabits"
              value={formData.dietaryHabits}
              onChange={handleChange}
              placeholder="e.g., Vegetarian, Vegan, Pescatarian"
              required
            />
            <InputField
              label="Allergies or Foods to Avoid"
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              placeholder="e.g., Peanuts, Gluten, Shellfish"
              required
            />

            <h3 className="text-xl font-medium text-sky-500 pt-2">
              Socioeconomic Factors
            </h3>
            <SelectField
              label="Income Level"
              name="incomeLevel"
              value={formData.incomeLevel}
              onChange={handleChange}
              options={Object.values(IncomeLevel).map((level) => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1),
              }))}
            />
            <SelectField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              options={Object.values(LocationType).map((loc) => ({
                value: loc,
                label: loc.charAt(0).toUpperCase() + loc.slice(1),
              }))}
            />
            <InputField
              label="Education Level"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
              placeholder="e.g., PhD, Masters, Bachelors, High School, Elementary"
            />
            <SelectField
              label="Literacy Level"
              name="literacyLevel"
              value={formData.literacyLevel}
              onChange={handleChange}
              options={Object.values(LiteracyLevel).map((level) => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1),
              }))}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <SparklesIcon className="w-5 h-5 mr-2" />
              )}
              Generate Plan
            </button>
          </form>
        </Card>

        <div className="md:col-span-1">
          {isLoading && (
            <Card className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <LoadingSpinner />
              <p className="mt-4 text-slate-400 text-lg">
                Generating your personalized plan...
              </p>
            </Card>
          )}
          {error && (
            <Card className="h-full min-h-[300px]">
              <div className="text-red-400 bg-red-900/30 p-4 rounded-md">
                <h3 className="font-semibold text-red-300 text-lg mb-2">
                  Error
                </h3>
                <p>{error}</p>
              </div>
            </Card>
          )}
          {nutritionPlan && !isLoading && !error && (
            <PlanDisplay
              plan={nutritionPlan}
              literacyLevel={formData.literacyLevel}
            />
          )}
          {!nutritionPlan && !isLoading && !error && (
            <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
              <SparklesIcon className="w-16 h-16 text-sky-500 mb-4" />
              <p className="text-slate-400 text-xl">
                Your personalized nutrition plan will appear here.
              </p>
              <p className="text-slate-500 mt-2">
                Fill in your details and click "Generate Plan".
              </p>
            </Card>
          )}
        </div>
      </div>
      <footer className="text-center mt-12 py-6 text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} AI Diabetes Nutrition Planner.
          Powered by Gemini.
        </p>
        <p>
          This tool provides suggestions and is not a substitute for
          professional medical advice.
        </p>
      </footer>
    </div>
  );
};

export default App;
