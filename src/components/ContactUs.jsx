export default function ContactUs() {

    function handleSubmit(){
        alert("Your query is submitted. It will be resolved at earliest.")
    }

    return (
        <div style={{ height: "80vh" }}>
            <div className="login-container">
                <h2 style={{textAlign:"center"}}>Contact Us</h2>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Enter your email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" />
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput2" className="form-label">Enter your Name</label>
                    <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="eg- John Doe" />
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Enter your message</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" placeholder="Short Description of your query" rows="3"></textarea>
                </div>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}