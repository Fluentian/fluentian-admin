'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useListUsers } from '@/lib/hooks/useAdmin';
import { UsersList } from '@/components/admin/UsersList';
import { CreateUserModal } from '@/components/admin/CreateUserModal';
import { Plus, Users, Search } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'student', label: 'Student' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function UsersPage() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const params = {
    page,
    size: pageSize,
    role: roleFilter === 'all' ? undefined : roleFilter,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
  };

  const { data, isLoading } = useListUsers(params);

  // Filter by search query (client-side)
  const filteredUsers = data?.data.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const canCreateUsers = ['admin', 'super_admin'].includes(user?.role || '');

  return (
    <>
      <PageHeader
        title="User Management"
        description="Manage system users and their roles"
        icon={Users}
        action={
          canCreateUsers && (
            <Button onClick={() => setShowCreateModal(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          )
        }
      />

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data?.pagination.total || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data?.data.filter((u) => u.is_active).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Email Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data?.data.filter((u) => u.email_verified).length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {data?.data.filter((u) => ['admin', 'super_admin'].includes(u.role)).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, or username..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={roleFilter} onValueChange={(value) => {
                  setRoleFilter(value);
                  setPage(1);
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value);
                  setPage(1);
                }}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersList
              users={filteredUsers}
              currentUserRole={user?.role || 'student'}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {data?.pagination && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {data.pagination.total} users
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  Page {page} of {data.pagination.pages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {canCreateUsers && (
        <CreateUserModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          maxRole={user?.role}
        />
      )}
    </>
  );
}
