import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";

import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Modal from "../components/Modal";
import moment from "moment";
import { FiEdit2, FiTrash2, FiFilter, FiSearch, FiDownload, FiClock, FiCalendar, FiMapPin } from "react-icons/fi";

export default function ViewUserTask({ insertedRecord, onUpdate, styleFromComponent }: any) {


  const [rows, setRows] = useState<Array<any>>([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const appState: any = useContext(AppContext);

  const [project, setProject] = useState("");
  const [taskType, setTaskType] = useState("");
  const [workingHrs, setWorkingHrs] = useState("");
  const [workingMinutes, setWorkingMinutes] = useState("");
  const [description, setDescription] = useState("");
  const [workingDate, setWorkingDate] = useState("");
  const [location, setLocation] = useState("");

  const [workId, setWorkId] = useState<any>("");
  const [projectData, setProjectData] = useState<any>();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Function to handle pagination changes
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getTaskById(paginationModel?.page, paginationModel?.pageSize);
  };

  useEffect(() => {
    if (insertedRecord) {
      const lInsertedRecord = insertedRecord?.data;
      const lRecord = {
        ...lInsertedRecord,
        display_working_date: new Date(
          lInsertedRecord.working_date
        )?.toLocaleDateString(),
        working_hrs_mins:
          lInsertedRecord.working_hrs +
          "hrs " +
          lInsertedRecord.working_mins +
          "mins",
      };
      if (insertedRecord?.isInserted) {
        setRows([lRecord, ...rows]);
      } else if (!insertedRecord?.isInserted) {
        const index = rows.findIndex((e: any) => e?._id === lInsertedRecord?._id);
        const copyRow = [...rows];
        copyRow[index] = lRecord;
        setRows(copyRow);
      }
    }
  }, [insertedRecord]);

  const getAllProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`project/${appState?.userDetails?.user?.department?.[0]}`);
      const data = response?.data?.data;
      setProjectData(data);
    } catch (error: any) {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProjects();
    getTaskById(0, 10);
  }, []);

  const axiosHandler = useAxios();

  const getTaskById = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(
        `worklog/${appState?.userDetails?.user?.id}?page=${page + 1}&limit=${pageSize}`
      );
      const data = response?.data?.data;
      const formattedData = data?.map((item: any) => ({
        ...item,
        display_working_date: new Date(item.working_date)?.toLocaleDateString(),
        working_hrs_mins: item.working_hrs + "hrs " + item.working_mins + "mins",
      }));
      setRows(formattedData || []);
      setTotalRows(response?.data?.total || 0);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMinutes = () => {
    const mins = [];
    for (let i = 0; i <= 60; i++) {
      if (i % 5 === 0) {
        mins.push(i);
      }
    }
    return mins;
  };

  const onClickButton = async (param: any) => {
    try {
      const response = await axiosHandler.put("worklog", param);
      if (response?.data?.success) {
        showNotification("success", "Task updated successfully");
        setisModalOpen(false);
        getTaskById(paginationModel.page, paginationModel.pageSize);
      } else {
        showNotification(response?.data?.message || "Something went wrong", "error");
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Something went wrong", "error");
    }
  };

  const handleEdit = (row: any) => {
    setProject(row.projectId || "");
    setTaskType(row.task_type || "");
    setWorkingHrs(row.working_hrs || "");
    setWorkingMinutes(row.working_mins || "");
    setDescription(row.task_description || "");
    setWorkingDate(row.working_date || "");
    setLocation(row.location || "");
    setWorkId(row._id || "");
    setisModalOpen(true);
  };

  const handleDelete = async (row: any) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await axiosHandler.delete(`worklog/${row._id}`);
        if (response?.data?.success) {
          showNotification("success", "Task deleted successfully");
          getTaskById(paginationModel.page, paginationModel.pageSize);
        } else {
          showNotification(response?.data?.message || "Something went wrong", "error");
        }
      } catch (error: any) {
        showNotification(error?.response?.data?.message || "Something went wrong", "error");
      }
    }
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch = 
      row.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.task_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.task_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || row.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const columns = [
    {
      field: "project_name",
      headerName: "Project",
      width: 180,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="font-medium text-gray-900">{params.value}</span>
        </div>
      ),
    },
    {
      field: "task_type",
      headerName: "Task Type",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {params.value}
        </span>
      ),
    },
    {
      field: "task_description",
      headerName: "Description",
      width: 300,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="max-w-[280px]">
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {params.value || "No description"}
          </div>
        </div>
      ),
    },
    {
      field: "working_hrs_mins",
      headerName: "Duration",
      width: 120,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <div className="flex items-center justify-center space-x-1">
          <FiClock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{params.value}</span>
        </div>
      ),
    },
    {
      field: "display_working_date",
      headerName: "Date",
      width: 120,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const workingDate = new Date(params.row.working_date);
        const createdAt = new Date(params.row.createdAt);
        const isSameDate = workingDate.toDateString() === createdAt.toDateString();
        
        return (
          <div className="flex items-center justify-center space-x-1">
            <FiCalendar className={`w-4 h-4 ${isSameDate ? 'text-gray-500' : 'text-orange-500'}`} />
            <span className={`text-sm ${isSameDate ? 'text-gray-700' : 'text-orange-600 font-medium'}`}>
              {params.value}
            </span>
          </div>
        );
      },
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params: any) => (
        <div className="flex items-center space-x-1">
          <FiMapPin className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">{params.value}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      headerClassName: "super-app-theme--header",
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params: any) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(params.row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Remove full page loader - use inline loader instead

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">View and manage your tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-outline flex items-center gap-2">
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button className="btn btn-primary flex items-center gap-2">
              <FiFilter className="w-4 h-4" />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Task List</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredRows.length} of {totalRows} tasks
          </p>
        </div>
        <div className="card-body p-0">
          <GridTable
            rowData={filteredRows}
            columnData={columns}
            onPaginationChange={handlePaginationChange}
            rowCount={totalRows}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <Modal
          modalHeader="Edit Task"
          modalSize="max-w-4xl"
        >
        <form onSubmit={(e) => {
          e.preventDefault();
          onClickButton({
            _id: workId,
            projectId: project,
            project_name: projectData?.find((p: any) => p.id === project)?.name,
            task_type: taskType,
            working_date: workingDate,
            working_hrs: workingHrs || "0",
            working_mins: workingMinutes || "0",
            location,
            task_description: description,
            username: appState?.userDetails?.user?.name,
            departmentId: appState?.userDetails?.user?.department,
            adminId: appState?.userDetails?.adminId,
          });
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Project</label>
              <select
                required
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="form-input"
              >
                <option value="">Select project</option>
                {projectData?.map((option: any) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Type</label>
              <select
                required
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="form-input"
              >
                <option value="">Select task type</option>
                {projectData?.[0]?.department === "676175237bf34482eb021c89" ? (
                  <>
                    <option value="Code Development">Code Development</option>
                    <option value="Debugging">Debugging</option>
                    <option value="Testing">Testing</option>
                    <option value="Ui Design">UI Design</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Customer Support">Customer Support</option>
                  </>
                ) : (
                  <>
                    <option value="Code Development">Code Development</option>
                    <option value="Debugging">Debugging</option>
                    <option value="Testing">Testing</option>
                    <option value="UI Design">UI Design</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Research">Research</option>
                    <option value="Planning">Planning</option>
                    <option value="Review">Review</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Working Time</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  required
                  value={workingHrs}
                  onChange={(e) => setWorkingHrs(e.target.value)}
                  className="form-input"
                >
                  <option value="">Hours</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hr) => (
                    <option key={hr} value={hr}>{hr}</option>
                  ))}
                </select>
                <select
                  required
                  value={workingMinutes}
                  onChange={(e) => setWorkingMinutes(e.target.value)}
                  className="form-input"
                >
                  <option value="">Minutes</option>
                  {getMinutes().map((min) => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Date</label>
              <input
                type="date"
                value={moment(workingDate).format("YYYY-MM-DD")}
                onChange={(e) => setWorkingDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="form-input"
              >
                <option value="">Select location</option>
                <option value="Thane">Thane</option>
                <option value="Nashik">Nashik</option>
                <option value="Chh Sambhaji Nagar">Chh Sambhaji Nagar</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={2000}
                rows={4}
                className="form-input resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setisModalOpen(false)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Task
            </button>
          </div>
        </form>
        </Modal>
      )}
    </div>
  );
}
