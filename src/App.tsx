import React, { useContext } from "react";
import "./App.css";
import AddTask from "./pages/AddTask";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLogin from "./pages/AdminLogin";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NoPage from "./pages/NoPage";
import { AppContext } from "./context/AppContext";
import ViewAdminDashboard from "./pages/ViewAdminDashboard";
import AddUser from "./pages/AddUser";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/Header/UserProfile";
import AddAdmin from "./pages/AddAdmin";
import Department from "./pages/Department";
import Project from "./pages/Project";
import ViewTasks from "./pages/ViewTasks";
import TaskType from "./pages/TaskType";
import NewDashboard from "./pages/NewDashboard";
import WorklogDashboard from "./pages/WorklogDashboard";
import WorklogDetails from "./pages/WorklogDetails";
import CreateWorklog from "./pages/CreateWorklog";

export default function App() {
  const appState: any = useContext(AppContext);


  return (
    <BrowserRouter>
      {!appState?.userDetails ? (
                    <Routes>
              <Route index element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
      ) : appState?.userDetails?.user?.role === 10001 ? (
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<NewDashboard/>} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-dashboard" element={<NewDashboard />} />
            <Route path="/tasks" element={<ViewAdminDashboard />} />
            <Route path="/project" element={<Project />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/task-type" element={<TaskType />} />
            <Route path="/worklog-dashboard" element={<WorklogDashboard />} />
            <Route path="/worklog-details/:id" element={<WorklogDetails />} />
            <Route path="/create-worklog" element={<CreateWorklog />} />
           
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : appState?.userDetails?.user?.role === 10000 ? (
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index  element={<AddTask />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/view-tasks" element={<ViewTasks />} />
            <Route path="/worklog-dashboard" element={<WorklogDashboard />} />
            <Route path="/worklog-details/:id" element={<WorklogDetails />} />
            <Route path="/create-worklog" element={<CreateWorklog />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : appState?.userDetails?.user?.role === 10002 ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/department" element={<Department />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/worklog-dashboard" element={<WorklogDashboard />} />
            <Route path="/worklog-details/:id" element={<WorklogDetails />} />
            <Route path="/create-worklog" element={<CreateWorklog />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : (
        ""
      )}
    </BrowserRouter>
  );
}
