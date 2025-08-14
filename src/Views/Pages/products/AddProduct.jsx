import React from 'react'
import AdminLayout from '../AdminLayout'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { use } from 'react'

const AddProduct = () => {
    const baseURL = import.meta.env.VITE_API_URL;
    const token = sessionStorage.getItem('adminToken');
    const [brands, setBrands] = useState([]);
    const [brandID, setBrandID] = useState(null);
    const [categoryID, setCategoryID] = useState(null);
    // const [viewCategory, setViewCategory] = useState(false);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(false);

    // const [subcategories, setSubcategories] = useState([]);
    // const [viewSubCategory, setViewSubCategory] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()


    const handleFetchBrands = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/getBrands`);
            // console.log(res.data.brands);
            setBrands(res.data.brands);
            // setViewCategory(true);

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        handleFetchBrands();
    })

    const handleFetchBrandDetails = async (id) => {
        try {
            const res = await axios.get(`${baseURL}/api/getCategoriesByBrand/${id}`);
            console.log(res.data.categories);
            setCategory(res.data.categories);
            setValue("brand", brands.find(brand => brand._id === id).brandName);

        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        if (brandID !== null && brandID !== "") {
            handleFetchBrandDetails(brandID);

        }
    }, [brandID])

    const handleCategory = () => {
        setValue("category", category.find(cat => cat._id === categoryID).category);
        setSelectedCategory(category.find(cat => cat._id === categoryID).category);
        setSubcategory(category.find(cat => cat._id === categoryID).subcategory);
        console.log(category.find(cat => cat._id === categoryID).subcategory);

    }

    useEffect(() => {
        if (categoryID !== null && categoryID !== "") {
            handleCategory();
        }
    }, [categoryID])

    const handleProduct = async (data) => {

        try {
            console.log(data);
            toast.success("Product added successfully");
        } catch (error) {
            console.log(error);

        }

    }
    const attributeFields = {
        ac: [
            { label: "Capacity (Ton)", name: "capacity", type: "select", options: ["1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton"] },
            { label: "Star Rating", name: "starRating", type: "select", options: ["3 Star", "4 Star", "5 Star"] },
            { label: "Type", name: "type", type: "select", options: ["Split", "Window", "Portable"] },
            { label: "Inverter Technology", name: "inverter", type: "select", options: ["Yes", "No"] },
            { label: "Power Consumption (W)", name: "power", type: "number" },
            { label: "Noise Level (dB)", name: "noise", type: "number" },
            { label: "Cooling Capacity (W)", name: "cooling", type: "number" }
        ],
        tv: [
            { label: "Display Size (inches)", name: "displaySize", type: "select", options: ["32", "40", "43", "50", "55", "65"] },
            { label: "Display Type", name: "displayType", type: "select", options: ["LED", "OLED", "QLED"] },
            { label: "Resolution", name: "resolution", type: "select", options: ["HD", "Full HD", "4K", "8K"] },
            { label: "Smart TV", name: "smartTv", type: "select", options: ["Yes", "No"] },
            { label: "HDMI Ports", name: "hdmiPorts", type: "number" },
            { label: "USB Ports", name: "usbPorts", type: "number" }
        ],
        laptop: [
            { label: "Processor", name: "processor", type: "select", options: ["Intel i3", "Intel i5", "Intel i7", "Ryzen 5", "Ryzen 7"] },
            { label: "RAM (GB)", name: "ram", type: "select", options: ["4", "8", "16", "32"] },
            { label: "Storage Type", name: "storageType", type: "select", options: ["HDD", "SSD"] },
            { label: "Storage Capacity (GB)", name: "storageCapacity", type: "select", options: ["256", "512", "1024"] },
            { label: "Display Size (inches)", name: "screenSize", type: "select", options: ["13.3", "14", "15.6", "17.3"] },
            { label: "Graphics Card", name: "gpu", type: "text" },
            { label: "Operating System", name: "os", type: "select", options: ["Windows", "MacOS", "Linux"] }
        ],
        refrigerator: [
            { label: "Capacity (Liters)", name: "capacity", type: "select", options: ["190", "250", "300", "400", "500+"] },
            { label: "Star Rating", name: "starRating", type: "select", options: ["2 Star", "3 Star", "4 Star", "5 Star"] },
            { label: "Type", name: "type", type: "select", options: ["Single Door", "Double Door", "Side by Side", "Triple Door"] },
            { label: "Defrost Type", name: "defrostType", type: "select", options: ["Direct Cool", "Frost Free"] },
            { label: "Compressor Type", name: "compressor", type: "text" },
            { label: "Shelf Type", name: "shelfType", type: "select", options: ["Toughened Glass", "Wire"] }
        ]
    };


    const fields = selectedCategory
        ? attributeFields[selectedCategory.toLowerCase()]
        : [];


    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="row py-3 justify-content-center">
                    <div className="col-12">
                        <form onSubmit={handleSubmit(handleProduct)} action="" className='form-control  px-lg-5 bg-transparent border-0'>
                            <div className="row   ">
                                <div className="col-12   py-3 rounded-3 text-center px-0 ">
                                    <h4 className='fw-bold'>Add New Product</h4>
                                    <p className='text-secondary small m-0'>Fill in the details below to add a new electronic item to your store.</p>
                                </div>
                            </div>
                            <div className="row     rounded-3 mb-3">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">Enter Product Title</label>
                                        <input {...register("title", { required: true })} type="text" placeholder='Enter Product Title' className={`form-control ${errors.title ? "is-invalid" : ""}`} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">Enter Product Description</label>
                                        <textarea name="" id="" cols="30" rows="5" {...register("description", { required: true })} placeholder='Enter Product Description' className={`form-control ${errors.description ? "is-invalid" : ""}`}></textarea>
                                    </div>
                                </div>
                                <div className="col-xl-4">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">Select Product Brand</label>
                                        <select onClick={(e) => setBrandID(e.target.value)} className={`form-select ${errors.brand ? "is-invalid" : ""}`}>
                                            <option value="">Select Brand</option>
                                            {
                                                brands.map((brand) => (
                                                    <option key={brand._id} value={brand._id}>{brand.brandName}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="col-xl-4">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">Select Product Category</label>
                                        <select onClick={(e) => setCategoryID(e.target.value)} disabled={category.length === 0} className={`form-select ${errors.category ? "is-invalid" : ""}`}>
                                            <option value="">Select Category</option>
                                            {
                                                category.map((cat, index) => (
                                                    <option key={cat._id} value={cat._id}>{cat.category}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="col-xl-4">
                                    <div className="mb-3">
                                        <label className="form-label mb-1">Select Product SubCategory</label>
                                        <select {...register("subCategory", { required: true })} disabled={categoryID === null} className={`form-select ${errors.category ? "is-invalid" : ""}`}>
                                            <option value="">Select SubCategory</option>
                                            {
                                                subcategory.map((subcat, index) => (
                                                    <option key={index} value={subcat}>{subcat}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>
                                {fields.map((field, index) => {

                                    return (
                                        <div className="mb-3" key={index}>
                                            <label className="form-label">{field.label}</label>
                                            {field.type === "select" ? (
                                                <select {...register(`attributes.${field.label}`)} className="form-select">
                                                    <option value="">Select {field.label}</option>
                                                    {field.options.map((opt, i) => (
                                                        <option key={i} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : field.type === "checkbox" ? (
                                                <div className="form-check">
                                                    <input type="checkbox" {...register(`attributes.${field.label}`)} className="form-check-input" />
                                                    <label className="form-check-label">Yes</label>
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    {...register(`attributes.${field.label}`)}
                                                    className="form-control"
                                                    placeholder={`Enter ${field.label}`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}

                            </div>
                            <button type='submit' className='form-control shadow-none btn btn-dark'>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddProduct
