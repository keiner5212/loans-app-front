import { createContext, useContext, useState } from "react";

const NavigationContext = createContext<{
    lastPage: string | null;
    setLastPage: (page: string | null) => void;
}>({
    lastPage: null,
    setLastPage: () => { },
});

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
    const [lastPage, setLastPage] = useState<string | null>(null);

    return (
        <NavigationContext.Provider value={{ lastPage, setLastPage }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => useContext(NavigationContext);
