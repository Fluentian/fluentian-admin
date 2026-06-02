'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/lib/store/auth';
import { useThemeStore } from '@/lib/store/theme';
import { usersApi } from '@/lib/api/users';
import { authApi } from '@/lib/api/auth';
import { getErrorMessage } from '@/lib/utils/api-error';
import { User, Lock, Palette, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(100),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const authUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const isDark = useThemeStore((state) => state.isDark);
  const setDark = useThemeStore((state) => state.setDark);

  const [email, setEmail] = useState('');
  const [savedProfile, setSavedProfile] = useState<{ displayName: string; username: string } | null>(
    null
  );
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '', username: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const me = await usersApi.getMe();
        if (cancelled) return;
        setEmail(me.email);
        const displayName = me.profile?.display_name ?? me.username;
        profileForm.reset({ displayName, username: me.username });
        setSavedProfile({ displayName, username: me.username });
      } catch (error) {
        if (!cancelled) {
          toast.error(getErrorMessage(error));
          const displayName = authUser?.username ?? '';
          profileForm.reset({ displayName, username: displayName });
          setSavedProfile({ displayName, username: displayName });
          setEmail(authUser?.email ?? '');
        }
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!savedProfile) return;

    try {
      const usernameChanged = values.username !== savedProfile.username;
      const displayNameChanged = values.displayName !== savedProfile.displayName;

      if (!usernameChanged && !displayNameChanged) {
        toast.message('No changes to save');
        return;
      }

      if (usernameChanged) {
        await usersApi.updateUsername(values.username);
        updateUser({ username: values.username });
      }

      if (displayNameChanged) {
        await usersApi.updateProfile({ display_name: values.displayName });
      }

      setSavedProfile({ displayName: values.displayName, username: values.username });
      profileForm.reset(values);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      await authApi.changePassword(values.currentPassword, values.newPassword);
      passwordForm.reset();
      toast.success('Password updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const initials = (profileForm.watch('displayName') || authUser?.username || 'AD')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Manage your account and dashboard preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Admin Profile</CardTitle>
              </div>
              <CardDescription>Update your display name and username.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingProfile ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[24px] font-bold">
                      {initials}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display name</Label>
                      <Input id="displayName" {...profileForm.register('displayName')} />
                      {profileForm.formState.errors.displayName && (
                        <p className="text-[12px] text-red-500" role="alert">
                          {profileForm.formState.errors.displayName.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...profileForm.register('username')} />
                      {profileForm.formState.errors.username && (
                        <p className="text-[12px] text-red-500" role="alert">
                          {profileForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" value={email} disabled />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      className="px-8"
                      disabled={profileForm.formState.isSubmitting}
                    >
                      {profileForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        'Update profile'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Security</CardTitle>
              </div>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    {...passwordForm.register('currentPassword')}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-[12px] text-red-500" role="alert">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      {...passwordForm.register('newPassword')}
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-[12px] text-red-500" role="alert">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      {...passwordForm.register('confirmPassword')}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-[12px] text-red-500" role="alert">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      'Update password'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Personalization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[14px] font-medium text-foreground">Dark mode</p>
                  <p className="text-[11px] text-muted-foreground">Use a dark interface</p>
                </div>
                <Switch checked={isDark} onCheckedChange={setDark} aria-label="Toggle dark mode" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
