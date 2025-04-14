
import { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex h-screen overflow-hidden">
      {!isHomePage && <AppSidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isHomePage && (
          <header className="h-16 border-b border-helper-darkgray flex items-center px-4 md:px-6 justify-between">
            <h1 className="text-xl font-bold">{title || "Helper"}</h1>
            <div className="flex items-center gap-2">
              {location.pathname !== '/dashboard' && (
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={() => navigate('/dashboard')}
                  className="h-8 w-8"
                >
                  <Home className="h-4 w-4" />
                </Button>
              )}
            </div>
          </header>
        )}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
