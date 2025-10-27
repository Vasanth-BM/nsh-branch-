# Branch-Based Data Filtering Implementation Guide

## Overview
This document describes the implementation of branch-wise data isolation in the pawn brokerage application, ensuring that users can only see data from their assigned branch, unless they have admin privileges.

## Key Features

### 1. Role-Based Access Control
- **Branch Users**: Can only view and manage data from their assigned branch
- **Admin Users**: Can view and manage data from all branches

### 2. Automatic Branch Filtering
All data queries are automatically filtered by branch_id unless the user has admin role.

## Implementation Details

### Core Utility Functions
**File**: `src/lib/branchFilter.ts`

This file provides the core filtering logic:

```typescript
applyBranchFilter(query, user, branch)
```
- Automatically adds `branch_id` filter to queries
- Skips filtering for admin users
- Returns the modified query

### Authentication Context
**File**: `src/context/AuthContext.tsx`

The authentication context provides:
- Current user information (including role)
- Current branch information
- Login/logout functionality

### Updated Hooks
All data-fetching hooks have been updated to include branch filtering:

1. **useSupabase.ts**
   - `useLoans()` - Filters loans by branch
   - `useDashboardStats()` - Shows stats for branch only
   - `useRecentLoans()` - Shows recent loans from branch

2. **usePledgeData.ts**
   - Filters pledge data by branch

3. **useBank.ts**
   - Filters banks by branch
   - Automatically assigns branch_id when creating banks

4. **useRepledge.ts**
   - Filters repledge entries by branch
   - Automatically assigns branch_id when creating entries

5. **useRepledgeDataDetails.ts**
   - Uses database function with branch filtering
   - Supports pagination and search with branch isolation

### Updated Components

1. **Customers.tsx**
   - Filters customers by branch
   - Only shows customers from the user's branch

2. **CreatePledge.tsx**
   - Automatically assigns branch_id to:
     - New customers
     - New loans
     - New jewel entries

3. **Dashboard.tsx**
   - Shows statistics for the user's branch only

### Database Function
**Migration**: `add_branch_filter_to_repledge_function.sql`

Created a new database function `search_repledge_details` that:
- Accepts `branch_id_filter` parameter
- Filters all repledge data by branch
- Supports pagination and search
- Returns total count for pagination

## How It Works

### For Branch Users
1. User logs in with branch credentials
2. System stores user role and branch_id in AuthContext
3. All data queries automatically filter by branch_id
4. User can only see data from their branch

### For Admin Users
1. Admin logs in with admin credentials
2. System detects admin role
3. Branch filtering is bypassed
4. Admin can see data from all branches

## Testing

### Test Branch User Access
1. Login as a branch user (e.g., `nsh_branch1`)
2. Create some pledges and repledges
3. Verify only data from that branch appears
4. Login as different branch user (e.g., `nsh_branch2`)
5. Verify data from branch1 is not visible

### Test Admin Access
1. Login as admin user
2. Verify data from all branches is visible
3. Verify dashboard shows consolidated data
4. Verify all reports include multi-branch data

## Security Considerations

1. **Database Level**: All tables have `branch_id` column
2. **Application Level**: Filtering applied at query level
3. **User Level**: Role-based access control
4. **No Client Bypass**: Filtering happens server-side

## Future Enhancements

To further enhance security, consider:
1. Implementing Row Level Security (RLS) policies in Supabase
2. Adding branch-level permissions for specific features
3. Audit logging for cross-branch data access
4. Additional role types (branch manager, supervisor, etc.)

## Troubleshooting

### Issue: Data from other branches still visible
**Solution**: Check if user role is set to 'admin' by mistake

### Issue: No data showing for branch user
**Solution**: Verify branch_id is correctly set in the database records

### Issue: Query errors after update
**Solution**: Ensure all queries include proper branch filtering logic
