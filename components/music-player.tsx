"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const playlists = [
  {
    id: "1",
    name: "Cooking Vibes",
    description: "Perfect background music for cooking",
    songs: 24,
    duration: "1h 32m",
    image: "/placeholder.svg?height=200&width=200",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "2",
    name: "Indian Classical",
    description: "Traditional Indian music for authentic cooking",
    songs: 18,
    duration: "2h 15m",
    image: "/placeholder.svg?height=200&width=200",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "3",
    name: "Jazz Kitchen",
    description: "Smooth jazz for elegant cooking sessions",
    songs: 32,
    duration: "2h 45m",
    image: "/placeholder.svg?height=200&width=200",
    color: "from-blue-500 to-teal-500",
  },
  {
    id: "4",
    name: "World Fusion",
    description: "Global beats for international recipes",
    songs: 28,
    duration: "1h 58m",
    image: "/placeholder.svg?height=200&width=200",
    color: "from-green-500 to-blue-500",
  },
]

const currentSong = {
  title: "Spice Route",
  artist: "Kitchen Beats",
  album: "Cooking Vibes",
  duration: 245, // seconds
  currentTime: 67,
}

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progress = (currentSong.currentTime / currentSong.duration) * 100

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
          Kitchen Music
        </h2>
        <p className="text-muted-foreground">Set the perfect mood for cooking</p>
      </motion.div>

      {/* Current Player */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Music className="h-8 w-8 text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold">{currentSong.title}</h3>
                <p className="text-muted-foreground">
                  {currentSong.artist} • {currentSong.album}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentSong.currentTime)}</span>
                    <span>{formatTime(currentSong.duration)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="ghost" size="icon">
                <Shuffle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                className="rounded-full w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Repeat className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <Volume2 className="h-5 w-5" />
              <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Playlists */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Cooking Playlists</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
              onClick={() => setSelectedPlaylist(playlist)}
            >
              <Card
                className={`overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 hover:shadow-lg transition-all duration-300 ${
                  selectedPlaylist.id === playlist.id ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <div className={`h-32 bg-gradient-to-br ${playlist.color} relative`}>
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1">{playlist.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{playlist.songs} songs</span>
                    <span>{playlist.duration}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Integration Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <h4 className="font-semibold mb-2">Connect Your Music</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your Spotify or YouTube Music account for personalized cooking playlists
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="bg-green-500 text-white border-green-500 hover:bg-green-600">
                Connect Spotify
              </Button>
              <Button variant="outline" className="bg-red-500 text-white border-red-500 hover:bg-red-600">
                Connect YouTube Music
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
