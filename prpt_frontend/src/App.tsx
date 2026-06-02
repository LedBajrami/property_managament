import {Outlet, useLocation} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'sonner';
import {LoaderPinwheel} from "lucide-react";
import {useAuth} from "@/hooks/Auth/useAuth.ts";
import {useEffect} from "react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function AppContent() {
    const { isLoading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        console.log('[App] location changed to:', location.pathname);
        console.trace(); // this will show the call stack
    }, [location]);

    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            // Don't invalidate auth — invalidate other queries if needed
            queryClient.invalidateQueries({ queryKey: ['data'] }); // example
        }
      };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    if (isLoading) return <LoaderPinwheel
        className="animate-spin"
        style={{
            position: "absolute",
            top: '50%',
            right: '50%',
        }}
    />;

    return (
        <div className="App">
            <Outlet />
            <Toaster position="top-right" richColors />
        </div>
    );
}

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
                <AppContent />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;