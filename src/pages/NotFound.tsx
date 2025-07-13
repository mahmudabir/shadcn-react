import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
      <h1 className="text-9xl font-extrabold text-muted-foreground">404</h1>
      <h2 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h2>
      <p className="mt-2 text-muted-foreground">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Button 
        onClick={() => navigate('/')} 
        className="mt-8"
      >
        Go back home
      </Button>
    </div>
  )
}
