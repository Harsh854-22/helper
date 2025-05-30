
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AlertCircle,
  LifeBuoy,
  ShoppingCart,
  Phone,
  User,
  BrainCircuit,
  Cloud,
  Home,
  Menu,
  X,
  MapPin,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const navItems = [
    { title: 'Profile', icon: User, path: '/profile' },
    { title: 'Dashboard', icon: Home, path: '/dashboard' },
    { title: 'Contacts', icon: Phone, path: '/contacts' },
    { title: 'Weather', icon: Cloud, path: '/weather' },
    { title: 'Alerts', icon: AlertCircle, path: '/alerts' },
    { title: 'Resources', icon: MapPin, path: '/resources' },
    { title: 'AI Assistant', icon: BrainCircuit, path: '/ai' },
    { title: 'Disaster Kit Stores', icon: ShoppingCart, path: '/disaster-kit-stores' },
    { title: 'Blogspot', icon: BrainCircuit, path: '/blogspot' },
    { title: 'Volunteer', icon: BrainCircuit, path: '/VolunteerSignup' },
  ];

  return (
    <Sidebar
      className={cn(
        'transition-width duration-300 border-r border-helper-darkgray', 
        isCollapsed ? 'lg:w-[70px]' : 'lg:w-[240px]'
      )}
      data-state={isCollapsed ? "collapsed" : "expanded"}
    >
      <SidebarHeader className="flex items-center justify-between p-4 h-16">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-helper-red" />
            <span className="font-bold text-xl">Helper</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'flex items-center gap-3 p-2 w-full rounded-md text-sm transition-colors',
                      location.pathname === item.path
                        ? 'bg-helper-red text-white'
                        : 'hover:bg-helper-darkgray'
                    )}
                  >
                    <item.icon className="flex-shrink-0 h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Card className="bg-helper-red">
          <CardContent className="p-3 flex items-center justify-center">
          <Button 
            variant="ghost" 
            className="text-white font-bold w-full"
            onClick={async () => {
              try {
                if (!navigator.geolocation) {
                  alert('Geolocation is not supported by your browser');
                  return;
                }
                navigator.geolocation.getCurrentPosition(async (position) => {
                  const latitude = position.coords.latitude;
                  const longitude = position.coords.longitude;
                  const locationUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                  const message = `Emergency! My current location: ${locationUrl}`;
                  await navigator.clipboard.writeText(message);
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }, () => {
                  alert('Unable to retrieve your location');
                });
              } catch (error) {
                alert('Error occurred: ' + error);
              }
            }}
          >
            {isCollapsed ? 'SOS' : 'Emergency SOS'}
          </Button>
          </CardContent>
        </Card>
      </SidebarFooter>
    </Sidebar>
  );
}
