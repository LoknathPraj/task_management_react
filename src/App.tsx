import React, { useContext } from "react";
import "./App.css";
import AddTask from "./pages/AddTask";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import NoPage from "./pages/NoPage";
import { AppContext } from "./context/AppContext";
import ViewAdminDashboard from "./pages/ViewAdminDashboard";

export default function App() {
  const appState: any = useContext(AppContext);
 console.log(appState?.userDetails?.user?.role)
  return (
    <BrowserRouter>
      {!appState?.userDetails ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Login />} />

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
          {appState?.userDetails?.user?.role==10001?
            <Route index element={<AddTask />} />
            :
            <Route index element={<ViewAdminDashboard />} />
            }

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
}
