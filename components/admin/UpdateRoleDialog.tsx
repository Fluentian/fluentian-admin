'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserAdminResponse } from '@/lib/api/admin';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const ROLES = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

const ROLE_DESCRIPTIONS: Record<string, string> = {
  student: 'Can only access learning content',
  moderator: 'Can manage student discussions and content',
  teacher: 'Can create and manage courses and lessons',
  admin: 'Can manage teachers, moderators, and students',
  super_admin: 'Full system access - can manage all users and roles',
};

interface UpdateRoleDialogProps {
  user: UserAdminResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (newRole: string) => Promise<void>;
  currentUserRole: string;
}

export function UpdateRoleDialog({
  user,
  open,
  onOpenChange,
  onRoleChange,
  currentUserRole,
}: UpdateRoleDialogProps) {
  const [newRole, setNewRole] = useState(user.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (newRole === user.role) {
      onOpenChange(false);
      return;
    }

    setIsLoading(true);
    try {
      await onRoleChange(newRole);
    } finally {
      setIsLoading(false);
    }
  };

  // Only super admin can assign super_admin or admin roles
  const availableRoles =
    currentUserRole === 'super_admin'
      ? ROLES
      : ROLES.filter((r) => !['admin', 'super_admin'].includes(r.value));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for <strong>{user.username}</strong> ({user.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">New Role *</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {ROLE_DESCRIPTIONS[newRole]}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || newRole === user.role}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
