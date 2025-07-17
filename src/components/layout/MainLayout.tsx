import { Outlet } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuthToken } from "@/hooks/use-auth-token.ts";
import { logout } from "@/lib/authUtils.ts";
import { LucideLoader2 } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb";
import { NavActions } from "../nav-actions";

export default function MainLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="ml-auto px-3">
                        <NavActions />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Outlet/>
                </div>
            </SidebarInset>
        </SidebarProvider>

        // <div className="container mx-auto py-8 space-y-6">
        //     <div className="flex justify-end items-end">
        //         <div className="flex gap-2">
        //             <ModeToggle/>
        //             {hasToken && <Button variant="destructive" onClick={() => {
        //                 setIsLoading(true)
        //                 setTimeout(() => {
        //                     logout()
        //                 }, 250)
        //             }}>
        //                 {isLoading && <LucideLoader2 className="animate-spin"></LucideLoader2>}
        //                 Logout
        //             </Button>}
        //         </div>
        //     </div>
        //     <Outlet/>
        // </div>
    )
}
