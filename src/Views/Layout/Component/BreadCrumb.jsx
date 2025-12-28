import React from "react";

const BreadCrumb = ({ parent, child }) => {
  return (
    <>
      <div className="col-lg-12 bg-white breadcrumb-container  py-2 mb-4 rounded-3">
        {/* breadcrumbs */}
        <nav aria-label="breadcrumb  ">
          <ol className="breadcrumb nav   m-0   fw-bold">
            {/* <li className="breadcrumb-item "><a className='text-decoration-none m-0 text-black small' href="/admin/dashboard">Dashboard</a></li> */}
            <li className="breadcrumb-item non-active  small">{parent}</li>
            <li className="breadcrumb-item active small" aria-current="page">
              {child}
            </li>
          </ol>
        </nav>
      </div>
    </>
  );
};

export default BreadCrumb;
