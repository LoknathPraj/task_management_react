import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import InlineLoader from "../components/InlineLoader";
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiFolder, 
  FiTag, 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiPlay,
  FiUser,
  FiEye,
  FiTrash2,
  FiPlus,
  FiMessageSquare,
  FiPaperclip,
  FiLink,
  FiGitBranch,
  FiActivity,
  FiSearch
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

const WorklogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const axiosHandler = useAxios();
  
  const [worklogList, setWorklogList] = useState<WorklogItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  // Dummy data for demonstration
  const dummyWorklogs: WorklogItem[] = [
    {
      _id: "1",
      title: "Implement User Authentication",
      description: "Create a secure authentication system with JWT tokens and password hashing. This includes user registration, login, password reset, and session management. The system should support multiple authentication providers including Google, Facebook, and email/password.",
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
      description: "Login button not responding on mobile devices. Users are unable to click the login button on iOS Safari and Android Chrome browsers. This is a critical issue affecting user authentication flow.",
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
      description: "Improve performance by optimizing slow database queries. Current queries are taking too long to execute, especially for large datasets. Need to implement proper indexing and query optimization.",
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
      description: "Create a modern and intuitive user dashboard with analytics, charts, and real-time data visualization. The dashboard should be responsive and provide insights into user behavior and system performance.",
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
      description: "Configure automated testing and deployment pipeline using GitHub Actions. Include unit tests, integration tests, and automated deployment to staging and production environments.",
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
      description: "Implement rate limiting for API endpoints to prevent abuse and ensure fair usage. This should include IP-based and user-based rate limiting with configurable thresholds.",
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
    { _id: "user5", name: "David Brown", email: "david@example.com" },
    { _id: "user6", name: "Lisa Anderson", email: "lisa@example.com" },
    { _id: "user7", name: "Robert Taylor", email: "robert@example.com" },
    { _id: "user8", name: "Jennifer Garcia", email: "jennifer@example.com" },
    { _id: "user9", name: "Michael Martinez", email: "michael@example.com" },
    { _id: "user10", name: "Jessica Rodriguez", email: "jessica@example.com" },
    { _id: "user11", name: "Christopher Lee", email: "christopher@example.com" },
    { _id: "user12", name: "Amanda White", email: "amanda@example.com" },
    { _id: "user13", name: "Daniel Thompson", email: "daniel@example.com" },
    { _id: "user14", name: "Nicole Clark", email: "nicole@example.com" },
    { _id: "user15", name: "Kevin Lewis", email: "kevin@example.com" },
    { _id: "user16", name: "Rachel Hall", email: "rachel@example.com" },
    { _id: "user17", name: "Steven Allen", email: "steven@example.com" },
    { _id: "user18", name: "Michelle Young", email: "michelle@example.com" },
    { _id: "user19", name: "Andrew King", email: "andrew@example.com" },
    { _id: "user20", name: "Stephanie Wright", email: "stephanie@example.com" },
    { _id: "user21", name: "Ryan Lopez", email: "ryan@example.com" },
    { _id: "user22", name: "Laura Hill", email: "laura@example.com" },
    { _id: "user23", name: "Jason Scott", email: "jason@example.com" },
    { _id: "user24", name: "Heather Green", email: "heather@example.com" },
    { _id: "user25", name: "Brian Adams", email: "brian@example.com" },
    { _id: "user26", name: "Melissa Baker", email: "melissa@example.com" },
    { _id: "user27", name: "Timothy Gonzalez", email: "timothy@example.com" },
    { _id: "user28", name: "Ashley Nelson", email: "ashley@example.com" },
    { _id: "user29", name: "Jeffrey Carter", email: "jeffrey@example.com" },
    { _id: "user30", name: "Kimberly Mitchell", email: "kimberly@example.com" },
    { _id: "user31", name: "Mark Perez", email: "mark@example.com" },
    { _id: "user32", name: "Angela Roberts", email: "angela@example.com" },
    { _id: "user33", name: "Donald Turner", email: "donald@example.com" },
    { _id: "user34", name: "Brenda Phillips", email: "brenda@example.com" },
    { _id: "user35", name: "Paul Campbell", email: "paul@example.com" },
    { _id: "user36", name: "Deborah Parker", email: "deborah@example.com" },
    { _id: "user37", name: "George Evans", email: "george@example.com" },
    { _id: "user38", name: "Rebecca Edwards", email: "rebecca@example.com" },
    { _id: "user39", name: "Kenneth Collins", email: "kenneth@example.com" },
    { _id: "user40", name: "Sharon Stewart", email: "sharon@example.com" },
    { _id: "user41", name: "Edward Sanchez", email: "edward@example.com" },
    { _id: "user42", name: "Donna Morris", email: "donna@example.com" },
    { _id: "user43", name: "Ronald Rogers", email: "ronald@example.com" },
    { _id: "user44", name: "Carol Reed", email: "carol@example.com" },
    { _id: "user45", name: "Anthony Cook", email: "anthony@example.com" },
    { _id: "user46", name: "Ruth Morgan", email: "ruth@example.com" },
    { _id: "user47", name: "Kevin Bell", email: "kevin2@example.com" },
    { _id: "user48", name: "Diane Murphy", email: "diane@example.com" },
    { _id: "user49", name: "Larry Bailey", email: "larry@example.com" },
    { _id: "user50", name: "Virginia Rivera", email: "virginia@example.com" },
    { _id: "user51", name: "Gary Cooper", email: "gary@example.com" },
    { _id: "user52", name: "Evelyn Richardson", email: "evelyn@example.com" },
    { _id: "user53", name: "Carl Cox", email: "carl@example.com" },
    { _id: "user54", name: "Cheryl Howard", email: "cheryl@example.com" },
    { _id: "user55", name: "Ralph Ward", email: "ralph@example.com" },
    { _id: "user56", name: "Mildred Torres", email: "mildred@example.com" },
    { _id: "user57", name: "Harold Peterson", email: "harold@example.com" },
    { _id: "user58", name: "Joan Gray", email: "joan@example.com" },
    { _id: "user59", name: "Douglas Ramirez", email: "douglas@example.com" },
    { _id: "user60", name: "Janet James", email: "janet@example.com" },
    { _id: "user61", name: "Henry Watson", email: "henry@example.com" },
    { _id: "user62", name: "Margaret Brooks", email: "margaret@example.com" },
    { _id: "user63", name: "Arthur Kelly", email: "arthur@example.com" },
    { _id: "user64", name: "Dorothy Sanders", email: "dorothy@example.com" },
    { _id: "user65", name: "Ryan Price", email: "ryan2@example.com" },
    { _id: "user66", name: "Betty Bennett", email: "betty@example.com" },
    { _id: "user67", name: "Joe Wood", email: "joe@example.com" },
    { _id: "user68", name: "Helen Barnes", email: "helen@example.com" },
    { _id: "user69", name: "Billy Ross", email: "billy@example.com" },
    { _id: "user70", name: "Sandra Henderson", email: "sandra@example.com" }
  ];

  const dummyProjects = [
    { _id: "proj1", name: "E-commerce Platform" },
    { _id: "proj2", name: "CRM System" },
    { _id: "proj3", name: "Mobile App" }
  ];

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

  useEffect(() => {
    // Load dummy data
    setWorklogList(dummyWorklogs);
    setUserList(dummyUsers);
    setProjectList(dummyProjects);
    
    // Find current worklog index
    const index = dummyWorklogs.findIndex(w => w._id === id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [id]);

  const currentWorklog = worklogList[currentIndex];

  // Initialize selected users when current worklog changes
  useEffect(() => {
    if (currentWorklog) {
      const assignedUsers = userList.filter(user => 
        currentWorklog.assignedTo.includes(user._id)
      );
      setSelectedUsers(assignedUsers);
    }
  }, [currentWorklog, userList]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      navigate(`/worklog-details/${worklogList[newIndex]._id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < worklogList.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      navigate(`/worklog-details/${worklogList[newIndex]._id}`);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? currentWorklog : w));
      setEditMode(false);
      showNotification("success", "Worklog updated successfully!");
      setLoading(false);
    }, 500);
  };

  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleUserSelect = (user: any) => {
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(prev => [...prev, user]);
      // Update the worklog with new assigned users
      const newAssignedTo = [...selectedUsers, user].map(u => u._id);
      setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, assignedTo: newAssignedTo} : w));
    }
    setUserSearchTerm("");
    setShowUserDropdown(false);
  };

  const handleUserRemove = (userId: string) => {
    const updatedUsers = selectedUsers.filter(u => u._id !== userId);
    setSelectedUsers(updatedUsers);
    // Update the worklog with removed assigned users
    const newAssignedTo = updatedUsers.map(u => u._id);
    setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, assignedTo: newAssignedTo} : w));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this worklog?")) {
      setLoading(true);
      setTimeout(() => {
        setWorklogList(prev => prev.filter(w => w._id !== currentWorklog._id));
        showNotification("success", "Worklog deleted successfully!");
        navigate("/worklog-dashboard");
        setLoading(false);
      }, 500);
    }
  };

  if (!currentWorklog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Worklog Not Found</h2>
          <p className="text-gray-600 mb-4">The worklog you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/worklog-dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      yellow: "bg-yellow-100 text-yellow-800",
      purple: "bg-purple-100 text-purple-800",
      green: "bg-green-100 text-green-800",
      gray: "bg-gray-100 text-gray-800",
      red: "bg-red-100 text-red-800"
    };
    return colorClasses[statusOption?.color as keyof typeof colorClasses] || "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: string) => {
    const priorityOption = priorityOptions.find(p => p.value === priority);
    const colorClasses = {
      gray: "bg-gray-100 text-gray-800",
      yellow: "bg-yellow-100 text-yellow-800",
      orange: "bg-orange-100 text-orange-800",
      red: "bg-red-100 text-red-800"
    };
    return colorClasses[priorityOption?.color as keyof typeof colorClasses] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/worklog-dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowLeft className="w-4 h-4" />
                </button>
                
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} of {worklogList.length}
                </span>
                
                <button
                  onClick={handleNext}
                  disabled={currentIndex === worklogList.length - 1}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <InlineLoader size={16} />
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {editMode ? (
                    <input
                      type="text"
                      value={currentWorklog.title}
                      onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, title: e.target.value} : w))}
                      className="w-full text-2xl font-bold text-gray-900 border-none focus:ring-0 p-0"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-900">{currentWorklog.title}</h1>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentWorklog.status)}`}>
                    {statusOptions.find(s => s.value === currentWorklog.status)?.icon} {statusOptions.find(s => s.value === currentWorklog.status)?.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentWorklog.priority)}`}>
                    {priorityOptions.find(p => p.value === currentWorklog.priority)?.label}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                {editMode ? (
                  <textarea
                    value={currentWorklog.description}
                    onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, description: e.target.value} : w))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed">{currentWorklog.description}</p>
                )}
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiActivity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Worklog updated</p>
                      <p className="text-xs text-gray-500">{currentWorklog.updatedAt.toLocaleDateString()} at {currentWorklog.updatedAt.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiPlus className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Worklog created</p>
                      <p className="text-xs text-gray-500">{currentWorklog.createdAt.toLocaleDateString()} at {currentWorklog.createdAt.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Comments</h3>
                <button className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <FiMessageSquare className="w-4 h-4" />
                  Add Comment
                </button>
              </div>
              <div className="text-center py-8 text-gray-500">
                <FiMessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No comments yet</p>
                <p className="text-sm">Be the first to add a comment</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  {editMode ? (
                    <select
                      value={currentWorklog.status}
                      onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, status: e.target.value} : w))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(currentWorklog.status)}`}>
                      {statusOptions.find(s => s.value === currentWorklog.status)?.icon} {statusOptions.find(s => s.value === currentWorklog.status)?.label}
                    </span>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  {editMode ? (
                    <select
                      value={currentWorklog.priority}
                      onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, priority: e.target.value} : w))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentWorklog.priority)}`}>
                      {priorityOptions.find(p => p.value === currentWorklog.priority)?.label}
                    </span>
                  )}
                </div>

                {/* Task Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Task Type</label>
                  {editMode ? (
                    <select
                      value={currentWorklog.taskType}
                      onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, taskType: e.target.value} : w))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {taskTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 mt-1">
                      {taskTypeOptions.find(t => t.value === currentWorklog.taskType)?.icon} {taskTypeOptions.find(t => t.value === currentWorklog.taskType)?.label}
                    </p>
                  )}
                </div>

                {/* Project */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Project</label>
                  {editMode ? (
                    <select
                      value={currentWorklog.projectId}
                      onChange={(e) => {
                        const project = projectList.find(p => p._id === e.target.value);
                        setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, projectId: e.target.value, projectName: project?.name || "Unknown Project"} : w));
                      }}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {projectList.map(project => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                      <FiFolder className="w-4 h-4 text-blue-600" />
                      {currentWorklog.projectName}
                    </p>
                  )}
                </div>

                {/* Assigned To */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned To</label>
                  {editMode ? (
                    <div>
                      {/* Selected Users */}
                      {selectedUsers.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {selectedUsers.map(user => (
                            <div
                              key={user._id}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              <span>{user.name}</span>
                              <button
                                type="button"
                                onClick={() => handleUserRemove(user._id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FiX className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Search Input */}
                      <div className="relative">
                        <div className="relative">
                          <input
                            type="text"
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            onFocus={() => setShowUserDropdown(true)}
                            placeholder="Search users..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        {/* Dropdown */}
                        {showUserDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredUsers.length > 0 ? (
                              filteredUsers.map(user => (
                                <button
                                  key={user._id}
                                  type="button"
                                  onClick={() => handleUserSelect(user)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                                >
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FiUsers className="w-3 h-3 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-2 text-gray-500 text-sm">No users found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 space-y-1">
                      {currentWorklog.assignedTo.map(userId => {
                        const user = userList.find(u => u._id === userId);
                        return (
                          <div key={userId} className="flex items-center gap-2 text-sm text-gray-900">
                            <FiUser className="w-4 h-4 text-gray-500" />
                            {user?.name || "Unknown User"}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Time Tracking */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Est. Hours</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={currentWorklog.estimatedHours}
                        onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, estimatedHours: parseFloat(e.target.value) || 0} : w))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{currentWorklog.estimatedHours}h</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Actual Hours</label>
                    {editMode ? (
                      <input
                        type="number"
                        value={currentWorklog.actualHours}
                        onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, actualHours: parseFloat(e.target.value) || 0} : w))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{currentWorklog.actualHours}h</p>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    {editMode ? (
                      <input
                        type="date"
                        value={currentWorklog.startDate.toISOString().split('T')[0]}
                        onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, startDate: new Date(e.target.value)} : w))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{currentWorklog.startDate.toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    {editMode ? (
                      <input
                        type="date"
                        value={currentWorklog.dueDate.toISOString().split('T')[0]}
                        onChange={(e) => setWorklogList(prev => prev.map(w => w._id === currentWorklog._id ? {...w, dueDate: new Date(e.target.value)} : w))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-sm text-gray-900 mt-1">{currentWorklog.dueDate.toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <FiLink className="w-4 h-4" />
                  Link Related Work
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <FiGitBranch className="w-4 h-4" />
                  Create Branch
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <FiPaperclip className="w-4 h-4" />
                  Attach Files
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorklogDetails;
