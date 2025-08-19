import { useLocation } from "react-router-dom";
import { Suspense } from "react";
import { RouteLoader } from "@/components/custom/route-loader.tsx";

export default function SuspenseWithFallback({ children }) {
  const { pathname } = useLocation();
  return (
    <Suspense fallback={<RouteLoader/>} key={pathname}>
      {children}
    </Suspense>
  );
}