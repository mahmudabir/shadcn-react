import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import { router } from './routes'
import { ThemeProvider, useTheme } from './components/providers/theme-provider'
import { Toaster } from "sonner";
import { ConfirmationPopupContainer } from "./components/custom/confirmation-popup";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
})

// eslint-disable-next-line react-refresh/only-export-components
function ThemedToaster() {
    const { theme } = useTheme()
    return <Toaster theme={theme} />
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <ThemedToaster />
                <ConfirmationPopupContainer />
                <RouterProvider router={router}/>
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </StrictMode>
)
