import { NavigationProvider } from "./contexts/NavigationContext";

const Contexts = ({ children }: { children: React.ReactNode }) => {
    return (
        <NavigationProvider>
            {children}
        </NavigationProvider>
    );
};

export default Contexts;
