
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  Shield, 
  MapPin, 
  Plus, 
  Trash2, 
  Phone, 
  Send, 
  Map, 
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Alert } from '@/types';

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    type: 'Weather',
    title: '',
    location: '',
    severity: 'medium',
    description: '',
    instructions: ['']
  });
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const { toast } = useToast();

  // Initial alerts data
  const initialAlerts: Alert[] = [
    {
      id: '1',
      type: 'Weather',
      title: 'Flash Flood Warning',
      location: 'Downtown Area',
      time: '2 hours ago',
      severity: 'high',
      description: 'Flash flooding is occurring or imminent in the downtown area. Avoid flood waters and seek higher ground immediately.',
      instructions: [
        'Move to higher ground immediately',
        'Do not walk or drive through flood waters',
        'Stay away from power lines and electrical wires',
        'Be prepared to evacuate if directed'
      ]
    },
    {
      id: '2',
      type: 'Infrastructure',
      title: 'Power Outage',
      location: 'Western District',
      time: '5 hours ago',
      severity: 'medium',
      description: 'A widespread power outage is affecting the western district. Utility crews are working to restore service.',
      instructions: [
        'Keep refrigerators closed to maintain cold temperature',
        'Use flashlights instead of candles',
        'Unplug major appliances to prevent damage',
        'Check on vulnerable neighbors if safe to do so'
      ]
    },
    {
      id: '3',
      type: 'Weather',
      title: 'Severe Thunderstorm',
      location: 'City-wide',
      time: '1 day ago',
      severity: 'medium',
      description: 'Severe thunderstorms with heavy rainfall and strong winds are expected within the next 6 hours.',
      instructions: [
        'Secure outdoor objects that could blow away',
        'Stay inside and away from windows',
        'Avoid using electrical equipment',
        'Prepare for potential power outages'
      ]
    },
    {
      id: '4',
      type: 'Health',
      title: 'Air Quality Warning',
      location: 'Northern Region',
      time: '2 days ago',
      severity: 'low',
      description: 'Poor air quality due to wildfire smoke. People with respiratory conditions should take precautions.',
      instructions: [
        'Stay indoors when possible',
        'Keep windows and doors closed',
        'Use air purifiers if available',
        'Wear a mask when outdoors if you have respiratory issues'
      ]
    }
  ];

  // Load alerts from localStorage or use initial data
  useEffect(() => {
    const savedAlerts = localStorage.getItem('helper-alerts');
    if (savedAlerts) {
      setActiveAlerts(JSON.parse(savedAlerts));
    } else {
      setActiveAlerts(initialAlerts);
    }
    
    // Get user location for SOS feature
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Could not get your location for emergency services."
          });
        }
      );
    }
  }, [toast]);

  // Save alerts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('helper-alerts', JSON.stringify(activeAlerts));
  }, [activeAlerts]);

  const handleSOS = () => {
    setSosActive(true);
    
    // Get current location for sharing
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create WhatsApp link with location and emergency message
          const emergencyNumber = "911"; // Change to your local emergency number
          const message = `Emergency SOS! I need immediate assistance. My location: https://www.google.com/maps?q=${latitude},${longitude}`;
          const whatsappLink = `https://api.whatsapp.com/send?phone=${emergencyNumber}&text=${encodeURIComponent(message)}`;
          
          // Open WhatsApp in a new tab
          window.open(whatsappLink, '_blank');
          
          toast({
            title: "SOS Signal Activated",
            description: "Emergency services have been notified of your location",
            variant: "destructive",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          
          // If location is unavailable, still allow WhatsApp contact
          const emergencyNumber = "911"; // Change to your local emergency number
          const message = "Emergency SOS! I need immediate assistance.";
          const whatsappLink = `https://api.whatsapp.com/send?phone=${emergencyNumber}&text=${encodeURIComponent(message)}`;
          
          window.open(whatsappLink, '_blank');
          
          toast({
            title: "SOS Signal Activated",
            description: "Could not get your location, but emergency contact has been initiated",
            variant: "destructive",
          });
        }
      );
    } else {
      // Fallback if geolocation is not supported
      const emergencyNumber = "911"; // Change to your local emergency number
      const message = "Emergency SOS! I need immediate assistance.";
      const whatsappLink = `https://api.whatsapp.com/send?phone=${emergencyNumber}&text=${encodeURIComponent(message)}`;
      
      window.open(whatsappLink, '_blank');
      
      toast({
        title: "SOS Signal Activated",
        description: "Emergency contact has been initiated",
        variant: "destructive",
      });
    }
    
    // Simulate SOS response
    setTimeout(() => {
      toast({
        title: "Response Incoming",
        description: "Emergency responders are on the way",
      });
    }, 3000);
  };

  const handleAddAlert = () => {
    // Validate form
    if (!newAlert.title || !newAlert.location || !newAlert.description) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Create new alert
    const alert: Alert = {
      id: Date.now().toString(),
      type: newAlert.type || 'Weather',
      title: newAlert.title || '',
      location: newAlert.location || '',
      time: 'Just now',
      severity: (newAlert.severity as 'critical' | 'high' | 'medium' | 'low') || 'medium',
      description: newAlert.description || '',
      instructions: newAlert.instructions?.filter(i => i.trim() !== '') || ['Stay safe'],
    };
    
    // Add to alerts
    setActiveAlerts(prevAlerts => [alert, ...prevAlerts]);
    
    // Reset form and close dialog
    setNewAlert({
      type: 'Weather',
      title: '',
      location: '',
      severity: 'medium',
      description: '',
      instructions: ['']
    });
    setIsAddingAlert(false);
    
    toast({
      title: "Alert added",
      description: "New alert has been created successfully.",
    });
  };

  const handleDeleteAlert = (id: string) => {
    setActiveAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    setSelectedAlert(null);
    
    toast({
      title: "Alert deleted",
      description: "The alert has been removed.",
    });
  };

  const handleAddInstruction = () => {
    setNewAlert(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), '']
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...(newAlert.instructions || [])];
    updatedInstructions[index] = value;
    
    setNewAlert(prev => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  const handleRemoveInstruction = (index: number) => {
    if ((newAlert.instructions?.length || 0) <= 1) return;
    
    const updatedInstructions = [...(newAlert.instructions || [])];
    updatedInstructions.splice(index, 1);
    
    setNewAlert(prev => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-helper-red animate-pulse-red';
      case 'high': return 'bg-helper-red';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout title="Alerts">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6">
          <Card className="bg-helper-red text-white border-helper-red">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={24} />
                <div>
                  <h2 className="text-xl font-bold">Emergency SOS</h2>
                  <p className="text-sm">Activate to send your location to emergency services via WhatsApp</p>
                </div>
              </div>
              <Button 
                variant={sosActive ? "outline" : "default"}
                className={`w-full md:w-auto ${sosActive ? "border-white text-white" : "bg-white text-helper-red hover:bg-gray-200"}`}
                onClick={handleSOS}
              >
                {sosActive ? "SOS Activated" : "Activate SOS"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Alerts</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAddingAlert(true)}
            className="flex items-center gap-1"
          >
            <Plus size={16} />
            Add Alert
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-helper-darkgray mb-4">
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="Weather">Weather</TabsTrigger>
            <TabsTrigger value="Infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="Health">Health</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`h-3 w-3 mt-1.5 rounded-full ${getSeverityColor(alert.severity)}`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{alert.title}</h3>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <MapPin size={12} /> {alert.location} • {alert.time}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-gray-300 line-clamp-2">{alert.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-helper-darkgray border-helper-darkgray">
                <CardContent className="p-6 text-center">
                  <Bell className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No active alerts</h3>
                  <p className="text-gray-400">You'll be notified when new alerts are available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {['Weather', 'Infrastructure', 'Health'].map((alertType) => (
            <TabsContent key={alertType} value={alertType} className="space-y-4">
              {activeAlerts.filter(a => a.type === alertType).length > 0 ? (
                activeAlerts
                  .filter(a => a.type === alertType)
                  .map((alert) => (
                    <Card 
                      key={alert.id} 
                      className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`h-3 w-3 mt-1.5 rounded-full ${getSeverityColor(alert.severity)}`} />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{alert.title}</h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1">
                                  <MapPin size={12} /> {alert.location} • {alert.time}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {alert.type}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-gray-300 line-clamp-2">{alert.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="bg-helper-darkgray border-helper-darkgray">
                  <CardContent className="p-6 text-center">
                    <Bell className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">No {alertType.toLowerCase()} alerts</h3>
                    <p className="text-gray-400">You'll be notified when new alerts are available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Alert Detail Dialog */}
        {selectedAlert && (
          <Dialog open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)}>
            <DialogContent className="bg-helper-darkgray border-helper-darkgray max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getSeverityColor(selectedAlert.severity)}`} />
                  {selectedAlert.title}
                </DialogTitle>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {selectedAlert.location} • {selectedAlert.time}
                </p>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-sm">{selectedAlert.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield size={16} className="text-helper-red" /> 
                    Safety Instructions
                  </h4>
                  <ul className="space-y-2">
                    {selectedAlert.instructions.map((instruction, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-helper-darkgray border border-helper-red flex-shrink-0 flex items-center justify-center text-xs mt-0.5">
                          {idx + 1}
                        </div>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteAlert(selectedAlert.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                  
                  <Button 
                    className="bg-helper-red hover:bg-red-700 text-white"
                    onClick={handleSOS}
                  >
                    Request Help
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Alert Dialog */}
        <Dialog open={isAddingAlert} onOpenChange={setIsAddingAlert}>
          <DialogContent className="bg-helper-darkgray border-helper-darkgray max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Alert</DialogTitle>
              <DialogDescription>Create a new alert to inform people about an emergency situation.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select 
                  value={newAlert.type} 
                  onValueChange={value => setNewAlert({...newAlert, type: value})}
                >
                  <SelectTrigger className="bg-helper-black border-helper-darkgray">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weather">Weather</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-title">Title</Label>
                <Input 
                  id="alert-title" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newAlert.title}
                  onChange={e => setNewAlert({...newAlert, title: e.target.value})}
                  placeholder="Alert title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-location">Location</Label>
                <Input 
                  id="alert-location" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newAlert.location}
                  onChange={e => setNewAlert({...newAlert, location: e.target.value})}
                  placeholder="Affected area"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-severity">Severity</Label>
                <Select 
                  value={newAlert.severity} 
                  onValueChange={value => setNewAlert({...newAlert, severity: value})}
                >
                  <SelectTrigger className="bg-helper-black border-helper-darkgray">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-description">Description</Label>
                <Textarea 
                  id="alert-description" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newAlert.description}
                  onChange={e => setNewAlert({...newAlert, description: e.target.value})}
                  placeholder="Describe the alert details"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Safety Instructions</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={handleAddInstruction}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                
                {newAlert.instructions?.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input 
                      className="bg-helper-black border-helper-darkgray"
                      value={instruction}
                      onChange={e => handleInstructionChange(index, e.target.value)}
                      placeholder={`Safety instruction ${index + 1}`}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => handleRemoveInstruction(index)}
                      disabled={(newAlert.instructions?.length || 0) <= 1}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingAlert(false)}>Cancel</Button>
              <Button 
                className="bg-helper-red hover:bg-red-700 text-white"
                onClick={handleAddAlert}
              >
                Add Alert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Alerts;
