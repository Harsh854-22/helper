
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LifeBuoy, ShieldAlert, MapPin, Cloud, Package2, Truck, 
         Ambulance, Flashlight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    navigate('/login');
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
    }
  ];

  const preparednessItems = [
    {
      icon: Ambulance,
      title: "First Aid Kits",
      description: "Comprehensive medical supplies",
      price: "$49.99"
    },
    {
      icon: Flashlight,
      title: "Emergency Lighting",
      description: "Solar-powered and battery backup options",
      price: "$29.99"
    },
    {
      icon: Truck,
      title: "Survival Backpack",
      description: "72-hour emergency preparedness kit",
      price: "$129.99"
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

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-black/20 backdrop-blur-sm border-gray-800 hover:border-helper-red transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <feature.icon className="w-10 h-10 text-helper-red" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-white">Emergency Preparedness Store</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {preparednessItems.map((item, index) => (
              <Card 
                key={index} 
                className="bg-black/20 backdrop-blur-sm border-gray-800 hover:border-helper-red transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <item.icon className="w-10 h-10 text-helper-red" />
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </div>
                    <span className="text-xl font-bold text-helper-red">{item.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{item.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-helper-red text-helper-red hover:bg-helper-red/10"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="text-center mt-16">
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
