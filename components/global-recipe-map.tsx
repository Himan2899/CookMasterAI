"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Globe, Star, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const worldRecipes = [
  {
    id: "1",
    name: "Butter Chicken",
    country: "India",
    region: "North India",
    coordinates: { x: 72, y: 45 }, // Percentage positions on SVG map
    difficulty: "Medium",
    time: 45,
    rating: 4.8,
    image: "/images/butter-chicken.jpeg",
    description: "Creamy tomato-based curry with tender chicken pieces",
  },
  {
    id: "2",
    name: "Pad Thai",
    country: "Thailand",
    region: "Central Thailand",
    coordinates: { x: 75, y: 52 },
    difficulty: "Easy",
    time: 30,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    description: "Stir-fried rice noodles with shrimp, tofu, and peanuts",
  },
  {
    id: "3",
    name: "Paella",
    country: "Spain",
    region: "Valencia",
    coordinates: { x: 48, y: 35 },
    difficulty: "Hard",
    time: 60,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=300",
    description: "Traditional Spanish rice dish with seafood and saffron",
  },
  {
    id: "4",
    name: "Ramen",
    country: "Japan",
    region: "Tokyo",
    coordinates: { x: 85, y: 40 },
    difficulty: "Medium",
    time: 90,
    rating: 4.9,
    image: "/images/chicken-biryani.jpeg",
    description: "Rich broth noodle soup with various toppings",
  },
  {
    id: "5",
    name: "Coq au Vin",
    country: "France",
    region: "Burgundy",
    coordinates: { x: 50, y: 32 },
    difficulty: "Medium",
    time: 120,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=300",
    description: "Chicken braised in wine with mushrooms and onions",
  },
  {
    id: "6",
    name: "Tacos al Pastor",
    country: "Mexico",
    region: "Mexico City",
    coordinates: { x: 25, y: 48 },
    difficulty: "Easy",
    time: 25,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
    description: "Marinated pork tacos with pineapple and onions",
  },
  {
    id: "7",
    name: "Pasta Carbonara",
    country: "Italy",
    region: "Rome",
    coordinates: { x: 52, y: 38 },
    difficulty: "Medium",
    time: 20,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=300",
    description: "Classic Roman pasta with eggs, cheese, and pancetta",
  },
  {
    id: "8",
    name: "Fish and Chips",
    country: "United Kingdom",
    region: "London",
    coordinates: { x: 48, y: 28 },
    difficulty: "Medium",
    time: 40,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=300",
    description: "Battered fish with crispy chips and mushy peas",
  },
  {
    id: "9",
    name: "Sushi",
    country: "Japan",
    region: "Tokyo",
    coordinates: { x: 87, y: 42 },
    difficulty: "Hard",
    time: 60,
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=300",
    description: "Fresh fish and rice with traditional preparation",
  },
  {
    id: "10",
    name: "Hamburger",
    country: "USA",
    region: "New York",
    coordinates: { x: 20, y: 35 },
    difficulty: "Easy",
    time: 15,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=300",
    description: "Classic American burger with all the fixings",
  },
]

export function GlobalRecipeMap() {
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof worldRecipes)[0] | null>(null)
  const [hoveredRecipe, setHoveredRecipe] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "#10b981" // green
      case "Medium":
        return "#f59e0b" // yellow
      case "Hard":
        return "#ef4444" // red
      default:
        return "#6b7280" // gray
    }
  }

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
          Global Recipe Explorer
        </h2>
        <p className="text-muted-foreground">Discover authentic recipes from around the world</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive World Map */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                Interactive World Recipe Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-4">
              <div className="relative w-full h-[500px] bg-gradient-to-b from-blue-100 via-green-100 to-blue-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-blue-900/10 rounded-lg overflow-hidden">
                {/* Realistic World Map */}
                <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
                  <img
                    src="/images/world-map-continents-oceans.webp"
                    alt="World Map with Continents and Oceans"
                    className="w-full h-full object-cover"
                  />

                  {/* Recipe markers overlaid on the realistic map */}
                  <div className="absolute inset-0">
                    {worldRecipes.map((recipe, index) => (
                      <div key={recipe.id} className="absolute">
                        {/* Pulsing circle animation for hovered recipe */}
                        {hoveredRecipe === recipe.id && (
                          <div
                            className="absolute w-8 h-8 rounded-full animate-ping"
                            style={{
                              left: `${recipe.coordinates.x}%`,
                              top: `${recipe.coordinates.y}%`,
                              backgroundColor: getDifficultyColor(recipe.difficulty),
                              opacity: 0.3,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        )}

                        {/* Main marker */}
                        <div
                          className="absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 hover:scale-150 border-2 border-white shadow-lg"
                          style={{
                            left: `${recipe.coordinates.x}%`,
                            top: `${recipe.coordinates.y}%`,
                            backgroundColor: getDifficultyColor(recipe.difficulty),
                            transform: "translate(-50%, -50%)",
                            filter:
                              hoveredRecipe === recipe.id
                                ? "drop-shadow(0 0 8px rgba(0,0,0,0.5))"
                                : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                          }}
                          onClick={() => setSelectedRecipe(recipe)}
                          onMouseEnter={() => setHoveredRecipe(recipe.id)}
                          onMouseLeave={() => setHoveredRecipe(null)}
                        />

                        {/* Recipe name tooltip on hover */}
                        {hoveredRecipe === recipe.id && (
                          <div
                            className="absolute bg-black/80 text-white px-3 py-1 rounded-md text-sm font-medium pointer-events-none z-10 whitespace-nowrap"
                            style={{
                              left: `${recipe.coordinates.x}%`,
                              top: `${recipe.coordinates.y - 8}%`,
                              transform: "translate(-50%, -100%)",
                            }}
                          >
                            {recipe.name}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map instructions */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-white/20">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    🗺️ Click on markers to explore recipes from around the world
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hover over markers to see recipe names and details
                  </p>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg shadow-lg backdrop-blur-sm">
                  <h4 className="text-sm font-semibold mb-2">Difficulty</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Easy</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Hard</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Details */}
        <div className="space-y-4">
          {selectedRecipe ? (
            <motion.div key={selectedRecipe.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={selectedRecipe.image || "/placeholder.svg"}
                    alt={selectedRecipe.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${getDifficultyBadgeColor(selectedRecipe.difficulty)} text-white`}
                  >
                    {selectedRecipe.difficulty}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2">{selectedRecipe.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedRecipe.region}, {selectedRecipe.country}
                  </p>
                  <p className="text-sm mb-4">{selectedRecipe.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{selectedRecipe.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{selectedRecipe.time} min</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    View Full Recipe
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
              <CardContent className="p-8 text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Explore World Recipes</h3>
                <p className="text-muted-foreground">
                  Click on any marker on the map to discover authentic recipes from that region
                </p>
              </CardContent>
            </Card>
          )}

          {/* Recipe List */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Featured Recipes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto">
              {worldRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedRecipe?.id === recipe.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  onMouseEnter={() => setHoveredRecipe(recipe.id)}
                  onMouseLeave={() => setHoveredRecipe(null)}
                >
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{recipe.name}</h4>
                    <p className="text-xs text-muted-foreground">{recipe.country}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs">{recipe.rating}</span>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                Recipe Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {worldRecipes.filter((r) => r.difficulty === "Easy").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Easy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {worldRecipes.filter((r) => r.difficulty === "Medium").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {worldRecipes.filter((r) => r.difficulty === "Hard").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Hard</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold">{worldRecipes.length}</div>
                <div className="text-xs text-muted-foreground">Total Recipes</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
