import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { designationOptions } from "../utils/index";
import { showNotification } from "../components/Toast";
import Dropdown from "../components/Dropdown";
import { BASE_URL } from "../constant";
import InlineLoader from "../components/InlineLoader";
import { FiUserPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiSave, FiX } from "react-icons/fi";

function AddAdmin() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validPwd, setValidPwd] = useState(true);
  const [validMatch, setValidMatch] = useState(false);
  const [formErrors, setFormErrors] = useState<any>();
  const [loading, setLoading] = useState(false);

  const [departmentData, setDepartmentData] = useState<any>();
  const [editState, setEditState] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getUserDetails(paginationModel.page, paginationModel.pageSize);
  };
  const columns: any[] = [
    {
      field: "s_no",
      headerName: "S. No",
      width: 100,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Admin Name",
      width: 220,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="font-semibold text-gray-900 text-lg">
          {params.value}
        </div>
      ),
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 180,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
          {params.value}
        </span>
      ),
    },
    {
      field: "department",
      headerName: "Departments",
      width: 250,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="font-medium text-gray-700">
          {params.value}
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 280,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="text-blue-600 hover:text-blue-800 transition-colors">
          {params.value}
        </div>
      ),
    },
    {
      field: "joiningDate",
      headerName: "Joining Date",
      width: 160,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <span className="text-sm text-gray-600">
          {new Date(params.value).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="max-w-[230px]">
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {params.value || "No description available"}
          </div>
        </div>
      ),
    },
  ];

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!*@#$%]).{8,24}$/;

  useEffect(() => {
    const result = PWD_REGEX.test(matchPwd);
    if (result && validMatch) {
      setFormData((prevValues: any) => ({ ...prevValues, password: matchPwd }));
      // setFormErrors((prevValues) => ({ ...prevValues, password: "" }));
    } else {
      setFormData((prevValues: any) => ({
        ...prevValues,
        password: undefined,
      }));
      /* setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Enter a valid password",
      })); */
    }
  }, [pwd, matchPwd, validMatch]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  const axiosHandler = useAxios();
  const getUserDetails = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`auth/getUserList?page=${page + 1}&limit=${pageSize}`);

      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setUserList(data);
      setTotalRows(totalItems);
    } catch (error: any) {}
    finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getUserDetails(paginationModel?.page, paginationModel?.pageSize);
  }, []);

  const getAllDept = async () => {
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds`);
      const data = response?.data?.data;
      setDepartmentData(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getAllDept();
  }, []);

  const deptOptions = departmentData?.map((item: any) => ({
    value: item?.id,
    label: item?.name,
  }));
  const resetStates = () => {
    setFormErrors({});
    setFormData(null);
    setPwd("")
    setMatchPwd("");
    setEditState(false);
  };

  const adminList = userList?.filter((item: any) => item?.role === 10001);
  
  

  useEffect(() => {
    if (Array.isArray(adminList)) {
      const formattedRows = adminList.map((user: any, index: number) => ({
        ...user,
        id: user?._id,
        s_no: index + 1,
        designation: designationOptions?.find(
          (item: any) => item.value == user?.designationId
        )?.label,
        department: user.department.map(
          (departmentId: any) =>
            deptOptions?.find(
              (item: { value: string; label: string }) =>
                item.value === departmentId
            )?.label
        ),
        joiningDate: formatDate(user?.joiningDate),
      }));
      setRows(formattedRows);
  
    }
  }, [userList]);
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const requiredInputFields: any = {
    name: true,
    joiningDate: true,
    email: true,
    mobile: true,
    password: editState ? false : true,
    // deptId: true,
    designationId: true,
  };

  const formatLabel = (key: any) => {
    if (!key) return;
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str: any) => str.toUpperCase());
  };
  const validateForm = () => {
    const validationErrors: any = {};
    Object.keys(requiredInputFields).forEach((key) => {
      const value = formData[key];

      if (requiredInputFields[key]) {
        if (typeof value === "string") {
          const trimmedValue = value?.trim();
          if (!trimmedValue) {
            validationErrors[key] = `${formatLabel(key)} is required`;
          }
          if (trimmedValue && key === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedValue.trim())) {
              validationErrors[key] = "Invalid email format";
            }
          }
          if (!trimmedValue && !validPwd && key === "password") {
            validationErrors[key] = "Enter a valid Password";
          } else if (
            !validPwd &&
            trimmedValue &&
            trimmedValue.length < 8 &&
            key === "password"
          ) {
            validationErrors[key] = "Password must have atleast 8 characters!";
          } else if (
            !validPwd &&
            trimmedValue &&
            trimmedValue.length >= 8 &&
            key === "password"
          ) {
            validationErrors[key] = "Enter a valid Password";
          }
          if (trimmedValue && key === "mobile") {
            if (trimmedValue.length < 10 || trimmedValue.length > 10) {
              validationErrors[key] = "Phone Number must have 10 Digits!";
            }
          }
        } else if (value === null || value === undefined || value === "") {
          if (key === "deptId") {
            validationErrors[key] = `Department is required`;
          } else if (key === "designationId") {
            validationErrors[key] = `Designation is required`;
          } else if (key === "mobile") {
            validationErrors[key] = `Phone Number is required`;
          } else {
            validationErrors[key] = `${formatLabel(key)} is required`;
          }
        }
      }
    });
    setFormErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const trimObjectValues: any = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj.map(trimObjectValues);
    } else if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc: any, key) => {
        acc[key] = trimObjectValues(obj[key]);
        return acc;
      }, {});
    } else if (typeof obj === "string") {
      return obj.trim();
    }
    return obj;
  };

  const handleEdit = (user: any) => {
    setEditState(true);
    const userDetails = {
      ...user,
      joiningDate: formatDate(user?.joiningDate),
      designationId: designationOptions.find(
        (item: any) => item.value == user?.designationId
      ),
      department: user?.department.map((departmentLabel: string) => {
        const department = deptOptions.find(
          (item: { label: string; value: string }) =>
            item?.label === departmentLabel
              ? { label: item.label, value: item.value }
              : null
        );
        return department;
      }),
    };
    setFormData(userDetails);
    setIsModalOpen(true);
  };

  const deleteUserById = async (id: any) => {
    try {
      const response = await axiosHandler.get(`auth/deleteUserById/${id}`);
      if (response) {
        setLoading(false);
        showNotification("success", "Admin deleted successfully!");
      }
      getUserDetails(paginationModel?.page, paginationModel?.pageSize);
    } catch (error: any) {
      setLoading(false);
      showNotification("error", "Something went wrong");
    }
  };
  const handleDelete = (_id: string) => {
    setLoading(true);
    deleteUserById(_id);
    setLoading(false);
  };

  const onClickAction = (actionType: any, row: any, id: any) => {
    if (actionType === "EDIT") {
      handleEdit(row);
    } else if (actionType === "DELETE") {
      handleDelete(id);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevValues: any) => ({ ...prevValues, [name]: value }));
  };

  const handleDesignationChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      designationId: option,
    }));
  };
  const handleDropdownChange = (option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      department: option,
    }));
  };
  // const createUser = async (data: any) => {
  //   try {
  //     const response = await axiosHandler.put(`auth/signup/${data}`);
  //     getUserDetails();
  //   } catch (error: any) {}
  // };

  const appState: any = useContext(AppContext);

  const createUser = async (data: any) => {
    const url = `${BASE_URL}auth/signup`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headersList,
        body: JSON.stringify(data),
      });
      if (response) {
        setLoading(false);
        showNotification("success", "Admin created successfully!");
      }
    } catch (error) {
      setLoading(false);
      showNotification("error", "Something went wrong");
    }
  };
  const updateUser = async (data: any, id: any) => {
    const url = `${BASE_URL}auth/updateUserById/${id}`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headersList,
        body: JSON.stringify(data),
      });
      if (response) {
        getUserDetails(paginationModel?.page, paginationModel?.pageSize);
        setLoading(false);
        showNotification("success", "Admin updated successfully!");
      }
    } catch (error) {
      setLoading(false);
      showNotification("error", "Something went wrong");
    }
  };

  const onClickButton = (type: string) => {
    if (type) {
      handleSubmit();
    } else {
      setIsModalOpen(!isModalOpen);
      setFormErrors("");
    }
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      setEditState(false);
      setLoading(true);
      const userData: any = {
        ...formData,
        designationId: Number(formData?.designationId?.value),
        departmentIds: formData?.department?.map((item: any) => item?.value),
        password: matchPwd,
        role: 10001,
      };
     
      if (userData?.id) {
        await updateUser(userData, userData?.id);
      } else {
        await createUser(userData);
      }
      setLoading(false)
      setIsModalOpen(!isModalOpen);
      resetStates();
      getUserDetails(paginationModel?.page, paginationModel?.pageSize);
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Management</h1>
            <p className="text-gray-600">Manage system administrators and their permissions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRows || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUserPlus className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Admins</p>
                  <p className="text-2xl font-bold text-green-600">{rows?.filter((admin: any) => admin.is_active !== false)?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiEdit2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-purple-600">{departmentData?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiTrash2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <GridTable
              onClickAction={onClickAction}
              actions={["DELETE", "EDIT"]}
              rowData={rows}
              onClickAdd={() => {
                setIsModalOpen(true);
                resetStates();
              }}
              columnData={columns}
              toolTipName={"Create Admin"}
              onPaginationChange={handlePaginationChange}
              rowCount={totalRows}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isLoading={loading}
          modalSize="max-w-4xl"
          modalHeader={editState ? "Update Admin" : "Create Admin"}
          modalBody={
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Full Name
                    {requiredInputFields.name && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors?.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter full name"
                  />
                  {formErrors?.name && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                  )}
                </div>
                {/* Phone Number */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Phone Number
                    {requiredInputFields.mobile && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData?.mobile || ""}
                    onChange={handleInputChange}
                    className={`form-input ${formErrors?.mobile ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {formErrors?.mobile && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.mobile}</p>
                  )}
                </div>
                {/* Designation */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Designation
                    {requiredInputFields.designationId && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    name="designationId"
                    value={formData?.designationId?.value || ""}
                    onChange={(e) => {
                      const option = designationOptions.find(opt => opt.value.toString() === e.target.value);
                      handleDesignationChange(e, option);
                    }}
                    className={`form-input ${formErrors?.designationId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select designation</option>
                    {designationOptions.map((option: any) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {formErrors?.designationId && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.designationId}</p>
                  )}
                </div>
                {/* Joining Date */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Joining Date
                    {requiredInputFields.joiningDate && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData?.joiningDate || ""}
                    onChange={handleInputChange}
                    disabled={editState}
                    className={`form-input ${formErrors?.joiningDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${editState ? 'bg-gray-100' : ''}`}
                  />
                  {formErrors?.joiningDate && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.joiningDate}</p>
                  )}
                </div>
                {/* Email */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Email Address
                    {requiredInputFields.email && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData?.email || ""}
                    onChange={handleInputChange}
                    disabled={editState}
                    className={`form-input ${formErrors?.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${editState ? 'bg-gray-100' : ''}`}
                    placeholder="Enter email address"
                  />
                  {formErrors?.email && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>
                {/* Employee ID */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Employee ID
                    {requiredInputFields.empId && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    name="empId"
                    value={formData?.empId || ""}
                    onChange={handleInputChange}
                    disabled={editState}
                    className={`form-input ${formErrors?.empId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${editState ? 'bg-gray-100' : ''}`}
                    placeholder="Enter employee ID"
                  />
                  {formErrors?.empId && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.empId}</p>
                  )}
                </div>

                {/* Password */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiEye className="w-4 h-4" />
                    Password
                    {requiredInputFields.password && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      className={`form-input pr-10 ${formErrors?.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors?.password && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiEye className="w-4 h-4" />
                    Confirm Password
                    {requiredInputFields.confimPassword && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={matchPwd}
                      onChange={(e) => setMatchPwd(e.target.value)}
                      className={`form-input pr-10 ${formErrors?.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors?.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Department */}
                <div className="form-group md:col-span-2">
                  <label className="form-label flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Departments
                    {requiredInputFields?.ldepartment && <span className="text-red-500">*</span>}
                  </label>
                  <Dropdown
                    submitRef={true}
                    multiple={true}
                    disabled={editState}
                    defaultValue={formData?.department || null}
                    options={deptOptions}
                    handleChange={handleDropdownChange}
                    errorMessage={formErrors?.department}
                    requiredField={requiredInputFields?.ldepartment || false}
                    defaultLabel="Choose Departments"
                    label=""
                    className="h-[39px]"
                  />
                  {formErrors?.deptId && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.deptId}</p>
                  )}
                </div>
              </div>
            </div>
          }
          modalFooter={
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onClickButton(editState ? "update" : "create")}
                disabled={loading}
                className={`btn flex items-center gap-2 ${
                  loading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                {loading ? (
                  <InlineLoader text={editState ? "Updating..." : "Creating..."} />
                ) : (
                  <>
                    {editState ? <FiEdit2 className="w-4 h-4" /> : <FiSave className="w-4 h-4" />}
                    {editState ? "Update Admin" : "Create Admin"}
                  </>
                )}
              </button>
            </div>
          }
        />
      )}
    </>
  );
}

export default AddAdmin;
