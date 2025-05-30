import { useRef, useState, createContext, useContext } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { LocationSettingSheet } from "./location";
import { LanguageSettingSheet } from "./language";

type SettingsSheetContextType = {
  locationSettingSheet: {
    open: () => void;
    close: () => void;
  };
  languageSettingSheet: {
    open: () => void;
    close: () => void;
  };
  notificationSettingSheet: {
    open: () => void;
    close: () => void;
  };
};

const SettingsSheetContext = createContext<SettingsSheetContextType>({
  locationSettingSheet: {
    open: () => {},
    close: () => {},
  },
  languageSettingSheet: {
    open: () => {},
    close: () => {},
  },
  notificationSettingSheet: {
    open: () => {},
    close: () => {},
  },
});

export function SettingSheetsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const locationSheetRef = useRef<BottomSheet>(null);
  const languageSheetRef = useRef<BottomSheet>(null);

  const contextValue: SettingsSheetContextType = {
    locationSettingSheet: {
      open: () => {
        setIsLocationSheetOpen(true);
      },
      close: () => {
        locationSheetRef.current?.close();
      },
    },
    languageSettingSheet: {
      open: () => {
        setIsLanguageSheetOpen(true);
      },
      close: () => {
        languageSheetRef.current?.close();
      },
    },
    notificationSettingSheet: {
      open: () => {},
      close: () => {},
    },
  };

  return (
    <SettingsSheetContext.Provider value={contextValue}>
      {children}
      <LocationSettingSheet
        ref={locationSheetRef}
        show={isLocationSheetOpen}
        onHide={() => setIsLocationSheetOpen(false)}
      />
      <LanguageSettingSheet
        ref={languageSheetRef}
        show={isLanguageSheetOpen}
        onHide={() => setIsLanguageSheetOpen(false)}
      />
    </SettingsSheetContext.Provider>
  );
}

export const useSettingsSheet = () => useContext(SettingsSheetContext);
