import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Radio from "../components/Radio";
import { BASE_URL } from "../constant";
import InlineLoader from "../components/InlineLoader";
import { FiHome, FiEdit2, FiTrash2, FiSave, FiX, FiPlus } from "react-icons/fi";

function Department() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [departmentList, setDepartmentList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>();
  const [editIsClicked, setEditIsClicked] = useState(false)
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getAllDept(paginationModel.page, paginationModel.pageSize);
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
      headerName: "Department Name",
      width: 400,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="font-semibold text-gray-900 text-lg">
          {params.value}
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 200,
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

  const axiosHandler = useAxios();
  const getAllDept = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds?page=${page + 1}&limit=${pageSize}`);
      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setDepartmentList(data);
      setTotalRows(totalItems);
    } catch (error: any) {}
    finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getAllDept(paginationModel?.page, paginationModel?.pageSize);
  }, []);
  useEffect(() => {
    if (Array.isArray(departmentList)) {
      const formattedRows = departmentList.map((dept: any, index: number) => ({
        ...dept,
        id: dept?._id,
        s_no: index + 1,
        createdAt: formatDate(dept?.createdAt),
      }));

      setRows(formattedRows);
    }
  }, [departmentList]);
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const requiredInputFields: any = {
    name: true,
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
          if (trimmedValue && key === "mobile") {
            if (trimmedValue.length < 10 || trimmedValue.length > 10) {
              validationErrors[key] = "Phone Number must have 10 Digits!";
            }
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
    showNotification("info", "Edit User");
    const userDetails = {
      ...user,
      joiningDate: formatDate(user?.joiningDate), 
      
    };
    setFormData(userDetails);
    setIsModalOpen(true);
    setEditIsClicked(true);
  };

  const deleteDeptById = async (id: any) => {
    try {
      const response = await axiosHandler.get(`department/deleteDepartmentById/${id}`);
      showNotification("success", "Department deleted successfully!")
      getAllDept(paginationModel.page, paginationModel.pageSize);
      
    } catch (error: any) {
      showNotification("error", "Something went wrong")
    }
  };
  const handleDelete = (_id: string) => {
    deleteDeptById(_id);
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

  const appState: any = useContext(AppContext);

  const createDept = async (data: any) => {
    const url = `${BASE_URL}department`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };

    try{
    const response = await fetch(url, {
      method: "POST",
      headers: headersList,
      body: JSON.stringify(data),
    });
    showNotification("success", "Department created successfully!")
  } catch(error:any){
    showNotification("error", "Something went wrong")
  }
  };
  // const updateUser = async (data: any, id: any) => {
  //   const url = `http://localhost:8080/api/auth/updateUserById/${id}`;
  //   let headersList = {
  //     "Content-Type": "application/json",
  //     Authorization: "bearer " + appState?.userDetails?.token,
  //   };
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: headersList,
  //     body: JSON.stringify(data),
  //   });

  //   if (response) {
  //     getUserDetails();
  //   }
  // };



  const onClickButton = (type: string) => {
    if (type) {
      handleSubmit();
    } else {
      setIsModalOpen(!isModalOpen);
      setFormErrors("");
    }
  };
  const handleSubmit = async () => {
    if (true) {
      const userData: any = {
        ...formData,
        isActive: formData?.isActive==="true"?true : false,
      };

      if (editIsClicked) {
      
      } else {
        await createDept(userData);
      }
      setIsModalOpen(!isModalOpen);
      setFormData({});
      getAllDept(paginationModel.page, paginationModel.pageSize);
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData((prevValues: any) => ({
      ...prevValues,

      isActive: value,
    }));
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Management</h1>
            <p className="text-gray-600">Manage organizational departments and their settings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRows || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiHome className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Departments</p>
                  <p className="text-2xl font-bold text-green-600">{rows?.filter((dept: any) => dept.is_active !== false)?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiEdit2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Additions</p>
                  <p className="text-2xl font-bold text-purple-600">{rows?.filter((dept: any) => {
                    const createdDate = new Date(dept.createdAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return createdDate > weekAgo;
                  })?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiPlus className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <GridTable
              onClickAction={onClickAction}
              actions={["DELETE"]}
              rowData={rows}
              onClickAdd={() => {
                setIsModalOpen(true);
              }}
              columnData={columns}
              toolTipName={"Create Department"}
              onPaginationChange={handlePaginationChange}
              rowCount={totalRows}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Modal
          isLoading={false}
          modalSize="max-w-2xl"
          modalHeader={"Create Department"}
          modalBody={
            <div className="p-6">
              <div className="space-y-6">
                {/* Department Name */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiHome className="w-4 h-4" />
                    Department Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={`form-input ${formErrors?.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter department name"
                  />
                  {formErrors?.name && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiEdit2 className="w-4 h-4" />
                    Status
                  </label>
                  <Radio
                    label={"Is Active:"}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                    ]}
                    selectedValue={formData?.isActive}
                    name={""}
                    onChange={handleRadioChange}
                  />
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
                onClick={() => onClickButton("create")}
                disabled={loading}
                className={`btn flex items-center gap-2 ${
                  loading 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                {loading ? (
                  <InlineLoader text="Creating..." />
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    Create Department
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

export default Department;
