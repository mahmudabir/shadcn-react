import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from "sonner"
import { ConfirmationPopupContainer } from "./components/custom/confirmation-popup"
import { ThemeProvider, useTheme } from './components/providers/theme-provider'
import './index.css'
import { QUERY_REFETCH_ON_WINDOW_FOCUS, QUERY_RETRY, QUERY_STALE_TIME } from './lib/utils'
import { router } from './routes'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      retry: QUERY_RETRY,
      refetchOnWindowFocus: QUERY_REFETCH_ON_WINDOW_FOCUS,
      enabled: true
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
        <RouterProvider router={router} />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
