import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Game list pagination">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <span aria-hidden="true">&lsaquo;</span>
          </button>
        </li>
        
        {getPageNumbers().map(page => (
          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : null}
            >
              {page}
            </button>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <span aria-hidden="true">&rsaquo;</span>
          </button>
        </li>

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;