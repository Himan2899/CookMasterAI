"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ShoppingCart, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useVoice } from "./voice-provider"

const suggestedItems = [
  "Milk",
  "Eggs",
  "Bread",
  "Chicken",
  "Rice",
  "Onions",
  "Tomatoes",
  "Garlic",
  "Ginger",
  "Yogurt",
  "Cheese",
  "Spinach",
  "Potatoes",
  "Oil",
]

export function ShoppingList() {
  const { shoppingList, addToShoppingList, removeFromShoppingList } = useVoice()
  const [newItem, setNewItem] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddItem = () => {
    if (newItem.trim()) {
      addToShoppingList(newItem.trim())
      setNewItem("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem()
    }
  }

  const toggleItemCheck = (id: string) => {
    // In a real implementation, this would update the checked status
    console.log("Toggle item:", id)
  }

  const filteredSuggestions = suggestedItems.filter(
    (item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !shoppingList.some((listItem) => listItem.name.toLowerCase() === item.toLowerCase()),
  )

  const checkedItems = shoppingList.filter((item) => item.checked)
  const uncheckedItems = shoppingList.filter((item) => !item.checked)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
          Smart Shopping List
        </h2>
        <p className="text-muted-foreground">Organize your grocery shopping with voice commands</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Items */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-500" />
                Add Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new item..."
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={handleAddItem} className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Quick Add:</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestedItems.slice(0, 8).map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => addToShoppingList(item)}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Voice Commands:</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>"Add milk to shopping list"</p>
                  <p>"Add 2 kg rice to shopping list"</p>
                  <p>"Remove bread from shopping list"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Shopping List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-500" />
                  Shopping List ({shoppingList.length} items)
                </span>
                <Badge variant="secondary">
                  {checkedItems.length}/{shoppingList.length} completed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Unchecked Items */}
                {uncheckedItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-gray-700 dark:text-gray-300">To Buy</h4>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {uncheckedItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                          >
                            <Checkbox checked={item.checked} onCheckedChange={() => toggleItemCheck(item.id)} />
                            <div className="flex-1 font-medium">{item.name}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromShoppingList(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Checked Items */}
                {checkedItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-gray-500 dark:text-gray-400">Completed</h4>
                    <div className="space-y-2">
                      <AnimatePresence>
                        {checkedItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-600 opacity-60"
                          >
                            <Checkbox checked={item.checked} onCheckedChange={() => toggleItemCheck(item.id)} />
                            <span className="flex-1 line-through text-gray-500">{item.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromShoppingList(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {shoppingList.length === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your shopping list is empty</h3>
                    <p className="text-muted-foreground">Add items using the form above or voice commands</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Auto-generated suggestions from recipes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Recipe-Based Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Based on your recent recipe views, you might need these ingredients:
            </p>
            <div className="flex flex-wrap gap-2">
              {["Chicken thighs", "Heavy cream", "Garam masala", "Basmati rice", "Paneer", "Spinach"].map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="cursor-pointer hover:bg-orange-500 hover:text-white transition-colors"
                  onClick={() => addToShoppingList(item)}
                >
                  + {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
