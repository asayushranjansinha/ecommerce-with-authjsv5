"use client";
import { useSession } from "@/components/providers/session-provider";
import UserInfo from "@/components/user-info";

const ClientPage = () => {
  const { session } = useSession();
  let user = session?.user;

  return <UserInfo label="Client Component" user={user} />;
};
export default ClientPage;
