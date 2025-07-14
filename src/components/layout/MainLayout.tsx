import { Outlet } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuthToken } from "@/hooks/use-auth-token.ts";
import { logout } from "@/lib/authUtils.ts";
import { LucideLoader2 } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";

export default function MainLayout() {
    const [hasToken, setHasToken] = useAuthToken()
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-end items-end">
                <div className="flex gap-2">
                    <ModeToggle/>
                    {hasToken && <Button variant="destructive" onClick={() => {
                        setIsLoading(true)
                        setTimeout(() => {
                            logout()
                        }, 250)
                    }}>
                        {isLoading && <LucideLoader2 className="animate-spin"></LucideLoader2>}
                        Logout
                    </Button>}
                </div>
            </div>
            <Outlet/>
        </div>
    )
}
