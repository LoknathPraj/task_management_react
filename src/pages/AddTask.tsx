import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import moment from "moment";

import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Loader from "../components/Loader";
import InlineLoader from "../components/InlineLoader";
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiFileText, FiSave, FiX } from "react-icons/fi";

export default function AddTask() {
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

  const [isLoading, setIsLoading] = useState(false);
  
  const resetForm = () => {
    setProject("");
    setWorkingHrs("");
    setTaskType("");
    setWorkingMinutes("");
    setDescription("");
    setWorkingDate("");
    setLocation("");
    setWorkId("");
  };
  
  const axiosHandler = useAxios();

  const getAllProjects = async () => {
    try {
      const response = await axiosHandler.get(
        `project/${appState?.userDetails?.user?.department?.[0]}`
      );
      const data = response?.data?.data;
      setProjectData(data);
    } catch (error: any) {}
  };
  
  useEffect(() => {
    getAllProjects();
  }, []);

  const getMinutes = () => {
    const mins = [];
    for (let i = 0; i <= 60; i++) {
      if (i % 5 == 0) {
        mins.push(i);
      }
    }
    return mins;
  };
  
  const _submitForm = (event: any) => {
    event.preventDefault();
    const param = {
      _id: workId,
      projectId: project,
      project_name: projectData?.find(
        (project2: any) => project2.id === project
      )?.name,
      task_type: taskType,
      working_date: workingDate,
      working_hrs: workingHrs||"0",
      working_mins: workingMinutes||"0",
      location,
      task_description: description,
      username: appState?.userDetails?.user?.name,
      departmentId: appState?.userDetails?.user?.department,
      adminId: appState?.userDetails?.adminId,
    };
    if (checkEmptyData()) return;
    if (workId) {
      updateTask(param);
    } else {
      addTask(param);
    }
  };


  
  const checkEmptyData = () => {
    if (
      project &&
      taskType &&
      workingDate &&
      workingHrs &&
      workingMinutes &&
      location &&
      description?.trim()
    ) {
      return false;
    }
    return true;
  };

  const addTask = async (param: any) => {
    setIsLoading(true);
    try {
      const response = await axiosHandler.post("worklog", param);
      if (response?.data?.success) {
        showNotification("success", "Task added successfully");

        resetForm();
      } else {
        showNotification(response?.data?.message || "Something went wrong", "error");
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (param: any) => {
    setIsLoading(true);
    try {
      const response = await axiosHandler.put("worklog", param);
      if (response?.data?.success) {
        showNotification("success", "Task updated successfully");

        resetForm();
      } else {
        showNotification(response?.data?.message || "Something went wrong", "error");
      }
    } catch (error: any) {
      showNotification(error?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };



  // Remove full page loader - use inline loader instead

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Task</h1>
          <p className="text-gray-600 mt-1">Create and manage your daily tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
            <FiPlus className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in the task information below</p>
        </div>
        
        <form onSubmit={_submitForm} className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Selection */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiFileText className="w-4 h-4" />
                Project
              </label>
              <select
                required
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="form-input"
              >
                <option value="">Select a project</option>
                {projectData?.map((option: any) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Task Type */}
            <div className="form-group">
              <label className="form-label">Task Type</label>
              <select
                required
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="form-input"
              >
                <option value="">Select task type</option>
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
              </select>
            </div>

            {/* Working Hours */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                Working Time
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  required
                  value={workingHrs}
                  onChange={(e) => {
                    if (!workingHrs) {
                      setWorkingMinutes("0");
                    }
                    setWorkingHrs(e.target.value);
                  }}
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

            {/* Work Date */}
            <div className="form-group">
              <label className="form-label flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                Work Date
              </label>
              <input
                type="date"
                value={moment(workingDate).format("YYYY-MM-DD")}
                onChange={(e) => setWorkingDate(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {/* Location */}
            <div className="form-group md:col-span-2">
              <label className="form-label flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Location
              </label>
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

            {/* Description */}
            <div className="form-group md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={2000}
                rows={6}
                className="form-input resize-none"
                placeholder="Describe the task details..."
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {description.length}/2000 characters
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            {workId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={checkEmptyData() || isLoading}
              className={`btn flex items-center gap-2 ${
                checkEmptyData() || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "btn-primary"
              }`}
            >
              {isLoading ? (
                <InlineLoader text={workId ? "Updating..." : "Creating..."} />
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {workId ? "Update Task" : "Create Task"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>


    </div>
  );
}
