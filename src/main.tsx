import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './routes'
import { ThemeProvider, useTheme } from './components/providers/theme-provider'
import { Toaster } from "sonner";
import { ConfirmationPopupContainer, mountConfirmationPopup } from "./components/custom/confirmation-popup";

// eslint-disable-next-line react-refresh/only-export-components
function ThemedToaster() {
    const { theme } = useTheme()
    return <Toaster theme={theme} />
}


// mountConfirmationPopup(); // Mount the singleton confirmation popup

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ThemedToaster />
            <ConfirmationPopupContainer />
            <RouterProvider router={router}/>
        </ThemeProvider>
    </StrictMode>
)
