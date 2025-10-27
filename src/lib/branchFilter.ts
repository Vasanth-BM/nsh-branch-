import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
}

export function applyBranchFilter<T>(
  query: PostgrestFilterBuilder<any, any, T>,
  user: User | null,
  branch: Branch | null
): PostgrestFilterBuilder<any, any, T> {
  if (!user || !branch) {
    return query;
  }

  if (user.role === 'admin') {
    return query;
  }

  return query.eq('branch_id', branch.id);
}

export function shouldFilterByBranch(user: User | null): boolean {
  return user?.role !== 'admin';
}

export function getBranchId(branch: Branch | null): string | null {
  return branch?.id || null;
}
