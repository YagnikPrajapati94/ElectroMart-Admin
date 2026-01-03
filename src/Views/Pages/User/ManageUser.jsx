import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import Skeleton from "react-loading-skeleton";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import UserService from "../../Services/UserService";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await UserService.getAllUsers();
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    // 🔍 Search on multiple fields
    const matchesSearch =
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toString().includes(search) ||
      user.role?.toLowerCase().includes(search) ||
      user.status?.toLowerCase().includes(search);

    // 🎭 Role filter
    const matchesRole = roleFilter ? user.role === roleFilter : true;

    // ⚡ Status filter
    const matchesStatus = statusFilter ? user.status === statusFilter : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row mb-4 px-2 align-items-center">
          <BreadCrumb parent={"Users"} child={"List"} />
          <div className="col-12 text-center p-0">
            <h3 className="fw-semibold TitleText m-0">Users Directory</h3>
            <small className="SubtitleText">
              View, search, and manage all registered Users here, including
              details, creation date, and more.
            </small>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6 mb-lg-0 mb-2 ms-auto">
            <label className="form-label">
              <small>Search</small>
            </label>
            <div className="input-group shadow-sm rounded-3 overflow-hidden">
              <span className="input-group-text searchIcon bg-white border-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="search"
                className="form-control searchBar border-0 py-2 bg-white"
                placeholder="Search Users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to first page
                }}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-md-0 mb-3">
            <label className="form-label">
              <small>Role</small>
            </label>
            {/* Role Base Filter in Dropdown  */}
            <select
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              value={roleFilter}
              className="form-select filterSelect "
              name=""
              id=""
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="form-label">
              <small>Status</small>
            </label>
            {/* Status Base Filter in Dropdown  */}
            <select
              onChange={(e) => {
                setStatusFilter(e.target.value), setCurrentPage(1);
              }}
              value={statusFilter}
              className="form-select filterSelect"
              name=""
              id="status"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="table-responsive rounded-3 shadow-sm">
              <table className="brands-table table table-hover align-middle mb-0 text-nowrap">
                <thead className="table-light">
                  <tr className="align-middle text-uppercase small text-secondary">
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading == true ? (
                    [...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <Skeleton height={20} width={20} />
                        </td>
                        <td>
                          <Skeleton height={20} width={120} />
                        </td>
                        <td>
                          <Skeleton height={20} width={120} />
                        </td>
                        <td>
                          <Skeleton height={20} width={120} />
                        </td>
                        <td>
                          <Skeleton height={20} width={120} />
                        </td>
                        <td>
                          <Skeleton height={20} width={80} />
                        </td>
                        <td>
                          <Skeleton height={20} width={80} />
                        </td>
                        <td>
                          <Skeleton height={20} width={80} />
                        </td>
                        <td className="text-end">
                          <Skeleton
                            height={30}
                            width={30}
                            inline
                            className="me-2"
                          />
                          <Skeleton height={30} width={30} inline />
                        </td>
                      </tr>
                    ))
                  ) : currentItems.length > 0 ? (
                    currentItems.map((user, index) => (
                      <tr key={user._id} style={{ cursor: "pointer" }}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>
                          {user.role == "admin" ? (
                            <span className="badge text-bg-primary rounded-2 px-3 py-2">
                              Admin
                            </span>
                          ) : (
                            <span className="badge text-bg-warning rounded-2 px-3 py-2">
                              User
                            </span>
                          )}
                        </td>
                        <td>
                          {user.status == "active" ? (
                            <span className="badge text-bg-success rounded-2 px-3 py-2">
                              Active
                            </span>
                          ) : (
                            <span className="badge text-bg-danger rounded-2 px-3 py-2">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td>
                          <span className="badge text-bg-light rounded-2 px-3 py-2">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="text-center ">⚠️</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <i className="bi bi-info-circle me-2"></i> No Users
                        found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Buttons */}
            {!loading && totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center py-3 px-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="SubtitleText small">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageUser;
