
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';

export const SOSButton = () => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleSOS = () => {
    setIsSharing(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const whatsappMessage = `Emergency! I need help! My location: https://www.google.com/maps?q=${latitude},${longitude}`;
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
          
          window.open(whatsappUrl, '_blank');
          
          setIsSharing(false);
          toast({
            title: "Location Shared",
            description: "Your location has been prepared for sharing via WhatsApp",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsSharing(false);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not access your location. Please enable location services.",
          });
        }
      );
    } else {
      setIsSharing(false);
      toast({
        variant: "destructive",
        title: "Location Not Supported",
        description: "Your browser doesn't support location sharing.",
      });
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full bg-helper-red hover:bg-red-700"
      onClick={handleSOS}
      disabled={isSharing}
    >
      <MapPin className="w-4 h-4 mr-2" />
      {isSharing ? "Sharing Location..." : "Emergency SOS"}
    </Button>
  );
};
