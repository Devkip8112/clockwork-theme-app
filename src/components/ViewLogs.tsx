import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown, Clock, ChevronDown, ChevronUp, Filter, Calendar } from 'lucide-react';

// Mock employee data
const mockEmployees = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    payType: 'hourly',
    totalHours: 42.5,
    clockEntries: [
      { id: 1, type: 'in', timestamp: new Date('2024-01-15T09:00:00'), date: '2024-01-15' },
      { id: 2, type: 'out', timestamp: new Date('2024-01-15T17:30:00'), date: '2024-01-15' },
      { id: 3, type: 'in', timestamp: new Date('2024-01-14T08:45:00'), date: '2024-01-14' },
      { id: 4, type: 'out', timestamp: new Date('2024-01-14T17:00:00'), date: '2024-01-14' },
    ]
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    payType: 'weekly',
    totalHours: 38.25,
    clockEntries: [
      { id: 5, type: 'in', timestamp: new Date('2024-01-15T09:15:00'), date: '2024-01-15' },
      { id: 6, type: 'out', timestamp: new Date('2024-01-15T17:00:00'), date: '2024-01-15' },
      { id: 7, type: 'in', timestamp: new Date('2024-01-14T09:00:00'), date: '2024-01-14' },
      { id: 8, type: 'out', timestamp: new Date('2024-01-14T16:45:00'), date: '2024-01-14' },
    ]
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '(555) 456-7890',
    payType: 'annually',
    totalHours: 45.0,
    clockEntries: [
      { id: 9, type: 'in', timestamp: new Date('2024-01-15T08:30:00'), date: '2024-01-15' },
      { id: 10, type: 'out', timestamp: new Date('2024-01-15T18:00:00'), date: '2024-01-15' },
      { id: 11, type: 'in', timestamp: new Date('2024-01-14T08:30:00'), date: '2024-01-14' },
      { id: 12, type: 'out', timestamp: new Date('2024-01-14T17:30:00'), date: '2024-01-14' },
    ]
  }
];

interface ViewLogsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SortField = 'name' | 'totalHours' | 'email';
type SortDirection = 'asc' | 'desc';

export const ViewLogs: React.FC<ViewLogsProps> = ({ open, onOpenChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<number | null>(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
          return employee.clockEntries.some(entry => 
            entry.date === now.toISOString().split('T')[0]
          );
        case 'yesterday':
          filterDate.setDate(now.getDate() - 1);
          return employee.clockEntries.some(entry => 
            entry.date === filterDate.toISOString().split('T')[0]
          );
        case 'this-week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return employee.clockEntries.some(entry => 
            new Date(entry.date) >= weekStart
          );
        case 'this-month':
          return employee.clockEntries.some(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === now.getMonth() && 
                   entryDate.getFullYear() === now.getFullYear();
          });
        case 'custom':
          if (!startDate || !endDate) return true;
          return employee.clockEntries.some(entry => 
            entry.date >= startDate && entry.date <= endDate
          );
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
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPayTypeBadgeVariant = (payType: string) => {
    switch (payType) {
      case 'hourly': return 'default';
      case 'weekly': return 'secondary';
      case 'annually': return 'outline';
      default: return 'default';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Employee Logs & Time Tracking
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search and Filter Bar */}
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  {filteredAndSortedEmployees.length} employees
                </Badge>
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
                
                {timeFilter === 'custom' && (
                  <>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-auto"
                      />
                      <span className="text-sm text-muted-foreground">to</span>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-auto"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Employee
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Pay Type</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort('totalHours')}
                        className="h-auto p-0 font-medium hover:bg-transparent"
                      >
                        Total Hours
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedEmployees.map((employee) => (
                    <React.Fragment key={employee.id}>
                      <TableRow className="hover:bg-muted/50">
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setExpandedEmployeeId(
                                expandedEmployeeId === employee.id ? null : employee.id
                              );
                            }}
                          >
                            {expandedEmployeeId === employee.id ? (
                              <ChevronUp className="h-4 w-4 mr-2" />
                            ) : (
                              <ChevronDown className="h-4 w-4 mr-2" />
                            )}
                            {expandedEmployeeId === employee.id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </TableCell>
                      </TableRow>
                      
                      {expandedEmployeeId === employee.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-muted/20 p-6">
                            <div className="space-y-6">
                              {/* Employee Info */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Full Name</p>
                                    <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{employee.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{employee.phone}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Clock Entries */}
                              <div>
                                <h3 className="text-lg font-semibold mb-4">Clock In/Out History</h3>
                                <div className="space-y-3">
                                  {employee.clockEntries.map((entry) => (
                                    <div key={entry.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                          entry.type === 'in' ? 'bg-green-500' : 'bg-orange-500'
                                        }`} />
                                        <span className="font-medium">
                                          {entry.type === 'in' ? 'Clocked In' : 'Clocked Out'}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="font-mono font-medium">
                                          {formatTime(entry.timestamp)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {formatDate(entry.timestamp)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              {filteredAndSortedEmployees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found matching your search.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
};