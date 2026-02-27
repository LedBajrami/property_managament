import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from 'sonner';
import { useUserState } from "@/hooks/Auth/useUserState.ts";
import {LoaderPinwheel} from "lucide-react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function AppContent() {
    const { isPending } = useUserState();

    if (isPending) return <LoaderPinwheel
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