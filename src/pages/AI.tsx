import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types';
import { Send, Bot, User as UserIcon, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content:
          "Hello, I'm your disaster management assistant. I can help with emergency preparedness, provide information about current disasters, or answer questions about safety procedures. How can I assist you today?",
        isUser: false,
        timestamp: new Date(),
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
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const recentMessages = messages.slice(-5);
      const context = recentMessages
        .map((msg) => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const prompt = `
You are a disaster management assistant AI helping users with disaster preparedness, emergencies, and recovery.

Previous conversation:
${context}

User: ${input}
AI:
`;

      const response = await generateResponse(prompt);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to get a response. Please try again later.',
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error.message || "I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (res.ok && data?.result) {
        return data.result.trim();
      } else {
        throw new Error(data.error || 'Invalid response from API');
      }
    } catch (err) {
      console.error('API request failed:', err);
      throw new Error('Failed to communicate with the assistant service');
    }
  };

  const handleClearChat = () => {
    const welcomeMessage = messages[0];
    setMessages([welcomeMessage]);
    localStorage.setItem('helper-ai-messages', JSON.stringify([welcomeMessage]));
    toast({
      title: 'Chat cleared',
      description: 'Your conversation history has been cleared.',
    });
  };

  // UI remains exactly the same from here down
  return (
    <Layout title="AI Assistant">
      <div className="container mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-helper-red" />
            <h2 className="text-xl font-semibold tracking-tight">Disaster Management Assistant</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-1" /> Reload
            </Button>
            <Button variant="outline" size="sm" onClick={handleClearChat} disabled={isLoading}>
              Clear Chat
            </Button>
          </div>
        </div>

        <Card className="flex-1 bg-black/20 backdrop-blur-sm border border-helper-darkgray overflow-hidden relative rounded-2xl shadow">
          {isModelLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-400">Initializing Assistant...</p>
              </div>
            </div>
          )}

          <CardContent className="p-4 overflow-y-auto h-full space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-xl px-4 py-2 text-sm leading-relaxed ${
                    message.isUser
                      ? 'bg-helper-red text-white rounded-tr-none'
                      : 'bg-helper-black border border-helper-darkgray text-white rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                    {message.isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-helper-black border border-helper-darkgray rounded-xl px-4 py-2 text-sm text-white flex items-center gap-2 animate-pulse">
                  <Bot className="h-4 w-4" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        <form onSubmit={handleSendMessage} className="flex gap-2 mt-4">
          <Input
            className="flex-1 bg-black/20 backdrop-blur-sm border-helper-darkgray text-white placeholder:text-gray-400 focus:ring-helper-red rounded-xl"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="bg-helper-red hover:bg-red-700 text-white rounded-xl"
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