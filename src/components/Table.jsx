// export default function Table({bookings,config,keyFn}){
//     return(
//             <table className="gx-3 gy-3 border-3">
//                 <thead>
//                     <tr>
//                     {config.map((value)=>{
//                         return <th className="border-3 p-3" key={value.label}>{value.label}</th>
//                     })}
//                     </tr>
//                 </thead>
//                 <tbody>
//                         {
//                             bookings.map((value1)=>{
//                                 return(
//                                 <tr key={keyFn(value1)}>
//                                  {config.map((eachValue)=>(
//                                     <td key={eachValue.label} className="p-3 border-3">{eachValue.render(value1)}</td>
//                                  ))}
//                                 </tr>
//                                 )
//                             })
//                         }
//                 </tbody>
//             </table>
//     )
// }

export default function Table({ bookings, config, keyFn }) {
    return (
        <div className="table-responsive">
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
                            {config.map((eachValue) => (
                                <td key={eachValue.label} className="p-3 text-center">{eachValue.render(value1)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
