import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import { useForm } from 'react-hook-form';
import { speak } from '../../Layout/utils/speak';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddSubCategory = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem('adminToken');
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [brandId, setBrandId] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewCategories, setViewCategories] = useState(false);

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
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/getCategoriesByBrand/${brandId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log(response);

            console.log(response.data.categories);
            setViewCategories(true);
            toast.success("Categories Founded Successfully");
            speak("Categories Founded Successfully");
            // const data = response.data.result;
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error(error.response.data.message);
            speak(error.response.data.message);
            setViewCategories(false);

        }
    };
    useEffect(() => {
        if (brandId) {
            fetchCategories();
        }
    }, [brandId]);



    const handleSubcategorySubmit = async (data) => {
        setLoading(true);
        try {
            console.log("Subcategory data:", data);

            const response = await axios.post(`${baseURL}/api/addSubCategory`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            speak("Subcategory added successfully");
            toast.success("Subcategory added successfully");
            reset();
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
            <div className="container-fluid p-4">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <h4 className="text-start fw-semibold">Add Subcategory</h4>
                        <p className='text-secondary  small'>Add a subcategory under a selected category and brand.</p>
                        <form onSubmit={handleSubmit(handleSubcategorySubmit)} action="" className='form-control bg-transparent border-0 p-0'>
                            <div className="mb-3">
                                <label className="form-label">Select Brand</label>
                                <select className={`form-select ${errors.brand ? 'is-invalid' : ''}`} {...register("brand", { required: "Brand is required" })}>
                                    <option value="">Select Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="subcategoryName" className="form-label">Select Category</label>
                                <select disabled={!viewCategories} className={`form-select ${errors.category ? 'is-invalid' : ''}`} id="categoryId" {...register("category", { required: "Category is required" })}>
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="subcategoryName" className="form-label">Subcategory Name</label>
                                <input {...register("subCategory", { required: "Subcategory Name is required" })} type="text" className={`form-control ${errors.subCategory ? 'is-invalid' : ''}`} placeholder="Subcategory Name" id="subcategoryName" />
                            </div>
                            <button type="submit" className="btn btn-dark form-control shadow-none">Add Subcategory</button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddSubCategory
