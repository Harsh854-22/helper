
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, AlertTriangle, Shield, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  type: string;
  title: string;
  location: string;
  time: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  instructions: string[];
}

const alertData: Alert[] = [
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

const Alerts = () => {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [sosActive, setSosActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading alerts
    setTimeout(() => {
      setActiveAlerts(alertData);
    }, 500);
  }, []);

  const handleSOS = () => {
    setSosActive(true);
    toast({
      title: "SOS Signal Activated",
      description: "Emergency services have been notified of your location",
      variant: "destructive",
    });
    
    // Simulate SOS response
    setTimeout(() => {
      toast({
        title: "Response Incoming",
        description: "Emergency responders are on the way",
      });
    }, 3000);
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
                  <p className="text-sm">Activate to send your location to emergency services</p>
                </div>
              </div>
              <Button 
                variant={sosActive ? "outline" : "default"}
                className={`w-full md:w-auto ${sosActive ? "border-white text-white" : "bg-white text-helper-red hover:bg-gray-200"}`}
                onClick={handleSOS}
                disabled={sosActive}
              >
                {sosActive ? "SOS Activated" : "Activate SOS"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-helper-darkgray">
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
            </TabsList>
          </div>

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

          <TabsContent value="weather" className="space-y-4">
            {activeAlerts.filter(a => a.type === 'Weather').map((alert) => (
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
            ))}
          </TabsContent>

          <TabsContent value="infrastructure" className="space-y-4">
            {activeAlerts.filter(a => a.type === 'Infrastructure').map((alert) => (
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
            ))}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            {activeAlerts.filter(a => a.type === 'Health').map((alert) => (
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
            ))}
          </TabsContent>
        </Tabs>
        
        {selectedAlert && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <Card className="bg-helper-darkgray border-helper-darkgray w-full max-w-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getSeverityColor(selectedAlert.severity)}`} />
                    {selectedAlert.title}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setSelectedAlert(null)}
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {selectedAlert.location} • {selectedAlert.time}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                <div className="flex justify-end pt-2">
                  <Button 
                    className="bg-helper-red hover:bg-red-700 text-white"
                    onClick={handleSOS}
                  >
                    Request Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;
