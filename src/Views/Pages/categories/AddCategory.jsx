import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import { useForm } from 'react-hook-form';
import { speak } from '../../Layout/utils/speak';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategory = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem('adminToken');
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [brandId, setBrandId] = useState('');
    const [loading, setLoading] = useState(false);

    const brandId = watch("brand");

    // Fetch Brand Function 
    const fetchBrands = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/getBrands`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data.brands);
            const data = response.data.brands;
            setBrands(data);

        } catch (error) {
            console.error('Failed to fetch brands:', error);
            return [];
        }
    };

    useEffect(() => {
        fetchBrands()
    }, []);

    // Fetch Catergory by Brand



    const handleCategorySubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseURL}/api/addCategory`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            speak("Category added successfully");
            toast.success("Category added successfully");
            reset();
            // fetchCategories?.();

            // closeBtnRef.current.click();
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
            speak(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };







    return (
        <AdminLayout>
            <div className="container-fluid p-4  ">
                <div className="row mb-5 px-2  justify-content-center">
                    <div className="col-lg-12 bg-white py-2 mb-3 rounded-3">
                        {/* breadcrumbs */}
                        <nav aria-label="breadcrumb  " >
                            <ol className="breadcrumb nav  m-0   fw-bold">
                                <li className="breadcrumb-item "><p className='text-decoration-none m-0 text-black small' href="/admin/dashboard">Dashboard</p></li>
                                <li className="breadcrumb-item text-secondary small">Categories</li>
                                <li className="breadcrumb-item active small" aria-current="page">Add Category</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="col-lg-12 p-0  rounded-2 ">

                        <form className='form-control bg-white border-0 p-4 ' onSubmit={handleSubmit(handleCategorySubmit)}>
                            <h4 className="text-start fw-semibold">Add Category</h4>
                            <p className='text-secondary  small'>Create a new product category for a selected brand.
                                Each brand can have its own unique set of categories like Mobile, Laptop, or Television.</p>
                            <div className="mb-3">
                                <label className="form-label">Select Brand</label>
                                <select className={`form-select ${errors.brand ? 'is-invalid' : ''}`}  {...register("brand", { required: "Brand is required" })}>
                                    <option value="">Select Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="categoryName" className="form-label">Category Name</label>
                                <input type="text" {...register("category", { required: "Category Image is required" })} className={`form-control ${errors.category ? 'is-invalid' : ''}`} placeholder="Category Name" id="categoryName" />

                            </div>
                            <button type="submit" className="btn btn-dark px-5 py-2 shadow-none">
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    "Add Category"
                                )}
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </AdminLayout>
    )
}

export default AddCategory
