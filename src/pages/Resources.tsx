
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Info, 
  Search, 
  Plus, 
  Trash2, 
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Resource } from '@/types';

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    type: 'shelter',
    name: '',
    address: '',
    phone: '',
    distance: '',
    hours: '',
    status: 'open'
  });
  const { toast } = useToast();

  // Initial resources data
  const initialResources: Resource[] = [
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

  // Load resources from localStorage or use initial data
  useEffect(() => {
    const savedResources = localStorage.getItem('helper-resources');
    if (savedResources) {
      const parsedResources = JSON.parse(savedResources);
      setResources(parsedResources);
      setFilteredResources(parsedResources);
    } else {
      setResources(initialResources);
      setFilteredResources(initialResources);
    }
  }, []);

  // Save resources to localStorage when they change
  useEffect(() => {
    if (resources.length > 0) {
      localStorage.setItem('helper-resources', JSON.stringify(resources));
    }
  }, [resources]);

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

  const handleAddResource = () => {
    // Validate form
    if (!newResource.name || !newResource.address || !newResource.phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    // Create new resource
    const resource: Resource = {
      id: Date.now().toString(),
      name: newResource.name || '',
      type: newResource.type as 'shelter' | 'hospital' | 'food' | 'supplies',
      address: newResource.address || '',
      phone: newResource.phone || '',
      distance: newResource.distance || '0.0 miles',
      hours: newResource.hours || '',
      status: newResource.status as 'open' | 'closed' | 'limited',
      notes: newResource.notes || '',
    };
    
    // Add to resources
    setResources(prevResources => [...prevResources, resource]);
    
    // Reset form and close dialog
    setNewResource({
      type: 'shelter',
      name: '',
      address: '',
      phone: '',
      distance: '',
      hours: '',
      status: 'open'
    });
    setIsAddingResource(false);
    
    toast({
      title: "Resource added",
      description: "New resource has been added successfully.",
    });
  };

  const handleDeleteResource = (id: string) => {
    setResources(prevResources => prevResources.filter(resource => resource.id !== id));
    setSelectedResource(null);
    
    toast({
      title: "Resource deleted",
      description: "The resource has been removed.",
    });
  };

  return (
    <Layout title="Resources">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 bg-helper-darkgray border-helper-darkgray"
              placeholder="Search for resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsAddingResource(true)}
            className="ml-2 flex items-center gap-1"
          >
            <Plus size={16} />
            Add Resource
          </Button>
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
        
        {/* Resource Detail Dialog */}
        {selectedResource && (
          <Dialog open={!!selectedResource} onOpenChange={(open) => !open && setSelectedResource(null)}>
            <DialogContent className="bg-helper-darkgray border-helper-darkgray w-full max-w-md">
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <DialogTitle className="flex items-center gap-2">
                    {selectedResource.name}
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(selectedResource.status)}`} />
                  </DialogTitle>
                </div>
                <Badge variant="outline" className="mt-2">
                  {getTypeLabel(selectedResource.type)}
                </Badge>
              </DialogHeader>
              
              <div className="space-y-4">
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
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteResource(selectedResource.id)}
                  >
                    <Trash2 size={16} />
                    Delete
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
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Add Resource Dialog */}
        <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
          <DialogContent className="bg-helper-darkgray border-helper-darkgray max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>Add a new emergency resource to help people in need.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resource-type">Resource Type</Label>
                <Select 
                  value={newResource.type} 
                  onValueChange={value => setNewResource({...newResource, type: value as 'shelter' | 'hospital' | 'food' | 'supplies'})}
                >
                  <SelectTrigger className="bg-helper-black border-helper-darkgray">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shelter">Shelter</SelectItem>
                    <SelectItem value="hospital">Medical</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-name">Name</Label>
                <Input 
                  id="resource-name" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newResource.name}
                  onChange={e => setNewResource({...newResource, name: e.target.value})}
                  placeholder="Resource name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-address">Address</Label>
                <Input 
                  id="resource-address" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newResource.address}
                  onChange={e => setNewResource({...newResource, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-phone">Phone Number</Label>
                <Input 
                  id="resource-phone" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newResource.phone}
                  onChange={e => setNewResource({...newResource, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-distance">Distance</Label>
                <Input 
                  id="resource-distance" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newResource.distance}
                  onChange={e => setNewResource({...newResource, distance: e.target.value})}
                  placeholder="e.g. 1.2 miles"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-hours">Operating Hours</Label>
                <Input 
                  id="resource-hours" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newResource.hours}
                  onChange={e => setNewResource({...newResource, hours: e.target.value})}
                  placeholder="e.g. Open 24/7 or 9AM - 5PM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-status">Status</Label>
                <Select 
                  value={newResource.status} 
                  onValueChange={value => setNewResource({...newResource, status: value as 'open' | 'closed' | 'limited'})}
                >
                  <SelectTrigger className="bg-helper-black border-helper-darkgray">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resource-notes">Additional Notes</Label>
                <Textarea 
                  id="resource-notes" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newResource.notes}
                  onChange={e => setNewResource({...newResource, notes: e.target.value})}
                  placeholder="Any additional information about this resource"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingResource(false)}>Cancel</Button>
              <Button 
                className="bg-helper-red hover:bg-red-700 text-white"
                onClick={handleAddResource}
              >
                Add Resource
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Resources;
