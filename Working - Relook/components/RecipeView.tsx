import React, { useState } from 'react';
import { RecipeData } from '../types';

interface RecipeViewProps {
  recipe: RecipeData;
}

const RecipeView: React.FC<RecipeViewProps> = ({ recipe }) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recipe Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        {recipe.prepTime && (
          <div className="bg-[#1a1b1e] p-3 rounded-xl border border-white/10 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-xs text-gray-400">Prep Time</div>
            <div className="text-sm font-bold text-white">{recipe.prepTime}</div>
          </div>
        )}
        {recipe.cookTime && (
          <div className="bg-[#1a1b1e] p-3 rounded-xl border border-white/10 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs text-gray-400">Cook Time</div>
            <div className="text-sm font-bold text-white">{recipe.cookTime}</div>
          </div>
        )}
        {recipe.servings && (
          <div className="bg-[#1a1b1e] p-3 rounded-xl border border-white/10 text-center">
            <div className="text-2xl mb-1">🍽️</div>
            <div className="text-xs text-gray-400">Servings</div>
            <div className="text-sm font-bold text-white">{recipe.servings}</div>
          </div>
        )}
        {recipe.difficulty && (
          <div className="bg-[#1a1b1e] p-3 rounded-xl border border-white/10 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xs text-gray-400">Difficulty</div>
            <div className={`text-sm font-bold capitalize ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>
          </div>
        )}
      </div>

      {/* Ingredients Section */}
      <div className="bg-[#1a1b1e] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🥘 Ingredients
          </h3>
          <span className="text-xs text-gray-400">
            {checkedIngredients.size}/{recipe.ingredients.length}
          </span>
        </div>
        <div className="space-y-3">
          {recipe.ingredients.map((ingredient, idx) => (
            <button
              key={idx}
              onClick={() => toggleIngredient(idx)}
              className="w-full text-left flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors active:scale-98"
            >
              <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                checkedIngredients.has(idx)
                  ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] border-[#E6F0C6]'
                  : 'border-gray-500'
              }`}>
                {checkedIngredients.has(idx) && (
                  <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`flex-1 ${checkedIngredients.has(idx) ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                {ingredient}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Instructions Section */}
      <div className="bg-[#1a1b1e] p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            👨‍🍳 Instructions
          </h3>
          <span className="text-xs text-gray-400">
            {completedSteps.size}/{recipe.steps.length} steps
          </span>
        </div>
        <div className="space-y-4">
          {recipe.steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => toggleStep(idx)}
              className="w-full text-left flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors active:scale-98"
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                completedSteps.has(idx)
                  ? 'bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black'
                  : 'bg-white/10 text-white'
              }`}>
                {completedSteps.has(idx) ? '✓' : idx + 1}
              </div>
              <span className={`flex-1 pt-1 ${completedSteps.has(idx) ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                {step}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {(recipe.ingredients.length > 0 || recipe.steps.length > 0) && (
        <div className="bg-[#1a1b1e] p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-300">Cooking Progress</span>
            <span className="text-sm font-bold text-[#E6F0C6]">
              {Math.round(((checkedIngredients.size + completedSteps.size) / (recipe.ingredients.length + recipe.steps.length)) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] transition-all duration-500"
              style={{
                width: `${((checkedIngredients.size + completedSteps.size) / (recipe.ingredients.length + recipe.steps.length)) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeView;