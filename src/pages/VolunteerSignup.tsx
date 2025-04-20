import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, Clock, MapPin, User, Mail, Phone, Home } from 'lucide-react';

const VolunteerSignup = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    skills: '',
    availability: '',
    interests: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/xwplqjjz", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Thank you!",
          description: "Your volunteer application has been submitted successfully."
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          skills: '',
          availability: '',
          interests: '',
          message: ''
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your form. Please try again later."
      });
    }
  };

  return (
    <Layout title="Volunteer Signup">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-helper-darkgray border-helper-darkgray">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Volunteer Sign-Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-8 text-center">
              <p className="text-gray-300 mb-6">
                Join our disaster relief team and contribute to making a positive impact in your community. 
                Your help can save lives and support those affected by natural disasters!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col items-center p-4 bg-helper-black rounded-lg">
                  <Clock className="h-8 w-8 mb-2 text-helper-red" />
                  <p className="text-sm">Flexible volunteer opportunities</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-helper-black rounded-lg">
                  <User className="h-8 w-8 mb-2 text-helper-red" />
                  <p className="text-sm">Training and support provided</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-helper-black rounded-lg">
                  <MapPin className="h-8 w-8 mb-2 text-helper-red" />
                  <p className="text-sm">Make a real difference</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="bg-helper-black border-helper-darkgray"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="bg-helper-black border-helper-darkgray"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="bg-helper-black border-helper-darkgray"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <Home className="h-4 w-4" /> Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    className="bg-helper-black border-helper-darkgray"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Skills/Expertise
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    className="bg-helper-black border-helper-darkgray"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Medical, Construction, Counseling, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability" className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Availability
                  </Label>
                  <Input
                    id="availability"
                    name="availability"
                    className="bg-helper-black border-helper-darkgray"
                    value={formData.availability}
                    onChange={handleChange}
                    placeholder="Weekdays, Weekends, Full-time, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Areas of Interest</Label>
                <Input
                  id="interests"
                  name="interests"
                  className="bg-helper-black border-helper-darkgray"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="Search & Rescue, First Aid, Food Distribution, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Why do you want to volunteer with us?</Label>
                <Textarea
                  id="message"
                  name="message"
                  className="bg-helper-black border-helper-darkgray min-h-[120px]"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="bg-helper-red hover:bg-red-700 text-white px-8 py-6 text-lg"
                >
                  Submit Volunteer Application
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VolunteerSignup;