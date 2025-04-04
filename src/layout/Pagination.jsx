export default function Pagination({data,currentPage,setCurrentPage,productsPerPage}){
    const length= data?.length || 0;
    const totalPages = Math.ceil(length / productsPerPage);
    return(
        <> 
           {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center bg-white     border-top shadow-sm py-3 "
                                    style={{
                                        position: "sticky",
                                        bottom: "0",
                                        left: "0",
                                        width: "100%",
                                    }}
                                >
                                    <button
                                        className="btn btn-outline-primary me-2 "
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span>
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="btn btn-outline-primary ms-2"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
        </>
    )
}


