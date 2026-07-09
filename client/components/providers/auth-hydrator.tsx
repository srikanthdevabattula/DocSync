"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { registerSessionExpiredHandler } from "@/lib/auth-session";
import { hydrateAuth, logout } from "@/redux/slices/auth-slice";

export function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    registerSessionExpiredHandler(() => {
      dispatch(logout());
    });
    dispatch(hydrateAuth());
  }, [dispatch]);

  return null;
}
