import { Session } from "next-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
  label: string;
  user?: Session["user"];
}

const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="max-w-[600px] mx-auto">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-x-4 gap-y-1 border rounded-lg p-3">
          <p className="text-sm font-medium">ID</p>
          <p className="truncate text-sm  font-mono bg-secondary px-2 py-1 rounded-md">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-x-4 gap-y-1 border rounded-lg p-3">
          <p className="text-sm font-medium">Name</p>
          <p className="truncate text-sm  font-mono bg-secondary px-2 py-1 rounded-md">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-x-4 gap-y-1 border rounded-lg p-3">
          <p className="text-sm font-medium">Role</p>
          <p className="truncate text-sm  font-mono bg-secondary px-2 py-1 rounded-md">
            {user?.role}
          </p>
        </div>
              
       
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Two Factor Authentication</p>
          <Badge
            variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
            className="rounded-md"
          >
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
export default UserInfo;
