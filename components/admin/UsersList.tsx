'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  MoreVertical,
  Shield,
  Ban,
  RotateCcw,
  Key,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { UserAdminResponse } from '@/lib/api/admin';
import {
  useUpdateUserRole,
  useDeactivateUser,
  useReactivateUser,
  useResetUserPassword,
} from '@/lib/hooks/useAdmin';
import { formatDate } from '@/lib/utils';
import { UpdateRoleDialog } from './UpdateRoleDialog';

interface UsersListProps {
  users: UserAdminResponse[];
  currentUserRole: string;
  isLoading?: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-800',
  admin: 'bg-orange-100 text-orange-800',
  teacher: 'bg-blue-100 text-blue-800',
  moderator: 'bg-green-100 text-green-800',
  student: 'bg-gray-100 text-gray-800',
};

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  teacher: 'Teacher',
  moderator: 'Moderator',
  student: 'Student',
};

export function UsersList({ users, currentUserRole, isLoading }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<UserAdminResponse | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const updateRole = useUpdateUserRole();
  const deactivateUser = useDeactivateUser();
  const reactivateUser = useReactivateUser();
  const resetPassword = useResetUserPassword();

  const handleChangeRole = async (newRole: string) => {
    if (!selectedUser) return;
    await updateRole.mutateAsync({
      userId: selectedUser.id,
      payload: { role: newRole },
    });
    setShowRoleDialog(false);
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;
    await deactivateUser.mutateAsync(selectedUser.id);
    setShowDeactivateDialog(false);
  };

  const handleReactivate = async (userId: string) => {
    await reactivateUser.mutateAsync(userId);
  };

  const handleResetPassword = async (userId: string) => {
    await resetPassword.mutateAsync(userId);
  };

  const canManageUser = (user: UserAdminResponse): boolean => {
    if (currentUserRole === 'super_admin') {
      return true;
    }
    if (currentUserRole === 'admin') {
      return !['super_admin', 'admin'].includes(user.role);
    }
    return false;
  };

  const canChangeRole = (user: UserAdminResponse): boolean => {
    return canManageUser(user) && currentUserRole === 'super_admin';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">No users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Email Verified</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {user.profile?.display_name || user.username}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={ROLE_COLORS[user.role]}>
                    {ROLE_LABELS[user.role]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <Badge className="bg-green-100 text-green-800 flex w-fit items-center gap-1">
                      <Check className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 flex w-fit items-center gap-1">
                      <X className="h-3 w-3" />
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {user.email_verified ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  {canManageUser(user) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canChangeRole(user) && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRoleDialog(true);
                              }}
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}

                        <DropdownMenuItem
                          onClick={() => handleResetPassword(user.id)}
                          disabled={resetPassword.isPending}
                        >
                          <Key className="mr-2 h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>

                        {user.is_active && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeactivateDialog(true);
                            }}
                            className="text-red-600"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        )}

                        {!user.is_active && (
                          <DropdownMenuItem
                            onClick={() => handleReactivate(user.id)}
                            disabled={reactivateUser.isPending}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <UpdateRoleDialog
            user={selectedUser}
            open={showRoleDialog}
            onOpenChange={setShowRoleDialog}
            onRoleChange={handleChangeRole}
            currentUserRole={currentUserRole}
          />

          <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to deactivate <strong>{selectedUser.username}</strong>?
                  They will no longer be able to log in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex justify-end gap-2">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivate}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deactivateUser.isPending}
                >
                  {deactivateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Deactivate
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
