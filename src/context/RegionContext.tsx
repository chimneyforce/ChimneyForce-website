import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

export interface RegionData {
  regionName: string;
  phoneNumbers: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface RegionContextType {
  region: RegionData;
  isNJ: boolean;
  isCT: boolean;
  isGlobal: boolean;
  statePrefix: string;
}

const HQ_DATA: RegionData = {
  regionName: 'CT & NJ',
  phoneNumbers: ['888-398-7707'],
  address: '750 MAIN STREET, SUITE 100',
  city: 'HARTFORD',
  state: 'CONNECTICUT',
  zip: '06103',
};

const CT_DATA: RegionData = {
  regionName: 'CT',
  phoneNumbers: ['203-350-0898'],
  address: '750 MAIN STREET, SUITE 100',
  city: 'HARTFORD',
  state: 'CONNECTICUT',
  zip: '06103',
};

const NJ_DATA: RegionData = {
  regionName: 'NJ',
  phoneNumbers: ['201-308-1211'],
  address: '122 N Troy Ave',
  city: 'Ventnor City',
  state: 'NJ',
  zip: '08406',
};

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const getRegionFromPath = (pathname: string) => {
  const path = pathname.toLowerCase();
  const isNewJersey = path.startsWith('/nj');
  const isConnecticut = path.startsWith('/ct');
  const isHomePage = path === '/';

  if (isHomePage) {
    return {
      region: HQ_DATA,
      isNJ: false,
      isCT: false,
      isGlobal: true,
      statePrefix: '',
    };
  } else if (isNewJersey) {
    return {
      region: NJ_DATA,
      isNJ: true,
      isCT: false,
      isGlobal: false,
      statePrefix: '/nj',
    };
  } else if (isConnecticut) {
    return {
      region: CT_DATA,
      isNJ: false,
      isCT: true,
      isGlobal: false,
      statePrefix: '/ct',
    };
  }

  return {
    region: HQ_DATA,
    isNJ: false,
    isCT: false,
    isGlobal: true,
    statePrefix: '',
  };
};

export const RegionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const regionData = useMemo(() => getRegionFromPath(location.pathname), [location.pathname]);

  return (
    <RegionContext.Provider value={regionData}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = (): RegionContextType => {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
};
