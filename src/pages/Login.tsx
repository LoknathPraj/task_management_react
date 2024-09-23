import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { BASE_URL, Endpoint } from "../constant";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const appState: any = useContext(AppContext);
  const [loading,setLoading]=useState<boolean>(false)

  const _onSubmit = (event: any) => {
    event.preventDefault();
    const payload = { email:username, password };
    if(username && password){
    doLogin(payload);
    setLoading(true)
    }
  };

  async function doLogin(payload: any) {
    try {
      const url = `${BASE_URL}${Endpoint.LOGIN}`;
      let headersList = {
        "Content-Type": "application/json"
       }
      const response = await fetch(url,{ 
        method: "POST",
        body: JSON.stringify(payload),
        headers: headersList
      });
    
      if (response?.status===200) {
        setLoading(false)
        const data=await response?.json()
        appState.setUserDetails(data);
      }else{
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      alert("Something went wrong");
    }
  }
  return (
    <form className="p-4 m-auto flex self-center mt-5" onSubmit={_onSubmit}>
      <div
        className=" md:w-1/3 sm:w-full  m-auto text-left border-gray-400 p-6"
        style={{ borderWidth: 1 }}
      >
        <img src="/logo.png" className="m-auto mb-15 mt-10" />
        <div>
          <label>Username</label>
          <input
            required
            placeholder=""
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            style={{ borderWidth: 1 }}
            className="border-1 border-gray-400 w-full h-11 pl-2 rounded"
          />
        </div>
        <div className="mt-5">
          <label>Password</label>
          <input
            required
            placeholder=""
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            style={{ borderWidth: 1 }}
            className="border-1 border-gray-400 w-full h-11 pl-2 rounded"
          />
        </div>

        <div className="m-auto text-center mt-15 mb-10">
          <button
          disabled={loading}
            type="submit"
            className="bg-blue-700 text-white p-2 rounded m-auto w-1/2"
          >
            Login
          </button>
         {loading&&<p>Loading...</p>}
        </div>
      </div>
    </form>
  );
}
