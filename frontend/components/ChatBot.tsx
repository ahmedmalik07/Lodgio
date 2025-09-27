'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const romanUrduResponses = {
  greeting: [
    "Assalam o Alaikum! Main aapka roommate finding assistant hun. Kaise help kar sakta hun?",
    "Hello! Roommate dhundne mein madad chahiye? Bataiye kya problem hai?",
    "Salam! Main yahan hun aapki madad ke liye. Kya poochna chahte hain?"
  ],
  help: [
    "Main aapko in cheezon mein help kar sakta hun:\n• Roommate kaise dhundein\n• Budget planning\n• Safety tips\n• Area suggestions\n• University ke paas accommodation",
    "Ye services available hain:\n• Matching preferences set karna\n• Local area guide\n• Rent negotiation tips\n• Compatibility check"
  ],
  budget: [
    "Budget ke liye ye tips hain:\n• Karachi mein 15-25k PKR average hai\n• Lahore mein 12-20k PKR\n• Shared room 8-15k tak mil jata hai\n• Utilities alag se 2-3k add karein",
    "Budget planning:\n• Total income ka 30% rent pe\n• Utilities, internet, food alag\n• Emergency fund rakhein\n• Negotiation try karein landlord se"
  ],
  safety: [
    "Safety ke liye important tips:\n• Roommate ka background check karein\n• References mangein\n• Pehle meet-up arrange karein public place mein\n• Family ko inform karein",
    "Security measures:\n• Original documents verify karein\n• Social media check karein\n• Common friends se poochein\n• Gut feeling pe trust karein"
  ],
  area: [
    "Best areas student ke liye:\n• Karachi: Gulshan, North Nazimabad, PECHS\n• Lahore: Johar Town, DHA, Model Town\n• Islamabad: F-sectors, G-sectors",
    "Area selection tips:\n• University se distance check karein\n• Transport availability\n• Market, hospital nearby\n• Safety reputation"
  ],
  process: [
    "Roommate finding process:\n1. Profile complete karein properly\n2. Preferences clearly mention karein\n3. Multiple options dekh kar decide karein\n4. Meet-up arrange karein\n5. Trial period rakhein",
    "Step by step guide:\n1. Budget fix karein\n2. Location preferences\n3. Lifestyle compatibility check\n4. References exchange karein\n5. Agreement sign karein"
  ],
  compatibility: [
    "Compatibility factors:\n• Sleep schedule same hona chahiye\n• Cleanliness standards match\n• Study habits similar\n• Food preferences\n• Social life balance",
    "Important matching points:\n• Morning person vs night owl\n• Introverted vs extroverted\n• Cooking vs ordering\n• Friends inviting policy\n• Noise tolerance"
  ],
  default: [
    "Samajh nahi aaya. Kya aap ye pooch rahe hain:\n• Budget help?\n• Safety tips?\n• Area suggestions?\n• Process guide?",
    "Main ye topics pe help kar sakta hun:\n• Roommate dhundna\n• Budget planning\n• Safety measures\n• Area recommendations",
    "Thoda aur detail mein bataiye. Main koshish karunga samjhane ki."
  ]
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Assalam o Alaikum! Main aapka roommate finding assistant hun. Kya help chahiye?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getResponseCategory = (userMessage: string): keyof typeof romanUrduResponses => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('salam') || message.includes('hello') || message.includes('hi')) {
      return 'greeting'
    }
    if (message.includes('budget') || message.includes('paisa') || message.includes('rent') || message.includes('paise')) {
      return 'budget'
    }
    if (message.includes('safety') || message.includes('safe') || message.includes('secure') || message.includes('danger')) {
      return 'safety'
    }
    if (message.includes('area') || message.includes('location') || message.includes('jagah') || message.includes('place')) {
      return 'area'
    }
    if (message.includes('process') || message.includes('kaise') || message.includes('how') || message.includes('steps')) {
      return 'process'
    }
    if (message.includes('compatible') || message.includes('match') || message.includes('similar') || message.includes('habit')) {
      return 'compatibility'
    }
    if (message.includes('help') || message.includes('madad') || message.includes('guide')) {
      return 'help'
    }
    
    return 'default'
  }

  const generateBotResponse = (userMessage: string): string => {
    const category = getResponseCategory(userMessage)
    const responses = romanUrduResponses[category]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-toggle"
          title="Roommate Assistant (Roman Urdu)"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="flex items-center space-x-2">
              <Bot size={20} />
              <div>
                <h4 className="font-semibold">Roommate Assistant</h4>
                <p className="text-xs opacity-90">Roman Urdu mein madad</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender}`}
              >
                <div className="flex items-start space-x-2">
                  {message.sender === 'bot' && (
                    <Bot size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User size={16} className="text-white mt-1 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-white' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="flex items-center space-x-2">
                  <Bot size={16} className="text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Roman Urdu mein poochiye..."
                className="chatbot-input flex-1"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Budget, safety, area, process ke baare mein poochiye
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot