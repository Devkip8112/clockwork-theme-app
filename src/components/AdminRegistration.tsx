import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

export const AdminRegistration: React.FC = () => {
  const { state, setScreen, registerAdmin } = useApp();
  const { themes } = useTheme();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    brandTheme: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.propertyId || !formData.brandTheme) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerAdmin(formData);
      toast({
        title: "Registration Successful",
        description: "Admin account has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant border-border/50">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setScreen('welcome')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Admin Registration
            </CardTitle>
            <div className="w-10" />
          </div>
          <p className="text-muted-foreground">
            Create your admin account and set up your property
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyId">Property ID</Label>
              <Input
                id="propertyId"
                type="text"
                placeholder="Enter unique property ID"
                value={formData.propertyId}
                onChange={(e) => handleInputChange('propertyId', e.target.value)}
                className="bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                This will be your unique property identifier
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandTheme">Brand Theme</Label>
              <Select value={formData.brandTheme} onValueChange={(value) => handleInputChange('brandTheme', value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select your brand theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                        <span>{theme.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This will set the theme for your employee clock-in system
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={state.isLoading}
            >
              {state.isLoading ? 'Creating Account...' : 'Create Admin Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};