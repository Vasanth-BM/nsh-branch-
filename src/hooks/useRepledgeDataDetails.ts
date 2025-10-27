import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// The interface remains the same, but we add total_count
export interface RepledgeWithDetails {
  id: string;
  loan_id: string | null;
  loan_no: string | null;
  re_no: string | null;
  amount: number | null;
  created_at: string | null;
  status: string | null;
  bank_name: string | null;
  customer_name: string | null;
  customer_photo: string | null;
  customer_mobile: string | null;
  total_count?: number; // total_count is now returned by the function
}

export const useRepledgeData = (
  searchTerm: string = '',
  page: number = 1,
  itemsPerPage: number = 10,
  bankFilter: string = 'all',
  startDate: string = '',
  endDate: string = ''
) => {
  const [data, setData] = useState<RepledgeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { user, branch } = useAuth();

  const fetchRepledgeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        search_term: searchTerm.trim(),
        page_num: page,
        page_size: itemsPerPage,
        bank_id_filter: bankFilter !== 'all' ? bankFilter : null,
        start_date_filter: startDate || null,
        end_date_filter: endDate || null,
        branch_id_filter: user?.role === 'admin' ? null : (branch?.id || null)
      };

      // Call the database function instead of building a query
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'search_repledge_details',
        params
      );

      if (rpcError) {
        throw rpcError;
      }
      
      const transformedData: RepledgeWithDetails[] = rpcData || [];

      setData(transformedData);
      // Set the total count from the first record, if it exists
      if (transformedData.length > 0) {
        setTotalCount(transformedData[0].total_count || 0);
      } else {
        setTotalCount(0);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching repledge data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && branch) {
      fetchRepledgeData();
    }
  }, [searchTerm, page, itemsPerPage, bankFilter, startDate, endDate, user, branch]);

  return {
    data,
    loading,
    error,
    totalCount,
    refetch: fetchRepledgeData
  };
};