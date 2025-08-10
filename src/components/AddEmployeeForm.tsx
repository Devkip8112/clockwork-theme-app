import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  payType: string;
  payAmount: string;
  ssn: string;
}

interface AddEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    payType: '',
    payAmount: '',
    ssn: ''
  });

  const [errors, setErrors] = useState<Partial<EmployeeFormData>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors: Partial<EmployeeFormData> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.ssn.trim()) newErrors.ssn = 'SSN is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Mock submission - in real app this would save to database
    toast({
      title: "Employee Added Successfully",
      description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
      variant: "default"
    });

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      payType: '',
      payAmount: '',
      ssn: ''
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Employee
          </DialogTitle>
          <DialogDescription>
            Enter employee information. Required fields are marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'border-destructive' : ''}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'border-destructive' : ''}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={errors.phoneNumber ? 'border-destructive' : ''}
              placeholder="(555) 123-4567"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pay Type */}
            <div className="space-y-2">
              <Label htmlFor="payType">Pay Type (Optional)</Label>
              <Select value={formData.payType} onValueChange={(value) => handleInputChange('payType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pay type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pay Amount */}
            <div className="space-y-2">
              <Label htmlFor="payAmount">Pay Amount (Optional)</Label>
              <Input
                id="payAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.payAmount}
                onChange={(e) => handleInputChange('payAmount', e.target.value)}
                placeholder="Enter amount"
              />
              <p className="text-xs text-muted-foreground">
                {formData.payType === 'hourly' ? 'Per hour rate' : 
                 formData.payType === 'weekly' ? 'Weekly salary' :
                 formData.payType === 'annually' ? 'Annual salary' : 
                 'Pay amount'}
              </p>
            </div>
          </div>

          {/* SSN */}
          <div className="space-y-2">
            <Label htmlFor="ssn">Social Security Number *</Label>
            <Input
              id="ssn"
              type="password"
              value={formData.ssn}
              onChange={(e) => handleInputChange('ssn', e.target.value)}
              className={errors.ssn ? 'border-destructive' : ''}
              placeholder="XXX-XX-XXXX"
              maxLength={11}
            />
            {errors.ssn && (
              <p className="text-sm text-destructive">{errors.ssn}</p>
            )}
            <p className="text-xs text-muted-foreground">
              SSN will be securely hashed and stored
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};