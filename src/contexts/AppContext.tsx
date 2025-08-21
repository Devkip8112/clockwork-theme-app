import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'employee' | null;
export type AppScreen = 'welcome' | 'admin-registration' | 'admin-login' | 'admin-dashboard' | 'employee-login' | 'employee-dashboard';

export interface ClockEntry {
  id: string;
  timestamp: Date;
  type: 'in' | 'out';
  userId: string;
  userName: string;
}

export interface AdminRegistrationData {
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  brandTheme: string;
}

export interface AppState {
  currentScreen: AppScreen;
  userRole: UserRole;
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  propertyId: string | null;
  adminData: AdminRegistrationData | null;
  clockEntries: ClockEntry[];
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  setScreen: (screen: AppScreen) => void;
  registerAdmin: (data: AdminRegistrationData) => Promise<void>;
  loginAdmin: (propertyId: string) => void;
  loginEmployee: (accessCode: string) => void;
  logout: () => void;
  clockIn: () => void;
  clockOut: () => void;
  setLoading: (loading: boolean) => void;
}

const initialState: AppState = {
  currentScreen: 'welcome',
  userRole: null,
  isLoggedIn: false,
  userId: null,
  userName: null,
  propertyId: null,
  adminData: null,
  clockEntries: [],
  isLoading: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setScreen = (screen: AppScreen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  };

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const registerAdmin = async (data: AdminRegistrationData) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setState(prev => ({
      ...prev,
      adminData: data,
      currentScreen: 'admin-dashboard',
      userRole: 'admin',
      isLoggedIn: true,
      propertyId: data.propertyId,
      userId: `admin_${data.propertyId}`,
      userName: data.name,
      isLoading: false
    }));
  };

  const loginAdmin = async (propertyId: string) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setState(prev => ({
      ...prev,
      userRole: 'admin',
      isLoggedIn: true,
      propertyId,
      userId: `admin_${propertyId}`,
      userName: 'Administrator',
      currentScreen: 'admin-dashboard',
      isLoading: false
    }));
  };

  const loginEmployee = async (accessCode: string) => {
    setLoading(true);
    
    // Simulate API call and employee lookup
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Valid mock employee codes
    const validCodes = ['123456', '122334', '135798'];
    
    if (!validCodes.includes(accessCode)) {
      setLoading(false);
      throw new Error('Invalid access code');
    }
    
    // Mock employee data based on access code
    const employeeNames: { [key: string]: string } = {
      '123456': 'John Smith',
      '122334': 'Sarah Johnson', 
      '135798': 'Mike Chen'
    };

    setState(prev => ({
      ...prev,
      userRole: 'employee',
      isLoggedIn: true,
      userId: `emp_${accessCode}`,
      userName: employeeNames[accessCode],
      currentScreen: 'employee-dashboard',
      isLoading: false
    }));
  };

  const logout = () => {
    setState(initialState);
  };

  const clockIn = () => {
    if (!state.userId || !state.userName) return;
    
    const newEntry: ClockEntry = {
      id: `${Date.now()}_in`,
      timestamp: new Date(),
      type: 'in',
      userId: state.userId,
      userName: state.userName
    };

    setState(prev => ({
      ...prev,
      clockEntries: [newEntry, ...prev.clockEntries]
    }));
  };

  const clockOut = () => {
    if (!state.userId || !state.userName) return;
    
    const newEntry: ClockEntry = {
      id: `${Date.now()}_out`,
      timestamp: new Date(),
      type: 'out',
      userId: state.userId,
      userName: state.userName
    };

    setState(prev => ({
      ...prev,
      clockEntries: [newEntry, ...prev.clockEntries]
    }));
  };

  // Auto-logout for employee "Done" flow
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (state.userRole === 'employee' && state.currentScreen === 'employee-dashboard') {
      // Set a longer timeout for demo purposes (30 seconds instead of 1 minute)
      timeoutId = setTimeout(() => {
        logout();
      }, 30000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.userRole, state.currentScreen]);

  return (
    <AppContext.Provider value={{
      state,
      setScreen,
      registerAdmin,
      loginAdmin,
      loginEmployee,
      logout,
      clockIn,
      clockOut,
      setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};