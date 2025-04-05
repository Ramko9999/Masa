import React, { createContext, ReactNode, useContext, useState, useRef } from 'react';

type TabBarVisibilityContextType = {
  isTabBarVisible: boolean;
  showTabBar: () => void;
  hideTabBar: () => void;
  toggleTabBarVisibility: (visible: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextType>({
  isTabBarVisible: true,
  showTabBar: () => {},
  hideTabBar: () => {},
  toggleTabBarVisibility: () => {},
});

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);

type TabBarVisibilityProviderProps = {
  children: ReactNode;
};

export const TabBarVisibilityProvider = ({ children }: TabBarVisibilityProviderProps) => {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  
  const showTabBar = () => setIsTabBarVisible(true);
  const hideTabBar = () => setIsTabBarVisible(false);
  const toggleTabBarVisibility = (visible: boolean) => setIsTabBarVisible(visible);

  return (
    <TabBarVisibilityContext.Provider
      value={{
        isTabBarVisible,
        showTabBar,
        hideTabBar,
        toggleTabBarVisibility,
      }}
    >
      {children}
    </TabBarVisibilityContext.Provider>
  );
}; 