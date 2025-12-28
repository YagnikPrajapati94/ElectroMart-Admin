import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({ title, count, icon, path, bg }) => {
  return (
    <>
      <div className=" col-xxl-3 col-md-6 mb-lg-0 mb-3">
        <div className="card h-100  hover-shadow border-0 shadow-sm bg-light ">
          <div className="card-body d-flex align-items-center">
            <div
              className={`card-icon rounded-2 ${bg} fs-3 text-light border me-3`}
            >
              <i className={icon}></i>
            </div>
            <div className="d-grid gap-1">
              <p className="m-0 text-secondary">{title}</p>
              <p className="m-0 fw-bold fs-5">{count}</p>
              <Link className="text-decoration-none" to={path}>
                More Details{" "}
                <i className="bi small bi-chevron-double-right"></i>{" "}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCard;
