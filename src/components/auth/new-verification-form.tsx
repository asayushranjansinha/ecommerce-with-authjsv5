"use client";

// Libraries
import { DotLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";

// Components
import SuccessMessage from "@/components/success-message";
import CardWrapper from "@/components/auth/card-wrapper";
import ErrorMessage from "@/components/error-message";

// Actions
import { verifyUserEmail } from "@/actions/auth";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const verificationAttempted = useRef<boolean>(false);

  const handleTokenVerificationAttempt = useCallback(() => {
    //  Prevent attempting token verification to be called twice. This happens in development mode only.

    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    if (!token) {
      setError(
        "Invalid verification link. Please request a new link and try again."
      );
      return;
    }

    verifyUserEmail(token).then((data) => {
      if (data.status === "error") {
        setError(data.message);
      } else {
        setSuccess(data.message);
      }
    });
  }, [token]);

  useEffect(() => {
    handleTokenVerificationAttempt();
  }, []);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to Login"
    >
      <div className="h-fit flex flex-col gap-3 items-center w-full justify-center">
        {!error && !success && <DotLoader color="#2D8ADA" />}
        <ErrorMessage message={error} />
        <SuccessMessage message={success} />
      </div>
    </CardWrapper>
  );
};
