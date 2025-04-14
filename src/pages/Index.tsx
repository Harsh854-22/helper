
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LifeBuoy } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('helper-visited');
    if (hasVisited) {
      // Auto-redirect to dashboard for returning users
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleGetStarted = () => {
    localStorage.setItem('helper-visited', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-helper-black p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-helper-red p-4 rounded-full">
            <LifeBuoy size={50} className="text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span className="text-helper-red">Helper</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Your comprehensive disaster management companion
        </p>
        
        <div className="space-y-6">
          <ul className="text-left space-y-2">
            {[
              "Real-time disaster alerts",
              "Find nearby emergency resources",
              "Store emergency contacts",
              "AI-powered assistance",
              "Weather monitoring"
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-helper-red" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            onClick={handleGetStarted}
            className="w-full bg-helper-red hover:bg-red-700 text-white py-3 text-lg"
          >
            Get Started
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-gray-400">
          Be prepared. Stay safe. Help others.
        </p>
      </div>
    </div>
  );
};

export default Index;
