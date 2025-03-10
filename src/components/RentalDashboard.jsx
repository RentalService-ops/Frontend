export default function RentalDashboard(){
    return (
        <div className="container" style={{overflow:"scroll"}}>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Total Properties</h5>
                <p className="card-text text-center">25</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Total Tenants</h5>
                <p className="card-text text-center">50</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Monthly Income</h5>
                <p className="card-text text-center">$10,000</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Recent Activity</h5>
                <ul>
                  <li>Property 1 rented to Tenant A</li>
                  <li>Tenant B's lease renewed</li>
                  <li>Payment received from Tenant C</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}