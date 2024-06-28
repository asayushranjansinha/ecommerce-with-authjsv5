"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema, SettingsSchemaType } from "@/schemas";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCurrentUser } from "@/hooks/use-current-user";
import ErrorMessage from "@/components/error-message";
import SuccessMessage from "@/components/success-message";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { update } = useSession();
  const user = useCurrentUser();

  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const onSubmit = (values: SettingsSchemaType) => {
    setError(undefined);
    setSuccess(undefined);
    
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
            update();
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleShowNewPassword = () => {
    setShowNewPassword((prev) => !prev);
  };

  return (
    <div className="bg-white p-10 rounded-xl">
      <Card className="w-[600px]">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">Settings</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Jane Doe"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription />
                    </FormItem>
                  )}
                />
                {/* Email field */}
                {!user?.isOAuth && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="jane.doe@gmail.com"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription />
                      </FormItem>
                    )}
                  />
                )}
                {/* currentPassword Password field */}
                {!user?.isOAuth && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
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
                        <FormDescription />
                      </FormItem>
                    )}
                  />
                )}
                {/* New Password Password field */}
                {!user?.isOAuth && (
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              disabled={isPending}
                              {...field}
                              placeholder="******"
                              type={showNewPassword ? "text" : "password"}
                              className="pr-12"
                            />
                            <Button
                              size={"icon"}
                              variant={"ghost"}
                              type="button"
                              onClick={toggleShowNewPassword}
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
                        <FormDescription />
                      </FormItem>
                    )}
                  />
                )}

                {/* Role Field */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        disabled={isPending}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={UserRole.USER}>User</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      <FormDescription />
                    </FormItem>
                  )}
                />

                {/* 2FA (Two Factor Auth) field */}
                {!user?.isOAuth && (
                  <FormField
                    control={form.control}
                    name="isTwoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Two Factor Authentication</FormLabel>
                          <FormDescription>
                            Enable two factor authentication for you
                            (Recommended).
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <ErrorMessage message={error} />
              <SuccessMessage message={success} />
              <Button disabled={isPending} type="submit">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Settings;
