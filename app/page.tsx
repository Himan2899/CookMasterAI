"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { RecipeExplorer } from "@/components/recipe-explorer"
import { ChefAssistant } from "@/components/chef-assistant"
import { VoiceControl } from "@/components/voice-control"
import { PantryManager } from "@/components/pantry-manager"
import { MusicPlayer } from "@/components/music-player"
import { GlobalRecipeMap } from "@/components/global-recipe-map"
import { NutritionVisualizer } from "@/components/nutrition-visualizer"
import { ShoppingList } from "@/components/shopping-list"
import { useVoice } from "@/components/voice-provider"
import { Loader } from "@/components/loader"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("recipes")
  const { isListening, setActiveSection: updateVoiceActiveSection } = useVoice()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update the page component to ensure voice commands can control navigation
  // Add this useEffect to synchronize activeSection with the VoiceProvider:

  useEffect(() => {
    // When activeSection changes in the page component, update it in the voice provider
    updateVoiceActiveSection(activeSection)
  }, [activeSection, updateVoiceActiveSection])

  // Add this after the existing useEffect
  useEffect(() => {
    console.log("📍 Active section changed to:", activeSection)
  }, [activeSection])

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 dark:from-indigo-900 dark:via-purple-900 dark:to-rose-900 overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>

      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-8 relative z-10"
      >
        <AnimatePresence mode="wait">
          {activeSection === "recipes" && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2">
                <RecipeExplorer />
              </div>
              <div className="lg:col-span-1">
                <ChefAssistant />
              </div>
            </motion.div>
          )}

          {activeSection === "pantry" && (
            <motion.div
              key="pantry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <PantryManager />
            </motion.div>
          )}

          {activeSection === "music" && (
            <motion.div
              key="music"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <MusicPlayer />
            </motion.div>
          )}

          {activeSection === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GlobalRecipeMap />
            </motion.div>
          )}

          {activeSection === "nutrition" && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <NutritionVisualizer />
            </motion.div>
          )}

          {activeSection === "shopping" && (
            <motion.div
              key="shopping"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ShoppingList />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <VoiceControl />

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatedBackgroundElements isListening={isListening} />
      </div>
    </main>
  )
}

function AnimatedBackgroundElements({ isListening }: { isListening: boolean }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            scale: isListening ? [1, 1.5, 1] : [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
            filter: "blur(40px)",
          }}
        />
      ))}
    </>
  )
}
