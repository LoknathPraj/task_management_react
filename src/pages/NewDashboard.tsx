import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { 
  FiUsers, 
  FiFolder, 
  FiClock, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiActivity,
  FiCalendar,
  FiTarget,
  FiPlus
} from "react-icons/fi";

export default function NewDashboard() {
  const appState: any = useContext(AppContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosHandler = useAxios();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard statistics
      const statsResponse = await axiosHandler.get("dashboard/stats");
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.data);
      }

      // Fetch recent tasks
      const tasksResponse = await axiosHandler.get("worklog/recent");
      if (tasksResponse?.data?.success) {
        setRecentTasks(tasksResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="card hover:shadow-lg transition-all duration-300">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '+' : ''}{change}% from last month
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  const TaskCard = ({ task }: any) => (
    <div className="card hover:shadow-md transition-all duration-200">
      <div className="card-body p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{task.project_name}</h3>
            <p className="text-sm text-gray-600">{task.task_type}</p>
          </div>
          <span className={`badge ${
            task.status === 'completed' ? 'badge-success' :
            task.status === 'in-progress' ? 'badge-warning' : 'badge-info'
          }`}>
            {task.status}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{task.task_description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            <span>{task.working_hrs}h {task.working_mins}m</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            <span>{new Date(task.working_date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {appState?.userDetails?.user?.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-outline flex items-center gap-2">
            <FiActivity className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="bg-blue-500"
          change={12}
        />
        <StatCard
          title="Active Projects"
          value={stats.totalProjects}
          icon={FiFolder}
          color="bg-green-500"
          change={8}
        />
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={FiTarget}
          color="bg-purple-500"
          change={15}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={FiCheckCircle}
          color="bg-emerald-500"
          change={23}
        />
      </div>

      {/* Task Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Overview */}
        <div className="card lg:col-span-2">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Task Overview</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(stats.pendingTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.pendingTasks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.inProgressTasks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stats.completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <button className="w-full btn btn-primary flex items-center gap-2">
                <FiPlus className="w-4 h-4" />
                Add New Task
              </button>
              <button className="w-full btn btn-outline flex items-center gap-2">
                <FiFolder className="w-4 h-4" />
                Create Project
              </button>
              <button className="w-full btn btn-outline flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                Add User
              </button>
              <button className="w-full btn btn-outline flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4" />
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="card-body">
          {recentTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTasks.slice(0, 6).map((task: any, index: number) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiTarget className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent tasks found</p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {[
              { action: "Task completed", user: "John Doe", time: "2 hours ago", type: "success" },
              { action: "New project created", user: "Jane Smith", time: "4 hours ago", type: "info" },
              { action: "User added to project", user: "Mike Johnson", time: "6 hours ago", type: "warning" },
              { action: "Task updated", user: "Sarah Wilson", time: "1 day ago", type: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}