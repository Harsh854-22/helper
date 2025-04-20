
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { LifeBuoy } from 'lucide-react';

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
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-helper-red p-4 rounded-full">
            <LifeBuoy size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome to <span className="text-helper-red">HELPER</span></h1>
        <p className="text-gray-400">Your personal disaster management assistant</p>
      </div>
      
      <AuthForm />
      
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
