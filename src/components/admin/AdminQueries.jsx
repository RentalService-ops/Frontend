/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import Table from "../admin/ui/Table";
import { Tbody, Td, Th, Thead, Tr } from "../admin/ui/Table";
import { Loader2 } from "lucide-react";
import { useCookies } from "react-cookie";
import AdminPagination from "./AdminPagination";

const AdminQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [resolvingQuery, setResolvingQuery] = useState(null);
    const [cookie] = useCookies();
    const [error, setError] = useState(null);
    // states for summary
    const [totalQueries, setTotalQueries] = useState(0);
    const [resolvedQueries, setResolvedQueries] = useState(0);
    const [pendingQueries, setPendingQueries] = useState(0);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3;

    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/queries/unresolved?page=${page}&size=${productsPerPage}&sortBy=query_id&direction=asc&search=${search}`, {
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`
                }
            });

            setQueries(response.data);
            setTotalPages(response.data.totalPages);
            const total = response.data;
            setTotalQueries(total.length);
            setResolvedQueries(total.filter((u) => u.queryStatus === "resolved").length);
            setPendingQueries(total.filter((u) => u.queryStatus === "pending").length);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
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

    const handleMarkNotResolved = async (queryId) => {
        const confirmReopen = window.confirm("Are you sure you want to mark this query as Not Resolved?");
        if (!confirmReopen) return;

        setResolvingQuery(queryId);
        try {
            await axios.put(`http://localhost:8080/api/admin/queries/${queryId}/notresolved`, {}, {
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`
                }
            });

            alert("Query status changed to Not Resolved!");
            fetchQueries();
        } catch (error) {
            setError(error.message);
            alert("Failed to update the query status. Please try again.");
        }
        setResolvingQuery(null);
    };

    return (
        <div className="m-4 p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Queries</h2>
            <div className="flex gap-6 mb-4 text-sm gap-5">
                <p className="bg-blue-100 text-blue-800 rounded p-4 shadow">
                    <strong>Total Queries : {totalQueries} </strong>
                </p>
                <p className="bg-green-100 text-green-800 rounded p-4 shadow">
                    <strong>Resolved Queries : {resolvedQueries} </strong>
                </p>
                <p className="bg-yellow-100 text-yellow-800 rounded p-4 shadow">
                    <strong>Pending Queries : {pendingQueries} </strong>
                </p>
            </div>
            <input
                type="text"
                placeholder="Search Query..."
                className="border p-2 rounded w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
                <div className="flex justify-center">
                    <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <Table className="w-full border">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Username</Th>
                            <Th>Email</Th>
                            <Th>Query</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {queries.map((query) => (
                            <Tr key={query.id}>
                                <Td>{query.id}</Td>
                                <Td>{query.username}</Td>
                                <Td>{query.useremail}</Td>
                                <Td>{query.query}</Td>
                                <Td>
                                    <span
                                        className={`px-2 py-1 rounded text-white ${query.queryStatus.toLowerCase() === "resolved"
                                            ? "bg-green-500"
                                            : query.queryStatus.toLowerCase() === "pending"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                            }`}
                                    >
                                        {query.queryStatus}
                                    </span>
                                </Td>
                                <Td>
                                    {query.queryStatus.toLowerCase() === "pending" ? (
                                        <button
                                            onClick={() => handleMarkResolved(query.id)}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                                            disabled={resolvingQuery === query.id}
                                        >
                                            {resolvingQuery === query.id ? "Resolving..." : "Mark as Resolved"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMarkNotResolved(query.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:bg-gray-400"
                                            disabled={resolvingQuery === query.id}
                                        >
                                            {resolvingQuery === query.id ? "Updating..." : "Mark as Pending"}
                                        </button>
                                    )}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
            {/* Pagination Component */}
            <div className="m-5">
                <AdminPagination
                    totalPages={totalPages}
                    currentPage={page}
                    setCurrentPage={setPage}
                />
            </div>
        </div>
    );
};

export default AdminQueries;