
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LifeBuoy, ShieldAlert, MapPin, Cloud, Package2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const hasVisited = localStorage.getItem('helper-visited');
    if (hasVisited) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleGetStarted = () => {
    localStorage.setItem('helper-visited', 'true');
    navigate('/dashboard');
  };

  const features = [
    {
      icon: ShieldAlert,
      title: "Real-time Alerts",
      description: "Get instant notifications about emergencies in your area"
    },
    {
      icon: MapPin,
      title: "Location Sharing",
      description: "Share your location with emergency contacts via WhatsApp"
    },
    {
      icon: Cloud,
      title: "Weather Monitoring",
      description: "Live weather updates and forecasts"
    },
    {
      icon: Package2,
      title: "Emergency Supplies",
      description: "Access our marketplace for disaster preparedness kits"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-helper-black to-helper-darkgray">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6 animate-bounce">
            <div className="bg-helper-red p-4 rounded-full">
              <LifeBuoy size={50} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Stay Safe with <span className="text-helper-red">Helper</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your comprehensive disaster management companion powered by AI
          </p>
          
          <Button 
            onClick={handleGetStarted}
            className="bg-helper-red hover:bg-red-700 text-white py-6 px-8 text-lg rounded-full transition-all duration-300 hover:scale-105"
          >
            Get Started Now
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-helper-red transition-all duration-300"
            >
              <feature.icon className="w-12 h-12 text-helper-red mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            By using Helper, you're taking an important step towards better emergency preparedness.
            Our AI-powered platform ensures you're always ready for the unexpected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
