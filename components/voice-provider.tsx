"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, useCallback, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechSynthesisUtterance: any
  }
}

type VoiceContextType = {
  isListening: boolean
  transcript: string
  confidence: number
  isProcessing: boolean
  isSpeaking: boolean
  startListening: () => void
  stopListening: () => void
  speakText: (text: string, priority?: "high" | "normal" | "low") => Promise<void>
  processCommand: (command: string) => void
  currentRecipe: Recipe | null
  setCurrentRecipe: (recipe: Recipe | null) => void
  timers: Timer[]
  addTimer: (name: string, duration: number) => void
  removeTimer: (id: string) => void
  pantryItems: PantryItem[]
  addPantryItem: (item: PantryItem) => void
  removePantryItem: (id: string) => void
  shoppingList: ShoppingItem[]
  addToShoppingList: (item: string) => void
  removeFromShoppingList: (id: string) => void
  setActiveSection: (section: string) => void
  activeSection: string
  lastCommand: string
  commandSuccess: boolean | null
  isSupported: boolean
  voiceStatus: string
  clearSpeechQueue: () => void
}

export type Recipe = {
  id: string
  name: string
  cuisine: string
  ingredients: string[]
  steps: string[]
  prepTime: number
  cookTime: number
  servings: number
  image: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export type Timer = {
  id: string
  name: string
  duration: number
  remaining: number
  isActive: boolean
}

export type PantryItem = {
  id: string
  name: string
  quantity: number
  unit: string
  expiryDate?: string
}

export type ShoppingItem = {
  id: string
  name: string
  checked: boolean
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

// Complete recipe database
const recipes: Recipe[] = [
  {
    id: "1",
    name: "Butter Chicken",
    cuisine: "Indian",
    ingredients: [
      "500g chicken thighs, cut into pieces",
      "2 tbsp butter",
      "1 large onion, finely chopped",
      "4 cloves garlic, minced",
      "1 tbsp fresh ginger paste",
      "2 tbsp tomato paste",
      "1 cup heavy cream",
      "1 tbsp garam masala",
      "1 tsp turmeric powder",
      "1 tsp cumin powder",
      "1 tsp red chili powder",
      "Salt to taste",
      "Fresh cilantro for garnish",
    ],
    steps: [
      "Marinate chicken with yogurt, garam masala, turmeric, and salt for 30 minutes",
      "Heat butter in a large pan over medium heat",
      "Add chopped onions and sauté until golden brown",
      "Add garlic and ginger paste, cook for 1 minute",
      "Add tomato paste and spices, cook for 2 minutes",
      "Add chicken and cook until browned on all sides",
      "Pour in cream and simmer for 15 minutes",
      "Garnish with cilantro and serve hot",
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    image: "/placeholder.svg?height=300&width=400",
    nutrition: { calories: 450, protein: 35, carbs: 10, fat: 30 },
  },
  {
    id: "2",
    name: "Palak Paneer",
    cuisine: "Indian",
    ingredients: [
      "250g paneer, cubed",
      "500g fresh spinach",
      "1 large onion",
      "4 cloves garlic",
      "1 inch ginger",
      "2 green chilies",
      "1 tsp cumin seeds",
      "1 tsp garam masala",
      "1/2 cup cream",
      "Salt to taste",
    ],
    steps: [
      "Blanch spinach and blend to puree",
      "Fry paneer cubes until golden",
      "Sauté onions, garlic, and ginger",
      "Add spices and spinach puree",
      "Add paneer and cream",
      "Simmer for 5 minutes",
      "Serve with rice or naan",
    ],
    prepTime: 20,
    cookTime: 25,
    servings: 4,
    image: "/placeholder.svg?height=300&width=400",
    nutrition: { calories: 350, protein: 20, carbs: 15, fat: 25 },
  },
  {
    id: "3",
    name: "Masala Dosa",
    cuisine: "Indian",
    ingredients: ["2 cups rice", "1 cup urad dal", "Potato filling", "Spices", "Oil for cooking"],
    steps: [
      "Soak rice and dal for 6 hours",
      "Grind to smooth batter",
      "Ferment overnight",
      "Prepare spiced potato filling",
      "Make thin crepes on griddle",
      "Add filling and fold",
      "Serve with chutney",
    ],
    prepTime: 480,
    cookTime: 20,
    servings: 6,
    image: "/placeholder.svg?height=300&width=400",
    nutrition: { calories: 250, protein: 8, carbs: 45, fat: 5 },
  },
  {
    id: "4",
    name: "Chicken Biryani",
    cuisine: "Indian",
    ingredients: ["500g chicken", "2 cups basmati rice", "2 onions", "Biryani spices", "Yogurt", "Ghee", "Fresh herbs"],
    steps: [
      "Marinate chicken with yogurt and spices",
      "Parboil rice with whole spices",
      "Layer chicken and rice",
      "Seal and cook on low heat",
      "Rest for 10 minutes",
      "Serve with raita",
    ],
    prepTime: 60,
    cookTime: 45,
    servings: 6,
    image: "/placeholder.svg?height=300&width=400",
    nutrition: { calories: 420, protein: 28, carbs: 40, fat: 18 },
  },
  {
    id: "5",
    name: "Chole Bhature",
    cuisine: "Indian",
    ingredients: ["2 cups chickpeas", "2 onions", "Spices", "2 cups flour", "Yogurt", "Oil for frying"],
    steps: [
      "Soak chickpeas overnight",
      "Pressure cook until soft",
      "Make spicy gravy",
      "Prepare bhature dough",
      "Roll and deep fry",
      "Serve hot together",
    ],
    prepTime: 120,
    cookTime: 60,
    servings: 4,
    image: "/placeholder.svg?height=300&width=400",
    nutrition: { calories: 480, protein: 15, carbs: 65, fat: 20 },
  },
]

// Advanced Speech Queue Management
class SpeechQueue {
  private queue: Array<{ text: string; priority: "high" | "normal" | "low"; resolve: () => void }> = []
  private isProcessing = false
  private currentUtterance: SpeechSynthesisUtterance | null = null

  async add(text: string, priority: "high" | "normal" | "low" = "normal"): Promise<void> {
    return new Promise((resolve) => {
      const item = { text, priority, resolve }

      if (priority === "high") {
        this.queue.unshift(item)
      } else {
        this.queue.push(item)
      }

      this.process()
    })
  }

  private async process() {
    if (this.isProcessing || this.queue.length === 0) return

    this.isProcessing = true
    const item = this.queue.shift()!

    try {
      await this.speak(item.text)
      item.resolve()
    } catch (error) {
      console.error("Speech error:", error)
      item.resolve()
    }

    this.isProcessing = false

    // Process next item
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), 100)
    }
  }

  private speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error("Speech synthesis not supported"))
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      utterance.lang = "en-US"

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        this.currentUtterance = null
        resolve() // Resolve anyway to continue queue
      }

      this.currentUtterance = utterance
      window.speechSynthesis.speak(utterance)
    })
  }

  clear() {
    this.queue = []
    if (this.currentUtterance) {
      window.speechSynthesis.cancel()
      this.currentUtterance = null
    }
    this.isProcessing = false
  }

  get isSpeaking() {
    return this.isProcessing || window.speechSynthesis?.speaking
  }
}

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  // Core state
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const [commandSuccess, setCommandSuccess] = useState<boolean | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState("Initializing...")

  // App state
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)
  const [activeSection, setActiveSection] = useState("recipes")
  const [timers, setTimers] = useState<Timer[]>([])
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: "1", name: "Onions", quantity: 5, unit: "pcs" },
    { id: "2", name: "Tomatoes", quantity: 3, unit: "pcs" },
    { id: "3", name: "Chicken", quantity: 500, unit: "g" },
    { id: "4", name: "Rice", quantity: 2, unit: "kg" },
    { id: "5", name: "Garlic", quantity: 1, unit: "head" },
  ])
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: "1", name: "Milk", checked: false },
    { id: "2", name: "Eggs", checked: false },
    { id: "3", name: "Bread", checked: false },
  ])

  // Refs
  const recognitionRef = useRef<any>(null)
  const speechQueueRef = useRef<SpeechQueue>(new SpeechQueue())
  const isActiveRef = useRef(false)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { toast } = useToast()

  // Advanced Speech Synthesis
  const speakText = useCallback(async (text: string, priority: "high" | "normal" | "low" = "normal"): Promise<void> => {
    if (!text.trim()) return

    console.log(`🔊 Speaking (${priority}):`, text)
    setIsSpeaking(true)

    try {
      await speechQueueRef.current.add(text, priority)
    } catch (error) {
      console.error("Speech error:", error)
    } finally {
      setIsSpeaking(false)
    }
  }, [])

  const clearSpeechQueue = useCallback(() => {
    speechQueueRef.current.clear()
    setIsSpeaking(false)
  }, [])

  // Advanced Command Processing
  const processCommand = useCallback(
    async (command: string) => {
      const cmd = command.toLowerCase().trim()
      console.log("🎯 Processing command:", cmd)

      setIsProcessing(true)
      setLastCommand(command)
      setVoiceStatus("Processing command...")

      try {
        let success = false

        // NAVIGATION COMMANDS
        if (cmd.includes("go to") || cmd.includes("open") || cmd.includes("show") || cmd.includes("navigate")) {
          if (cmd.includes("pantry")) {
            setActiveSection("pantry")
            await speakText("Opening pantry manager", "high")
            success = true
          } else if (cmd.includes("recipe") || cmd.includes("recipes")) {
            setActiveSection("recipes")
            await speakText("Opening recipe explorer", "high")
            success = true
          } else if (cmd.includes("music")) {
            setActiveSection("music")
            await speakText("Opening music player", "high")
            success = true
          } else if (cmd.includes("shopping")) {
            setActiveSection("shopping")
            await speakText("Opening shopping list", "high")
            success = true
          } else if (cmd.includes("nutrition")) {
            setActiveSection("nutrition")
            await speakText("Opening nutrition tracker", "high")
            success = true
          } else if (cmd.includes("map")) {
            setActiveSection("map")
            await speakText("Opening recipe map", "high")
            success = true
          }
        }

        // RECIPE COMMANDS
        else if (cmd.includes("recipe") || cmd.includes("cook") || cmd.includes("make")) {
          let foundRecipe: Recipe | null = null

          if (cmd.includes("butter chicken")) {
            foundRecipe = recipes.find((r) => r.name.toLowerCase().includes("butter chicken")) || null
          } else if (cmd.includes("palak paneer")) {
            foundRecipe = recipes.find((r) => r.name.toLowerCase().includes("palak paneer")) || null
          } else if (cmd.includes("masala dosa") || cmd.includes("dosa")) {
            foundRecipe = recipes.find((r) => r.name.toLowerCase().includes("masala dosa")) || null
          } else if (cmd.includes("biryani")) {
            foundRecipe = recipes.find((r) => r.name.toLowerCase().includes("biryani")) || null
          } else if (cmd.includes("chole")) {
            foundRecipe = recipes.find((r) => r.name.toLowerCase().includes("chole")) || null
          }

          if (foundRecipe) {
            setCurrentRecipe(foundRecipe)
            setActiveSection("recipes")
            await speakText(`Found ${foundRecipe.name} recipe. Opening now.`, "high")
            success = true
          }
        }

        // READ RECIPE COMMANDS
        else if (
          cmd.includes("read") &&
          (cmd.includes("recipe") || cmd.includes("steps") || cmd.includes("ingredients"))
        ) {
          if (currentRecipe) {
            if (cmd.includes("ingredients")) {
              await speakText(`Reading ingredients for ${currentRecipe.name}`, "high")
              for (let i = 0; i < Math.min(currentRecipe.ingredients.length, 5); i++) {
                await speakText(`${i + 1}. ${currentRecipe.ingredients[i]}`)
              }
              if (currentRecipe.ingredients.length > 5) {
                await speakText(`And ${currentRecipe.ingredients.length - 5} more ingredients`)
              }
            } else {
              await speakText(`Reading cooking steps for ${currentRecipe.name}`, "high")
              for (let i = 0; i < Math.min(currentRecipe.steps.length, 3); i++) {
                await speakText(`Step ${i + 1}: ${currentRecipe.steps[i]}`)
              }
              if (currentRecipe.steps.length > 3) {
                await speakText(
                  `And ${currentRecipe.steps.length - 3} more steps. Check the screen for complete recipe.`,
                )
              }
            }
            success = true
          } else {
            await speakText("No recipe is currently selected. Please choose a recipe first.", "high")
            success = false
          }
        }

        // SHOPPING LIST COMMANDS
        else if (cmd.includes("add") && cmd.includes("shopping")) {
          let itemToAdd = ""

          // Extract item name
          if (cmd.includes("milk")) itemToAdd = "Milk"
          else if (cmd.includes("eggs")) itemToAdd = "Eggs"
          else if (cmd.includes("bread")) itemToAdd = "Bread"
          else if (cmd.includes("rice")) itemToAdd = "Rice"
          else if (cmd.includes("chicken")) itemToAdd = "Chicken"
          else if (cmd.includes("tomatoes")) itemToAdd = "Tomatoes"
          else if (cmd.includes("onions")) itemToAdd = "Onions"
          else if (cmd.includes("garlic")) itemToAdd = "Garlic"

          if (itemToAdd) {
            const newItem: ShoppingItem = {
              id: Date.now().toString(),
              name: itemToAdd,
              checked: false,
            }
            setShoppingList((prev) => [...prev, newItem])
            await speakText(`Added ${itemToAdd} to shopping list`, "high")
            success = true
          }
        } else if (cmd.includes("remove") && cmd.includes("shopping")) {
          let itemToRemove = ""

          if (cmd.includes("milk")) itemToRemove = "milk"
          else if (cmd.includes("eggs")) itemToRemove = "eggs"
          else if (cmd.includes("bread")) itemToRemove = "bread"
          else if (cmd.includes("rice")) itemToRemove = "rice"

          if (itemToRemove) {
            setShoppingList((prev) => prev.filter((item) => !item.name.toLowerCase().includes(itemToRemove)))
            await speakText(`Removed ${itemToRemove} from shopping list`, "high")
            success = true
          }
        }

        // TIMER COMMANDS
        else if (cmd.includes("timer") || cmd.includes("set timer")) {
          let minutes = 0

          if (cmd.includes("5 minutes") || cmd.includes("five minutes")) minutes = 5
          else if (cmd.includes("10 minutes") || cmd.includes("ten minutes")) minutes = 10
          else if (cmd.includes("15 minutes") || cmd.includes("fifteen minutes")) minutes = 15
          else if (cmd.includes("20 minutes") || cmd.includes("twenty minutes")) minutes = 20
          else if (cmd.includes("30 minutes") || cmd.includes("thirty minutes")) minutes = 30

          if (minutes > 0) {
            const newTimer: Timer = {
              id: Date.now().toString(),
              name: "Cooking Timer",
              duration: minutes * 60,
              remaining: minutes * 60,
              isActive: true,
            }
            setTimers((prev) => [...prev, newTimer])
            await speakText(`Timer set for ${minutes} minutes`, "high")
            success = true
          }
        }

        // HELP COMMANDS
        else if (cmd.includes("help") || cmd.includes("what can you do")) {
          await speakText(
            "I can help you with recipes, navigation, timers, and shopping lists. Try saying: show me butter chicken recipe, go to pantry, set timer for 5 minutes, or add milk to shopping list.",
            "high",
          )
          success = true
        }

        // GREETING
        else if (cmd.includes("hello") || cmd.includes("hi")) {
          await speakText(
            "Hello! I'm Cook Master AI, your voice-controlled kitchen assistant. How can I help you cook today?",
            "high",
          )
          success = true
        }

        // STOP COMMANDS
        else if (cmd.includes("stop") || cmd.includes("quiet") || cmd.includes("silence")) {
          clearSpeechQueue()
          await speakText("Voice assistant stopped", "high")
          setIsListening(false)
          isActiveRef.current = false
          success = true
        }

        // DEFAULT RESPONSE
        if (!success) {
          await speakText("I didn't understand that command. Say 'help' to hear what I can do.", "high")
        }

        setCommandSuccess(success)
        setVoiceStatus(success ? "Command executed" : "Command not recognized")
      } catch (error) {
        console.error("Command processing error:", error)
        await speakText("Sorry, there was an error processing your command", "high")
        setCommandSuccess(false)
        setVoiceStatus("Error processing command")
      } finally {
        setIsProcessing(false)
      }
    },
    [currentRecipe, clearSpeechQueue, speakText],
  )

  // Advanced Speech Recognition Setup
  const initializeRecognition = useCallback(() => {
    if (typeof window === "undefined") return false

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      setVoiceStatus("Speech recognition not supported")
      return false
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log("🎤 Recognition started")
      setVoiceStatus("Listening...")
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ""
      let interimTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
          setConfidence(result[0].confidence)
        } else {
          interimTranscript += result[0].transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)

      if (finalTranscript) {
        console.log("🎯 Final transcript:", finalTranscript)
        processCommand(finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.error("🚨 Recognition error:", event.error)
      setVoiceStatus(`Error: ${event.error}`)

      if (event.error === "not-allowed") {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice commands",
          variant: "destructive",
        })
        setIsListening(false)
        isActiveRef.current = false
      }
    }

    recognition.onend = () => {
      console.log("🔚 Recognition ended")

      if (isActiveRef.current) {
        // Restart recognition if still active
        setTimeout(() => {
          if (isActiveRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch (error) {
              console.error("Error restarting recognition:", error)
            }
          }
        }, 100)
      }
    }

    recognitionRef.current = recognition
    setIsSupported(true)
    setVoiceStatus("Ready")
    return true
  }, [processCommand, toast])

  // Initialize on mount
  useEffect(() => {
    const initialized = initializeRecognition()
    if (initialized) {
      toast({
        title: "🎤 Voice Assistant Ready",
        description: "Click the microphone to start voice commands",
      })
    } else {
      toast({
        title: "Voice Not Supported",
        description: "Please use Chrome, Edge, or Safari for voice features",
        variant: "destructive",
      })
    }
  }, [initializeRecognition, toast])

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.isActive && timer.remaining > 0) {
            const newRemaining = timer.remaining - 1
            if (newRemaining === 0) {
              speakText(`Timer complete! Your ${timer.name} is done.`, "high")
              toast({
                title: "⏰ Timer Complete!",
                description: `Your ${timer.name} is done.`,
              })
              return { ...timer, remaining: 0, isActive: false }
            }
            return { ...timer, remaining: newRemaining }
          }
          return timer
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [speakText, toast])

  // Start listening
  const startListening = useCallback(async () => {
    if (!isSupported || !recognitionRef.current) {
      toast({
        title: "Voice Recognition Unavailable",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      })
      return
    }

    console.log("🎤 Starting voice recognition...")

    try {
      // Stop any existing recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    } catch (error) {
      console.log("No existing recognition to stop")
    }

    // Clear any restart timeouts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
    }

    setIsListening(true)
    isActiveRef.current = true
    setTranscript("")
    setVoiceStatus("Starting...")

    // Start recognition after brief delay
    setTimeout(() => {
      if (isActiveRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start()
          speakText("Voice assistant activated. I'm ready for your commands!", "high")
          toast({
            title: "🎤 Voice Assistant Active",
            description: "Say 'help' to hear available commands",
          })
        } catch (error) {
          console.error("Error starting recognition:", error)
          setVoiceStatus("Error starting recognition")
        }
      }
    }, 500)
  }, [isSupported, speakText, toast])

  // Stop listening
  const stopListening = useCallback(() => {
    console.log("🛑 Stopping voice recognition")

    setIsListening(false)
    isActiveRef.current = false
    setTranscript("")
    setVoiceStatus("Stopped")

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error("Error stopping recognition:", error)
      }
    }

    clearSpeechQueue()
  }, [clearSpeechQueue])

  // Helper functions
  const addTimer = useCallback((name: string, duration: number) => {
    const newTimer: Timer = {
      id: Date.now().toString(),
      name,
      duration,
      remaining: duration,
      isActive: true,
    }
    setTimers((prev) => [...prev, newTimer])
    return newTimer.id
  }, [])

  const removeTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id))
  }, [])

  const addPantryItem = useCallback((item: PantryItem) => {
    setPantryItems((prev) => [...prev, item])
  }, [])

  const removePantryItem = useCallback((id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const addToShoppingList = useCallback((item: string) => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: item,
      checked: false,
    }
    setShoppingList((prev) => [...prev, newItem])
  }, [])

  const removeFromShoppingList = useCallback((id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // Update speaking status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(speechQueueRef.current.isSpeaking)
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const value = {
    isListening,
    transcript,
    confidence,
    isProcessing,
    isSpeaking,
    startListening,
    stopListening,
    speakText,
    processCommand,
    currentRecipe,
    setCurrentRecipe,
    timers,
    addTimer,
    removeTimer,
    pantryItems,
    addPantryItem,
    removePantryItem,
    shoppingList,
    addToShoppingList,
    removeFromShoppingList,
    setActiveSection,
    activeSection,
    lastCommand,
    commandSuccess,
    isSupported,
    voiceStatus,
    clearSpeechQueue,
  }

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
}

export const useVoice = () => {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}
