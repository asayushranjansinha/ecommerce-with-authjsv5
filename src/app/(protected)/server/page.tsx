import UserInfo from "@/components/user-info";
import { getCurrentUser } from "@/utils/auth";

const ServerPage = async () => {
  const user = await getCurrentUser();
  return <UserInfo label="Server Component" user={user} />;
};
export default ServerPage;
