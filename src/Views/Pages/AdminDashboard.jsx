import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

import AdminLayout from "./AdminLayout";
import DashboardCard from "../Layout/Component/Cards/DashboardCard";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Bar } from "react-chartjs-2";
import DashboardService from "../Services/DashboardService";

const AdminDashboard = () => {
  const [brands, setBrands] = useState([]);
  const [counts, setCounts] = useState({});
  const { user } = useAuth();
  const baseURL = import.meta.env.VITE_API_URL;
  const fetchData = async () => {
    try {
      const res = await DashboardService.getCounts();
      setCounts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "New Users",
        data: [5, 12, 18, 25, 30, 40, 48, 55, 60, 70, 80, 95],
        backgroundColor: "rgba(78, 115, 223, 0.7)",
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#6c757d",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: "#212529",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#6c757d",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6c757d",
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
  };
  const userStatusData = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [counts.activeUsers || 0, counts.inactiveUsers || 0],
        backgroundColor: ["#28c76f", "#ea5455"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };
  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row ">
          <div className=" col-xxl-6 col-md-6 mb-4">
            <div className="card hover-shadow border-0  shadow-sm bg-light ">
              <div className="card-body row ">
                <div className="col-md-9 align-content-center">
                  <h6 className="fw-bold">
                    Congratulations{" "}
                    {user && (
                      <span className="text-primary">
                        {user.firstName} {user.lastName}
                      </span>
                    )}
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
            bg="bg-primary"
            path="/admin/categories/manage"
            title="Total Categories"
            count={counts.totalCategories}
            icon="bi-layers"
          />

          <DashboardCard
            bg="bg-success"
            path="/admin/subcategories/manage"
            title="Sub Categories"
            count={counts.totalSubCategories}
            icon="bi-diagram-3"
          />

          <DashboardCard
            bg="bg-warning"
            path="/admin/brands/manage"
            title="Brands"
            count={counts.totalBrands}
            icon="bi-tags"
          />

          <DashboardCard
            bg="bg-danger"
            path="/admin/users/manage"
            title="Total Users"
            count={counts.totalUsers}
            icon="bi-people"
          />

          <DashboardCard
            bg="bg-success"
            path="/admin/users/manage"
            title="Active Users"
            count={counts.activeUsers}
            icon="bi-person-check"
          />

          <DashboardCard
            bg="bg-danger"
            path="/admin/users/manage"
            title="Inactive Users"
            count={counts.inactiveUsers}
            icon="bi-person-x"
          />
        </div>
        <div className="row ">
          <div className="col-xl-8 mb-xl-0 mb-4 col-lg-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header py-3  border-0 d-flex justify-content-center align-items-center">
                <h6 className="fw-bold  mb-0">Monthly User Growth</h6>
                {/* <span className="small">2025</span> */}
              </div>

              <div className="card-body" style={{ height: "350px" }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Optional Right Side Summary */}
          <div className="col-xl-4  col-lg-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header py-3  border-0 d-flex justify-content-between">
                <h6 className="fw-bold mb-0">User Overview</h6>
                <i className="bi bi-people"></i>
              </div>

              <div className="card-body d-flex flex-column align-items-center">
                <div className="SubtitleText" style={{ width: "220px" }}>
                  <Doughnut data={userStatusData} options={doughnutOptions} />
                </div>

                <div className="d-flex gap-4 mt-3">
                  <div className="text-center">
                    <h6 className="mb-0 text-success">{counts.activeUsers}</h6>
                    <small className="SubtitleText">Active</small>
                  </div>
                  <div className="text-center">
                    <h6 className="mb-0 text-danger">{counts.inactiveUsers}</h6>
                    <small className="SubtitleText">Inactive</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
