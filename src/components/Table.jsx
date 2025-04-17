
export default function Table({ bookings, config, keyFn }) {
    return (
        <div className="flex-grow-1 p-3">
            {bookings.length > 0 ? (
                <div className="table-responsive shadow rounded-3 border">
                    <table className="table table-striped table-bordered table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                {config.map((value) => (
                                    <th
                                        key={value.label}
                                        className="text-center"
                                        style={{ padding: "1rem", fontWeight: "600", fontSize: "1rem" }}
                                    >
                                        {value.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={keyFn(booking)} className="text-center">
                                    {config.map((col) => (
                                        <td
                                            key={col.label}
                                            style={{
                                                padding: "1rem",
                                                verticalAlign: "middle",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            {col.render(booking, index)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="alert alert-info text-center mt-4">No data at the moment.</div>
            )}
        </div>
    );
}
