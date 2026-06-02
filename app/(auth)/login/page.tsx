'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { getDefaultRouteForRole } from '@/lib/rbac';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(values.email, values.password);
      
      if (!response || !response.user) {
        setError('Invalid response from server');
        setIsLoading(false);
        return;
      }

      if (response.user.role === 'student') {
        setError('This account does not have admin access.');
        setIsLoading(false);
        return;
      }

      login(response);
      
      // Set cookie for middleware
      Cookies.set('accessToken', response.access_token, { expires: 1 });
      
      router.push(getDefaultRouteForRole(response.user.role));
    } catch (err: unknown) {
      let errorMessage = 'Invalid email or password';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as any;
        errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.detail || errorMessage;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] shadow-sm border-border">
      <CardHeader className="space-y-1 pt-8 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center" aria-hidden="true">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-[18px] font-semibold text-text-primary">Fluentian Admin</span>
        </div>
        <CardDescription className="text-[14px] text-text-secondary">
          Sign in to your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Login form">
          {error && (
            <Alert 
              variant="destructive" 
              className="bg-red-50 border-red-200 text-red-600 py-2"
              role="alert"
              aria-live="polite"
            >
              <AlertDescription className="text-[13px]">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@fluentian.com"
              aria-label="Email address"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? true : false}
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p id="email-error" className="text-[12px] text-red-500" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                aria-label="Password"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={errors.password ? true : false}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-[12px] text-red-500" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-10 mt-2" 
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> : 'Sign in'}
          </Button>

          <div className="pt-4 mt-2 border-t border-border text-center">
            <Link
              href="/help"
              className="inline-flex items-center justify-center gap-2 text-[13px] text-primary hover:text-primary-dark font-medium transition-colors"
            >
              <HelpCircle size={16} aria-hidden="true" />
              Help & learning guide
            </Link>
            <p className="text-[12px] text-text-muted mt-2">
              Lesson types, quizzes, and how courses are structured — no sign-in required.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
