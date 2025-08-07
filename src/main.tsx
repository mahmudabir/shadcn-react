import { QueryClient } from '@tanstack/react-query'
import { ReactNode, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { QUERY_REFETCH_ON_WINDOW_FOCUS, QUERY_RETRY, QUERY_STALE_TIME } from './lib/utils'

// Create a client
const globalQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
      retry: QUERY_RETRY,
      refetchOnWindowFocus: QUERY_REFETCH_ON_WINDOW_FOCUS,
      enabled: true
    },
  },
})

const Main = (props?: { children?: ReactNode, isDevelopment: boolean }) => {
  return (
    isDevelopment
      ? <StrictMode>{props.children}</StrictMode>
      : props.children
  );
}
const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development';
createRoot(document.getElementById('root')!).render(
  <Main isDevelopment={isDevelopment}>
    <App queryClient={globalQueryClient} />
  </Main>
);
