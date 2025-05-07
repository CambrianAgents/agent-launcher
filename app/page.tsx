"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import GradientBackground from "@/components/gradient-background"

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Hide welcome message when user starts typing
  useEffect(() => {
    if (input.length > 0) {
      setShowWelcome(false)
    }
  }, [input])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (input.trim() === "") return
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInput("")
    
    try {
      // Create placeholder for assistant message
      const assistantPlaceholder = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: ""
      }
      
      setMessages(prev => [...prev, assistantPlaceholder])
      
      // Send request to our custom API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage]
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch response')
      }
      
      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) return
      
      let result = ""
      
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(Boolean)
        
        for (const line of lines) {
          try {
            const parsedLine = JSON.parse(line)
            
            if (parsedLine.type === 'text') {
              result = parsedLine.text
              
              // Update the assistant message with the new content
              setMessages(prev => {
                const updatedMessages = [...prev]
                updatedMessages[updatedMessages.length - 1] = {
                  ...updatedMessages[updatedMessages.length - 1],
                  content: result
                }
                return updatedMessages
              })
            }
          } catch (e) {
            console.error('Error parsing stream chunk:', e)
          }
        }
      }
      
    } catch (error) {
      console.error('Error fetching agent response:', error)
      
      // Update the last message to show error
      setMessages(prev => {
        const updatedMessages = [...prev]
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content: "Sorry, there was an error processing your request. Please try again."
        }
        return updatedMessages
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#1c1c1c] text-[#fcf7f0]">
      <GradientBackground />

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-[#333333] bg-[#1c1c1c]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <img src="/sei-logo.png" alt="Logo" className="h-6 w-6" />
          <h1 className="text-xl font-bold">SEI AI Agent</h1>
        </div>
        <div className="flex items-center gap-1">
          <a href="https://cambrian.wtf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <img src="/logo-lime.png" alt="Logo" className="h-5 w-5" />
            <span className="text-sm text-[#fcf7f0]/70">Powered by Cambrian</span>
          </a>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-1">
        {showWelcome && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ccff33] to-[#7dcc00] flex items-center justify-center">
              {/* <Bot className="h-8 w-8 text-[#1c1c1c]" /> */}
              <img src="/sei-logo-black.png" alt="Logo" className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to the SEI AI Agent</h2>
            <h5 className="text-sm text-[#fcf7f0]/70 flex items-center justify-center gap-1">
              Powered by<img src="/logo-lime.png" alt="Cambrian" className="h-3 w-3" />Cambrian
            </h5>
            <p className="text-[#fcf7f0]/70 max-w-md">
              Ask me anything and I'll do my best to help you. I can interact with the Sei blockchain.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} />
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-[#fcf7f0]/70">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>AI is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[#333333] bg-[#1c1c1c]/80 backdrop-blur-md z-10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-full bg-[#2a2a2a] border border-[#333333] text-[#fcf7f0] placeholder-[#fcf7f0]/50 focus:outline-none focus:ring-2 focus:ring-[#ccff33]/50"
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-gradient-to-r from-[#ccff33] to-[#7dcc00] text-[#1c1c1c] hover:opacity-90 transition-opacity"
            disabled={isLoading || input.trim() === ""}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
