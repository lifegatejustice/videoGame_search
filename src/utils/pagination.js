// Pagination utility functions
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Parse pagination parameters from request query
const parsePaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(query.limit) || DEFAULT_LIMIT));

  return { page, limit };
};

// Calculate pagination metadata
const getPaginationMetadata = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
  };
};

// Apply pagination to mongoose query
const applyPagination = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

// Create pagination links (for future use with HATEOAS)
const createPaginationLinks = (baseUrl, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const links = {};

  if (page > 1) {
    links.prev = `${baseUrl}?page=${page - 1}&limit=${limit}`;
  }

  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}&limit=${limit}`;
  }

  links.first = `${baseUrl}?page=1&limit=${limit}`;
  links.last = `${baseUrl}?page=${totalPages}&limit=${limit}`;

  return links;
};

module.exports = {
  parsePaginationParams,
  getPaginationMetadata,
  applyPagination,
  createPaginationLinks,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
};
