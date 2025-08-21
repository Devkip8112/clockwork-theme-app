interface ClockEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'clock-in' | 'clock-out';
  timestamp: string;
  synced: boolean;
  propertyId: string;
}

interface Employee {
  id: string;
  name: string;
  propertyId: string;
  isActive: boolean;
}

// Simple localStorage-based offline storage
const STORAGE_KEYS = {
  CLOCK_ENTRIES: 'timetracker-clock-entries',
  EMPLOYEES: 'timetracker-employees',
  LAST_SYNC: 'timetracker-last-sync'
};

export const storeClockEntry = async (entry: Omit<ClockEntry, 'synced'>) => {
  const clockEntry: ClockEntry = { ...entry, synced: false };
  
  const stored = localStorage.getItem(STORAGE_KEYS.CLOCK_ENTRIES);
  const entries: ClockEntry[] = stored ? JSON.parse(stored) : [];
  
  entries.push(clockEntry);
  localStorage.setItem(STORAGE_KEYS.CLOCK_ENTRIES, JSON.stringify(entries));
  
  return clockEntry;
};

export const getUnsyncedEntries = async (): Promise<ClockEntry[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.CLOCK_ENTRIES);
  if (!stored) return [];
  
  const entries: ClockEntry[] = JSON.parse(stored);
  return entries.filter(entry => !entry.synced);
};

export const markEntrySynced = async (entryId: string) => {
  const stored = localStorage.getItem(STORAGE_KEYS.CLOCK_ENTRIES);
  if (!stored) return;
  
  const entries: ClockEntry[] = JSON.parse(stored);
  const updatedEntries = entries.map(entry => 
    entry.id === entryId ? { ...entry, synced: true } : entry
  );
  
  localStorage.setItem(STORAGE_KEYS.CLOCK_ENTRIES, JSON.stringify(updatedEntries));
};

export const storeEmployees = async (employees: Employee[]) => {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
};

export const getStoredEmployees = async (): Promise<Employee[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
  return stored ? JSON.parse(stored) : [];
};

export const syncOfflineData = async () => {
  if (!navigator.onLine) return;

  const unsyncedEntries = await getUnsyncedEntries();
  
  for (const entry of unsyncedEntries) {
    try {
      // Here you would normally send to your backend API
      // For now, we'll just mark as synced after a delay
      await new Promise(resolve => setTimeout(resolve, 100));
      await markEntrySynced(entry.id);
      console.log(`Synced entry: ${entry.id}`);
    } catch (error) {
      console.error(`Failed to sync entry ${entry.id}:`, error);
    }
  }
  
  // Store last sync time
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
};

export const getLastSyncTime = (): Date | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  return stored ? new Date(stored) : null;
};