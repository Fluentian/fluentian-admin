'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/auth";
import { User, Shield, Lock, Bell, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Manage your account and dashboard preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Security */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Admin Profile</CardTitle>
              </div>
              <CardDescription>Update your public information and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[24px] font-bold">
                  {user?.username?.substring(0, 2).toUpperCase()}
                </div>
                <Button variant="outline">Change Avatar</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input defaultValue={user?.username} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input defaultValue={user?.email} disabled />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button className="px-8">Update Profile</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Security</CardTitle>
              </div>
              <CardDescription>Change your password and manage sessions.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button variant="outline">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: App Settings */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Admin Controls</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <SettingToggle 
                label="Maintenance Mode" 
                description="Lock app for students" 
              />
              <SettingToggle 
                label="Debug Logs" 
                description="Capture detailed API logs" 
              />
              <SettingToggle 
                label="Auto-Archive" 
                description="Archive old notifications" 
                defaultChecked
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-primary" />
                <CardTitle className="text-[16px]">Personalization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
               <SettingToggle 
                label="Dark Mode" 
                description="Use dark interface" 
              />
               <SettingToggle 
                label="Compact View" 
                description="Dense table layouts" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[14px] font-medium text-text-primary">{label}</p>
        <p className="text-[11px] text-text-muted">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
