export default function Pagination({data,currentPage,setCurrentPage,productsPerPage}){
    const length= data?.length || 0;
    const totalPages = Math.ceil(length / productsPerPage);
    console.log(totalPages)
    return(
        <> 
            {totalPages > 1 && (
                <nav className="mb-0">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                Previous
                            </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}

                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    )
}