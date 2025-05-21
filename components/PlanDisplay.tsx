import React from "react";
import {
  NutritionPlan,
  LiteracyLevel,
  LowLiteracyNutritionPlan,
  StandardNutritionPlan,
  LowLiteracyMeal,
  LowLiteracyDayPlan,
  StandardDayPlan,
} from "../types";
import {
  CalendarDaysIcon,
  LightBulbIcon,
  ShoppingCartIcon,
  SparklesIcon,
  CakeIcon,
  SunIcon,
  MoonIcon,
  StarIcon,
} from "./Icons";

interface PlanDisplayProps {
  plan: NutritionPlan;
  literacyLevel: LiteracyLevel;
}

const MealCard: React.FC<{
  title: string;
  content: string | LowLiteracyMeal;
  isLowLiteracy: boolean;
  icon: React.ReactNode;
}> = ({ title, content, isLowLiteracy, icon }) => {
  const renderContent = () => {
    if (
      isLowLiteracy &&
      typeof content === "object" &&
      content !== null &&
      "description" in content
    ) {
      const meal = content as LowLiteracyMeal;
      return (
        <>
          <p className="text-slate-300 mb-3">{meal.description}</p>
          {meal.visualFoodItems && meal.visualFoodItems.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-sky-400 mb-2">
                Key Foods:
              </h4>
              <div className="flex flex-wrap gap-3">
                {meal.visualFoodItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center"
                  >
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(
                        item
                      )}/100/80?grayscale&blur=1`}
                      alt={item}
                      className="w-24 h-20 object-cover rounded-lg mb-1 shadow-md border-2 border-slate-600"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://picsum.photos/seed/placeholder/100/80?grayscale")
                      }
                    />
                    <span className="text-xs text-slate-400 capitalize">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }
    return (
      <p className="text-slate-300 whitespace-pre-line">{content as string}</p>
    );
  };

  return (
    <div className="bg-slate-700/50 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold text-sky-300">{title}</h3>
      </div>
      {renderContent()}
    </div>
  );
};

const DayPlanCard: React.FC<{
  dayPlan: StandardDayPlan | LowLiteracyDayPlan;
  isLowLiteracy: boolean;
}> = ({ dayPlan, isLowLiteracy }) => {
  const meals = dayPlan.meals;
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl mb-6">
      <div className="flex items-center mb-4">
        <CalendarDaysIcon className="w-7 h-7 text-cyan-400 mr-3" />
        <h2 className="text-2xl font-bold text-cyan-400">{dayPlan.day}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MealCard
          title="Breakfast"
          content={meals.breakfast}
          isLowLiteracy={isLowLiteracy}
          icon={<SunIcon className="w-5 h-5 text-yellow-400 mr-2" />}
        />
        <MealCard
          title="Lunch"
          content={meals.lunch}
          isLowLiteracy={isLowLiteracy}
          icon={<CakeIcon className="w-5 h-5 text-orange-400 mr-2" />}
        />
        <MealCard
          title="Dinner"
          content={meals.dinner}
          isLowLiteracy={isLowLiteracy}
          icon={<MoonIcon className="w-5 h-5 text-indigo-400 mr-2" />}
        />
        <MealCard
          title="Snacks"
          content={meals.snacks}
          isLowLiteracy={isLowLiteracy}
          icon={<StarIcon className="w-5 h-5 text-pink-400 mr-2" />}
        />
      </div>
      {!isLowLiteracy && (dayPlan as StandardDayPlan).micronutrientsFocus && (
        <div className="mt-4 pt-3 border-t border-slate-700">
          <h4 className="text-md font-semibold text-sky-400 mb-1">
            Micronutrients Focus:
          </h4>
          <p className="text-sm text-slate-400">
            {(dayPlan as StandardDayPlan).micronutrientsFocus?.join(", ")}
          </p>
        </div>
      )}
      {!isLowLiteracy && (dayPlan as StandardDayPlan).notes && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <h4 className="text-md font-semibold text-sky-400 mb-1">Notes:</h4>
          <p className="text-sm text-slate-400 whitespace-pre-line">
            {(dayPlan as StandardDayPlan).notes}
          </p>
        </div>
      )}
    </div>
  );
};

export const PlanDisplay: React.FC<PlanDisplayProps> = ({
  plan,
  literacyLevel,
}) => {
  const isLowLiteracy = literacyLevel === LiteracyLevel.LOW;

  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center mb-6">
        <SparklesIcon className="w-8 h-8 text-yellow-400 mr-3" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300">
          {plan.planTitle}
        </h1>
      </div>

      {plan.days.map((dayPlan, index) => (
        <DayPlanCard
          key={index}
          dayPlan={dayPlan}
          isLowLiteracy={isLowLiteracy}
        />
      ))}

      {isLowLiteracy && (plan as LowLiteracyNutritionPlan).generalTips && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center mb-2">
            <LightBulbIcon className="w-6 h-6 text-yellow-400 mr-2" />
            <h2 className="text-xl font-semibold text-yellow-300">
              Simple Tips
            </h2>
          </div>
          <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
            {(plan as LowLiteracyNutritionPlan).generalTips.map(
              (tip, index) => (
                <li key={index}>{tip}</li>
              )
            )}
          </ul>
        </div>
      )}

      {!isLowLiteracy &&
        (plan as StandardNutritionPlan).generalRecommendations && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center mb-2">
              <LightBulbIcon className="w-6 h-6 text-yellow-400 mr-2" />
              <h2 className="text-xl font-semibold text-yellow-300">
                General Recommendations
              </h2>
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1 pl-2">
              {(plan as StandardNutritionPlan).generalRecommendations.map(
                (rec, index) => (
                  <li key={index}>{rec}</li>
                )
              )}
            </ul>
          </div>
        )}

      {!isLowLiteracy &&
        (plan as StandardNutritionPlan).foodShoppingSuggestions && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center mb-2">
              <ShoppingCartIcon className="w-6 h-6 text-green-400 mr-2" />
              <h2 className="text-xl font-semibold text-green-300">
                Food Shopping Suggestions
              </h2>
            </div>
            {(
              Object.keys(
                (plan as StandardNutritionPlan).foodShoppingSuggestions || {}
              ) as Array<keyof StandardNutritionPlan["foodShoppingSuggestions"]>
            ).map((category) => {
              if (category === "notes") return null;
              const items = (plan as StandardNutritionPlan)
                .foodShoppingSuggestions?.[category];
              if (!items || (Array.isArray(items) && items.length === 0))
                return null;
              return (
                <div key={category} className="mb-2">
                  <h3 className="text-md font-semibold text-sky-400 capitalize">
                    {category}:
                  </h3>
                  <p className="text-sm text-slate-400">
                    {(items as string[]).join(", ")}
                  </p>
                </div>
              );
            })}
            {(plan as StandardNutritionPlan).foodShoppingSuggestions?.notes && (
              <div className="mt-2">
                <h3 className="text-md font-semibold text-sky-400">
                  Shopping Notes:
                </h3>
                <p className="text-sm text-slate-400">
                  {
                    (plan as StandardNutritionPlan).foodShoppingSuggestions
                      ?.notes
                  }
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
