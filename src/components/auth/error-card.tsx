import { TriangleAlertIcon } from "lucide-react";
import CardWrapper from "./card-wrapper";

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/error"
      backButtonLabel="Back to Login"
    >
      <div className="w-full flex items-center justify-center">
        <TriangleAlertIcon className="h-10 w-10 text-destructive" />
      </div>
    </CardWrapper>
  );
};
export default ErrorCard;
