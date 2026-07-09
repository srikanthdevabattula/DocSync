"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAuthError, register } from "@/redux/slices/auth-slice";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
      {children}
    </span>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, isHydrated } = useAppSelector((state) => state.auth);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isHydrated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (values: RegisterFormValues) => {
    dispatch(clearAuthError());
    const result = await dispatch(
      register({
        name: values.name,
        email: values.email,
        password: values.password,
      }),
    );

    if (register.fulfilled.match(result)) {
      router.replace("/");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Start collaborating with your team in a secure workspace."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FieldIcon>
                      <User className="size-4" aria-hidden="true" />
                    </FieldIcon>
                    <Input
                      {...field}
                      autoComplete="name"
                      placeholder="Jane Cooper"
                      className="h-11 pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FieldIcon>
                      <Mail className="size-4" aria-hidden="true" />
                    </FieldIcon>
                    <Input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      className="h-11 pl-10"
                    />
                  </div>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FieldIcon>
                      <Lock className="size-4" aria-hidden="true" />
                    </FieldIcon>
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FieldIcon>
                      <Lock className="size-4" aria-hidden="true" />
                    </FieldIcon>
                    <PasswordInput
                      {...field}
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      className="pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      aria-label="Accept terms and conditions"
                    />
                  </FormControl>
                  <FormLabel className={cn("mt-0! font-normal leading-relaxed text-muted-foreground")}>
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-primary hover:text-primary/80">
                      Terms & Conditions
                    </Link>
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full rounded-xl text-base shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/25"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="relative py-1">
            <Separator />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-medium tracking-wide text-muted-foreground uppercase dark:bg-card">
              Or
            </span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </AuthLayout>
  );
}
