"use client";
import { Loader } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: () => void;
  loadingState?: boolean;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  asChild?: boolean;
}

export const ActionButton = ({
  children,
  onClick,
  loadingState,
  className,
  icon,
  type,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      className={className}
      onClick={onClick}
      disabled={loadingState}
      type={type}
      variant={variant}
      size={size}
      asChild={asChild}
      {...props}
    >
      {icon} {icon && <span className="mr-2">{icon}</span>}
      {loadingState ? (
        <>
          <Loader className="h-5 w-5 animate-spin mr-2" />
          Please wait!
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
};
