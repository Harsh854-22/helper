
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { LifeBuoy, AlertTriangle, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-helper-black to-helper-darkgray flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
        {/* Left Side - Features */}
        <div className="w-full md:w-1/2 bg-helper-darkgray p-8 flex flex-col justify-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-helper-red p-4 rounded-full">
              <LifeBuoy size={40} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-white mb-4">
            Stay <span className="text-helper-red">Prepared</span>, Stay <span className="text-helper-red">Safe</span>
          </h1>
          
          <div className="space-y-4">
            {[
              { icon: AlertTriangle, text: "Real-time Emergency Alerts" },
              { icon: Shield, text: "Advanced Safety Features" },
              { icon: Headphones, text: "24/7 Support & Guidance" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-gray-300">
                <feature.icon className="text-helper-red h-6 w-6" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              className="border-helper-red text-helper-red hover:bg-helper-red/10"
              onClick={() => navigate('/')}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Right Side - Authentication Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <AuthForm />
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 text-center max-w-md">
        <p className="mb-2">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
        <p>
          Help us create a safer community by joining today
        </p>
      </div>
    </div>
  );
};

export default Login;
