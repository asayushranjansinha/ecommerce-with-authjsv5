const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      {children}
    </div>
  );
};

export default AuthLayout;
