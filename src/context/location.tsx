import { createContext, useContext, useState } from "react";
import { Location } from "@/api/location";

type LocationContextType = {
    location?: Location;
    setLocation: (location: Location) => void;
}

export const LocationContext = createContext<LocationContextType>({
    setLocation: () => { },
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [location, setLocation] = useState<Location>();

    return (
        <LocationContext.Provider value={{ location, setLocation }}>{children}</LocationContext.Provider>
    )
}

export function useLocation() {
    return useContext(LocationContext);
}

