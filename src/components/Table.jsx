export default function Table({ bookings, config, keyFn }) {

    return (
        <div className="table-responsive flex-grow-1">
            { bookings.length > 0 ?
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        {config.map((value) => (
                            <th key={value.label} className="p-3 text-center">{value.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((value1,index) => (
                        <tr key={keyFn(value1)}>
                            <td>{index+1}</td>
                            {config.map((eachValue) => (
                                <td key={eachValue.label} className="p-3 text-center">{eachValue.render(value1)}</td>
                            ))}
                        </tr>
                    )) }
                </tbody>
            </table>    
                : <div>No Data available...</div>}
        </div>
    );
  }
  