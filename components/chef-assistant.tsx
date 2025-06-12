"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, VolumeX, MessageCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVoice } from "./voice-provider"

export function ChefAssistant() {
  const { isListening, startListening, stopListening, speakText, transcript } = useVoice()
  const [currentTip, setCurrentTip] = useState(0)

  // Cooking tips that rotate
  const cookingTips = [
    "Always taste your food while cooking!",
    "Let meat rest after cooking for better flavor.",
    "Salt your pasta water generously.",
    "Mise en place - prep everything before cooking.",
    "Use a meat thermometer for perfect doneness.",
    "Fresh herbs make all the difference!",
    "Don't overcrowd your pan when searing.",
    "Room temperature ingredients mix better.",
    "Room temperature ingredients mix better.",
  ]

  // Example voice commands to display
  const exampleCommands = [
    "Move to pantry",
    "Show me butter chicken recipe",
    "Read recipe steps",
    "Set a timer for 5 minutes",
    "Add tomatoes to shopping list",
    "Remove bread from shopping list",
    "What's a substitute for yogurt?",
    "Go to music player",
    "Open nutrition tracker",
    "Show me global recipes",
  ]

  useEffect(() => {
    // Rotate cooking tips every 5 seconds
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % cookingTips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [cookingTips.length])

  return (
    <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Chef Assistant
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isListening) {
                stopListening()
              } else {
                startListening()
                speakText("Hello! I'm your Chef Assistant. How can I help you today?")
              }
            }}
            className={`${
              isListening
                ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
            }`}
          >
            {isListening ? (
              <>
                <VolumeX className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Mic className="mr-2 h-4 w-4" />
                Talk
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chef Avatar Section */}
        <div className="h-64 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden relative flex items-center justify-center">
          {/* Chef Avatar */}
          <motion.div
            className="relative"
            animate={{
              scale: isListening ? [1, 1.05, 1] : [1],
              rotate: isListening ? [0, 2, -2, 0] : [0],
            }}
            transition={{
              duration: 2,
              repeat: isListening ? Number.POSITIVE_INFINITY : 0,
              ease: "easeInOut",
            }}
          >
            <img src="/images/chef-avatar.png" alt="Chef Assistant Avatar" className="w-48 h-48 object-contain" />

            {/* Listening indicator */}
            {isListening && (
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Listening...
                </div>
              </motion.div>
            )}

            {/* Floating sparkles when listening */}
            {isListening && (
              <>
                <motion.div
                  className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0,
                  }}
                />
                <motion.div
                  className="absolute -top-4 right-4 w-2 h-2 bg-pink-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, -180, -360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute top-2 -right-2 w-2.5 h-2.5 bg-blue-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                />
              </>
            )}
          </motion.div>

          {/* Voice waves animation */}
          {isListening && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-full"
                  animate={{
                    height: [10, 30, 10],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}

          {/* Pulsing ring effect when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 border-4 border-red-400 rounded-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-pink-400 rounded-lg"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </>
          )}
        </div>

        {/* Current transcript */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">You said:</span>
              </div>
              <p className="text-sm">{transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cooking tip */}
        <motion.div
          key={currentTip}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Chef's Tip:</span>
          </div>
          <p className="text-sm">{cookingTips[currentTip]}</p>
        </motion.div>

        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Mic className="h-4 w-4 text-purple-500" />
            Try saying:
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {exampleCommands.map((command, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="text-sm bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-gray-800 p-2 rounded-md border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                onClick={() => speakText(command)}
              >
                "{command}"
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
