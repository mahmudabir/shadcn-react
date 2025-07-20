import { setPreloaderHandler } from "@/app/core/api/base-api";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "../app-sidebar";
import { Preloader } from "../custom/preloader";
import { PreloaderProvider, usePreloader } from "../custom/preloader-provider";
import { NavActions } from "../nav-actions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

function AuthorizedLayoutContent() {
    const { visible, increment, decrement, isManual } = usePreloader();
    useEffect(() => {
        setPreloaderHandler({ increment, decrement, isManual });
        // Optionally cleanup: unset handler on unmount
        return () => setPreloaderHandler({ increment: () => { }, decrement: () => { }, isManual: false });
    }, [increment, decrement, isManual]);
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
                    <Outlet />
                </div>
            </SidebarInset>
            <Preloader visible={visible} />
        </SidebarProvider>
    );
}

export default function AuthorizedLayout() {
    return (
        <PreloaderProvider>
            <AuthorizedLayoutContent />
        </PreloaderProvider>
    );
}

