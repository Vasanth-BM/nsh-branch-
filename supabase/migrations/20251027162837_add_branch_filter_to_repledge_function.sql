/*
  # Add Branch-Filtered Repledge Search Function

  1. New Function
    - `search_repledge_details` - Search and paginate repledge entries with branch filtering
    - Filters by branch_id when provided
    - Supports search term, bank filter, and date range filters
    - Returns paginated results with total count

  2. Security
    - Function is accessible to authenticated users
    - Respects branch-level data isolation
*/

CREATE OR REPLACE FUNCTION search_repledge_details(
  search_term TEXT DEFAULT '',
  page_num INT DEFAULT 1,
  page_size INT DEFAULT 10,
  bank_id_filter UUID DEFAULT NULL,
  start_date_filter DATE DEFAULT NULL,
  end_date_filter DATE DEFAULT NULL,
  branch_id_filter UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  loan_id UUID,
  loan_no TEXT,
  re_no TEXT,
  amount NUMERIC,
  created_at TIMESTAMPTZ,
  status TEXT,
  bank_name TEXT,
  customer_name TEXT,
  customer_photo TEXT,
  customer_mobile TEXT,
  total_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH filtered_data AS (
    SELECT
      re.id,
      re.loan_id,
      l.loan_no,
      re.repledge_no AS re_no,
      re.amount,
      re.created_at,
      re.status,
      b.name AS bank_name,
      c.name AS customer_name,
      c.photo_url AS customer_photo,
      c.mobile_no AS customer_mobile
    FROM repledges re
    LEFT JOIN loans l ON re.loan_id = l.id
    LEFT JOIN customers c ON l.customer_id = c.id
    LEFT JOIN banks b ON re.bank_id = b.id
    WHERE
      (branch_id_filter IS NULL OR re.branch_id = branch_id_filter)
      AND (
        search_term = '' 
        OR c.name ILIKE '%' || search_term || '%'
        OR l.loan_no ILIKE '%' || search_term || '%'
        OR re.repledge_no ILIKE '%' || search_term || '%'
      )
      AND (bank_id_filter IS NULL OR re.bank_id = bank_id_filter)
      AND (start_date_filter IS NULL OR re.created_at::DATE >= start_date_filter)
      AND (end_date_filter IS NULL OR re.created_at::DATE <= end_date_filter)
  ),
  counted_data AS (
    SELECT COUNT(*) AS total FROM filtered_data
  )
  SELECT
    fd.*,
    cd.total AS total_count
  FROM filtered_data fd
  CROSS JOIN counted_data cd
  ORDER BY fd.created_at DESC
  LIMIT page_size
  OFFSET (page_num - 1) * page_size;
END;
$$;