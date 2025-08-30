import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import { BASE_URL } from "../constant";
import InlineLoader from "../components/InlineLoader";
import { FiFolder, FiEdit2, FiTrash2, FiSave, FiX, FiPlus, FiUser, FiCalendar, FiUsers, FiTarget, FiCheckCircle, FiSearch, FiX as FiClose } from "react-icons/fi";

function Project() {
  interface Department {
    createdAt: string; // ISO date string
    id: string; // Unique identifier
    is_active: boolean; // Status of the department
    name: string; // Name of the department
    projects: any[]; // Assuming projects can be of any type, you can specify a more accurate type if needed
    updatedAt: string; // ISO date string
    __v: number; // Version key, if applicable
    _id: string; // Another unique identifier, often the same as `id`
  }
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [projectList, setProjectList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>();
  const [departmentData, setDepartmentData] = useState<Department[] | undefined>();
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editIsClicked, setEditIsClicked] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  
  // Searchable dropdown states
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getAllProjects(paginationModel?.page, paginationModel?.pageSize);
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
      headerName: "Project Name",
      width: 300,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="font-medium text-gray-900 text-base">
          {params.value}
        </div>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      width: 250,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {params.value}
        </span>
      ),
    },
    {
      field: "projectManager",
      headerName: "Project Manager",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">{params.value || "Not assigned"}</span>
        </div>
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 150,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-lg">
          {params.value ? new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "Not set"}
        </span>
      ),
    },
    {
      field: "completedDate",
      headerName: "Completed Date",
      width: 150,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <span className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-lg">
          {params.value ? new Date(params.value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "Not completed"}
        </span>
      ),
    },
    {
      field: "employeeCount",
      headerName: "Team Size",
      width: 120,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex items-center justify-center gap-1">
          <FiUsers className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">{params.value || 0}</span>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 180,
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

  const getAllProjects = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`/project/?page=${page + 1}&limit=${pageSize}`);
      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setProjectList(data);
      setTotalRows(totalItems);
    } catch (error: any) {}
    finally {
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axiosHandler.get(`/auth/getUserList`);
      const data = response?.data?.data;
      setUserList(data);
    } catch (error: any) {}
  };

  useEffect(() => {
    getAllProjects(paginationModel?.page, paginationModel?.pageSize);
    getAllUsers();
  }, []);

  useEffect(() => {
    if (Array.isArray(projectList)) {
      const formattedRows = projectList.map((dept: any, index: number) => ({
        ...dept,
        s_no: index + 1,
        department: deptOptions.find(
          (item: { value:any}) => item.value === dept?.department
        )?.label,
        createdAt: formatDate(dept?.createdAt),
      }));

      setRows(formattedRows);
    }
  }, [projectList]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const requiredInputFields: any = {
    name: true,
    deptId: true,
    projectManager: true,
    startDate: true,
  };

  const resetStates = () => {
    setFormErrors({});
    setFormData({});
    setEditIsClicked(false);
    setSelectedUsers([]);
    setUserSearchTerm("");
    setIsUserDropdownOpen(false);
  };

  const handleEdit = (project: any) => {
    setEditIsClicked(true);
    const projectDetails = {
      ...project,
      department: deptOptions.find(
        (item: { label: string; value: string }) => item.label === project?.department
      ),
      projectManager: userList.find((user: any) => user._id === project?.projectManager),
      assignedUsers: project?.assignedUsers || []
    };
    setFormData(projectDetails);
    
    // Set selected users for the searchable dropdown
    if (project?.assignedUsers && Array.isArray(project.assignedUsers)) {
      const users = userList.filter((user: any) => project.assignedUsers.includes(user._id));
      setSelectedUsers(users);
    }
    
    setIsModalOpen(true);
  };

  const deleteProjectById = async (id: any) => {
    try {
      const response = await axiosHandler.get(`project/deleteProjectById/${id}`);
      showNotification("success", "Project deleted successfully!")
      getAllProjects(paginationModel?.page, paginationModel?.pageSize);
    } catch (error: any) {
      showNotification("error", "Something went wrong")
    }
  };

  const handleDelete = (_id: string) => {
    deleteProjectById(_id);
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
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const appState: any = useContext(AppContext);

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

  const departments = appState?.userDetails?.user?.department;

  const deptOptions = departments
    ?.map((deptId: string) => {
      const department = departmentData?.find(
        (dept: Department) => dept.id === deptId
      );

      return department
        ? { value: department.id, label: department.name }
        : null;
    })
    .filter(Boolean);

  const createProject = async (data: any) => {
    const url = `${BASE_URL}project/`;
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
      showNotification("success", "Project created successfully!")
      getAllProjects(paginationModel?.page, paginationModel?.pageSize);
    } catch(error:any) {
      showNotification("error", "Something went wrong")
    }
  };

  const updateProject = async (data: any, id: any) => {
    const url = `${BASE_URL}project/updateProjectById/${id}`;
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
      showNotification("success", "Project updated successfully!")
      getAllProjects(paginationModel?.page, paginationModel?.pageSize);
    } catch(error:any) {
      showNotification("error", "Something went wrong")
    }
  };

  const onClickButton = (type: string) => {
    if (type) {
      handleSubmit();
    } else {
      setIsModalOpen(false);
      setFormErrors("");
    }
  };

  const handleSubmit = async () => {
    // Validation
    const errors: any = {};
    if (!formData.name?.trim()) {
      errors.name = "Project name is required";
    }
    if (!formData.deptId?.value) {
      errors.deptId = "Department is required";
    }
    if (!formData.projectManager?.value) {
      errors.projectManager = "Project manager is required";
    }
    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const projectData: any = {
      ...formData,
      deptId: formData?.deptId?.value,
      projectManager: formData?.projectManager?.value,
      assignedUsers: selectedUsers.map((user: any) => user._id),
      employeeCount: selectedUsers.length,
    };

    if (editIsClicked && formData?._id) {
      await updateProject(projectData, formData._id);
    } else {
      await createProject(projectData);
    }
    setIsModalOpen(false);
    setFormData({});
    resetStates();
  };

  const handleDepartmentChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      deptId: option,
    }));
    
    // Clear error when user selects a department
    if (formErrors.deptId) {
      setFormErrors((prev: any) => ({ ...prev, deptId: "" }));
    }
  };

  const handleProjectManagerChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      projectManager: option,
    }));
    
    // Clear error when user selects a project manager
    if (formErrors.projectManager) {
      setFormErrors((prev: any) => ({ ...prev, projectManager: "" }));
    }
  };

  // Searchable dropdown functions
  const filteredUsers = userList.filter((user: any) => {
    const searchLower = userSearchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.designation?.toLowerCase().includes(searchLower)
    );
  });

  const handleUserSelect = (user: any) => {
    const isAlreadySelected = selectedUsers.some((selected: any) => selected._id === user._id);
    if (!isAlreadySelected) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setUserSearchTerm("");
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user: any) => user._id !== userId));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: any) => {
      if (event.key === 'Escape' && isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isUserDropdownOpen]);

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management</h1>
            <p className="text-gray-600">Manage projects and their department assignments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRows || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiFolder className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-green-600">{rows?.filter((project: any) => project.is_active !== false)?.length || 0}</p>
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
                  <FiPlus className="w-6 h-6 text-purple-600" />
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
              toolTipName={"Create Project"}
              onPaginationChange={handlePaginationChange}
              rowCount={totalRows}
              isLoading={loading}
            />
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <Modal
          isLoading={false}
          modalHeader={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {editIsClicked ? <FiEdit2 className="w-5 h-5 text-white" /> : <FiFolder className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editIsClicked ? "Update Project" : "Create New Project"}
                </h3>
                <p className="text-sm text-blue-100">
                  {editIsClicked ? "Modify project details" : "Add a new project to the system"}
                </p>
              </div>
            </div>
          }
          modalBody={
            <div className="space-y-6">
              {/* Project Name */}
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiFolder className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Project Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors?.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter project name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFolder className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {formErrors?.name && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Department and Project Manager */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiTarget className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Department</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData?.deptId?.value || ""}
                      onChange={(e) => {
                        const option = deptOptions?.find((opt: any) => opt.value.toString() === e.target.value);
                        handleDepartmentChange(e, option);
                      }}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.deptId 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select department</option>
                      {deptOptions?.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiTarget className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors?.deptId && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.deptId}
                    </p>
                  )}
                </div>

                {/* Project Manager */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-700">Project Manager</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="projectManager"
                      value={formData?.projectManager?.value || ""}
                      onChange={(e) => {
                        const option = userList?.find((user: any) => user._id === e.target.value);
                        handleProjectManagerChange(e, { label: option?.name, value: option?._id });
                      }}
                      className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.projectManager 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select project manager</option>
                      {userList?.map((user: any) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors?.projectManager && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.projectManager}
                    </p>
                  )}
                </div>
              </div>

              {/* Start Date and Completed Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Start Date</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="startDate"
                      value={formData?.startDate || ""}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        formErrors?.startDate 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  {formErrors?.startDate && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {formErrors.startDate}
                    </p>
                  )}
                </div>

                {/* Completed Date */}
                <div className="form-group">
                  <label className="form-label flex items-center gap-2">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-700">Completed Date</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="completedDate"
                      value={formData?.completedDate || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Searchable Assigned Users */}
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiUsers className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Assigned Team Members</span>
                  <span className="text-sm text-gray-500">({selectedUsers.length} selected)</span>
                </label>
                
                {/* Selected Users Display */}
                {selectedUsers.length > 0 && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((user: any) => (
                        <div
                          key={user._id}
                          className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-300 text-sm"
                        >
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                            <FiUser className="w-3 h-3 text-purple-600" />
                          </div>
                          <span className="text-gray-700">{user.name}</span>
                          <button
                            type="button"
                            onClick={() => handleUserRemove(user._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FiClose className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Searchable Dropdown */}
                <div className="relative user-dropdown-container">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users by name, email, or designation..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      onFocus={() => setIsUserDropdownOpen(true)}
                      className="w-full px-4 py-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <FiUsers className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  {isUserDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user: any) => {
                          const isSelected = selectedUsers.some((selected: any) => selected._id === user._id);
                          return (
                            <div
                              key={user._id}
                              onClick={() => handleUserSelect(user)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                                isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <FiUser className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                  {user.designation && (
                                    <div className="text-xs text-gray-500">{user.designation}</div>
                                  )}
                                </div>
                                {isSelected && (
                                  <div className="text-purple-600">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No users found matching "{userSearchTerm}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Type to search users by name, email, or designation. Click to add to team.
                </p>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiFolder className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData?.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Enter project description (optional)"
                />
              </div>
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
                onClick={() => onClickButton(editIsClicked ? "update" : "create")}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <InlineLoader text={editIsClicked ? "Updating..." : "Creating..."} />
                ) : (
                  <>
                    {editIsClicked ? <FiEdit2 className="w-4 h-4" /> : <FiSave className="w-4 h-4" />}
                    {editIsClicked ? "Update Project" : "Create Project"}
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

export default Project;
