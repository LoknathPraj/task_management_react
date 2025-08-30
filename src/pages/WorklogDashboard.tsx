import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import GridTable from "../components/GridTable";
import { showNotification } from "../components/Toast";
import { 
  FiPlus, 
  FiFolder, 
  FiTag, 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiPlay,
  FiUser
} from "react-icons/fi";

interface WorklogItem {
  _id: string;
  title: string;
  description: string;
  taskType: string;
  status: string;
  priority: string;
  assignedTo: string[];
  projectId: string;
  projectName: string;
  estimatedHours: number;
  actualHours: number;
  startDate: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WorklogDashboard = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const axiosHandler = useAxios();
  const [worklogList, setWorklogList] = useState<WorklogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [departmentList, setDepartmentList] = useState<any[]>([]);
  const [userList, setUserList] = useState<any[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);
  
  // Quick filter states
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");

  // Form states
  const [formData, setFormData] = useState<{
    _id?: string;
    title: string;
    description: string;
    taskType: string;
    status: string;
    priority: string;
    assignedTo: string[];
    projectId: string;
    estimatedHours: string;
    startDate: string;
    dueDate: string;
  }>({
    title: "",
    description: "",
    taskType: "",
    status: "active",
    priority: "medium",
    assignedTo: [],
    projectId: "",
    estimatedHours: "",
    startDate: "",
    dueDate: ""
  });

  const [formErrors, setFormErrors] = useState<any>({});

  // Task type and status options
  const taskTypeOptions = [
    { value: "story", label: "User Story", icon: "📖" },
    { value: "bug", label: "Bug Fix", icon: "🐛" },
    { value: "enhancement", label: "Enhancement", icon: "✨" },
    { value: "feature", label: "New Feature", icon: "🚀" },
    { value: "task", label: "Task", icon: "📋" },
    { value: "epic", label: "Epic", icon: "🎯" }
  ];

  const statusOptions = [
    { value: "active", label: "Active", icon: "▶️", color: "blue" },
    { value: "in-progress", label: "In Progress", icon: "⏸️", color: "yellow" },
    { value: "review", label: "Under Review", icon: "👀", color: "purple" },
    { value: "resolved", label: "Resolved", icon: "✅", color: "green" },
    { value: "closed", label: "Closed", icon: "🔒", color: "gray" },
    { value: "blocked", label: "Blocked", icon: "🚫", color: "red" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "gray" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "high", label: "High", color: "orange" },
    { value: "critical", label: "Critical", color: "red" }
  ];

  // Dummy data for demonstration
  const dummyWorklogs: WorklogItem[] = [
    {
      _id: "1",
      title: "Implement User Authentication",
      description: "Create a secure authentication system with JWT tokens and password hashing",
      taskType: "feature",
      status: "in-progress",
      priority: "high",
      assignedTo: ["user1", "user2"],
      projectId: "proj1",
      projectName: "E-commerce Platform",
      estimatedHours: 16,
      actualHours: 8,
      startDate: new Date("2024-01-15"),
      dueDate: new Date("2024-01-25"),
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-20")
    },
    {
      _id: "2",
      title: "Fix Login Button Bug",
      description: "Login button not responding on mobile devices",
      taskType: "bug",
      status: "resolved",
      priority: "critical",
      assignedTo: ["user3"],
      projectId: "proj1",
      projectName: "E-commerce Platform",
      estimatedHours: 4,
      actualHours: 3,
      startDate: new Date("2024-01-18"),
      dueDate: new Date("2024-01-20"),
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-19")
    },
    {
      _id: "3",
      title: "Optimize Database Queries",
      description: "Improve performance by optimizing slow database queries",
      taskType: "enhancement",
      status: "active",
      priority: "medium",
      assignedTo: ["user1", "user4", "user5"],
      projectId: "proj2",
      projectName: "CRM System",
      estimatedHours: 12,
      actualHours: 0,
      startDate: new Date("2024-01-22"),
      dueDate: new Date("2024-02-01"),
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-20")
    },
    {
      _id: "4",
      title: "Design User Dashboard",
      description: "Create a modern and intuitive user dashboard with analytics",
      taskType: "story",
      status: "review",
      priority: "high",
      assignedTo: ["user2"],
      projectId: "proj2",
      projectName: "CRM System",
      estimatedHours: 20,
      actualHours: 18,
      startDate: new Date("2024-01-10"),
      dueDate: new Date("2024-01-30"),
      createdAt: new Date("2024-01-08"),
      updatedAt: new Date("2024-01-25")
    },
    {
      _id: "5",
      title: "Setup CI/CD Pipeline",
      description: "Configure automated testing and deployment pipeline",
      taskType: "task",
      status: "closed",
      priority: "medium",
      assignedTo: ["user3", "user4"],
      projectId: "proj3",
      projectName: "Mobile App",
      estimatedHours: 8,
      actualHours: 10,
      startDate: new Date("2024-01-05"),
      dueDate: new Date("2024-01-15"),
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-15")
    },
    {
      _id: "6",
      title: "API Rate Limiting",
      description: "Implement rate limiting for API endpoints to prevent abuse",
      taskType: "enhancement",
      status: "blocked",
      priority: "high",
      assignedTo: ["user1"],
      projectId: "proj1",
      projectName: "E-commerce Platform",
      estimatedHours: 6,
      actualHours: 2,
      startDate: new Date("2024-01-20"),
      dueDate: new Date("2024-01-28"),
      createdAt: new Date("2024-01-18"),
      updatedAt: new Date("2024-01-22")
    }
  ];

  const dummyUsers = [
    { _id: "user1", name: "John Smith", email: "john@example.com" },
    { _id: "user2", name: "Sarah Johnson", email: "sarah@example.com" },
    { _id: "user3", name: "Mike Davis", email: "mike@example.com" },
    { _id: "user4", name: "Emily Wilson", email: "emily@example.com" },
    { _id: "user5", name: "David Brown", email: "david@example.com" }
  ];

  const dummyProjects = [
    { _id: "proj1", name: "E-commerce Platform" },
    { _id: "proj2", name: "CRM System" },
    { _id: "proj3", name: "Mobile App" }
  ];

  const dummyDepartments = [
    { _id: "dept1", name: "Engineering" },
    { _id: "dept2", name: "Design" },
    { _id: "dept3", name: "Product" }
  ];

  // Fetch data functions
  const fetchWorklogs = async () => {
    setLoading(true);
    try {
      // Use dummy data instead of API call
      setTimeout(() => {
        setWorklogList(dummyWorklogs);
        setLoading(false);
      }, 500); // Simulate API delay
    } catch (error) {
      console.error("Error fetching worklogs:", error);
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      // Use dummy data instead of API call
      setDepartmentList(dummyDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Use dummy data instead of API call
      setUserList(dummyUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      // Use dummy data instead of API call
      setProjectList(dummyProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchWorklogs();
    fetchDepartments();
    fetchUsers();
    fetchProjects();
  }, []);

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };







  const handleViewDetails = (worklog: WorklogItem) => {
    navigate(`/worklog-details/${worklog._id}`);
  };

  // Filter worklog data based on selected filters
  const getFilteredWorklogList = () => {
    return worklogList.filter(item => {
      // Status filter
      if (statusFilter && item.status !== statusFilter) return false;
      
      // Priority filter
      if (priorityFilter && item.priority !== priorityFilter) return false;
      
      // Task type filter
      if (taskTypeFilter && item.taskType !== taskTypeFilter) return false;
      
      // Project filter
      if (projectFilter && item.projectId !== projectFilter) return false;
      
      // Assigned to filter
      if (assignedToFilter && !item.assignedTo.includes(assignedToFilter)) return false;
      
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = item.title.toLowerCase().includes(searchLower);
        const descriptionMatch = item.description.toLowerCase().includes(searchLower);
        const projectMatch = item.projectName.toLowerCase().includes(searchLower);
        const assignedUsersMatch = item.assignedTo.some((userId: string) => {
          const user = userList.find((u: any) => u._id === userId);
          return user?.name.toLowerCase().includes(searchLower);
        });
        
        if (!titleMatch && !descriptionMatch && !projectMatch && !assignedUsersMatch) {
          return false;
        }
      }
      
      return true;
    });
  };

  const downloadExcelData = async () => {
    setIsExporting(true);
    try {
      // Simulate export with dummy data
      setTimeout(() => {
        // Create a simple CSV export for demo
        const headers = "Title,Description,Task Type,Status,Priority,Project,Estimated Hours,Due Date";
        const rows = worklogList.map(w => 
          `"${w.title}","${w.description}","${w.taskType}","${w.status}","${w.priority}","${w.projectName}","${w.estimatedHours}","${w.dueDate.toLocaleDateString()}"`
        ).join('\n');
        const csvContent = headers + '\n' + rows;
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "worklog-data.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        
        showNotification("success", "Data exported successfully!");
        setIsExporting(false);
      }, 1000); // Simulate processing time
    } catch (error) {
      showNotification("error", "Export failed!");
      setIsExporting(false);
    }
  };

  // Column definitions for the table
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 300,
      renderCell: (params: any) => (
        <button
          onClick={() => handleViewDetails(params.row)}
          className="text-left font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        >
          {params.value || "Untitled"}
        </button>
      )
    },
    {
      field: "taskType",
      headerName: "Type",
      width: 120,
      renderCell: (params: any) => {
        const taskType = taskTypeOptions.find(option => option.value === params.value);
        return (
          <div className="flex items-center gap-2">
            <span className="text-lg">{taskType?.icon || "📋"}</span>
            <span className="text-sm font-medium text-gray-700">
              {taskType?.label || params.value || "Unknown"}
            </span>
          </div>
        );
      }
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params: any) => {
        const status = statusOptions.find(option => option.value === params.value);
        const colorClasses = {
          blue: "bg-blue-100 text-blue-800",
          yellow: "bg-yellow-100 text-yellow-800",
          purple: "bg-purple-100 text-purple-800",
          green: "bg-green-100 text-green-800",
          gray: "bg-gray-100 text-gray-800",
          red: "bg-red-100 text-red-800"
        };
        
        return (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${colorClasses[status?.color as keyof typeof colorClasses] || "bg-gray-100 text-gray-800"}`}>
            <span>{status?.icon || "📋"}</span>
            <span>{status?.label || params.value || "Unknown"}</span>
          </div>
        );
      }
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params: any) => {
        const priority = priorityOptions.find(option => option.value === params.value);
        const colorClasses = {
          gray: "bg-gray-100 text-gray-800",
          yellow: "bg-yellow-100 text-yellow-800",
          orange: "bg-orange-100 text-orange-800",
          red: "bg-red-100 text-red-800"
        };
        
        return (
          <div className={`px-2 py-1 rounded text-xs font-medium ${colorClasses[priority?.color as keyof typeof colorClasses] || "bg-gray-100 text-gray-800"}`}>
            {priority?.label || params.value || "Unknown"}
          </div>
        );
      }
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      width: 150,
      renderCell: (params: any) => {
        const assignedUsers = params.value || [];
        return (
          <div className="flex flex-wrap gap-1">
            {assignedUsers.slice(0, 2).map((userId: string, index: number) => {
              const user = userList.find((u: any) => u._id === userId);
              return (
                <div key={index} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-xs">
                  <FiUser className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-700">{user?.name || "Unknown"}</span>
                </div>
              );
            })}
            {assignedUsers.length > 2 && (
              <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                +{assignedUsers.length - 2} more
              </div>
            )}
          </div>
        );
      }
    },

    {
      field: "estimatedHours",
      headerName: "Est. Hours",
      width: 100,
      renderCell: (params: any) => (
        <div className="flex items-center gap-1">
          <FiClock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium">{params.value || 0}h</span>
        </div>
      )
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 150,
      renderCell: (params: any) => {
        if (!params.value) {
          return (
            <div className="flex items-center gap-1 text-gray-400">
              <FiCalendar className="w-4 h-4" />
              <span className="text-sm font-medium">Not set</span>
            </div>
          );
        }
        
        const dueDate = new Date(params.value);
        const today = new Date();
        const isOverdue = dueDate < today && params.row.status !== "resolved" && params.row.status !== "closed";
        
        return (
          <div className={`flex items-center gap-1 ${isOverdue ? "text-red-600" : "text-gray-700"}`}>
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              {dueDate.toLocaleDateString()}
            </span>
            {isOverdue && <FiAlertCircle className="w-4 h-4 text-red-500" />}
          </div>
        );
      }
    },

  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Worklog Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage project tasks, track progress, and monitor team productivity
              </p>
            </div>
            <button
              onClick={() => navigate("/create-worklog")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              Create Worklog
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{getFilteredWorklogList().length}</p>
                {getFilteredWorklogList().length !== worklogList.length && (
                  <p className="text-xs text-gray-500">of {worklogList.length} total</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getFilteredWorklogList().filter(item => item.status === "active" || item.status === "in-progress").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiPlay className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {getFilteredWorklogList().filter(item => item.status === "resolved" || item.status === "closed").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {getFilteredWorklogList().filter(item => {
                    const dueDate = new Date(item.dueDate);
                    const today = new Date();
                    return dueDate < today && item.status !== "resolved" && item.status !== "closed";
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Filters</h3>
            <button
              onClick={() => {
                setStatusFilter("");
                setPriorityFilter("");
                setTaskTypeFilter("");
                setProjectFilter("");
                setAssignedToFilter("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
          
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Projects</option>
                {projectList.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
              <select
                value={taskTypeFilter}
                onChange={(e) => setTaskTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {taskTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={assignedToFilter}
                onChange={(e) => setAssignedToFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Users</option>
                {userList.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

 
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <GridTable
            rowData={getFilteredWorklogList()}
            columnData={columns}
            isLoading={loading}
            onClickExport={downloadExcelData}
            isExporting={isExporting}
          />
        </div>
      </div>


    </div>
  );
};

export default WorklogDashboard;
