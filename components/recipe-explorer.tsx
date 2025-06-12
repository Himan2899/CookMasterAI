"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Globe, Search, ChevronRight, Star, Clock, Users, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Recipe } from "./voice-provider"
import { useVoice } from "./voice-provider"

// Sample recipe data
const popularRecipes: Recipe[] = [
  {
    id: "1",
    name: "Butter Chicken",
    cuisine: "Indian",
    ingredients: [
      "500g chicken thighs",
      "2 tbsp butter",
      "1 onion",
      "2 cloves garlic",
      "1 tbsp ginger paste",
      "2 tbsp tomato paste",
      "1 cup heavy cream",
      "1 tbsp garam masala",
      "1 tsp turmeric",
      "1 tsp cumin",
      "Salt to taste",
    ],
    steps: [
      "Marinate chicken with yogurt and spices for 30 minutes",
      "In a large pan, melt butter and sauté onions until translucent",
      "Add garlic and ginger, cook for 1 minute",
      "Add tomato paste and spices, cook for 2 minutes",
      "Add chicken and cook until browned",
      "Pour in cream, simmer for 15 minutes",
      "Garnish with fresh cilantro",
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    image: "/images/butter-chicken.jpeg",
    nutrition: {
      calories: 450,
      protein: 35,
      carbs: 10,
      fat: 30,
    },
  },
  {
    id: "2",
    name: "Palak Paneer",
    cuisine: "Indian",
    ingredients: [
      "250g paneer",
      "500g spinach",
      "1 onion",
      "2 cloves garlic",
      "1 tbsp ginger paste",
      "1 tsp cumin seeds",
      "1 tsp garam masala",
      "1/2 cup cream",
      "Salt to taste",
    ],
    steps: [
      "Blanch spinach in hot water for 3 minutes, then blend into a puree",
      "Heat oil in a pan, add cumin seeds until they splutter",
      "Add onions, garlic, and ginger, sauté until golden brown",
      "Add spices and cook for 1 minute",
      "Add spinach puree and simmer for 5 minutes",
      "Add paneer cubes and cream, cook for another 5 minutes",
      "Serve hot with naan or rice",
    ],
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    image: "/images/palak-paneer.jpeg",
    nutrition: {
      calories: 350,
      protein: 20,
      carbs: 15,
      fat: 25,
    },
  },
  {
    id: "3",
    name: "Masala Dosa",
    cuisine: "Indian",
    ingredients: ["2 cups rice", "1 cup urad dal", "Potato filling", "Spices", "Oil for cooking"],
    steps: [
      "Soak rice and dal separately for 4-6 hours",
      "Grind into a smooth batter",
      "Ferment overnight",
      "Prepare potato filling with spices",
      "Heat a griddle, pour batter and spread into a thin circle",
      "Add oil around the edges",
      "Place potato filling in the center",
      "Fold and serve with chutney and sambar",
    ],
    prepTime: 480, // Including soaking and fermentation
    cookTime: 20,
    servings: 6,
    image: "/images/masala-dosa.jpeg",
    nutrition: {
      calories: 250,
      protein: 8,
      carbs: 45,
      fat: 5,
    },
  },
  {
    id: "4",
    name: "Chicken Biryani",
    cuisine: "Indian",
    ingredients: [
      "500g chicken",
      "2 cups basmati rice",
      "2 onions",
      "2 tomatoes",
      "2 tbsp biryani masala",
      "1 cup yogurt",
      "Fresh herbs",
      "Ghee",
    ],
    steps: [
      "Marinate chicken with yogurt and spices for 1 hour",
      "Parboil rice with whole spices",
      "Layer marinated chicken and rice in a heavy-bottomed pot",
      "Seal with dough and cook on low heat for 25 minutes",
      "Let it rest for 10 minutes before opening",
      "Garnish with fried onions and fresh herbs",
    ],
    prepTime: 60,
    cookTime: 45,
    servings: 6,
    image: "/images/chicken-biryani.jpeg",
    nutrition: {
      calories: 420,
      protein: 28,
      carbs: 40,
      fat: 18,
    },
  },
  {
    id: "5",
    name: "Chole Bhature",
    cuisine: "Indian",
    ingredients: ["2 cups chickpeas", "2 onions", "2 tomatoes", "Spices", "2 cups all-purpose flour", "Oil for frying"],
    steps: [
      "Soak chickpeas overnight",
      "Pressure cook with spices until soft",
      "Prepare a gravy with onions, tomatoes and spices",
      "Mix flour, yogurt, and oil to make bhature dough",
      "Let it rest for 2 hours",
      "Roll out and deep fry until golden",
      "Serve hot with chole",
    ],
    prepTime: 120,
    cookTime: 60,
    servings: 4,
    image: "/images/chole-bhature.jpeg",
    nutrition: {
      calories: 480,
      protein: 15,
      carbs: 65,
      fat: 20,
    },
  },
]

export function RecipeExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { setCurrentRecipe, speakText } = useVoice()
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredRecipes = popularRecipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setCurrentRecipe(recipe)
    setIsDialogOpen(true)

    // After a short delay, offer to read the steps
    setTimeout(() => {
      speakText("Would you like me to read the recipe steps? Say 'read recipe steps' to hear them.")
    }, 2000)
  }

  return (
    <div className="space-y-6" ref={containerRef}>
      <motion.div
        className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
            Recipe Explorer
          </h2>
          <p className="text-muted-foreground">Discover delicious recipes from around the world</p>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search recipes..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Sort by Rating</DropdownMenuItem>
              <DropdownMenuItem>Sort by Time</DropdownMenuItem>
              <DropdownMenuItem>Filter by Cuisine</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger
            value="popular"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger
            value="indian"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Indian
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
          >
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={index} onSelect={handleRecipeSelect} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="indian" className="mt-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredRecipes
              .filter((recipe) => recipe.cuisine === "Indian")
              .map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} onSelect={handleRecipeSelect} />
              ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Your recently viewed recipes will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="flex items-center justify-center h-40">
            <p className="text-muted-foreground">Your saved recipes will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold flex items-center">
          <Globe className="mr-2 h-5 w-5 text-blue-500" />
          Global Recipe Explorer
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
        >
          View Map
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Recipe Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedRecipe.name}</DialogTitle>
                <DialogDescription>
                  {selectedRecipe.cuisine} cuisine • {selectedRecipe.prepTime + selectedRecipe.cookTime} minutes
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedRecipe.image || "/placeholder.svg"}
                    alt={selectedRecipe.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <ul className="space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-sm">
                          • {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Instructions:</h4>
                  <ol className="space-y-2">
                    {selectedRecipe.steps.map((step, index) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium text-orange-500">{index + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Nutrition (per serving):</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Calories: {selectedRecipe.nutrition.calories}</div>
                      <div>Protein: {selectedRecipe.nutrition.protein}g</div>
                      <div>Carbs: {selectedRecipe.nutrition.carbs}g</div>
                      <div>Fat: {selectedRecipe.nutrition.fat}g</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RecipeCard({
  recipe,
  index,
  onSelect,
}: { recipe: Recipe; index: number; onSelect: (recipe: Recipe) => void }) {
  const { speakText } = useVoice()

  const handleSelect = () => {
    onSelect(recipe)
    // Announce the recipe selection
    speakText(
      `Selected ${recipe.name} recipe. This ${recipe.cuisine} dish takes ${recipe.prepTime + recipe.cookTime} minutes to prepare.`,
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="cursor-pointer"
      onClick={handleSelect}
    >
      <Card className="overflow-hidden h-full flex flex-col bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
            {recipe.cuisine}
          </Badge>
        </div>

        <CardHeader>
          <CardTitle className="text-lg">{recipe.name}</CardTitle>
          <div className="flex items-center">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-amber-500" : ""}`} />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">(24 ratings)</span>
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          <div className="text-sm text-muted-foreground line-clamp-2">
            {recipe.ingredients.slice(0, 3).join(", ")} and {recipe.ingredients.length - 3} more ingredients
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            {recipe.prepTime + recipe.cookTime} min
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            {recipe.servings} servings
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-500 hover:text-white hover:border-transparent"
          >
            View
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
