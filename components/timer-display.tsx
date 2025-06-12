"use client"

import { motion } from "framer-motion"
import { type Timer, useVoice } from "./voice-provider"
import { X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TimerDisplay({ timer }: { timer: Timer }) {
  const { removeTimer } = useVoice()

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progress = (timer.remaining / timer.duration) * 100

  // Calculate hue based on remaining time (green to red)
  const hue = (progress / 100) * 120 // 0 = red, 120 = green

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-lg p-4 w-64 backdrop-blur-sm border border-white/20"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-pink-500" />
          <h4 className="font-medium">{timer.name}</h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
          onClick={() => removeTimer(timer.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-2xl font-bold mb-2 tabular-nums text-center">{formatTime(timer.remaining)}</div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-3 rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, hsl(${hue}, 80%, 60%), hsl(${hue}, 90%, 50%))`,
          }}
          initial={{ width: "100%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}
