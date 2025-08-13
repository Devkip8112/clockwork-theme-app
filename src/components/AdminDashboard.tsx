import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, Clock, Clock3, Clock9, Building2, Users, Activity, CheckCircle, UserPlus, FileText, Search, ArrowUpDown, Filter, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddEmployeeForm } from './AddEmployeeForm';
import { EmployeeDetailModal } from './EmployeeDetailModal';
// Mock employee data
const mockEmployees = [{
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  payType: 'hourly',
  totalHours: 42.5,
  clockEntries: [{
    id: 1,
    type: 'in' as const,
    timestamp: new Date('2024-01-15T09:00:00'),
    date: '2024-01-15'
  }, {
    id: 2,
    type: 'out' as const,
    timestamp: new Date('2024-01-15T17:30:00'),
    date: '2024-01-15'
  }, {
    id: 3,
    type: 'in' as const,
    timestamp: new Date('2024-01-14T08:45:00'),
    date: '2024-01-14'
  }, {
    id: 4,
    type: 'out' as const,
    timestamp: new Date('2024-01-14T17:00:00'),
    date: '2024-01-14'
  }]
}, {
  id: 2,
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '(555) 987-6543',
  payType: 'weekly',
  totalHours: 38.25,
  clockEntries: [{
    id: 5,
    type: 'in' as const,
    timestamp: new Date('2024-01-15T09:15:00'),
    date: '2024-01-15'
  }, {
    id: 6,
    type: 'out' as const,
    timestamp: new Date('2024-01-15T17:00:00'),
    date: '2024-01-15'
  }, {
    id: 7,
    type: 'in' as const,
    timestamp: new Date('2024-01-14T09:00:00'),
    date: '2024-01-14'
  }, {
    id: 8,
    type: 'out' as const,
    timestamp: new Date('2024-01-14T16:45:00'),
    date: '2024-01-14'
  }]
}, {
  id: 3,
  firstName: 'Mike',
  lastName: 'Johnson',
  email: 'mike.johnson@example.com',
  phone: '(555) 456-7890',
  payType: 'annually',
  totalHours: 45.0,
  clockEntries: [{
    id: 9,
    type: 'in' as const,
    timestamp: new Date('2024-01-15T08:30:00'),
    date: '2024-01-15'
  }, {
    id: 10,
    type: 'out' as const,
    timestamp: new Date('2024-01-15T18:00:00'),
    date: '2024-01-15'
  }, {
    id: 11,
    type: 'in' as const,
    timestamp: new Date('2024-01-14T08:30:00'),
    date: '2024-01-14'
  }, {
    id: 12,
    type: 'out' as const,
    timestamp: new Date('2024-01-14T17:30:00'),
    date: '2024-01-14'
  }]
}];
type SortField = 'name' | 'totalHours' | 'email';
type SortDirection = 'asc' | 'desc';
export const AdminDashboard: React.FC = () => {
  const {
    state,
    logout,
    clockIn,
    clockOut
  } = useApp();
  const {
    currentTheme
  } = useTheme();
  const {
    toast
  } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [timeFilter, setTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = mockEmployees.filter(employee => {
      const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
      const search = searchTerm.toLowerCase();
      const nameEmailMatch = fullName.includes(search) || employee.email.toLowerCase().includes(search);

      // Apply time filter
      if (!nameEmailMatch) return false;
      if (timeFilter === 'all') return true;
      const now = new Date();
      const filterDate = new Date();
      switch (timeFilter) {
        case 'today':
          return employee.clockEntries.some(entry => entry.date === now.toISOString().split('T')[0]);
        case 'yesterday':
          filterDate.setDate(now.getDate() - 1);
          return employee.clockEntries.some(entry => entry.date === filterDate.toISOString().split('T')[0]);
        case 'this-week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return employee.clockEntries.some(entry => new Date(entry.date) >= weekStart);
        case 'this-month':
          return employee.clockEntries.some(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
          });
        case 'custom':
          if (!startDate || !endDate) return true;
          return employee.clockEntries.some(entry => entry.date >= startDate && entry.date <= endDate);
        default:
          return true;
      }
    });
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      switch (sortField) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
          break;
        case 'totalHours':
          aValue = a.totalHours;
          bValue = b.totalHours;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        default:
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });
    return filtered;
  }, [searchTerm, sortField, sortDirection, timeFilter, startDate, endDate]);
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const getPayTypeBadgeVariant = (payType: string) => {
    switch (payType) {
      case 'hourly':
        return 'default';
      case 'weekly':
        return 'secondary';
      case 'annually':
        return 'outline';
      default:
        return 'default';
    }
  };
  const handleClockIn = () => {
    clockIn();
    toast({
      title: "Clocked In Successfully",
      description: `Welcome back, ${state.userName}!`,
      variant: "default"
    });
  };
  const handleClockOut = () => {
    clockOut();
    toast({
      title: "Clocked Out Successfully",
      description: "Have a great day!",
      variant: "default"
    });
  };
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "Session ended successfully",
      variant: "default"
    });
    logout();
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const lastClockEntry = state.clockEntries[0];
  const isCurrentlyClockedIn = lastClockEntry?.type === 'in';
  return <div className="min-h-screen bg-gradient-surface relative">
      {/* Add Employee Button - Fixed Corner */}
      <div className="fixed top-4 right-4 z-50">
        <Button onClick={() => setShowAddEmployee(true)} className="shadow-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Header */}
      <div className="bg-card shadow-elegant border-b border-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <img src={currentTheme.logo} alt={currentTheme.name} className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold text-foreground">{currentTheme.name}</h1>
              <p className="text-sm text-muted-foreground">Administrator Dashboard</p>
            </div>
          </div>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6 max-w-4xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {state.userName}
          </h2>
          <p className="text-lg text-muted-foreground">
            Property ID: <span className="font-mono font-semibold">{state.propertyId}</span>
          </p>
        </div>

        {/* Current time */}
        <div className="mb-8 text-center bg-card rounded-2xl p-6 shadow-elegant">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">CURRENT TIME</p>
            <p className="text-4xl font-bold font-mono text-primary">{formatTime(currentTime)}</p>
            <p className="text-sm text-muted-foreground">{formatDate(currentTime)}</p>
          </div>
        </div>

        {/* Status indicator */}
        {lastClockEntry && <div className="mb-8 flex justify-center">
            <div className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-elegant ${isCurrentlyClockedIn ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              <Activity className={`h-5 w-5 ${isCurrentlyClockedIn ? 'animate-pulse' : ''}`} />
              <span className="font-semibold">
                Currently {isCurrentlyClockedIn ? 'Clocked In' : 'Clocked Out'}
              </span>
              {isCurrentlyClockedIn && <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />}
            </div>
          </div>}

        {/* Employee Logs Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Employee Logs & Time Tracking
          </h3>
          
          {/* Search and Filter Bar */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search employees by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              
            </div>
            
            {/* Time Filter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Filter:</span>
              </div>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {timeFilter === 'custom' && <>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-auto" />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-auto" />
                  </div>
                </>}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg shadow-elegant border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('name')} className="h-auto p-0 font-medium hover:bg-transparent">
                      Employee
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Pay Type</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('totalHours')} className="h-auto p-0 font-medium hover:bg-transparent">
                      Total Hours
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEmployees.map(employee => <TableRow key={employee.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {employee.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{employee.email}</div>
                        <div className="text-muted-foreground">{employee.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPayTypeBadgeVariant(employee.payType)}>
                        {employee.payType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono font-medium">
                        {employee.totalHours}h
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>

            {filteredAndSortedEmployees.length === 0 && <div className="text-center py-8 text-muted-foreground">
                No employees found matching your search.
              </div>}
          </div>
        </div>

        {/* Clock In/Out Buttons */}
        <div className="mb-8 flex justify-center gap-4">
          <Button onClick={handleClockIn} disabled={isCurrentlyClockedIn} size="lg" className="px-8 py-4 text-lg">
            <Clock3 className="h-5 w-5 mr-2" />
            Clock In
          </Button>
          <Button onClick={handleClockOut} disabled={!isCurrentlyClockedIn} variant="outline" size="lg" className="px-8 py-4 text-lg">
            <Clock9 className="h-5 w-5 mr-2" />
            Clock Out
          </Button>
        </div>


        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Property</p>
            <p className="font-mono font-semibold">{state.propertyId}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="font-semibold capitalize">{state.userRole}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Entries</p>
            <p className="font-semibold">{state.clockEntries.length}</p>
          </div>
          
          <div className="bg-card rounded-xl p-4 text-center shadow-elegant">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-semibold text-success">Active</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeForm open={showAddEmployee} onOpenChange={setShowAddEmployee} />
      
      <EmployeeDetailModal employee={selectedEmployee} open={!!selectedEmployee} onOpenChange={open => !open && setSelectedEmployee(null)} />
    </div>;
};