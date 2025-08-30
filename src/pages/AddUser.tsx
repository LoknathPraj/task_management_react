import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import {designationOptions } from "../utils/index";
import { showNotification } from "../components/Toast";
import { BASE_URL } from "../constant";
import InlineLoader from "../components/InlineLoader";
import { FiUser, FiEdit2, FiTrash2, FiSave, FiX, FiPlus, FiEye, FiEyeOff, FiMail, FiPhone, FiCalendar, FiBriefcase, FiHome, FiHash } from "react-icons/fi";
// import { Oval } from "react-loader-spinner";
 

function AddUser() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validPwd, setValidPwd] = useState(true);
  // const [pwdFocus, setPwdFocus] = useState(false);
  // const [matchFocus, setMatchFocus] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [formErrors, setFormErrors] = useState<any>();
  const [departmentData, setDepartmentData] = useState<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
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
      headerName: "Full Name",
      width: 220,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="font-medium text-gray-900">
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
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {params.value}
        </span>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 200,
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
        <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
          {new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
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
  

  
  

  const axiosHandler = useAxios();
  const getUserDetails = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`auth/getUserList?page=${page + 1}&limit=${pageSize}`);
      const data = response?.data?.data;
      const { totalItems } = response?.data;

      setUserList(data);
      setTotalRows(totalItems);
    } catch (error: any) {} finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getUserDetails(paginationModel?.page, paginationModel?.pageSize);
  }, []);
  const EmployeeList = userList?.filter((item: any) => item?.role === 10000);
  
  useEffect(() => {
    if (Array.isArray(EmployeeList)) {
      const formattedRows = EmployeeList.map((user: any, index: number) => ({
        ...user,
        id: user?._id,
        s_no: index + 1,
        designation: designationOptions.find(
          (item: any) => item.value == user?.designationId
        )?.label,
        department: user.department.map((departmentId:any) => 
          deptOptions?.find(
            (item: { value: string; label: string }) => item.value === departmentId
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
    firstName: true,
    lastName: true,
    mobile: true,
    designationId: true,
    joiningDate: true,
    email: true,
    department: true,
    password: true,
    confirmPassword: true,
    empId: true,
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
          if (key === "department") {
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

  const resetStates = () => {
    setFormErrors({});
    setFormData({});
    setMatchPwd("");
    setPwd("")
    setEditState(false);
  };

  const handleEdit = (user: any) => {
    
    setEditState(true);
    const userDetails = {
      ...user,
      firstName: user.name?.split(' ')[0] || '',
      lastName: user.name?.split(' ').slice(1).join(' ') || '',
      department: deptOptions?.find(
        (item: { label: string; value: string }) => item.label === user?.department
      ),
      designationId: designationOptions?.find(
        (item: { label: string; value: string }) => item.label === user?.designation
      )
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
      getUserDetails(paginationModel.page, paginationModel.pageSize);
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
  const handleDepartmentChange = (e: any, option: any) => {
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
  
  const assignedDepts = appState?.userDetails?.user?.department 
  

  const depts = assignedDepts?.map((deptId:any) => {
    const matchedDept = deptOptions?.find((option:any) => option.value === deptId);
    return matchedDept ? { value: matchedDept.value, label: matchedDept.label } : null;
  }).filter(Boolean);

  const createUser = async (data: any) => {
    const url = `${BASE_URL}auth/`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    try {const response = await fetch(url, {
      method: "POST",
      headers: headersList,
      body: JSON.stringify(data),
    });
    if(response){
      
      setLoading(false)
      showNotification("success", "User created succesfully!");
    }
  } catch(error){
    
    setLoading(false)
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
      method: "PUT",
      headers: headersList,
      body: JSON.stringify(data),
    });

      if (response) {
        getUserDetails(paginationModel.page, paginationModel.pageSize);
        setLoading(false);
        showNotification("success", "User updated succesfully!");
      }

  }
 catch (error) {
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
    // Validation
    const errors: any = {};
    if (!formData.firstName?.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName?.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.mobile?.trim()) {
      errors.mobile = "Phone number is required";
    }
    if (!formData.designationId?.value) {
      errors.designationId = "Designation is required";
    }
    if (!formData.joiningDate) {
      errors.joiningDate = "Joining date is required";
    }
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.department?.value) {
      errors.department = "Department is required";
    }
    if (!pwd && !editState) {
      errors.password = "Password is required";
    }
    if (!matchPwd && !editState) {
      errors.confirmPassword = "Confirm password is required";
    }
    if (pwd !== matchPwd && !editState) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.empId?.trim()) {
      errors.empId = "Employee ID is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const userData: any = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      designationId: formData?.designationId?.value,
      department: formData?.department?.value,
    };

    if (editState && formData?._id) {
      await updateUser(userData, formData._id);
    } else {
      await createUser(userData);
    }
    setIsModalOpen(false);
    setFormData({});
    resetStates();
  };
  const handleKeyDown = (event:any) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage user accounts and their information</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRows || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-green-600">{rows?.filter((user: any) => user.is_active !== false)?.length || 0}</p>
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
                  <FiHome className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <GridTable
              onClickAction={onClickAction}
              actions={["EDIT", "DELETE"]}
              rowData={rows}
              onClickAdd={() => {
                setIsModalOpen(true);
                resetStates();
              }}
              columnData={columns}
              toolTipName={"Create User"}
              onPaginationChange={handlePaginationChange}
              rowCount={totalRows}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <Modal
          isLoading={loading}
          modalSize="max-w-4xl"
          modalHeader={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {editState ? <FiEdit2 className="w-5 h-5 text-white" /> : <FiUser className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editState ? "Update User" : "Create New User"}
                </h3>
                <p className="text-sm text-blue-100">
                  {editState ? "Modify user details" : "Add a new user to the system"}
                </p>
              </div>
            </div>
          }
          modalBody={
            <div className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">First Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData?.firstName || ""}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.firstName 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter first name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.firstName && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-700">Last Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData?.lastName || ""}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.lastName 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter last name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.lastName && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone Number and Employee ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Phone Number</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobile"
                      value={formData?.mobile || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.mobile 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter phone number"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.mobile && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.mobile}
                    </p>
                  )}
                </div>

                {/* Employee ID */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiHash className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-gray-700">Employee ID</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="empId"
                      value={formData?.empId || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.empId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter employee ID"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHash className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.empId && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.empId}
                    </p>
                  )}
                </div>
              </div>

              {/* Designation and Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Designation */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiBriefcase className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Designation</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="designationId"
                      value={formData?.designationId?.value || ""}
                      onChange={(e) => {
                        const option = designationOptions.find(opt => opt.value.toString() === e.target.value);
                        handleDesignationChange(e, option);
                      }}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.designationId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select designation</option>
                      {designationOptions.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBriefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors?.designationId && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.designationId}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiHome className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-700">Department</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData?.department?.value || ""}
                      onChange={(e) => {
                        const option = depts?.find((opt: any) => opt.value.toString() === e.target.value);
                        handleDepartmentChange(e, option);
                      }}
                      disabled={editState}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.department 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${editState ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Select department</option>
                      {depts?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiHome className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors?.department && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.department}
                    </p>
                  )}
                </div>
              </div>

              {/* Email and Joining Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Email Address</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData?.email || ""}
                      onChange={handleInputChange}
                      disabled={editState}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.email 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${editState ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter email address"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.email && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Joining Date */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Joining Date</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData?.joiningDate || ""}
                      onChange={handleInputChange}
                      disabled={editState}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.joiningDate 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      } ${editState ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.joiningDate && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.joiningDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Fields (only for new users) */}
              {!editState && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiEye className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-700">Password</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          formErrors?.password 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Enter password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiEye className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors?.password && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <FiEye className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-700">Confirm Password</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={matchPwd}
                        onChange={(e) => setMatchPwd(e.target.value)}
                        className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                          formErrors?.confirmPassword 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Confirm password"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiEye className="h-5 w-5 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors?.confirmPassword && (
                      <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          }
          modalFooter={
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onClickButton(editState ? "update" : "create")}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <InlineLoader text={editState ? "Updating..." : "Creating..."} />
                ) : (
                  <>
                    {editState ? <FiEdit2 className="w-4 h-4" /> : <FiSave className="w-4 h-4" />}
                    {editState ? "Update User" : "Create User"}
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

export default AddUser;
