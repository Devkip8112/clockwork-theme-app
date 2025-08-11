import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ClockEntry {
  id: number;
  type: 'in' | 'out';
  timestamp: Date;
  date: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  payType: string;
  totalHours: number;
  clockEntries: ClockEntry[];
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  open,
  onOpenChange
}) => {
  if (!employee) return null;

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Employee Details - {employee.firstName} {employee.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Employee Info */}
          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee.id}</p>
              </div>
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
              <div>
                <p className="text-sm text-muted-foreground">Pay Type</p>
                <Badge variant={getPayTypeBadgeVariant(employee.payType)}>
                  {employee.payType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="font-mono font-medium text-lg">{employee.totalHours}h</p>
              </div>
            </div>
          </div>

          {/* Clock Entries */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Clock In/Out History</h3>
            <div className="space-y-3 max-h-96 overflow-auto">
              {employee.clockEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No clock entries found for this employee.
                </div>
              ) : (
                employee.clockEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-card border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        entry.type === 'in' ? 'bg-success' : 'bg-warning'
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
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};