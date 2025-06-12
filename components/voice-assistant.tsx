"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useVoice } from "./voice-provider"
import { TimerDisplay } from "./timer-display"

export function VoiceAssistant() {
  const { isListening, transcript, startListening, stopListening, timers } = useVoice()

  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    if (transcript) {
      setShowTranscript(true)
      const timer = setTimeout(() => {
        setShowTranscript(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [transcript])

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Active timers */}
        <div className="flex flex-col gap-2">
          {timers
            .filter((timer) => timer.isActive)
            .map((timer) => (
              <TimerDisplay key={timer.id} timer={timer} />
            ))}
        </div>

        {/* Voice transcript */}
        <AnimatePresence>
          {showTranscript && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-w-md"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <Volume2 className="inline-block mr-2 h-4 w-4" />
                {transcript}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={isListening ? stopListening : startListening}
            size="lg"
            className={`rounded-full w-16 h-16 ${
              isListening ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
            }`}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>
        </motion.div>
      </div>
    </>
  )
}
