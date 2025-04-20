
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast({
          title: "Sign in successful",
          description: "Welcome back to Helper!"
        });
        
        navigate('/dashboard');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/dashboard',
          },
        });

        if (error) throw error;
        
        toast({
          title: "Sign up successful",
          description: "Please check your email for verification."
        });
        
        setMode('signin');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });

        if (error) throw error;
        
        toast({
          title: "Password reset email sent",
          description: "Check your email for a password reset link."
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-black/20 backdrop-blur-sm border-gray-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-white">
          {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          {mode === 'signin' ? 'Enter your credentials to access your account' : 
           mode === 'signup' ? 'Join us to stay prepared and protected' : 
           'Enter your email to receive a password reset link'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleAuth}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-black/40 border-gray-800 focus:border-helper-red text-white"
            />
          </div>
          
          {mode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/40 border-gray-800 focus:border-helper-red text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-helper-red hover:bg-red-700 transition-colors"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </Button>
          
          <div className="text-center space-y-2">
            {mode === 'signin' ? (
              <>
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <Button 
                    variant="link" 
                    type="button"
                    className="p-0 text-helper-red" 
                    onClick={() => setMode('signup')}
                  >
                    Sign up
                  </Button>
                </p>
                <Button 
                  variant="link" 
                  type="button"
                  className="p-0 text-helper-red" 
                  onClick={() => setMode('reset')}
                >
                  Forgot password?
                </Button>
              </>
            ) : mode === 'signup' ? (
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Button 
                  variant="link" 
                  type="button"
                  className="p-0 text-helper-red" 
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </Button>
              </p>
            ) : (
              <Button 
                variant="link" 
                type="button"
                className="p-0 text-helper-red" 
                onClick={() => setMode('signin')}
              >
                Back to sign in
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
