"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Code,
  GraduationCap,
  Heart,
  Lightbulb,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const skills = [
  { name: "C++", category: "Programming", color: "bg-blue-500" },
  { name: "Java", category: "Development", color: "bg-green-500" },
  { name: "Python", category: "AI & ML", color: "bg-purple-500" },
  { name: "DSA", category: "Algorithms", color: "bg-orange-500" },
]

const interests = [
  { name: "BTech CSE Student", icon: GraduationCap, color: "bg-purple-100 text-purple-700" },
  { name: "Innovation Enthusiast", icon: Lightbulb, color: "bg-yellow-100 text-yellow-700" },
  { name: "Healthcare Tech", icon: Heart, color: "bg-red-100 text-red-700" },
]

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/Himan2899",
    color: "hover:bg-gray-800 hover:text-white",
    description: "View my code repositories",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/in/himanshu-bali-8b2a6031b",
    color: "hover:bg-blue-600 hover:text-white",
    description: "Connect with me professionally",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://x.com/Himansde2899",
    color: "hover:bg-blue-400 hover:text-white",
    description: "Follow me on X (Twitter)",
  },
]

export function AboutCreator() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSocialClick = (url: string, name: string) => {
    if (url === "#") {
      alert(`${name} profile coming soon!`)
      return
    }
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <>
      {/* Trigger Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300"
          >
            <User className="h-4 w-4" />
            About Creator
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              About the Creator
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Section */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src="/images/creator-profile-new.jpeg"
                        alt="Himanshu Bali - Creator Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover"
                      />
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2">Himanshu Bali</h3>
                    <p className="text-lg text-purple-600 dark:text-purple-400 font-medium mb-2">
                      Aspiring Computer Science Engineer
                    </p>
                    <p className="text-muted-foreground mb-4 flex items-center justify-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Passionate About Technology & Innovation
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <a
                          href="mailto:himanshuofficialuserid@gmail.com"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          himanshuofficialuserid@gmail.com
                        </a>
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center gap-3 mt-4">
                        {socialLinks.map((social, index) => (
                          <motion.div
                            key={social.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className={`rounded-full transition-all duration-300 ${social.color} group relative`}
                              onClick={() => handleSocialClick(social.url, social.name)}
                              title={social.description}
                            >
                              <social.icon className="h-4 w-4" />
                              {social.url !== "#" && (
                                <ExternalLink className="h-2 w-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Social Links Labels */}
                      <div className="flex justify-center gap-6 mt-2">
                        {socialLinks.map((social) => (
                          <div key={social.name} className="text-center">
                            <p className="text-xs text-muted-foreground">{social.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* About */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">
                    I am currently pursuing my{" "}
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Bachelor of Technology (BTech) in Computer Science Engineering
                    </span>
                    , with a strong passion for technology and problem-solving. My academic journey is equipping me with
                    a solid foundation in programming languages like{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">C++, Java, and Python</span>,
                    as well as a growing understanding of data structures, algorithms, and software development.
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-500" />
                    Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className={`${skill.color} text-white p-3 rounded-lg mb-2`}>
                          <div className="font-bold text-lg">{skill.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{skill.category}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests & Focus */}
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Interests & Focus
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {interests.map((interest, index) => (
                      <motion.div
                        key={interest.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg ${interest.color}`}>
                          <interest.icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{interest.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    About Cook Master AI
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cook Master AI is a voice-controlled kitchen companion that I developed to showcase the integration
                    of modern web technologies with AI-powered voice recognition. This project demonstrates my passion
                    for creating innovative solutions that make everyday tasks more efficient and enjoyable.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Voice Recognition</Badge>
                    <Badge variant="secondary">3D Graphics</Badge>
                    <Badge variant="secondary">Responsive Design</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="text-lg font-bold mb-3 flex items-center justify-center gap-2">
                    <ExternalLink className="h-4 w-4 text-blue-500" />
                    Let's Connect!
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    I'm always excited to connect with fellow developers, discuss new technologies, and collaborate on
                    innovative projects.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-gray-800 hover:text-white transition-all duration-300"
                      onClick={() => handleSocialClick("https://github.com/Himan2899", "GitHub")}
                    >
                      <Github className="h-4 w-4 mr-2" />
                      View My Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-600 hover:text-white transition-all duration-300"
                      onClick={() =>
                        handleSocialClick("https://www.linkedin.com/in/himanshu-bali-8b2a6031b", "LinkedIn")
                      }
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      Professional Network
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-400 hover:text-white transition-all duration-300"
                      onClick={() => handleSocialClick("https://x.com/Himansde2899", "X (Twitter)")}
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Follow on X
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
          >
            <p className="text-sm text-muted-foreground">
              Thank you for exploring Cook Master AI! I hope this application inspires you to try new recipes and enjoy
              cooking with the power of voice technology. 🍳✨
            </p>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
