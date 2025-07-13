import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { setNavigateFunction } from "@/app/core/api/base-api.ts";
import { ACCESS_TOKEN_KEY } from "@/lib/authUtils.ts";

const AuthGuard = ({ children }: { children: React.ReactElement }) => {

  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AuthGuard;