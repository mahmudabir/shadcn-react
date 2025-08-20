import { useLocation } from "react-router-dom";
import { JSX, Suspense } from "react";
import { RouteLoader } from "@/components/custom/route-loader.tsx";

export default function SuspenseWithFallback(props: { children: JSX.Element }) {
  const { pathname } = useLocation();
  const { children } = props;
  return (
    <Suspense fallback={<RouteLoader/>} key={pathname}>
      {children}
    </Suspense>
  );
}