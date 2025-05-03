import { useRef, useState, createContext, useContext } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { LocationSettingSheet } from "./location";

type SettingsSheetContextType = {
    locationSettingSheet: {
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
        open: () => { },
        close: () => { },
    },
    notificationSettingSheet: {
        open: () => { },
        close: () => { },
    },
});

export function SettingSheetsProvider({ children }: { children: React.ReactNode }) {
    const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const contextValue: SettingsSheetContextType = {
        locationSettingSheet: {
            open: () => {
                setIsLocationSheetOpen(true);
            },
            close: () => {
                bottomSheetRef.current?.close();
            },
        },
        notificationSettingSheet: {
            open: () => { },
            close: () => { },
        },
    };

    return (
        <SettingsSheetContext.Provider value={contextValue}>
            {children}
            <LocationSettingSheet
                ref={bottomSheetRef}
                show={isLocationSheetOpen}
                onHide={() => setIsLocationSheetOpen(false)}
            />
        </SettingsSheetContext.Provider>
    );
}

export function useSettingsSheet() {
    return useContext(SettingsSheetContext);
}
