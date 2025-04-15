import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../Table";
import { useCookies } from "react-cookie";
import Pagination from "../../layout/Pagination"

const AdminQueries = () => {
    const [queries, setQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [resolvingQuery, setResolvingQuery] = useState(null);
    const [cookie] = useCookies();
    const [error, setError] = useState(null);
    
    // states for summary
    const [totalQueries, setTotalQueries] = useState(0);

    const productsPerPage = 5;

    const config=[
        {label:"Username",render:(query)=>query.username},
        {label:"Email",render:(query)=>query.useremail},
        {label:"Query",render:(query)=>query.query},
        {label:"Actions",render:(query)=>(<button
            onClick={() => handleMarkResolved(query.id)}
            className="btn btn-primary"
            disabled={resolvingQuery === query.id}
        >
            {resolvingQuery === query.id ? "Resolving..." : "Mark as Resolved"}
        </button>)}
    ];

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/queries/pending?page=${page}&size=${productsPerPage}&sortBy=query_id&direction=asc&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`
                }
            });

            setQueries(response.data);
            const total = response.data;
            setTotalQueries(total.length);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleMarkResolved = async (queryId) => {
        const confirmResolve = window.confirm("Are you sure you want to mark this query as resolved?");
        if (!confirmResolve) return;

        setResolvingQuery(queryId);
        try {
            await axios.put(`http://localhost:8080/api/admin/queries/${queryId}/resolve`, {}, {
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`
                }
            });

            alert("Query marked as resolved!");
            fetchQueries();
        } catch (error) {
            setError(error.message);
            alert("Failed to mark the query as resolved. Please try again.");
        }
        setResolvingQuery(null);
    };

    return (
        <div className="m-3 p-4">
            <h2 className="h4 fw-bold mb-4">Manage Queries</h2>
            <div className="d-flex gap-3 mb-4 small">
                <p className="bg-primary-subtle text-primary rounded p-3 shadow text-center">
                    <strong>Total Queries : {totalQueries} </strong>
                </p>
            </div>
            <input
                type="text"
                placeholder="Search Query..."
                className="form-control w-100 mb-4 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {queries ? 
            <Table config={config} bookings={queries} keyFn={(booking)=>booking.id}/> :<>
            {error && <div>{error}</div>}</>
            }
            <Pagination data={queries} currentPage={page} setCurrentPage={setPage} productsPerPage={productsPerPage} admin />
        </div>
    );
};

export default AdminQueries;