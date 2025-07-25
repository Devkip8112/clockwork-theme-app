import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'employee' | null;
export type AppScreen = 'welcome' | 'admin-login' | 'admin-dashboard' | 'employee-login' | 'employee-dashboard';

export interface ClockEntry {
  id: string;
  timestamp: Date;
  type: 'in' | 'out';
  userId: string;
  userName: string;
}

export interface AppState {
  currentScreen: AppScreen;
  userRole: UserRole;
  isLoggedIn: boolean;
  userId: string | null;
  userName: string | null;
  propertyId: string | null;
  clockEntries: ClockEntry[];
  isLoading: boolean;
}

interface AppContextType {
  state: AppState;
  setScreen: (screen: AppScreen) => void;
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
    
    // Mock employee data based on access code
    const employeeName = `Employee ${accessCode.slice(0, 2)}${accessCode.slice(-2)}`;
    
    setState(prev => ({
      ...prev,
      userRole: 'employee',
      isLoggedIn: true,
      userId: `emp_${accessCode}`,
      userName: employeeName,
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