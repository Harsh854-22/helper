import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types';
import { Send, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Pre-defined first-time welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "Hello, I'm your disaster management assistant. I can help with emergency preparedness, provide information about current disasters, or answer questions about safety procedures. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
    
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('helper-ai-messages');
    if (savedMessages && messages.length <= 1) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('helper-ai-messages', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Use Gemini API for responses
      const API_KEY = "AIzaSyDuUvqAeeIyRVDyOP436M7MBu3J374cfMI";
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
      
      const recentMessages = messages.slice(-5); // Get last 5 messages for context
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful disaster management assistant. Always provide accurate and helpful information about disaster preparedness, response, and recovery. 
                  
                  Recent conversation:
                  ${recentMessages.map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}
                  
                  User: ${input}
                  
                  Respond with clear, concise information. If discussing sensitive disaster topics, be empathetic and focus on practical advice.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      
      // Extract the response text
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again later.",
      });
      
      // Add fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't process your request right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    // Keep only the welcome message
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    localStorage.setItem('helper-ai-messages', JSON.stringify([welcomeMessage]));
    
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  return (
    <Layout title="AI Assistant">
      <div className="container mx-auto p-4 md:p-6 flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Disaster Management Assistant</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearChat}
            className="text-xs"
          >
            Clear Chat
          </Button>
        </div>
        
        <Card className="flex-1 overflow-hidden bg-helper-darkgray border-helper-darkgray mb-4">
          <CardContent className="p-4 h-full overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 ${
                      message.isUser 
                        ? 'bg-helper-red text-white rounded-tr-none' 
                        : 'bg-helper-black border border-helper-darkgray rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.isUser ? (
                        <UserIcon className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-helper-black border border-helper-darkgray rounded-lg rounded-tl-none p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            className="flex-1 bg-helper-darkgray border-helper-darkgray"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-helper-red hover:bg-red-700 text-white"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default AI;
