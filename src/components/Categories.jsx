import { useEffect, useState } from "react";
import AddCategory from "./AddCategory"
import Pagination from "./Pagination";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
export default function Categories() {
    const sampleData = [
        {
            categoryId: 1,
            user: "this user",
            name: "Name1",
            description: "This is a description"
        },
        {
            categoryId: 2,
            user: "this user2",
            name: "Name 2",
            description: "This is a description for name2"
        },
        {
            categoryId: 3,
            user: "this user2",
            name: "Name 2",
            description: "This is a description for name2"
        }
    ]

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryData, setCategoryData] = useState(sampleData);
    const [cookies]=useCookies()
    const id=jwtDecode(cookies.jwtToken).user_id;

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    useEffect(()=>{
        const controller=new AbortController();
        const signal=controller.signal;
        async function fetchData(){
            try{
            const response=await axios.get(`http://localhost:8080/api/category/category/${id}`,{//passing id of the renter of whose categories are to be fetched.
                params:{
                    Authorization:`Bearer ${cookies.jwtToken}`
                },
                signal:signal
            })
            setCategoryData(response.data.body);
        }
            catch(err){
                console.log(err.message);
            }
        }
        fetchData();
        return()=>{
            controller.abort();
        }
    },[])

    async function handleDelete(id){//passing id of the category to be deleted.
        try{
            const response =await axios.delete(`http://localhost:8080/api/category/category/${id}`,{
                params:{
                    Authrorization:`Bearer ${cookies.jwtToken}`
                }
            })
            const newCategoryData=categoryData.filter((category)=>category.categoryId !== response.data.categoryId);
            setCategoryData(newCategoryData);
        }
        catch(err){
            console.log(err.message);
        }
    }

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = categoryData.slice(indexOfFirstProduct, indexOfLastProduct);
    return (
        <>
            {
                !showAddCategory ?
                    <>  
                        <div className="mb-5">
                        <button className="btn btn-primary position-absolute " style={{ right: "0px" }}
                            onClick={() => setShowAddCategory(true)}>Add Category</button>
                            <Pagination data={categoryData} currentPage={currentPage} setCurrentPage={setCurrentPage}
                            productsPerPage={productsPerPage} />
                        </div>

                        <div className="d-flex flex-wrap gap-3 equipment-container">
                            {
                                currentProducts.map((category) => (
                                    <div class="card" style={{height: "auto",width:"335px"}}>
                                        <div class="card-body">
                                            <h5 class="card-title">{category.name}</h5>
                                            <p class="card-text">{category.description}</p>
                                            <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary">Edit</button>
                                            <button className="btn btn-danger" onClick={()=>handleDelete(category.categoryId)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                    :
                    <AddCategory setShowAddCategory={setShowAddCategory} />
            }
        </>
    )

}