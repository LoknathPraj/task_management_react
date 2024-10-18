import React, { useContext } from "react";
import "./App.css";
import AddTask from "./pages/AddTask";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NoPage from "./pages/NoPage";
import { AppContext } from "./context/AppContext";
import ViewAdminDashboard from "./pages/ViewAdminDashboard";
import AddUser from "./pages/AddUser";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/Header/UserProfile";
import AddAdmin from "./pages/AddAdmin";

export default function App() {
  const appState: any = useContext(AppContext);

  console.log(appState);

  return (
    <BrowserRouter>
      {!appState?.userDetails ? (
        <Routes>
          <Route index element={<Login />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      ) : appState?.userDetails?.user?.role === 10001 ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<ViewAdminDashboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : appState?.userDetails?.user?.role === 10000 ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : appState?.userDetails?.user?.role === 10002 ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : (
        ""
      )}
    </BrowserRouter>
  );
}
