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
import { forgotPasswordAndSendEmail } from "@/actions/user";

export const ForgotPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPasswordFormSubmission = (
    values: ResetPasswordSchemaType
  ) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      forgotPasswordAndSendEmail(values).then((data) => {
        if (data.status === "error") {
          setError(data.message);
        } else {
          setSuccess(data.message);
        }
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
          onSubmit={form.handleSubmit(handleForgotPasswordFormSubmission)}
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
