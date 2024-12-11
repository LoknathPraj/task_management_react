import React, { useContext, useEffect, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ProfileImageUploader from "./ProfileImageLoader";
import axios from "axios";
import { BASE_URL } from "../../constant";
import { AppContext } from "../../context/AppContext";
import axiosHandler from "../../context/useAxios";
import useAxios from "../../context/useAxios";
import { designationOptions } from "../../utils/index";
import { TbChevronsDownLeft } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { showNotification } from "../Toast";

function UserProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [isError, setIsError] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validPwd, setValidPwd] = useState(true);
  const [userList, setUserList] = useState<any>();
  const [validMatch, setValidMatch] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [departmentData, setDepartmentData] = useState<any>();
  const [loading, setLoading] = useState<any>(false)

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!*@#$%]).{8,24}$/;

  useEffect(() => {
    const result = PWD_REGEX.test(matchPwd);
    if (result && validMatch) {
      setFormData((prevValues: any) => ({ ...prevValues, password: matchPwd }));
    } else {
      setFormData((prevValues: any) => ({
        ...prevValues,
        password: undefined,
      }));
    }
  }, [pwd, matchPwd, validMatch]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  const axiosHandler = useAxios();
  const getUserDetails = async () => {
    try {
      const response = await axiosHandler.get(`auth/getUserList`);
      const data = response?.data?.data;
      setUserList(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  const getAllDept = async () => {
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds`);
      const data = response?.data?.data;
      setDepartmentData(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getAllDept();
  }, []);

  const updateUser = async (data: any, id: any) => {
    const url = `http://localhost:8080/api/auth/updateUserById/${id}`;
    let headersList = {      
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    try {
    const response = await fetch(url, {
      method: "POST",
      headers: headersList,
      body: JSON.stringify(data),
    });

    if (response) {
      getUserDetails();
      setLoading(false);
      showNotification("success", "User updated succesfully!");
    }

  }
 catch (error) {
  setLoading(false);
  showNotification("error", "Something went wrong");
}
};

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const requiredInputFields: any = {
    name: true,
    joiningDate: true,
    email: true,
    mobile: true,
  };

  const formatLabel = (key: any) => {
    if (!key) return;
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str: any) => str.toUpperCase());
  };

  const validateForm = () => {
    const validationErrors: any = {};
    Object.keys(requiredInputFields).forEach((key) => {
      const value = formData[key];

      if (requiredInputFields[key]) {
        if (typeof value === "string") {
          const trimmedValue = value?.trim();
          if (!trimmedValue) {
            validationErrors[key] = `${formatLabel(key)} is required`;
          }
          if (
            (trimmedValue && key === "email") ||
            key === "personalEmail" ||
            key === "corporateEmail"
          ) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(trimmedValue.trim())) {
              validationErrors[key] = "Invalid email format";
            }
          }
          if (!trimmedValue && !validPwd && key === "password") {
            validationErrors[key] = "Enter a valid Password";
          } else if (
            !validPwd &&
            trimmedValue &&
            trimmedValue.length < 8 &&
            key === "password"
          ) {
            validationErrors[key] = "Password must have atleast 8 characters!";
          } else if (
            !validPwd &&
            trimmedValue &&
            trimmedValue.length >= 8 &&
            key === "password"
          ) {
            validationErrors[key] = "Enter a valid Password";
          }
          if (
            trimmedValue &&
            (key === "phoneNumber" || key === "contactNumber")
          ) {
            if (trimmedValue.length < 10 || trimmedValue.length > 10) {
              validationErrors[key] = "Phone Number must have 10 Digits!";
            }
          }
        } else if (value === null || value === undefined || value === "") {
          validationErrors[key] = `${formatLabel(key)} is required`;
        }
      }
    });
    setFormErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const trimObjectValues: any = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj.map(trimObjectValues);
    } else if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc: any, key) => {
        acc[key] = trimObjectValues(obj[key]);
        return acc;
      }, {});
    } else if (typeof obj === "string") {
      return obj.trim();
    }
    return obj;
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    

    setFormData((prevValues: any) => ({ ...prevValues, [name]: value }));
  };

  const handleDesignationChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      designationId: option,
    }));
  };

  const handleSubmit = async () => {
    const userData: any = {
      ...formData,
      designationId: Number(formData?.designationId?.value),
      deptId: Number(formData?.deptId?.value),
      password: matchPwd,
    };
    updateUser(userData, userData?.id);
    setFormData({});
    setMatchPwd("");
  };

  const appState: any = useContext(AppContext);

  const userDetail = appState?.userDetails?.userId;

  const thisUser = userList?.find((user: any) => user?._id === userDetail);
  

 

  useEffect(() => {
    if (thisUser) {
      
      setFormData(thisUser);
      setFormData((prevValues: any) => ({
        ...prevValues,
        joiningDate: formatDate(prevValues?.joiningDate),
        designationId: designationOptions.find(
          (item: any) => item.value == (prevValues?.designationId)
        ),
      }));
    }
  }, [thisUser]);


  return (
    <>
      <div className="w-[97%] mx-auto">
        <h1 className="py-2  rounded-sm mb-4 mx-auto bg-blue-700 text-white text-center text-2xl">
          My Profile
        </h1>
        <div
          className="mx-auto mt-6"
          style={{
            width: "150px",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <ProfileImageUploader />
        </div>
        <div className="bg-white h-[25rem] w-[80%] mx-auto">
          <div className="relative mb-4 mt-6 bg-w ">
            <div className="flex flex-col xsm:flex-row justify-between items-center"></div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 mt-10 ml-20">
              <div className=" mb-8">
                <TextField
                  className="w-80"
                  label="Full Name"
                  name="name"
                  value={formData?.name || ""}
                  type="text"
                  onChange={handleInputChange}
                  InputLabelProps={{
                    sx: {
                      marginTop: "-8px",
                    },
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                />
              </div>
              <div className=" mb-8">
                <TextField
                  className="w-80"
                  label="Phone Number"
                  name="mobile"
                  type="number"
                  value={formData?.mobile || ""}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    sx: {
                      marginTop: "-8px",
                    },
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                />
              </div>
              <div className="mb-8">
                <Autocomplete
                  className="w-80"
                  options={[...designationOptions]}
                  value={formData?.designationId ? formData?.designationId?.label : ''}
                  onChange={handleDesignationChange}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Designation"
                      name="designationId"
                      InputLabelProps={{
                        sx: {
                          marginTop: "-8px",
                        },
                      }}
                    />
                  )}
                />
              </div>
              <div className=" mb-8">
                <TextField
                  className="w-80"
                  label="Joining Date"
                  disabled={true}
                  type="date"
                  onChange={handleInputChange}
                  value={formData?.joiningDate || ""}
                  InputLabelProps={{
                    shrink: true,
                    sx: {
                      marginTop: "-8px",
                    },
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                />
              </div>
              <div className=" mb-8">
                <TextField
                  className="w-80"
                  label="E-Mail"
                  disabled={true}
                  type="email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData?.email || ""}
                  InputLabelProps={{
                    sx: {
                      marginTop: "-8px",
                    },
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                />
              </div>
              {/* <div className="mb-8">
                <Autocomplete
                  className="w-80"
                  options={depts}
                  value={formData?.department}
                  onChange={handleDepartmentChange}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department"
                      InputLabelProps={{
                        sx: {
                          marginTop: "-8px",
                        },
                      }}
                    />
                  )}
                />
              </div> */}
              <div className=" mb-8">
                <TextField
                  className="w-80"
                  label="Password"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  InputLabelProps={{
                    sx: {
                      marginTop: "-8px",
                    },
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                />
              </div>
              <div className=" mb-8">
                <TextField
                  className="w-80"
                  label="Confirm Password"
                  type="password"
                  value={matchPwd}
                  // onFocus={() => setMatchFocus(true)}
                  // onBlur={() => setMatchFocus(false)}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  InputLabelProps={{
                    sx: {
                      marginTop: "-8px",
                    },
                  }}
                  sx={{
                    ".MuiInputBase-root": {
                      height: "40px",
                    },
                  }}
                />
              </div>
            </div>
            <div className="absolute pb-9 right-20 space-x-4 ">
              <NavLink to="/">
                <Button className="border-2 border-blue-700" variant="outlined">
                  Close
                </Button>
              </NavLink>
              <Button
                className="bg-blue-700 mb-10"
                onClick={handleSubmit}
                variant="contained"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
