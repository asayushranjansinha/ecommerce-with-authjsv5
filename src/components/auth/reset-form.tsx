"use client";

// Libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

// Schema
import { ResetSchema, ResetPasswordSchemaType } from "@/schemas";

// Components
import CardWrapper from "@/components/auth/card-wrapper";
import ErrorMessage from "@/components/error-message";
import SuccessMessage from "@/components/success-message";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Actions
import { resetPassword } from "@/actions/reset";

export const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  /**
   * Initiates the password reset process by calling the reset action with the provided values.
   * Sets error and success states based on the outcome of the reset attempt.
   *
   * @param {ResetPasswordSchemaType} values - The reset password values.
   * @returns {void}
   */
  const initiateResetPassword = (values: ResetPasswordSchemaType) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      resetPassword(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(initiateResetPassword)}
        >
          <div className="w-full space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset link
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
