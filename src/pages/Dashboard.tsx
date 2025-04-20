
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, MapPin, Phone, Cloud, BrainCircuit } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Mock recent alerts
  const recentAlerts = [
    { id: 1, type: 'Flood', location: 'Downtown Area', time: '2 hours ago', severity: 'high' },
    { id: 2, type: 'Power Outage', location: 'Western District', time: '5 hours ago', severity: 'medium' },
  ];

  return (
    <Layout title="Dashboard">
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer" onClick={() => navigate('/alerts')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-helper-red" />
                Alerts
              </CardTitle>
              <CardDescription>View active alerts in your area</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer" onClick={() => navigate('/resources')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-helper-red" />
                Resources
              </CardTitle>
              <CardDescription>Find nearby emergency resources</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer" onClick={() => navigate('/contacts')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-helper-red" />
                Contacts
              </CardTitle>
              <CardDescription>Manage emergency contacts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer" onClick={() => navigate('/weather')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-helper-red" />
                Weather
              </CardTitle>
              <CardDescription>Check current weather conditions</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer" onClick={() => navigate('/ai')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-helper-red" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get intelligent disaster guidance</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer" onClick={() => navigate('/disaster-kit-stores')}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-helper-red" />
                Disaster Kit Stores
              </CardTitle>
              <CardDescription>Find nearby disaster kit stores</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="bg-helper-red text-white border-helper-red hover:bg-red-700 transition-colors cursor-pointer" onClick={() => navigate('/alerts')}>
            <CardContent className="flex items-center justify-center p-6">
              <Button variant="ghost" className="text-white text-lg font-bold">
                Emergency SOS
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recent Alerts</h2>
          {recentAlerts.length > 0 ? (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <Card key={alert.id} className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${
                          alert.severity === 'high' ? 'bg-helper-red animate-pulse-red' : 
                          alert.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <h3 className="font-medium">{alert.type}</h3>
                          <p className="text-sm text-gray-400">{alert.location} • {alert.time}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => navigate('/alerts')}>
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-helper-darkgray border-helper-darkgray">
              <CardContent className="p-4 text-center text-gray-400">
                No recent alerts in your area
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-end">
            <Button variant="link" className="text-helper-red" onClick={() => navigate('/alerts')}>
              View all alerts
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
