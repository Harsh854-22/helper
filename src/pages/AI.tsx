import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types';
import { Send, Bot, User as UserIcon, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pipeline } from '@huggingface/transformers';

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [generator, setGenerator] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadModel = async () => {
      try {
        const pipe = await pipeline(
          'text-generation',
          'gpt2',
          { quantized: true }
        );
        setGenerator(pipe);
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load AI model. Using fallback responses.",
        });
        setIsModelLoading(false);
      }
    };

    loadModel();
  }, [toast]);

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
    
    const savedMessages = localStorage.getItem('helper-ai-messages');
    if (savedMessages && messages.length <= 1) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);
  
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('helper-ai-messages', JSON.stringify(messages));
    }
  }, [messages]);
  
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
      let response;
      
      if (generator) {
        const result = await generator(input + "\nResponse:", {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.9,
        });
        response = result[0].generated_text.split("Response:")[1].trim();
      } else {
        response = generateFallbackResponse(input);
      }
      
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
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
      return "Hello! I'm your disaster management assistant. How can I help you today?";
    }
    
    if (lowercaseInput.includes('emergency') || lowercaseInput.includes('help')) {
      return "For immediate emergency assistance, please call your local emergency services. I can provide guidance on disaster preparedness and safety procedures.";
    }
    
    return "I'm here to help with disaster management questions. Could you please be more specific about what you'd like to know?";
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
