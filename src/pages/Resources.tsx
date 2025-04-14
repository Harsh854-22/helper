
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Clock, Info, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Resource {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'food' | 'supplies';
  address: string;
  phone: string;
  distance: string;
  hours: string;
  status: 'open' | 'closed' | 'limited';
  notes?: string;
}

const resourcesData: Resource[] = [
  {
    id: '1',
    name: 'Central Community Center',
    type: 'shelter',
    address: '123 Main St, Downtown',
    phone: '(555) 123-4567',
    distance: '0.8 miles',
    hours: 'Open 24/7',
    status: 'open',
    notes: 'Currently housing 45/100 capacity. Provides beds, food, and basic medical care.'
  },
  {
    id: '2',
    name: 'Memorial Hospital',
    type: 'hospital',
    address: '789 Health Ave, Westside',
    phone: '(555) 987-6543',
    distance: '1.2 miles',
    hours: 'Open 24/7',
    status: 'open',
    notes: 'Emergency room operating at normal capacity. Specialized for trauma care.'
  },
  {
    id: '3',
    name: 'Riverside Emergency Shelter',
    type: 'shelter',
    address: '456 River Rd, Eastside',
    phone: '(555) 234-5678',
    distance: '2.1 miles',
    hours: 'Open 24/7',
    status: 'limited',
    notes: 'Near capacity. Priority for families with children. Pet-friendly.'
  },
  {
    id: '4',
    name: 'City Food Bank',
    type: 'food',
    address: '321 Hunger St, Northside',
    phone: '(555) 345-6789',
    distance: '1.5 miles',
    hours: '9AM - 7PM',
    status: 'open',
    notes: 'Distributing ready-to-eat meals and water. No ID required.'
  },
  {
    id: '5',
    name: 'Urgent Care Clinic',
    type: 'hospital',
    address: '555 Medical Blvd, Southside',
    phone: '(555) 456-7890',
    distance: '0.9 miles',
    hours: '8AM - 10PM',
    status: 'limited',
    notes: 'Treating minor injuries and illnesses. Limited medication supply.'
  },
  {
    id: '6',
    name: 'Relief Supply Center',
    type: 'supplies',
    address: '888 Helper Ave, Downtown',
    phone: '(555) 567-8901',
    distance: '1.0 miles',
    hours: '8AM - 6PM',
    status: 'open',
    notes: 'Distributing cleaning supplies, hygiene kits, and bottled water.'
  }
];

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate loading resources
    setTimeout(() => {
      setResources(resourcesData);
      setFilteredResources(resourcesData);
    }, 500);
  }, []);

  useEffect(() => {
    let result = resources;
    
    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter(resource => resource.type === activeTab);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(resource => 
        resource.name.toLowerCase().includes(searchLower) || 
        resource.address.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredResources(result);
  }, [search, activeTab, resources]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'limited': return 'bg-orange-500';
      case 'closed': return 'bg-helper-red';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'shelter': return 'Shelter';
      case 'hospital': return 'Medical';
      case 'food': return 'Food';
      case 'supplies': return 'Supplies';
      default: return type;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Layout title="Resources">
      <div className="container mx-auto p-4 md:p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-10 bg-helper-darkgray border-helper-darkgray"
            placeholder="Search for resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList className="bg-helper-darkgray mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="shelter">Shelters</TabsTrigger>
            <TabsTrigger value="hospital">Medical</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="supplies">Supplies</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <Card 
                  key={resource.id} 
                  className="bg-helper-darkgray border-helper-darkgray hover:border-helper-red transition-colors cursor-pointer"
                  onClick={() => setSelectedResource(resource)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{resource.name}</h3>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(resource.status)}`} />
                        </div>
                        
                        <p className="text-sm text-gray-400 flex items-center gap-1 mb-1">
                          <MapPin size={12} /> {resource.address} ({resource.distance})
                        </p>
                        
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {resource.hours}
                        </p>
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(resource.type)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-helper-darkgray border-helper-darkgray">
                <CardContent className="p-6 text-center">
                  <MapPin className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No resources found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {selectedResource && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <Card className="bg-helper-darkgray border-helper-darkgray w-full max-w-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {selectedResource.name}
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedResource.status)}`} />
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setSelectedResource(null)}
                  >
                    ✕
                  </Button>
                </div>
                <Badge variant="outline" className="mt-2">
                  {getTypeLabel(selectedResource.type)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-helper-red mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{selectedResource.address}</p>
                      <p className="text-xs text-gray-400">{selectedResource.distance} away</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-helper-red flex-shrink-0" />
                    <p className="text-sm">{selectedResource.phone}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-helper-red flex-shrink-0" />
                    <p className="text-sm">{selectedResource.hours}</p>
                  </div>
                </div>
                
                {selectedResource.notes && (
                  <div className="bg-black/20 p-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-helper-red mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{selectedResource.notes}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // In a real app, this would use a mapping API
                      // For now, we'll just close the modal
                      setSelectedResource(null);
                    }}
                  >
                    Get Directions
                  </Button>
                  
                  <Button 
                    className="bg-helper-red hover:bg-red-700 text-white"
                    onClick={() => {
                      // In a real app, this would initiate a call
                      window.location.href = `tel:${selectedResource.phone.replace(/\D/g, '')}`;
                    }}
                  >
                    Call
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

export default Resources;
