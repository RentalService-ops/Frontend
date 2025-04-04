export default function Table({ bookings, config, keyFn }) {
    return (
        <div className="table-responsive flex-grow-1">
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        {config.map((value) => (
                            <th key={value.label} className="p-3 text-center">{value.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((value1) => (
                        <tr key={keyFn(value1)}>
                            {config.map((eachValue,index) => (
                                <td key={eachValue.label} className="p-3 text-center">{eachValue.label === "#"?eachValue.render(index): eachValue.render(value1)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
