import React from 'react';
import { X, Globe2, Youtube, Clock, ChefHat, Bookmark } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
    .map((i) => ({
      ingredient: recipe[`strIngredient${i}` as keyof Recipe],
      measure: recipe[`strMeasure${i}` as keyof Recipe],
    }))
    .filter(({ ingredient, measure }) => ingredient && measure);

  const instructions = recipe.strInstructions
    .split('\r\n')
    .filter(step => step.trim().length > 0);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/90 backdrop-blur-sm p-4 border-b z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{recipe.strMeal}</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
              onClick={() => {}}
            >
              <Bookmark className="w-6 h-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="relative rounded-xl overflow-hidden mb-8">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm">
                  {recipe.strCategory}
                </span>
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm flex items-center gap-2">
                  <Globe2 className="w-4 h-4" />
                  {recipe.strArea} Cuisine
                </span>
                {recipe.strTags && (
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm">
                    {recipe.strTags}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-semibold">Ingredients</h3>
              </div>
              <ul className="space-y-3 bg-orange-50 rounded-xl p-6">
                {ingredients.map(({ ingredient, measure }, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    <span className="font-medium">{measure}</span>
                    <span className="mx-2">-</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-orange-500" />
                <h3 className="text-xl font-semibold">Instructions</h3>
              </div>
              <ol className="space-y-4">
                {instructions.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.strYoutube && (
            <div className="border-t pt-8">
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-semibold">Video Tutorial</h3>
              </div>
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg"
              >
                <Youtube className="w-5 h-5" />
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;