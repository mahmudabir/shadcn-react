import { Button } from "@/components/ui/button"
import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/mode-toggle"
import { Link, Route, BrowserRouter, Routes } from 'react-router-dom';
import { useAuthToken } from "./hooks/use-auth-token";
import { ROUTES } from "./app/core/routes/routes";
import AuthGuard from "./app/core/guards/AuthGuard";
import Dashboard from "./app/modules/dashboard/Dashboard";
import CountryCreate from "./app/modules/country/CountryCreate";
import CountryEdit from "./app/modules/country/CountryEdit";
import Login from "./app/modules/auth/Login";
import CountryList from "@/app/modules/country/CountryList.tsx";
import { logout } from "@/lib/authUtils.ts";
import CountryDetails from "@/app/modules/country/CountryDetails.tsx";

function App() {
    const [hasToken, setHasToken] = useAuthToken();

  return (
    <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex min-h-svh flex-col items-center justify-center">

                {/*{hasToken && <nav style={{ marginBottom: 20 }}>*/}
                {/*    <Link to={ROUTES.dashboard} style={{ marginRight: 10 }}>Dashboard</Link>*/}
                {/*    <Link to={ROUTES.countries} style={{ marginRight: 10 }}>Countries</Link>*/}
                {/*    <Link to={ROUTES.countryCreate} style={{ marginRight: 10 }}>Create Country</Link>*/}
                {/*    <ModeToggle/>*/}
                {/*    {hasToken && (*/}
                {/*        <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>*/}
                {/*    )}*/}
                {/*</nav>}*/}
                <Button>Click me</Button>
            </div>
        </ThemeProvider>
        <Routes>
            <Route path={ROUTES.dashboard} element={<AuthGuard><Dashboard /></AuthGuard>} />
            <Route path={ROUTES.countries} element={<AuthGuard><CountryList /></AuthGuard>} />
            <Route path={ROUTES.countryCreate} element={<AuthGuard><CountryCreate /></AuthGuard>} />
            <Route path={ROUTES.countryEdit()} element={<AuthGuard><CountryEdit /></AuthGuard>} />
            <Route path={ROUTES.countryDetails()} element={<AuthGuard><CountryDetails /></AuthGuard>} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App