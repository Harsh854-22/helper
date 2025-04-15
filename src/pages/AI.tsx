
import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types';
import { Send, Bot, User as UserIcon, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { env } from '@/utils/ai-config';

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
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
    
    if (!input.trim() || isLoading) return;
    
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
      // Get last 5 messages for context
      const recentMessages = messages.slice(-5);
      const context = recentMessages
        .map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const prompt = `Context: You are a helpful disaster management assistant. Always provide accurate and helpful information about disaster preparedness, response, and recovery.

Previous conversation:
${context}

User question: ${input}

Provide a clear and helpful response:`;

      // Using a simpler approach for response generation to avoid model loading issues
      const response = await generateResponse(prompt);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error generating response:', error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again later.",
      });
      
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

  // Simple response generation function that doesn't rely on heavy models
  const generateResponse = async (prompt: string): Promise<string> => {
    // Basic response templates for common disaster-related topics
    const responses = {
      earthquake: "During an earthquake, remember to DROP, COVER, and HOLD ON. Get under a sturdy piece of furniture and hold on until the shaking stops. Stay away from windows and exterior walls.",
      fire: "If there's a fire, remember to GET OUT and STAY OUT. Use your escape plan, stay low to avoid smoke, and call emergency services once you're safely outside.",
      flood: "For floods, remember to move to higher ground and avoid walking or driving through flood waters. Just 6 inches of moving water can knock you down, and 12 inches can float a vehicle.",
      hurricane: "When preparing for a hurricane, secure your home, gather emergency supplies, and follow evacuation orders if given. Stay informed through official channels and have a communication plan.",
      tornado: "During a tornado warning, seek shelter immediately in a basement, storm cellar, or interior room on the lowest floor with no windows. Cover yourself with blankets or a mattress for protection.",
      preparedness: "A basic emergency kit should include water (one gallon per person per day for at least three days), non-perishable food, flashlight, first aid kit, batteries, whistle, dust mask, plastic sheeting, duct tape, moist towelettes, garbage bags, wrench/pliers, can opener, and local maps.",
      evacuation: "When evacuating, remember to take your emergency supply kit, secure your home, unplug electrical equipment, leave a note telling others when you left and where you're going, lock your home, and use recommended evacuation routes.",
      firstaid: "Basic first aid includes treating wounds by cleaning with soap and water, controlling bleeding with pressure, treating burns by cooling with water, and monitoring for signs of shock like rapid breathing, paleness, or weakness.",
    };

    // Simple keyword matching to determine response
    const lowerPrompt = prompt.toLowerCase();
    let response = "I'm here to help with disaster management questions. Could you provide more specific details about what you'd like to know about emergency preparedness, response, or recovery?";
    
    // Check for keywords in the prompt
    for (const [key, value] of Object.entries(responses)) {
      if (lowerPrompt.includes(key)) {
        response = value;
        break;
      }
    }
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return response;
  };

  const handleClearChat = () => {
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
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-helper-red" />
            <h2 className="text-xl font-bold">Disaster Management Assistant</h2>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.reload()}
              className="text-xs flex gap-1"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
              Reload Assistant
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearChat}
              className="text-xs"
              disabled={isLoading}
            >
              Clear Chat
            </Button>
          </div>
        </div>
        
        <Card className="flex-1 overflow-hidden bg-black/20 backdrop-blur-sm border-helper-darkgray mb-4 relative">
          {isModelLoading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-400">Initializing Assistant...</p>
              </div>
            </div>
          )}
          <CardContent className="p-4 h-full overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] md:max-w-[70%] rounded-lg p-3 backdrop-blur-sm ${
                      message.isUser 
                        ? 'bg-helper-red/90 text-white rounded-tr-none' 
                        : 'bg-helper-black/90 border border-helper-darkgray rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.isUser ? (
                        <UserIcon className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp instanceof Date 
                          ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-helper-black/90 border border-helper-darkgray rounded-lg rounded-tl-none p-3 backdrop-blur-sm">
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
            className="flex-1 bg-black/20 backdrop-blur-sm border-helper-darkgray focus:ring-helper-red"
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
