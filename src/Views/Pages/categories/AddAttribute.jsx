import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import BreadCrumb from "../../Layout/Component/BreadCrumb";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { speak } from "../../Layout/utils/speak";

const AddAttribute = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_URL;
  const token = sessionStorage.getItem("adminToken");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({
    mode: "onChange", // ✅ Real-time validation
    defaultValues: {
      category: "",
      attributes: [
        {
          label: "",
          name: "",
          type: "",
          options: "",
        },
      ],
    },
  });

  const handleAttributeSubmit = async (data) => {
    setLoading(true);
    try {
      const formattedAttributes = data.attributes.map((attr) => ({
        ...attr,
        options: attr.options
          ? attr.options.split(",").map((opt) => opt.trim())
          : [],
      }));

      const finalData = {
        category: data.category,
        attributes: formattedAttributes,
      };
      const res = await axios.post(`${baseURL}/api/addAttribute`, finalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Form submitted:", finalData);
      toast.success(res.data.message);
      speak(res.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add attributes");
      speak(error.response?.data?.message || "Failed to add attributes");
      setLoading(false);
    }
  };

  const { fields, append, remove } = useFieldArray({
    name: "attributes",
    control,
  });

  const handleAddRow = (e) => {
    e.preventDefault();
    append({
      label: "",
      name: "",
      type: "",
      options: "",
    });
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/getOnlyCategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <div className="row px-2">
          <BreadCrumb parent={"Categories"} child={"Add Attribute"} />
          <div className="col-12 p-0">
            <form
              onSubmit={handleSubmit(handleAttributeSubmit)}
              className="p-4 rounded-2 pb-0"
            >
              <div className="row">
                <div className="col-12">
                  <h4 className="text-start TitleText fw-semibold">
                    Add Product Attributes
                  </h4>
                  <p className="SubtitleText small m-0">
                    Product attributes are additional details about your
                    products, such as brand, size, color, or technical
                    specifications. These attributes help customers filter and
                    compare products easily.
                  </p>
                </div>
                <div className="divider">
                  <hr className="w-100" />
                </div>

                {/* Category Select */}
                <div className="col-12 mb-3">
                  <label className="form-label">Select Category</label>
                  <select
                    disabled={categories.length === 0}
                    className={`form-select ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    {...register("category", {
                      required: "Category is required",
                    })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attributes Table */}
                <div className="col-12">
                  <label className="form-label">Attributes</label>
                  <div className="table-responsive">
                    <table className="attributes-table table  ">
                      <thead className="">
                        <tr>
                          <th style={{ width: "3%" }}>No</th>
                          <th style={{ width: "20%" }}>
                            Label <br />
                            <small className="SubtitleText">
                              Ex: Processor, RAM{" "}
                            </small>
                          </th>
                          <th style={{ width: "20%" }}>
                            Name <br />
                            <small className="SubtitleText">
                              Ex: Processor, RAM
                            </small>
                          </th>
                          <th style={{ width: "20%" }}>
                            Type <br />
                            <small className="SubtitleText">
                              Ex: Text / Select
                            </small>
                          </th>

                          <th style={{ width: "20%" }}>
                            Options <br />
                            <small className="SubtitleText">
                              Ex: Option1, Option2
                            </small>
                          </th>

                          <th style={{ width: "5%" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody className=" tbody-attribute">
                        {fields.map((item, index) => {
                          const selectedType = watch(
                            `attributes.${index}.type`
                          );
                          return (
                            <tr key={item.id}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <input
                                  type="text"
                                  className={` form-control ${
                                    errors.attributes?.[index]?.label
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="e.g. Processor, RAM"
                                  {...register(`attributes.${index}.label`, {
                                    required: "Label is required",
                                  })}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className={`form-control ${
                                    errors.attributes?.[index]?.name
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  placeholder="e.g. processor, ram"
                                  {...register(`attributes.${index}.name`, {
                                    required: "Name is required",
                                  })}
                                />
                              </td>
                              <td>
                                <select
                                  {...register(`attributes.${index}.type`, {
                                    required: "Type is required",
                                  })}
                                  className={`form-select ${
                                    errors.attributes?.[index]?.type
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                >
                                  <option value="">Select Type</option>
                                  <option value="text">Text</option>
                                  <option value="number">Number</option>
                                  <option value="select">Select</option>
                                  <option value="color">Color</option>
                                </select>
                              </td>

                              {selectedType === "select" ? (
                                <td>
                                  <input
                                    type="text"
                                    disabled={
                                      !selectedType ||
                                      selectedType === "text" ||
                                      selectedType === "number"
                                    }
                                    className={`form-control ${
                                      errors.attributes?.[index]?.options
                                        ? "is-invalid"
                                        : ""
                                    }`}
                                    placeholder="Enter options (comma separated)"
                                    {...register(
                                      `attributes.${index}.options`,
                                      {
                                        required: "Options are required",
                                      }
                                    )}
                                  />
                                </td>
                              ) : (
                                <td className="text-center text-danger">
                                  Disabled
                                </td>
                              )}
                              <td>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="btn btn-danger"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="border-0 ">
                          <td className="p-0 border-0">
                            <button
                              type="button"
                              onClick={handleAddRow}
                              className="btn btn-primary form-control  rounded-0 "
                            >
                              {/* rounded plus icon  */}

                              <i className="bi bi-plus-circle"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Submit */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn text-light form-control login-btn border-0 shadow-none"
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      "Add Attributes"
                    )}
                  </button>
                  {/* help guide  */}
                  <a href="#" className="text-decoration-none">
                    <p className="SubtitleText text-center mt-3 small">
                      Need assistance?{" "}
                      <span className="text-primary">View attribute guide</span>
                    </p>
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddAttribute;
