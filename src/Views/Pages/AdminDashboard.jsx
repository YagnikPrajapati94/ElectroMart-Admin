import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

import AdminLayout from "./AdminLayout";
import DashboardCard from "../Layout/Component/Cards/DashboardCard";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Bar } from "react-chartjs-2";

const AdminDashboard = () => {
  const [brands, setBrands] = useState([]);
  const { user } = useAuth();
  const baseURL = import.meta.env.VITE_API_URL;
  const fetchData = async () => {
    try {
      // get brands
      const res = await axios.get(`${baseURL}/api/getBrands`);
      setBrands(res.data.brands);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45, 50, 60, 70, 80, 90],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        ticks: {
          color: "gray", // X-axis labels color
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row mb-4">
          <div className=" col-xxl-6 col-md-6 mb-lg-0 mb-3">
            <div className="card hover-shadow border-0  shadow-sm bg-light ">
              <div className="card-body row ">
                <div className="col-md-9 align-content-center">
                  <h6 className="fw-bold">
                    Congratulations{" "}
                    <span className="text-primary">
                      {user.firstName} {user.lastName}
                    </span>
                    !
                  </h6>
                  <p className="SubtitleText">
                    You have successfully logged into your account.
                  </p>
                  <button className="btn login-btn border-0 shadow-none text-white btn-sm px-4">
                    View Sales
                  </button>
                </div>
                <div className="col-md-3 text-end">
                  <img
                    src="/common/prize.png"
                    className="img-fluid w-50"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
          <DashboardCard
            bg={"bg-danger"}
            path={"/admin/brands"}
            title={"Total Brands"}
            count={brands.length}
            icon="bi-tags-fill"
          />
          <DashboardCard
            bg={"bg-danger"}
            path={"/admin/brands"}
            title={"Total Brands"}
            count={brands.length}
            icon="bi-tags-fill"
          />
        </div>
        {/* <div className="row ">
          <div className=" col-8   mb-lg-0 mb-3">
            <div className="card hover-shadow border-0 shadow-sm bg-light ">
              <div className="card-body ">
                <Bar options={options} data={data} />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
