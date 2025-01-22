"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  registerSchema,
  userRoles,
  type RegisterFormValues,
} from "./validation";
import { signUp } from "./actions";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      rsa_id: "",
      cell_number: "",
      physical_address: "",
      roleapplication: "User",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsPending(true);
      const result = await signUp(data);

      if (result?.error) {
        toast.error(result.error);
        if (result.error.includes("Username")) {
          form.setError("username", { message: result.error });
        } else if (result.error.includes("Email")) {
          form.setError("email", { message: result.error });
        }
        return;
      }

      toast.success("Registration successful! Please wait for approval.");
      router.push("/register-pending-message");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <div className="w-full max-w-2xl space-y-6 bg-card p-8 rounded-lg shadow-lg border border-border">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Create an Account
          </h1>
          <p className="text-muted-foreground">
            Please complete all required fields to register
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe"
                        {...field}
                        autoComplete="username"
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormDescription>
                      Must be at least 3 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john@example.com"
                        type="email"
                        {...field}
                        autoComplete="email"
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rsa_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RSA ID Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your RSA ID"
                        {...field}
                        maxLength={13}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormDescription>13 digits maximum</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cell_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cell Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+27"
                        {...field}
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        autoComplete="new-password"
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormDescription>
                      Must include uppercase, lowercase, number, and special
                      character
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password*</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        autoComplete="new-password"
                        disabled={isPending}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="physical_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your physical address"
                      {...field}
                      disabled={isPending}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleapplication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Application*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replace(/([A-Z])/g, " $1").trim()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the role you wish to apply for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-muted-foreground">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary hover:text-primary/90 underline"
                      >
                        terms and conditions
                      </Link>
                      *
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;
