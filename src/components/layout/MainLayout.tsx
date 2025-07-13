import { ThemeProvider } from "@/components/theme-provider"
import { Outlet, useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuthToken } from "@/hooks/use-auth-token.ts";
import { logout } from "@/lib/authUtils.ts";

export default function MainLayout() {
    const [hasToken, setHasToken] = useAuthToken()

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="container mx-auto py-8 space-y-6">
                <div className="flex justify-end items-end">
                    <div className="flex gap-2">
                        <ModeToggle/>
                        {hasToken && <Button variant="outline" onClick={logout}>Logout</Button>}
                    </div>
                </div>
                <Outlet/>
            </div>
        </ThemeProvider>
    )
}
