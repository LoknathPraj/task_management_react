import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import InlineLoader from "../components/InlineLoader";
import { 
  FiArrowLeft, 
  FiSave, 
  FiX, 
  FiFolder, 
  FiTag, 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiFileText,
  FiAlertCircle,
  FiPlay,
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

const CreateWorklog = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const axiosHandler = useAxios();
  
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [projectList, setProjectList] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    taskType: "",
    status: "active",
    priority: "medium",
    projectId: "",
    estimatedHours: "",
    startDate: "",
    dueDate: ""
  });

  const [formErrors, setFormErrors] = useState<any>({});

  // Dummy data for demonstration
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
    { _id: "proj3", name: "Mobile App" },
    { _id: "proj4", name: "Analytics Dashboard" },
    { _id: "proj5", name: "API Gateway" }
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
    { value: "active", label: "Active", icon: "▶️" },
    { value: "in-progress", label: "In Progress", icon: "⏸️" },
    { value: "review", label: "Under Review", icon: "👀" },
    { value: "resolved", label: "Resolved", icon: "✅" },
    { value: "closed", label: "Closed", icon: "🔒" },
    { value: "blocked", label: "Blocked", icon: "🚫" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ];

  useEffect(() => {
    // Load dummy data
    setUserList(dummyUsers);
    setProjectList(dummyProjects);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  };

  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleUserSelect = (user: any) => {
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(prev => [...prev, user]);
    }
    setUserSearchTerm("");
    setShowUserDropdown(false);
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId));
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.taskType) errors.taskType = "Task type is required";
    if (!formData.projectId) errors.projectId = "Project is required";
    if (!formData.estimatedHours) errors.estimatedHours = "Estimated hours is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    if (selectedUsers.length === 0) errors.assignedTo = "At least one user must be assigned";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const project = projectList.find(p => p._id === formData.projectId);
      
      const newWorklog: WorklogItem = {
        _id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        taskType: formData.taskType,
        status: formData.status,
        priority: formData.priority,
        assignedTo: selectedUsers.map(u => u._id),
        projectId: formData.projectId,
        projectName: project?.name || "Unknown Project",
        estimatedHours: parseFloat(formData.estimatedHours),
        actualHours: 0,
        startDate: new Date(formData.startDate),
        dueDate: new Date(formData.dueDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      showNotification("success", "Worklog created successfully!");
      navigate("/worklog-dashboard");
    } catch (error: any) {
      showNotification("error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/worklog-dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Create New Worklog</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-700">Title</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  formErrors.title 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter worklog title"
              />
              {formErrors.title && (
                <p className="text-sm text-red-600 mt-2">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-700">Description</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                  formErrors.description 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Describe the worklog details..."
              />
              {formErrors.description && (
                <p className="text-sm text-red-600 mt-2">{formErrors.description}</p>
              )}
            </div>

            {/* Task Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiTag className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Task Type</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.taskType 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="">Select Task Type</option>
                  {taskTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
                {formErrors.taskType && (
                  <p className="text-sm text-red-600 mt-2">{formErrors.taskType}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiPlay className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Status</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Priority and Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiAlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-700">Priority</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiFolder className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Project</span>
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.projectId 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="">Select Project</option>
                  {projectList.map((project: any) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {formErrors.projectId && (
                  <p className="text-sm text-red-600 mt-2">{formErrors.projectId}</p>
                )}
              </div>
            </div>

            {/* Assigned To - Searchable Dropdown */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-700">Assigned To</span>
                <span className="text-red-500">*</span>
              </label>
              
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
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
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiUsers className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No users found</div>
                    )}
                  </div>
                )}
              </div>
              
              {formErrors.assignedTo && (
                <p className="text-sm text-red-600 mt-2">{formErrors.assignedTo}</p>
              )}
            </div>

            {/* Hours and Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-gray-700">Est. Hours</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.estimatedHours 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="0.0"
                />
                {formErrors.estimatedHours && (
                  <p className="text-sm text-red-600 mt-2">{formErrors.estimatedHours}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Start Date</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.startDate 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {formErrors.startDate && (
                  <p className="text-sm text-red-600 mt-2">{formErrors.startDate}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <FiCalendar className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-gray-700">Due Date</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
                    formErrors.dueDate 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {formErrors.dueDate && (
                  <p className="text-sm text-red-600 mt-2">{formErrors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/worklog-dashboard")}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <InlineLoader size={16} />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
                Create Worklog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorklog;
