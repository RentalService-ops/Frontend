export default function AdminPagination({ totalPages, currentPage, setCurrentPage }) {
    if (totalPages <= 1) return null;
  
    const goToPage = (page) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
      }
    };
  
    return (
      <nav className="my-4">
        <ul className="pagination flex justify-center gap-2">
          <li>
            <button
              className={`px-3 py-1 rounded border ${currentPage === 0 ? 'bg-gray-200 text-gray-500' : 'bg-white hover:bg-blue-100'}`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
          </li>
  
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                className={`px-3 py-1 rounded border ${currentPage === index ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'}`}
                onClick={() => goToPage(index)}
              >
                {index + 1}
              </button>
            </li>
          ))}
  
          <li>
            <button
              className={`px-3 py-1 rounded border ${currentPage === totalPages - 1 ? 'bg-gray-200 text-gray-500' : 'bg-white hover:bg-blue-100'}`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  }