"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Music, ShoppingCart, Globe, PieChart, Apple, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "./mode-toggle"
import { AboutCreator } from "./about-creator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useVoice } from "./voice-provider"

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Header({ activeSection, setActiveSection }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const { startListening } = useVoice()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Recipes", icon: <Home className="h-4 w-4" />, section: "recipes" },
    { name: "Pantry", icon: <Apple className="h-4 w-4" />, section: "pantry" },
    { name: "Music", icon: <Music className="h-4 w-4" />, section: "music" },
    { name: "Recipe Map", icon: <Globe className="h-4 w-4" />, section: "map" },
    { name: "Nutrition", icon: <PieChart className="h-4 w-4" />, section: "nutrition" },
    { name: "Shopping", icon: <ShoppingCart className="h-4 w-4" />, section: "shopping" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-white/70 dark:bg-slate-900/70 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.section}
                    variant={activeSection === item.section ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveSection(item.section)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0"
                  onClick={startListening}
                >
                  Start Voice Assistant
                </Button>
                <div className="mt-4 pt-4 border-t">
                  <AboutCreator />
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center"
          >
            <motion.span
              className="text-2xl font-extrabold"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #ff7e5f, #feb47b, #ffcb80, #feb47b, #ff7e5f)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Cook Master AI
            </motion.span>
          </motion.div>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <motion.div key={item.section} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant={activeSection === item.section ? "default" : "ghost"}
                className={
                  activeSection === item.section ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : ""
                }
                onClick={() => setActiveSection(item.section)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "200px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <Input
                  type="search"
                  placeholder="Search recipes..."
                  className="pr-8"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div key="search-closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden md:block">
            <AboutCreator />
          </div>

          <ModeToggle />
        </div>
      </div>
    </motion.header>
  )
}
