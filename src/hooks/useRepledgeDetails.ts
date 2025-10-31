import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { applyBranchFilter } from '../lib/branchFilter';

export interface RepledgeEntry {
  id: string;
  loan_id: string | null;
  repledge_no: string;
  date: string | null;
  amount: number | null;
  interest_rate: number | null;
  validity_months: number | null;
  status: string;
  bank_id: string | null;
  branch_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface RepledgeWithDetails extends RepledgeEntry {
  loan?: {
    id: string;
    loan_no: string;
    customer_id: string;
    amount: number;
    date: string;
  };
  close_repledges?: Array<{
    id: string;
    end_date: string;
    payment_method: string;
    calculation_method: string;
    duration: number;
    final_interest_rate: number;
    calculated_interest: number;
    total_payable: number;
    created_at: string;
  }>;
}

interface Customer {
  id: string;
  name: string;
  mobile_no: string | null;
  photo_url: string | null;
}

export interface RepledgeDetailWithCustomer extends RepledgeWithDetails {
  customer?: Customer;
  bank?: {
    id: string;
    name: string;
  };
}

const ITEMS_PER_PAGE = 10;

export const useRepledgeDetails = () => {
  const [repledges, setRepledges] = useState<RepledgeDetailWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bankFilter, setBankFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { user, branch } = useAuth();

  const fetchRepledges = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('repledges')
        .select(`
          *,
          loans (
            id,
            loan_no,
            customer_id,
            amount,
            date,
            customers (
              id,
              name,
              mobile_no,
              photo_url
            )
          ),
          banks (
            id,
            name
          ),
          close_repledges (
            id,
            end_date,
            payment_method,
            calculation_method,
            duration,
            final_interest_rate,
            calculated_interest,
            total_payable,
            created_at
          )
        `);

      query = applyBranchFilter(query, user, branch);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const repledgesWithCustomers = data?.map((repledge: any) => ({
        ...repledge,
        customer: repledge.loans?.customers?.[0] || null,
        loan: repledge.loans,
      })) || [];

      setRepledges(repledgesWithCustomers);
    } catch (error) {
      console.error('Error fetching repledges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && branch) {
      fetchRepledges();
    }
  }, [user, branch]);

  const filteredRepledges = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    return repledges
      .filter(rep => {
        const s = search.toLowerCase();
        return (
          s === '' ||
          rep.customer?.name?.toLowerCase().includes(s) ||
          rep.customer?.mobile_no?.includes(s) ||
          rep.loan?.loan_no?.toLowerCase().includes(s) ||
          rep.repledge_no?.toLowerCase().includes(s)
        );
      })
      .filter(rep => bankFilter === 'all' || rep.bank_id === bankFilter)
      .filter(rep => statusFilter === 'All' || rep.status === statusFilter)
      .filter(rep => {
        if (!rep.date) {
          return dateFilter === 'All' && !startDate && !endDate;
        }

        const repDate = new Date(rep.date);
        repDate.setHours(0, 0, 0, 0);

        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return repDate >= start && repDate <= end;
        }

        switch (dateFilter) {
          case 'All':
            return true;
          case 'Today':
            return repDate.getTime() === today.getTime();
          case 'This Week':
            return repDate >= startOfWeek;
          case 'This Month':
            return repDate >= startOfMonth;
          case 'This Year':
            return repDate >= startOfYear;
          default:
            return true;
        }
      });
  }, [repledges, search, bankFilter, statusFilter, dateFilter, startDate, endDate]);

  const paginatedRepledges = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRepledges.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRepledges, currentPage]);

  const totalPages = Math.ceil(filteredRepledges.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRepledges.length]);

  return {
    repledges: paginatedRepledges,
    loading,
    filteredRepledges,
    search,
    setSearch,
    bankFilter,
    setBankFilter,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount: filteredRepledges.length,
    refetch: fetchRepledges,
  };
};
