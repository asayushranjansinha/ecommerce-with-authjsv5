"use client";

import { useCurrentUserRole } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import ErrorMessage from "@/components/error-message";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentUserRole();
  if (role !== allowedRole) {
    return (
      <ErrorMessage message="You do not have permission to access this content" />
    );
  }
  return <>{children}</>;
};
export default RoleGate;
