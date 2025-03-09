export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const paginateData = <T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): PaginationResult<T> => {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * limit;
  const end = start + limit;

  return {
    data: data.slice(start, end),
    pagination: {
      total,
      totalPages,
      currentPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }
  };
};