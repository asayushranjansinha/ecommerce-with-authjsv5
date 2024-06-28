"use client";

// Libraries
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

// Schemas
import { LoginSchema, LoginSchemaType } from "@/schemas";

// Components
import CardWrapper from "@/components/auth/card-wrapper";
import ErrorMessage from "@/components/error-message";
import SuccessMessage from "@/components/success-message";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

// Actions
import { loginUser } from "@/actions/login-user";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use!"
      : "";

  const callbackUrl = searchParams.get("callbackUrl");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      code: "",
      email: "",
      password: "",
    },
  });

  /**
   * Initiates the login process with the provided credentials.
   *
   * This function handles the login process, including:
   * - Clearing previous error and success messages
   * - Calling the loginUser function with the provided credentials
   * - Handling the response, which may include:
   *   - Displaying error messages
   *   - Displaying success messages
   *   - Initiating two-factor authentication if required
   * - Resetting the form in case of errors or success
   *
   * @param {LoginSchemaType} values - The login credentials.
   * @param {string} values.email - The user's email address.
   * @param {string} values.password - The user's password.
   * @param {string} [values.code] - The two-factor authentication code (if applicable).
   *
   * @returns {void}
   *
   * @example
   * const handleSubmit = (formValues: LoginSchemaType) => {
   *   initiateLogIn(formValues);
   * };
   */
  const initiateLogIn = (values: LoginSchemaType): void => {
    console.log("login values", { values });
    setError("");
    setSuccess("");

    startTransition(() => {
      loginUser(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          } else if (data?.success) {
            form.reset();
            setSuccess(data.success);
          } else if (data?.twoFactor) {
            setShowTwoFactor(true);
            setOtpValue("");
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const handleSubmit = (values: LoginSchemaType) => {
    if (showTwoFactor) {
      initiateLogIn({ ...values, code: otpValue });
    } else {
      initiateLogIn(values);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="w-full space-y-4">
            {showTwoFactor ? (
              <>
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => setOtpValue(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                </FormItem>
              </>
            ) : (
              <>
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
                      <Button
                        asChild
                        className="px-0 font-normal"
                        variant={"link"}
                        size={"sm"}
                      >
                        <Link href="/auth/reset">Forgot password</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <ErrorMessage message={error || urlError} />
          <SuccessMessage message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
