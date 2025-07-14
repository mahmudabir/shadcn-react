// This file is kept for backward compatibility but is no longer used
// The application now uses React Router - see src/routes/index.tsx

import { Navigate } from "react-router-dom"

function App() {
    return <Navigate to="/" replace/>
}

export default App