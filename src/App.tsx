import React, { useState, useEffect } from 'react';
import { Search, ChefHat, Loader2, Clock, Sparkles, Home } from 'lucide-react';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';
import CategoryFilter from './components/CategoryFilter';
import { Recipe } from './types';

export default function App() {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);

  const featuredDishes = [
    { name: 'Tandoori chicken', cuisine: 'Indian' },
    { name: 'Pizza Express Margherita', cuisine: 'Miscellaneous' },
    { name: 'Vegan Chocolate Cake', cuisine: 'Vegan' },
  ];

  const resetToHome = () => {
    setSearch('');
    setRecipes([]);
    setSelectedCategory('');
    setSelectedRecipe(null);
  };

  const fetchFeaturedRecipes = async () => {
    try {
      const recipes = await Promise.all(
        featuredDishes.map(async (dish) => {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${dish.name}`);
          const data = await response.json();
          return data.meals?.[0];
        })
      );
      setFeaturedRecipes(recipes.filter(Boolean));
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories(data.categories.map((cat: any) => cat.strCategory));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFeaturedRecipes();
  }, []);

  const searchRecipes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    try {
      let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`;
      if (selectedCategory) {
        const categoryRecipes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`);
        const categoryData = await categoryRecipes.json();
        const detailedRecipes = await Promise.all(
          categoryData.meals.map(async (meal: any) => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            const data = await response.json();
            return data.meals[0];
          })
        );
        setRecipes(detailedRecipes.filter((recipe: Recipe) => 
          recipe.strMeal.toLowerCase().includes(search.toLowerCase())
        ));
      } else {
        const response = await fetch(url);
        const data = await response.json();
        setRecipes(data.meals || []);
      }
      
      setRecentSearches(prev => {
        const updated = [search, ...prev.filter(s => s !== search)].slice(0, 5);
        return updated;
      });
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 relative">
          {(search || recipes.length > 0 || selectedCategory) && (
            <button
              onClick={resetToHome}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              aria-label="Return to home"
            >
              <Home className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-16 h-16 text-orange-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-2">SpiceTrail Webpage</h1>
          <p className="text-xl text-gray-600">Discover delicious recipes from around the world</p>
        </header>

        <div className="max-w-4xl mx-auto mb-12">
          <form onSubmit={searchRecipes} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for recipes..."
                className="w-full px-6 py-4 rounded-full shadow-lg border-2 border-orange-100 focus:border-orange-300 focus:outline-none text-lg bg-white/90 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors shadow-md"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span>Recent searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearch(term);
                      searchRecipes(new Event('submit') as any);
                    }}
                    className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-orange-100 transition-colors shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {!search && !recipes.length && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Featured Recipes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {recipes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Found {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
            </div>
          </>
        )}

        {recipes.length === 0 && !loading && search && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <ChefHat className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No recipes found</h3>
              <p className="text-gray-600">Try searching for something else or change the category filter!</p>
            </div>
          </div>
        )}

        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
}