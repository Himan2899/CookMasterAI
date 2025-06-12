"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Target, Zap } from "lucide-react"

const nutritionData = [
  { name: "Protein", value: 35, color: "#ff6b6b" },
  { name: "Carbs", value: 45, color: "#4ecdc4" },
  { name: "Fat", value: 20, color: "#45b7d1" },
]

const weeklyNutrition = [
  { day: "Mon", calories: 2100, protein: 120, carbs: 250, fat: 70 },
  { day: "Tue", calories: 1950, protein: 110, carbs: 230, fat: 65 },
  { day: "Wed", calories: 2200, protein: 130, carbs: 270, fat: 75 },
  { day: "Thu", calories: 2050, protein: 115, carbs: 240, fat: 68 },
  { day: "Fri", calories: 2300, protein: 140, carbs: 280, fat: 80 },
  { day: "Sat", calories: 2400, protein: 145, carbs: 290, fat: 85 },
  { day: "Sun", calories: 2150, protein: 125, carbs: 260, fat: 72 },
]

const recipeComparison = [
  { name: "Butter Chicken", calories: 450, protein: 35, carbs: 10, fat: 30, fiber: 2 },
  { name: "Palak Paneer", calories: 350, protein: 20, carbs: 15, fat: 25, fiber: 5 },
  { name: "Masala Dosa", calories: 250, protein: 8, carbs: 45, fat: 5, fiber: 3 },
  { name: "Chicken Biryani", calories: 420, protein: 28, carbs: 40, fat: 18, fiber: 2 },
  { name: "Chole Bhature", calories: 480, protein: 15, carbs: 65, fat: 20, fiber: 8 },
]

const dailyGoals = {
  calories: { current: 2100, target: 2200, unit: "kcal" },
  protein: { current: 120, target: 150, unit: "g" },
  carbs: { current: 250, target: 275, unit: "g" },
  fat: { current: 70, target: 80, unit: "g" },
  fiber: { current: 25, target: 30, unit: "g" },
  water: { current: 6, target: 8, unit: "glasses" },
}

export function NutritionVisualizer() {
  const [selectedMetric, setSelectedMetric] = useState("calories")

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 90) return "text-green-500"
    if (percentage >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getProgressWidth = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500 mb-2">
          Nutrition Visualizer
        </h2>
        <p className="text-muted-foreground">Track your nutritional intake and health goals</p>
      </motion.div>

      {/* Daily Goals Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Today's Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(dailyGoals).map(([key, goal]) => (
                <motion.div key={key} className="text-center" whileHover={{ scale: 1.05 }}>
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - goal.current / goal.target)}`}
                        className={getProgressColor(goal.current, goal.target)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-sm capitalize">{key}</h4>
                  <p className="text-xs text-muted-foreground">
                    {goal.current}/{goal.target} {goal.unit}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Macronutrient Breakdown */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Macronutrient Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={nutritionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {nutritionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {nutritionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calorie Intake */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Daily Calorie Intake
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">2,100</div>
                      <div className="text-sm text-muted-foreground">calories consumed</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Breakfast</span>
                        <span>450 kcal</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full"
                          style={{ width: "20%" }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Lunch</span>
                        <span>750 kcal</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full"
                          style={{ width: "35%" }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Dinner</span>
                        <span>650 kcal</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full"
                          style={{ width: "30%" }}
                        />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Snacks</span>
                        <span>250 kcal</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-purple-500 h-2 rounded-full"
                          style={{ width: "15%" }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Weekly Nutrition Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyNutrition}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#8884d8" />
                      <Bar dataKey="protein" fill="#82ca9d" />
                      <Bar dataKey="carbs" fill="#ffc658" />
                      <Bar dataKey="fat" fill="#ff7c7c" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle>Recipe Nutrition Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipeComparison.map((recipe, index) => (
                    <motion.div
                      key={recipe.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{recipe.name}</h4>
                        <Badge variant="secondary">{recipe.calories} kcal</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Protein:</div>
                          <div className="font-medium">{recipe.protein}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Carbs:</div>
                          <div className="font-medium">{recipe.carbs}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Fat:</div>
                          <div className="font-medium">{recipe.fat}g</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Fiber:</div>
                          <div className="font-medium">{recipe.fiber}g</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle>Nutrition Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyNutrition}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="calories" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="protein" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="carbs" stroke="#ffc658" strokeWidth={2} />
                      <Line type="monotone" dataKey="fat" stroke="#ff7c7c" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
