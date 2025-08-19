import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ConfirmationPopupContainer } from "@/components/custom/confirmation-popup.tsx";
import { ThemeProvider, useTheme } from '@/components/providers/theme-provider.tsx';
import router from "@/routes/router.tsx";
import { QUERY_REFETCH_ON_WINDOW_FOCUS, QUERY_RETRY, QUERY_STALE_TIME_MS } from "@/lib/utils.ts";

// Create a client
const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME_MS,
      retry: QUERY_RETRY,
      refetchOnWindowFocus: QUERY_REFETCH_ON_WINDOW_FOCUS,
      enabled: true
    },
  },
})

function App() {
    // return <Navigate to="/" replace/>

    const { theme } = useTheme();

    return (
        <QueryClientProvider client={globalQueryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Toaster theme={theme} />
                <ConfirmationPopupContainer />
                <RouterProvider router={router} />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;