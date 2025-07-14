import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './routes'
import { ThemeProvider, useTheme } from './components/theme-provider'
import { Toaster } from "sonner";

// eslint-disable-next-line react-refresh/only-export-components
function ThemedToaster() {
    const { theme } = useTheme()
    return <Toaster theme={theme} />
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ThemedToaster />
            <RouterProvider router={router}/>
        </ThemeProvider>
    </StrictMode>
)
