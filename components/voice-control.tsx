"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, VolumeX, Check, X, Loader2, Waves, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useVoice } from "./voice-provider"
import { TimerDisplay } from "./timer-display"

export function VoiceControl() {
  const {
    isListening,
    transcript,
    confidence,
    isProcessing,
    isSpeaking,
    startListening,
    stopListening,
    timers,
    lastCommand,
    commandSuccess,
    isSupported,
    voiceStatus,
    clearSpeechQueue,
  } = useVoice()

  const [showTranscript, setShowTranscript] = useState(false)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    if (transcript) {
      setShowTranscript(true)
      const timer = setTimeout(() => {
        setShowTranscript(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [transcript])

  useEffect(() => {
    if (voiceStatus && voiceStatus !== "Ready") {
      setShowStatus(true)
      const timer = setTimeout(() => {
        setShowStatus(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [voiceStatus])

  const getStatusColor = () => {
    if (isProcessing) return "bg-blue-500"
    if (isSpeaking) return "bg-green-500"
    if (isListening) return "bg-red-500"
    return "bg-gray-500"
  }

  const getStatusText = () => {
    if (isProcessing) return "Processing..."
    if (isSpeaking) return "Speaking..."
    if (isListening) return "Listening..."
    return "Ready"
  }

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

        {/* Voice Status Card */}
        <AnimatePresence>
          {(showStatus || isProcessing || isSpeaking) && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-white/95 dark:bg-slate-800/95 p-4 rounded-lg shadow-lg max-w-md backdrop-blur-sm border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                <span className="text-sm font-medium">{getStatusText()}</span>
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSpeaking && <Volume2 className="h-4 w-4" />}
                {isListening && <Waves className="h-4 w-4" />}
              </div>

              {confidence > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Confidence</span>
                    <span>{Math.round(confidence * 100)}%</span>
                  </div>
                  <Progress value={confidence * 100} className="h-1" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice transcript */}
        <AnimatePresence>
          {showTranscript && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="bg-white/95 dark:bg-slate-800/95 p-4 rounded-lg shadow-lg max-w-md backdrop-blur-sm border border-white/20"
            >
              <div className="flex items-start gap-3">
                <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">You said:</div>
                  <div className="text-sm">{transcript}</div>
                  {confidence > 0 && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {Math.round(confidence * 100)}% confident
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command result indicator */}
        <AnimatePresence>
          {!isProcessing && commandSuccess !== null && lastCommand && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`p-4 rounded-lg shadow-lg max-w-md backdrop-blur-sm border ${
                commandSuccess
                  ? "bg-green-500/90 border-green-400/20 text-white"
                  : "bg-red-500/90 border-red-400/20 text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {commandSuccess ? <Check className="h-4 w-4 flex-shrink-0" /> : <X className="h-4 w-4 flex-shrink-0" />}
                <div>
                  <p className="text-sm font-medium">
                    {commandSuccess ? "Command executed!" : "Command not recognized"}
                  </p>
                  <p className="text-xs opacity-90 mt-1">"{lastCommand}"</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Commands Help */}
        <AnimatePresence>
          {!isListening && isSupported && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/95 dark:bg-slate-800/95 p-4 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 max-w-sm"
            >
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Mic className="h-4 w-4 text-purple-500" />
                Voice Commands
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>"Show me butter chicken recipe"</p>
                <p>"Go to pantry"</p>
                <p>"Set timer for 5 minutes"</p>
                <p>"Add milk to shopping list"</p>
                <p>"Read recipe steps"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Control Panel */}
        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Status indicator */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
                <span className="text-xs font-medium">{getStatusText()}</span>
              </div>

              {/* Main mic button with pulsing animation */}
              <div className="relative">
                {isListening && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500 opacity-20"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-red-500 opacity-20"
                      animate={{ scale: [1, 1.8, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    />
                  </>
                )}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!isSupported}
                    size="lg"
                    className={`rounded-full w-16 h-16 shadow-lg transition-all duration-300 ${
                      isListening
                        ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    }`}
                  >
                    {isListening ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
                  </Button>
                </motion.div>
              </div>

              {/* Control buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSpeechQueue}
                  disabled={!isSpeaking}
                  className="text-xs"
                >
                  <VolumeX className="h-3 w-3 mr-1" />
                  Stop Speech
                </Button>

                {!isSupported && (
                  <Badge variant="destructive" className="text-xs">
                    Not Supported
                  </Badge>
                )}
              </div>
            </div>

            {/* Voice activity indicator */}
            {isListening && (
              <div className="mt-3 flex justify-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-red-500 to-pink-500 rounded-full"
                    animate={{
                      height: [8, 24, 8],
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
          </CardContent>
        </Card>
      </div>
    </>
  )
}
