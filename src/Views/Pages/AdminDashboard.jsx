import React from 'react'
import AdminLayout from './AdminLayout'
import DashboardCard from '../Layout/Component/Cards/DashboardCard';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const AdminDashboard = () => {
    const [brands, setBrands] = useState([]);
    const baseURL = import.meta.env.VITE_API_URL;
    const fetchData = async () => {
        try {
            // get brands 
            const res = await axios.get(`${baseURL}/api/getBrands`);
            setBrands(res.data.brands);


        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <AdminLayout>
            <div className="container-fluid p-4">
                <div className="row">
                    {/* <div className="col-12 fs-5 mb-3 text-dark bg-body-tertiary py-1 shadow-lg">
                        Dashboard
                    </div> */}
                </div>
                <div className="row ">
                    {/* <DashboardCard bg={"bg-primary"} path={"/admin/products/add"} title={"Total Products"} count={100} icon="bi-box-seam" /> */}
                    <DashboardCard bg={"bg-danger"} path={"/admin/brands"} title={"Total Brands"} count={brands.length} icon="bi-tags-fill" />
                    <DashboardCard bg={"bg-danger"} path={"/admin/brands"} title={"Total Brands"} count={brands.length} icon="bi-tags-fill" />
                </div>
            </div>

        </AdminLayout>
    )
}

export default AdminDashboard
