"use client";

// Libraries
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "sonner";

// Actions
import { registerNewUserWithCredentials } from "@/actions/auth";

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
import { ActionButton } from "@/components/action-button";

// Schemas
import { RegisterSchema, RegisterSchemaType } from "@/schemas";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  /**
   * Initiates the sign-up process by triggering the internal register action.
   * Clears previous error and success messages before starting the registration.
   *
   * @param {RegisterSchemaType} values - The values required for registration.
   * @returns {void}
   */
  const initiateSignUp = (values: RegisterSchemaType) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      registerNewUserWithCredentials(values)
        .then((data) => {
          if (data.status === "success") {
            setSuccess(data.message);
            toast.success(data.message);
          } else {
            setError(data.message);
            toast.error(data.message);
          }
        })
        .finally(() => {
          // TODO: Either navigate to login or hide success or error message
          form.reset();
        });
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <CardWrapper
      headerLabel="Create Account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit(initiateSignUp)}
        >
          <div className="w-full space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      placeholder="John Doe"
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isPending}
                        {...field}
                        placeholder="******"
                        type={showPassword ? "text" : "password"}
                        className="pr-12"
                      />
                      <Button
                        size={"icon"}
                        variant={"ghost"}
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-0 top-0 bg-transparent hover:bg-transparent active:bg-transparent"
                      >
                        {showPassword ? (
                          <IoEye className="text-slate-600" />
                        ) : (
                          <IoEyeOff className="text-slate-600" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ErrorMessage message={error} />
          <SuccessMessage message={success} />

          <ActionButton
            loadingState={isPending}
            type="submit"
            className="w-full"
          >
            Create an account
          </ActionButton>
        </form>
      </Form>
    </CardWrapper>
  );
};
