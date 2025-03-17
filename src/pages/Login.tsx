import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { BASE_URL, Endpoint } from "../constant";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { showNotification } from "../components/Toast";
import Loader from "../components/Loader";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const appState: any = useContext(AppContext);
 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const _onSubmit = (event: any) => {
    event.preventDefault();
    const payload = { email: username, password };
    if (username && password) {
      doLogin(payload);
      setLoading(true);
    }
  };

  async function doLogin(payload: any) {
    setLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.LOGIN}`;
      let headersList = {
        "Content-Type": "application/json",
      };
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headersList,
      });

      if (response?.status === 200) {
        setLoading(false);
        const data = await response?.json();
        appState.setUserDetails(data);
        navigate("/");
        showNotification("success", "Succesfully Logged in!")
      } else {
        setLoading(false);
        showNotification("error","Something went wrong");
      }
    } catch (err) {
      setLoading(false);
      showNotification("error","Something went wrong");
    }
    finally {
      setLoading(false); 
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 ">
      {loading&& <Loader />}
      <form className="p-4 flex self-center bg-white shadow-lg rounded-lg" onSubmit={_onSubmit}>
        <div className="md:w-96 sm:w-full m-auto p-6 text-left border-gray-400">
          <img src="/logo.png" className="m-auto mb-15 mt-10" />
          <div>
            <label>Username</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-400 w-full h-11 pl-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-5">
            <label>Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 w-full h-11 pl-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="m-auto text-center mt-15 mb-10">
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-700 text-white p-2  rounded m-auto  w-full "
            >
              Login
            </button>
            {/* {loading && (
              <div className="mt-5 flex justify-center">
                <Oval height={35} width={35} color="#1f7fbb" ariaLabel="loading" strokeWidth={3} />
              </div>
            )} */}
          </div>
        </div>
      </form>
    </div>
  );
}
