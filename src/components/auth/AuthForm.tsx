
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'reset';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
          title: "Successfully signed in",
          description: "Welcome back!",
        });

      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: "Successfully signed up",
          description: "Please check your email for the confirmation link.",
        });

      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) throw error;
        toast({
          title: "Password reset email sent",
          description: "Please check your email for the reset link.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-helper-darkgray border-helper-darkgray">
      <CardHeader>
        <CardTitle>
          {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Enter your credentials to access your account' 
            : mode === 'signup' 
              ? 'Create a new account to save your data' 
              : 'Enter your email to receive a reset link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              className="bg-helper-black border-helper-darkgray"
            />
          </div>
          
          {mode !== 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required={mode !== 'reset'}
                className="bg-helper-black border-helper-darkgray"
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-helper-red hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {mode === 'signin' ? (
          <>
            <Button 
              variant="link" 
              className="text-helper-red" 
              onClick={() => setMode('reset')}
            >
              Forgot your password?
            </Button>
            <div className="text-sm">
              Don't have an account?{' '}
              <Button 
                variant="link" 
                className="text-helper-red p-0 h-auto" 
                onClick={() => setMode('signup')}
              >
                Sign up
              </Button>
            </div>
          </>
        ) : mode === 'signup' ? (
          <div className="text-sm">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="text-helper-red p-0 h-auto" 
              onClick={() => setMode('signin')}
            >
              Sign in
            </Button>
          </div>
        ) : (
          <Button 
            variant="link" 
            className="text-helper-red" 
            onClick={() => setMode('signin')}
          >
            Back to sign in
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
