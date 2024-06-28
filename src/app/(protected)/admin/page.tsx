"use client";
import { admin } from "@/actions/admin";
import RoleGate from "@/components/auth/role-gate";
import SuccessMessage from "@/components/success-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("ALLOWED");
      } else {
        toast.error("FORBIDDEN");
      }
    });
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data?.success) {
        toast.success(data.success);
      } else if (data?.error) {
        toast.error(data.error);
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <SuccessMessage message="You are allowed to view the content" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default AdminPage;
