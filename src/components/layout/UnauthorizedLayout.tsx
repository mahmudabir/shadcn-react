import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";

export default function UnauthorizedLayout() {
    return (
        <div className="flex flex-col min-h-svh h-svh w-full overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <Link to="/about-us" className="text-lg font-semibold">
                        About Us
                    </Link>
                </div>
                <div className="ml-auto px-3">
                    <ModeToggle />
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
                <Outlet />
            </div>
        </div>
    )
}
