import Navbar from "@/app/(protected)/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen h-full w-full flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto py-8">{children}</div>
    </div>
  );
};

export default ProtectedLayout;
