import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, User, Plus, Search, Trash2, Edit, X, Save, UserCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/types';

const emergencyServices: Contact[] = [
  { id: 'emergency-1', name: 'Emergency Services', phone: '911', type: 'emergency', notes: 'For immediate life-threatening emergencies' },
  { id: 'emergency-2', name: 'Police Department', phone: '(555) 123-4567', type: 'emergency', notes: 'For non-emergency police assistance' },
  { id: 'emergency-3', name: 'Fire Department', phone: '(555) 234-5678', type: 'emergency', notes: 'For non-emergency fire assistance' },
  { id: 'emergency-4', name: 'Poison Control', phone: '(800) 222-1222', type: 'emergency', notes: 'For poison emergencies and information' },
];

const defaultContacts: Contact[] = [
  { id: '1', name: 'John Smith', phone: '(555) 345-6789', type: 'family', notes: 'Primary emergency contact' },
  { id: '2', name: 'Sarah Johnson', phone: '(555) 456-7890', type: 'friend', notes: 'Lives nearby, has spare key' },
  { id: '3', name: 'Dr. Wilson', phone: '(555) 567-8901', type: 'medical', notes: 'Primary care physician' },
];

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({ type: 'other' });
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem('helper-contacts');
    if (savedContacts) {
      setContacts([...emergencyServices, ...JSON.parse(savedContacts)]);
    } else {
      // Use default contacts if none saved
      setContacts([...emergencyServices, ...defaultContacts]);
      localStorage.setItem('helper-contacts', JSON.stringify(defaultContacts));
    }
  }, []);

  useEffect(() => {
    let result = contacts;
    
    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter(contact => contact.type === activeTab);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) || 
        contact.phone.includes(search) ||
        (contact.notes && contact.notes.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredContacts(result);
  }, [search, activeTab, contacts]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'emergency': return 'Emergency';
      case 'family': return 'Family';
      case 'friend': return 'Friend';
      case 'medical': return 'Medical';
      case 'other': return 'Other';
      default: return type;
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both name and phone number."
      });
      return;
    }

    const contact: Contact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      type: newContact.type as 'emergency' | 'family' | 'friend' | 'medical' | 'other',
      notes: newContact.notes
    };

    const userContacts = contacts.filter(c => !emergencyServices.some(es => es.id === c.id));
    const updatedContacts = [...userContacts, contact];
    
    setContacts([...emergencyServices, ...updatedContacts]);
    localStorage.setItem('helper-contacts', JSON.stringify(updatedContacts));
    
    setNewContact({ type: 'other' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Contact added",
      description: `${contact.name} has been added to your contacts.`
    });
  };

  const handleEditContact = () => {
    if (!currentContact || !currentContact.name || !currentContact.phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both name and phone number."
      });
      return;
    }

    // Don't allow editing emergency services
    if (emergencyServices.some(es => es.id === currentContact.id)) {
      setIsEditDialogOpen(false);
      return;
    }

    const userContacts = contacts.filter(c => !emergencyServices.some(es => es.id === c.id));
    const updatedUserContacts = userContacts.map(c => 
      c.id === currentContact.id ? currentContact : c
    );
    
    setContacts([...emergencyServices, ...updatedUserContacts]);
    localStorage.setItem('helper-contacts', JSON.stringify(updatedUserContacts));
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Contact updated",
      description: `${currentContact.name} has been updated.`
    });
  };

  const handleDeleteContact = () => {
    if (!currentContact) return;

    // Don't allow deleting emergency services
    if (emergencyServices.some(es => es.id === currentContact.id)) {
      setIsDeleteDialogOpen(false);
      return;
    }

    const userContacts = contacts.filter(c => !emergencyServices.some(es => es.id === c.id));
    const updatedUserContacts = userContacts.filter(c => c.id !== currentContact.id);
    
    setContacts([...emergencyServices, ...updatedUserContacts]);
    localStorage.setItem('helper-contacts', JSON.stringify(updatedUserContacts));
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Contact deleted",
      description: `${currentContact.name} has been removed from your contacts.`
    });
  };

  const isEmergencyService = (id: string) => {
    return emergencyServices.some(es => es.id === id);
  };

  return (
    <Layout title="Contacts">
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10 bg-helper-darkgray border-helper-darkgray"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Button 
            className="bg-helper-red hover:bg-red-700 text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Contact
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="bg-helper-darkgray mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="friend">Friends</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const isEmergency = isEmergencyService(contact.id);
                
                return (
                  <Card 
                    key={contact.id} 
                    className={`${isEmergency ? 'bg-helper-red/10' : 'bg-helper-darkgray'} border-helper-darkgray hover:border-helper-red transition-colors`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-helper-darkgray rounded-full p-2 mt-1">
                            <UserCircle className={`h-6 w-6 ${isEmergency ? 'text-helper-red' : 'text-gray-400'}`} />
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{contact.name}</h3>
                            <p className="text-sm text-gray-400">{contact.phone}</p>
                            
                            {contact.notes && (
                              <p className="text-xs text-gray-400 mt-1">{contact.notes}</p>
                            )}
                            
                            <div className="mt-2">
                              <span className="text-xs bg-helper-darkgray px-2 py-1 rounded-full">
                                {getTypeLabel(contact.type)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-helper-red" 
                            onClick={() => {
                              window.location.href = `tel:${contact.phone.replace(/\D/g, '')}`;
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          
                          {!isEmergency && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => {
                                  setCurrentContact(contact);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-helper-red"
                                onClick={() => {
                                  setCurrentContact(contact);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="bg-helper-darkgray border-helper-darkgray">
                <CardContent className="p-6 text-center">
                  <User className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No contacts found</h3>
                  <p className="text-gray-400">Try adjusting your search or filter</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Add Contact Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-helper-darkgray border-helper-darkgray sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newContact.name || ''}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newContact.phone || ''}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Contact Type</Label>
                <select 
                  id="type"
                  className="w-full rounded-md bg-helper-black border-helper-darkgray p-2"
                  value={newContact.type}
                  onChange={(e) => setNewContact({...newContact, type: e.target.value as any})}
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input 
                  id="notes" 
                  className="bg-helper-black border-helper-darkgray"
                  value={newContact.notes || ''}
                  onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="gap-1">
                  <X size={16} /> Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                className="bg-helper-red hover:bg-red-700 text-white gap-1"
                onClick={handleAddContact}
              >
                <Save size={16} /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Contact Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-helper-darkgray border-helper-darkgray sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input 
                  id="edit-name" 
                  className="bg-helper-black border-helper-darkgray"
                  value={currentContact?.name || ''}
                  onChange={(e) => setCurrentContact(curr => curr ? {...curr, name: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input 
                  id="edit-phone" 
                  className="bg-helper-black border-helper-darkgray"
                  value={currentContact?.phone || ''}
                  onChange={(e) => setCurrentContact(curr => curr ? {...curr, phone: e.target.value} : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Contact Type</Label>
                <select 
                  id="edit-type"
                  className="w-full rounded-md bg-helper-black border-helper-darkgray p-2"
                  value={currentContact?.type}
                  onChange={(e) => setCurrentContact(curr => curr ? {...curr, type: e.target.value as any} : null)}
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Input 
                  id="edit-notes" 
                  className="bg-helper-black border-helper-darkgray"
                  value={currentContact?.notes || ''}
                  onChange={(e) => setCurrentContact(curr => curr ? {...curr, notes: e.target.value} : null)}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="gap-1">
                  <X size={16} /> Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                className="bg-helper-red hover:bg-red-700 text-white gap-1"
                onClick={handleEditContact}
              >
                <Save size={16} /> Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Contact Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-helper-darkgray border-helper-darkgray sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Contact</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p>Are you sure you want to delete {currentContact?.name}?</p>
              <p className="text-sm text-gray-400 mt-2">This action cannot be undone.</p>
            </div>
            
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="gap-1">
                  <X size={16} /> Cancel
                </Button>
              </DialogClose>
              <Button 
                variant="destructive"
                className="gap-1"
                onClick={handleDeleteContact}
              >
                <Trash2 size={16} /> Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Contacts;
