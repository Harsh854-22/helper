
import { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Send, ArrowDown, Loader2, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Sample predefined responses for the AI assistant
const predefinedResponses: Record<string, string> = {
  "flood": "During a flood:\n1. Move to higher ground immediately\n2. Avoid walking or driving through flood waters\n3. Stay away from power lines and electrical wires\n4. If told to evacuate, do so immediately",
  
  "earthquake": "During an earthquake:\n1. Drop, cover, and hold on\n2. If inside, stay inside and take cover under sturdy furniture\n3. If outside, move to an open area away from buildings and power lines\n4. After shaking stops, check yourself and others for injuries",
  
  "fire": "During a fire:\n1. Get out quickly and stay out\n2. Cover your mouth and nose with a wet cloth to avoid smoke inhalation\n3. Crawl low under smoke\n4. Feel doors before opening them - if hot, find another escape route",
  
  "hurricane": "During a hurricane:\n1. Evacuate if directed by authorities\n2. Otherwise, stay indoors away from windows\n3. Turn off utilities if instructed to do so\n4. Fill bathtubs and containers with water for sanitary purposes",
  
  "tornado": "During a tornado:\n1. Go to a basement or interior room on the lowest floor\n2. Stay away from windows\n3. Cover yourself with blankets or mattress for protection\n4. If outside, find a low-lying area and protect your head",
  
  "heatwave": "During a heatwave:\n1. Stay in air-conditioned buildings as much as possible\n2. Drink plenty of fluids, even if not thirsty\n3. Wear lightweight, light-colored clothing\n4. Check on vulnerable individuals (elderly, sick, young)",
  
  "blizzard": "During a blizzard:\n1. Stay indoors and avoid unnecessary travel\n2. Keep emergency supplies ready\n3. Maintain ventilation when using alternative heat sources\n4. Check on neighbors, especially the elderly",
  
  "emergency kit": "Your emergency kit should include:\n1. Water (one gallon per person per day for at least 3 days)\n2. Non-perishable food (at least 3-day supply)\n3. Battery-powered radio and extra batteries\n4. Flashlight and extra batteries\n5. First aid kit\n6. Whistle to signal for help\n7. Dust mask, plastic sheeting, and duct tape\n8. Moist towelettes, garbage bags, and plastic ties\n9. Wrench or pliers to turn off utilities\n10. Manual can opener\n11. Local maps\n12. Cell phone with chargers and backup battery",
  
  "evacuation": "When evacuating:\n1. Leave immediately if authorities instruct you to do so\n2. Wear protective clothing and sturdy shoes\n3. Take your emergency kit\n4. Lock your home\n5. Use routes specified by officials\n6. Stay away from downed power lines\n7. Inform friends or family of your destination",
  
  "first aid": "Basic first aid tips:\n1. For bleeding: Apply direct pressure with a clean cloth\n2. For burns: Cool with water, cover with a clean cloth\n3. For fractures: Immobilize the injury, apply ice\n4. For choking: Perform the Heimlich maneuver\n5. For heart attack: Call emergency services, assist with CPR if needed\n6. Always seek professional medical help when possible",
  
  "power outage": "During a power outage:\n1. Keep refrigerator and freezer doors closed\n2. Use flashlights instead of candles\n3. Turn off or disconnect appliances\n4. Listen to local news for updates\n5. Have alternative charging methods for phones\n6. Keep your car fuel tank at least half full",
  
  "water safety": "For water safety during disasters:\n1. Store clean water (1 gallon per person per day)\n2. If advised, boil water for at least one minute before use\n3. Disinfect water with unscented household bleach if boiling isn't possible\n4. Never drink floodwater\n5. Use bottled water for preparing food when possible",
  
  "help": "I can provide information on various disaster scenarios and emergency procedures. Try asking about:\n- Specific disasters (floods, earthquakes, fires, etc.)\n- Emergency kits and supplies\n- Evacuation procedures\n- First aid\n- Safety during power outages\n- Water safety\n- Communication during emergencies\n- How to help others\n\nJust type your question, and I'll do my best to assist you."
};

// Function to find the most relevant predefined response
const findRelevantResponse = (query: string): string => {
  const queryLower = query.toLowerCase();
  
  // Check for exact matches first
  for (const [key, response] of Object.entries(predefinedResponses)) {
    if (queryLower.includes(key)) {
      return response;
    }
  }
  
  // Fallback response
  return "I'm here to help with disaster-related questions. For this type of situation, I recommend contacting emergency services directly. You can also try asking about flood safety, earthquake procedures, emergency kits, evacuation, first aid, or type 'help' for more options.";
};

const AI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI disaster management assistant. How can I help you today? You can ask about emergency procedures, disaster preparedness, or specific scenarios.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: findRelevantResponse(input.toLowerCase()),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout title="AI Assistant">
      <div className="container mx-auto p-4 md:p-6 flex flex-col h-full max-h-[calc(100vh-4rem)]">
        <div className="mb-4 flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-helper-red" />
          <h2 className="text-xl font-bold">Disaster Management Assistant</h2>
        </div>
        
        <Card className="bg-helper-darkgray border-helper-darkgray flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-2'}`}>
                    <div 
                      className={`rounded-lg px-4 py-2 ${
                        message.isUser 
                          ? 'bg-helper-red text-white' 
                          : 'bg-helper-black border border-helper-darkgray'
                      }`}
                    >
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className={`${i > 0 ? 'mt-2' : ''}`}>{line}</p>
                      ))}
                    </div>
                    <div 
                      className={`text-xs text-gray-400 mt-1 ${
                        message.isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  <div 
                    className={`flex-shrink-0 h-8 w-8 rounded-full bg-helper-darkgray flex items-center justify-center ${
                      message.isUser ? 'order-1 mr-2' : 'order-1 mr-2'
                    }`}
                  >
                    {message.isUser 
                      ? <User className="h-4 w-4 text-gray-400" /> 
                      : <Bot className="h-4 w-4 text-helper-red" />
                    }
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start mb-4">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-helper-darkgray flex items-center justify-center mr-2">
                    <Bot className="h-4 w-4 text-helper-red" />
                  </div>
                  <div className="bg-helper-black border border-helper-darkgray rounded-lg px-4 py-2">
                    <Loader2 className="h-5 w-5 animate-spin text-helper-red" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t border-helper-darkgray">
              <div className="flex gap-2">
                <Input
                  className="bg-helper-black border-helper-darkgray"
                  placeholder="Type your question here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isProcessing}
                />
                <Button
                  className={`${isProcessing ? 'bg-gray-700' : 'bg-helper-red hover:bg-red-700'} text-white`}
                  onClick={handleSendMessage}
                  disabled={isProcessing || !input.trim()}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="mt-3 flex justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-xs text-gray-400"
                  onClick={scrollToBottom}
                >
                  <ArrowDown className="h-3 w-3 mr-1" /> Latest messages
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          <p>This AI assistant provides general guidance only.</p>
          <p>In case of a real emergency, please contact emergency services immediately.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AI;
