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
import { newVerification } from "@/actions/new-verification";

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const verificationAttempted = useRef<boolean>(false);

  /**
   * Initiates the token verification process. Ensures that token verification
   * is only attempted once. If a token is missing, sets an error message.
   * Calls the newVerification function with the provided token and handles the
   * success or error response.
   *
   * @returns {void}
   */
  const initiateTokenVerification = useCallback(() => {
    //  Prevent attempting token verification to be called twice. This happens in development mode only.

    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token]);

  useEffect(() => {
    initiateTokenVerification();
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
