import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-helper-black flex items-center justify-center p-4 ml-[450px]">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-helper-red mb-2">HELPER</h1>
          <p className="text-gray-400">Your personal disaster management assistant</p>
        </div>

        <div className="w-full">
          <AuthForm />
        </div>

        <p className="mt-6 text-sm text-gray-500 text-center w-full">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;