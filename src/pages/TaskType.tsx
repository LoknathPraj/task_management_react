import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import { BASE_URL } from "../constant";
import InlineLoader from "../components/InlineLoader";
import { FiList, FiEdit2, FiTrash2, FiSave, FiX, FiPlus, FiFolder, FiTag } from "react-icons/fi";

function TaskType() {
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
  const [editIsClicked, setEditIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getAllTaskType(paginationModel.page, paginationModel.pageSize);
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
      headerName: "Task Type",
      width: 350,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="font-semibold text-gray-900 text-lg">
          {params.value}
        </div>
      ),
    },
    {
      field: "projectName",
      headerName: "Project",
      width: 250,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          {params.value}
        </span>
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

  const getAllProjects = async () => {
    try {
      const response = await axiosHandler.get(`/project/`);
      const data = response?.data?.data;
      setProjectList(data);
    } catch (error: any) {}
  };

  const getAllTaskType = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`/task-type/?page=${page + 1}&limit=${pageSize}`);
      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setRows(data);
      setTotalRows(totalItems);
    } catch (error: any) {}
    finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getAllProjects();
    getAllTaskType(paginationModel.page, paginationModel.pageSize);
  }, []);

  const requiredInputFields: any = {
    name: true,
    project: true,
  };

  const resetStates = () => {
    setFormErrors({});
    setFormData({});
    setEditIsClicked(false);
  };

  const handleEdit = (taskType: any) => {
    setEditIsClicked(true);
    // Set the form data with the task type details
    const taskTypeDetails = {
      ...taskType,
      project: {
        value: taskType.projectId || taskType.project?._id,
        label: taskType.projectName || taskType.project?.name
      }
    };
    setFormData(taskTypeDetails);
    setIsModalOpen(true);
  };

  const deleteTaskTypeById = async (id: any) => {
    try {
      const response = await axiosHandler.get(
        `task-type/deleteTaskTypeById/${id}`
      );
      showNotification("success", "Task Type deleted successfully!");
      getAllTaskType(paginationModel.page, paginationModel.pageSize);
    } catch (error: any) {
      showNotification("error", "Something went wrong");
    }
  };

  const handleDelete = (_id: string) => {
    deleteTaskTypeById(_id);
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

  const createTaskType = async (data: any) => {
    const url = `${BASE_URL}task-type/`;
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
      showNotification("success", "Task Type created successfully!");
      setIsModalOpen(false);
      setFormData({});
      getAllTaskType(paginationModel.page, paginationModel.pageSize);
      resetStates();
    } catch (error: any) {
      showNotification("error", "Something went wrong");
    }
  };

  const updateTaskType = async (data: any) => {
    const url = `${BASE_URL}task-type/${data._id}`;
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
      showNotification("success", "Task Type updated successfully!");
      setIsModalOpen(false);
      setFormData({});
      getAllTaskType(paginationModel.page, paginationModel.pageSize);
      resetStates();
    } catch (error: any) {
      showNotification("error", "Something went wrong");
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
      errors.name = "Task Type name is required";
    }
    if (!formData.project?.value) {
      errors.project = "Project is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const taskTypeData: any = {
      ...formData,
      projectId: formData.project.value,
      projectName: formData.project.label,
    };

    if (editIsClicked) {
      await updateTaskType(taskTypeData);
    } else {
      await createTaskType(taskTypeData);
    }
  };

  const handleProjectChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      project: option,
    }));
    
    // Clear error when user selects a project
    if (formErrors.project) {
      setFormErrors((prev: any) => ({ ...prev, project: "" }));
    }
  };

  const handleKeyDown = (event: any) => {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Type Management</h1>
            <p className="text-gray-600">Manage task types and their project assignments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Task Types</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRows || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiList className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Task Types</p>
                  <p className="text-2xl font-bold text-green-600">{rows?.filter((taskType: any) => taskType.is_active !== false)?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiEdit2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projects</p>
                  <p className="text-2xl font-bold text-purple-600">{projectList?.length || 0}</p>
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
              rowData={rows||[]}
              onClickAdd={() => {
                setIsModalOpen(true);
                resetStates();
              }}
              columnData={columns}
              toolTipName={"Create Task Type"}
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
                {editIsClicked ? <FiEdit2 className="w-5 h-5 text-white" /> : <FiTag className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editIsClicked ? "Update Task Type" : "Create New Task Type"}
                </h3>
                <p className="text-sm text-blue-100">
                  {editIsClicked ? "Modify task type details" : "Add a new task type to the system"}
                </p>
              </div>
            </div>
          }
          modalBody={
            <div className="space-y-6">
              {/* Project Selection */}
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiFolder className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Project</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="project"
                    value={formData?.project?.value || ""}
                    onChange={(e) => {
                      const option = projectList?.find((opt: any) => opt._id === e.target.value);
                      handleProjectChange(e, { label: option?.name, value: option?._id });
                    }}
                    className={`w-full px-4 py-3 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      formErrors?.project 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select a project</option>
                    {projectList?.map((project: any) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFolder className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {formErrors?.project && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.project}
                  </p>
                )}
              </div>
              
              {/* Task Type Name */}
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiTag className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Task Type Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData?.name || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-4 py-3 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                      formErrors?.name 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter task type name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiTag className="h-5 w-5 text-gray-400" />
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

              {/* Description */}
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiList className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-700">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData?.description || ""}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Enter task type description (optional)"
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
                    {editIsClicked ? "Update Task Type" : "Create Task Type"}
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

export default TaskType;
