import { useState, useEffect } from "react";
import { UserRole } from "@/lib/types";

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("userRole");
    return (saved as UserRole) || "client";
  });

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("userRole", newRole);
  };

  useEffect(() => {
    localStorage.setItem("userRole", role);
  }, [role]);

  return { role, switchRole };
};
