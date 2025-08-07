// This file is kept for backward compatibility but is no longer used
// The application now uses React Router - see src/routes/index.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ConfirmationPopupContainer } from "./components/custom/confirmation-popup";
import { ThemeProvider, useTheme } from './components/providers/theme-provider';
import { router } from "./routes";

function App(props?: { queryClient?: QueryClient }) {
    // return <Navigate to="/" replace/>

    const { theme } = useTheme();

    return (
        <QueryClientProvider client={props?.queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Toaster theme={theme} />
                <ConfirmationPopupContainer />
                <RouterProvider router={router} />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App