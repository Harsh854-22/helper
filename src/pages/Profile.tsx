
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Save, AlertCircle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MedicalInfo {
  conditions: string;
  medications: string;
  allergies: string;
  bloodType: string;
  notes: string;
}

interface ProfileInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalInfo: MedicalInfo;
}

const defaultProfile: ProfileInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  emergencyContact: '',
  medicalInfo: {
    conditions: '',
    medications: '',
    allergies: '',
    bloodType: '',
    notes: ''
  }
};

const Profile = () => {
  const [profile, setProfile] = useState<ProfileInfo>(defaultProfile);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('helper-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('helper-profile', JSON.stringify(profile));
    toast({
      title: "Profile saved",
      description: "Your profile information has been updated."
    });
  };

  const handleSaveMedical = () => {
    localStorage.setItem('helper-profile', JSON.stringify(profile));
    toast({
      title: "Medical information saved",
      description: "Your medical information has been updated."
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProfileInfo],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoading) {
    return (
      <Layout title="Profile">
        <div className="container mx-auto p-4 md:p-6 flex items-center justify-center min-h-[50vh]">
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="container mx-auto p-4 md:p-6">
        <Tabs defaultValue="personal">
          <TabsList className="bg-helper-darkgray mb-6">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="medical">Medical Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card className="bg-helper-darkgray border-helper-darkgray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-helper-red" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  This information will be used in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    className="bg-helper-black border-helper-darkgray"
                    placeholder="Your full name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    className="bg-helper-black border-helper-darkgray"
                    placeholder="Your phone number"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    className="bg-helper-black border-helper-darkgray"
                    placeholder="Your email address"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Home Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    className="bg-helper-black border-helper-darkgray"
                    placeholder="Your home address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Primary Emergency Contact</Label>
                  <Input 
                    id="emergencyContact"
                    name="emergencyContact"
                    className="bg-helper-black border-helper-darkgray"
                    placeholder="Name and phone number"
                    value={profile.emergencyContact}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    className="bg-helper-red hover:bg-red-700 text-white"
                    onClick={handleSaveProfile}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Information
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 p-4 border border-helper-red/30 rounded-md bg-helper-red/5">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-helper-red flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Why provide this information?</h3>
                  <p className="text-sm text-gray-400">
                    Your profile information helps emergency responders identify and assist you during a disaster. 
                    This data is stored locally on your device and is not shared unless you choose to do so.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medical">
            <Card className="bg-helper-darkgray border-helper-darkgray">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-helper-red" />
                  Medical Information
                </CardTitle>
                <CardDescription>
                  Critical health information for emergency situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea 
                    id="medicalConditions"
                    name="medicalInfo.conditions"
                    className="bg-helper-black border-helper-darkgray min-h-[80px]"
                    placeholder="List any medical conditions"
                    value={profile.medicalInfo.conditions}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea 
                    id="medications"
                    name="medicalInfo.medications"
                    className="bg-helper-black border-helper-darkgray min-h-[80px]"
                    placeholder="List medications and dosages"
                    value={profile.medicalInfo.medications}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea 
                    id="allergies"
                    name="medicalInfo.allergies"
                    className="bg-helper-black border-helper-darkgray"
                    placeholder="List any allergies or sensitivities"
                    value={profile.medicalInfo.allergies}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <select 
                    id="bloodType"
                    name="medicalInfo.bloodType"
                    className="w-full rounded-md bg-helper-black border-helper-darkgray p-2"
                    value={profile.medicalInfo.bloodType}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      medicalInfo: {
                        ...prev.medicalInfo,
                        bloodType: e.target.value
                      }
                    }))}
                  >
                    <option value="">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes">Additional Notes</Label>
                  <Textarea 
                    id="medicalNotes"
                    name="medicalInfo.notes"
                    className="bg-helper-black border-helper-darkgray min-h-[80px]"
                    placeholder="Any other important medical information"
                    value={profile.medicalInfo.notes}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    className="bg-helper-red hover:bg-red-700 text-white"
                    onClick={handleSaveMedical}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Medical Info
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 p-4 border border-helper-red/30 rounded-md bg-helper-red/5">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-helper-red flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Medical Information Privacy</h3>
                  <p className="text-sm text-gray-400">
                    Your medical information is stored locally on your device. In an emergency, this information 
                    can be critical for first responders. Consider creating a medical ID card with this information.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
