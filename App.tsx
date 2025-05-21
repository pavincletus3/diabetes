import React, { useState, useCallback } from "react";
import {
  LiteracyLevel,
  IncomeLevel,
  LocationType,
  FormData,
  NutritionPlan,
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
  <div
    className={`bg-slate-800/90 backdrop-blur-sm shadow-2xl rounded-xl p-6 md:p-8 border border-slate-700/50 transition-all duration-300 hover:shadow-sky-900/20 ${className}`}
  >
    {title && (
      <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400 mb-6">
        {title}
      </h2>
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-cyan-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-center relative z-10">
        <header className="text-center mb-10 pt-10 md:pt-16 px-4">
          <div className="inline-block mb-3 p-2 rounded-full bg-sky-500/10 text-sky-400">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400 mb-4">
            AI Diabetes Nutrition Planner
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Personalized nutrition plans, tailored to your specific needs and
            lifestyle.
          </p>
        </header>

        {showApiKeyNote && (
          <div
            className="bg-sky-900/40 border border-sky-700/50 text-sky-300 px-5 py-4 rounded-xl relative mb-8 max-w-2xl text-sm flex items-start shadow-lg transform transition-all duration-300 hover:shadow-sky-900/30 animate-fade-in"
            role="alert"
          >
            <InformationCircleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-sky-400" />
            <span>
              <strong className="font-medium">Important:</strong> This
              application requires a Gemini API key to be configured in the
              environment variable
              <code className="mx-1 px-1 py-0.5 bg-sky-900/50 rounded text-sky-200 font-mono">
                process.env.API_KEY
              </code>
              . The key is used directly and not stored by this frontend.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mb-12">
          <Card
            title="Your Details"
            className="md:col-span-1 transform transition-all duration-500"
          >
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              </div>

              <div className="pt-2 pb-1">
                <h3 className="text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400 mb-3">
                  Socioeconomic Factors
                </h3>
                <div className="h-1 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-full mb-5"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                  label="Education Level"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleChange}
                  placeholder="e.g., PhD, Masters, Bachelors, High School"
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
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate Plan
                  </>
                )}
              </button>
            </form>
          </Card>

          <div className="md:col-span-1">
            {isLoading && (
              <Card className="flex flex-col items-center justify-center h-full min-h-[300px] animate-pulse">
                <LoadingSpinner />
                <p className="mt-6 text-slate-400 text-lg animate-pulse">
                  Generating your personalized plan...
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  This usually takes 5-10 seconds
                </p>
              </Card>
            )}
            {error && (
              <Card className="h-full min-h-[300px] animate-shake">
                <div className="text-red-400 bg-red-900/30 p-5 rounded-xl border border-red-800/50">
                  <h3 className="font-semibold text-red-300 text-lg mb-2 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Error
                  </h3>
                  <p>{error}</p>
                </div>
              </Card>
            )}
            {nutritionPlan && !isLoading && !error && (
              <div className="transform transition-all duration-500 animate-fade-in">
                <PlanDisplay
                  plan={nutritionPlan}
                  literacyLevel={formData.literacyLevel}
                />
              </div>
            )}
            {!nutritionPlan && !isLoading && !error && (
              <Card className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                <div className="p-6 rounded-full bg-sky-500/10 mb-6">
                  <SparklesIcon className="w-12 h-12 text-sky-400" />
                </div>
                <p className="text-slate-300 text-xl mb-3">
                  Your personalized nutrition plan will appear here
                </p>
                <p className="text-slate-500 max-w-md">
                  Fill in your details on the left and click "Generate Plan" to
                  create a customized diabetes-friendly nutrition plan based on
                  your specific needs.
                </p>
              </Card>
            )}
          </div>
        </div>
        <footer className="text-center py-8 text-slate-500 text-sm max-w-4xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>
          <p className="mb-2">
            &copy; {new Date().getFullYear()} AI Diabetes Nutrition Planner.
            Powered by Gemini.
          </p>
          <p className="text-slate-600">
            <strong className="text-slate-500">Disclaimer:</strong> This tool
            provides suggestions and is not a substitute for professional
            medical advice. Always consult with healthcare providers about your
            diet and diabetes management.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
