import { Autocomplete, Button, TextField, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { designationOptions } from "../utils/index";
import { showNotification } from "../components/Toast";
import Dropdown from "../components/Dropdown";
import { BASE_URL } from "../constant";
import Loader from "../components/Loader";

function AddAdmin() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validPwd, setValidPwd] = useState(true);
  const [validMatch, setValidMatch] = useState(false);
  const [formErrors, setFormErrors] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [departmentData, setDepartmentData] = useState<any>();
  const [editState, setEditState] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getUserDetails(paginationModel.page, paginationModel.pageSize);
  };
  const columns: any[] = [
    {
      field: "s_no",
      headerName: "S. No",
      width: 80,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "designation",
      headerName: "Designation",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "department",
      headerName: "Departments",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "email",
      headerName: "E-Mail",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "joiningDate",
      headerName: "Joining Date",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
  ];

  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!*@#$%]).{8,24}$/;

  useEffect(() => {
    const result = PWD_REGEX.test(matchPwd);
    if (result && validMatch) {
      setFormData((prevValues: any) => ({ ...prevValues, password: matchPwd }));
      // setFormErrors((prevValues) => ({ ...prevValues, password: "" }));
    } else {
      setFormData((prevValues: any) => ({
        ...prevValues,
        password: undefined,
      }));
      /* setFormErrors((prevErrors) => ({
        ...prevErrors,
        password: "Enter a valid password",
      })); */
    }
  }, [pwd, matchPwd, validMatch]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  const axiosHandler = useAxios();
  const getUserDetails = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`auth/getUserList?page=${page + 1}&limit=${pageSize}`);

      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setUserList(data);
      setTotalRows(totalItems);
    } catch (error: any) {}
    finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getUserDetails(paginationModel?.page, paginationModel?.pageSize);
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

  const deptOptions = departmentData?.map((item: any) => ({
    value: item?.id,
    label: item?.name,
  }));
  const resetStates = () => {
    setFormErrors({});
    setFormData(null);
    setPwd("")
    setMatchPwd("");
    setEditState(false);
  };

  const adminList = userList?.filter((item: any) => item?.role === 10001);
  
  

  useEffect(() => {
    if (Array.isArray(adminList)) {
      const formattedRows = adminList.map((user: any, index: number) => ({
        ...user,
        id: user?._id,
        s_no: index + 1,
        designation: designationOptions?.find(
          (item: any) => item.value == user?.designationId
        )?.label,
        department: user.department.map(
          (departmentId: any) =>
            deptOptions?.find(
              (item: { value: string; label: string }) =>
                item.value === departmentId
            )?.label
        ),
        joiningDate: formatDate(user?.joiningDate),
      }));
      setRows(formattedRows);
  
    }
  }, [userList]);
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
    password: editState ? false : true,
    // deptId: true,
    designationId: true,
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
          if (trimmedValue && key === "email") {
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
          if (trimmedValue && key === "mobile") {
            if (trimmedValue.length < 10 || trimmedValue.length > 10) {
              validationErrors[key] = "Phone Number must have 10 Digits!";
            }
          }
        } else if (value === null || value === undefined || value === "") {
          if (key === "deptId") {
            validationErrors[key] = `Department is required`;
          } else if (key === "designationId") {
            validationErrors[key] = `Designation is required`;
          } else if (key === "mobile") {
            validationErrors[key] = `Phone Number is required`;
          } else {
            validationErrors[key] = `${formatLabel(key)} is required`;
          }
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

  const handleEdit = (user: any) => {
    setEditState(true);
    const userDetails = {
      ...user,
      joiningDate: formatDate(user?.joiningDate),
      designationId: designationOptions.find(
        (item: any) => item.value == user?.designationId
      ),
      department: user?.department.map((departmentLabel: string) => {
        const department = deptOptions.find(
          (item: { label: string; value: string }) =>
            item?.label === departmentLabel
              ? { label: item.label, value: item.value }
              : null
        );
        return department;
      }),
    };
    setFormData(userDetails);
    setIsModalOpen(true);
  };

  const deleteUserById = async (id: any) => {
    try {
      const response = await axiosHandler.get(`auth/deleteUserById/${id}`);
      if (response) {
        setLoading(false);
        showNotification("success", "Admin deleted successfully!");
      }
      getUserDetails(paginationModel?.page, paginationModel?.pageSize);
    } catch (error: any) {
      setLoading(false);
      showNotification("error", "Something went wrong");
    }
  };
  const handleDelete = (_id: string) => {
    setLoading(true);
    deleteUserById(_id);
    setLoading(false);
  };

  const onClickAction = (actionType: any, row: any, id: any) => {
    if (actionType === "EDIT") {
      handleEdit(row);
    } else if (actionType === "DELETE") {
      handleDelete(id);
    }
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
  const handleDropdownChange = (option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      department: option,
    }));
  };
  // const createUser = async (data: any) => {
  //   try {
  //     const response = await axiosHandler.put(`auth/signup/${data}`);
  //     getUserDetails();
  //   } catch (error: any) {}
  // };

  const appState: any = useContext(AppContext);

  const createUser = async (data: any) => {
    const url = `${BASE_URL}auth/signup`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: headersList,
        body: JSON.stringify(data),
      });
      if (response) {
        setLoading(false);
        showNotification("success", "Admin created successfully!");
      }
    } catch (error) {
      setLoading(false);
      showNotification("error", "Something went wrong");
    }
  };
  const updateUser = async (data: any, id: any) => {
    const url = `${BASE_URL}auth/updateUserById/${id}`;
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
        getUserDetails(paginationModel?.page, paginationModel?.pageSize);
        setLoading(false);
        showNotification("success", "Admin updated successfully!");
      }
    } catch (error) {
      setLoading(false);
      showNotification("error", "Something went wrong");
    }
  };

  const onClickButton = (type: string) => {
    if (type) {
      handleSubmit();
    } else {
      setIsModalOpen(!isModalOpen);
      setFormErrors("");
    }
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      setEditState(false);
      setLoading(true);
      const userData: any = {
        ...formData,
        designationId: Number(formData?.designationId?.value),
        departmentIds: formData?.department?.map((item: any) => item?.value),
        password: matchPwd,
        role: 10001,
      };
     
      if (userData?.id) {
        await updateUser(userData, userData?.id);
      } else {
        await createUser(userData);
      }
      setLoading(false)
      setIsModalOpen(!isModalOpen);
      resetStates();
      getUserDetails(paginationModel?.page, paginationModel?.pageSize);
    }
  };

  return (
    <>
      <div className="m-5 h-10">
      {loading&& <Loader />}
        <GridTable
          onClickAction={onClickAction}
          actions={["DELETE", "EDIT"]}
          rowData={rows}
          onClickAdd={() => {
            setIsModalOpen(true);
            resetStates();
          }}
          columnData={columns}
          toolTipName={"Create Admin"}
          onPaginationChange={handlePaginationChange}
          rowCount={totalRows}
        />
      </div>
      {isModalOpen && (
        <Modal
          isLoading={loading}
          customFooter={true}
          //modalSize=""
          //modalHeight=""
          modalHeader={editState ? "Update Admin" : "Create Admin"}
          modalBody={
            <div>
              <div className="relative mt-5 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                  <div className=" mb-6">
                    <TextField
                      className="w-80"
                      label="Full Name"
                      name="name"
                      required={requiredInputFields.name}
                      error={formErrors?.name || ""}
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
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.name || ""}
                    </div>
                  </div>
                  <div className=" mb-6">
                    <TextField
                      className="w-80"
                      label="Phone Number"
                      name="mobile"
                      required={requiredInputFields.mobile}
                      value={formData?.mobile || ""}
                      onChange={handleInputChange}
                      type="number"
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
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.mobile || ""}
                    </div>
                  </div>
                  <div className="mb-6">
                    <Autocomplete
                      className="w-80"
                      options={designationOptions}
                      value={formData?.designationId}
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
                          required={requiredInputFields.designationId}
                          InputLabelProps={{
                            sx: {
                              marginTop: "-8px",
                            },
                          }}
                        />
                      )}
                    />
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.designationId || ""}
                    </div>
                  </div>
                  <div className=" mb-6">
                    <TextField
                    disabled={editState ? true : false}
                      className="w-80"
                      label="Joining Date"
                      type="date"
                      required={requiredInputFields.joiningDate}
                      name="joiningDate"
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
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.joiningDate || ""}
                    </div>
                  </div>
                  <div className=" mb-6">
                    <TextField
                    disabled={editState}
                      className="w-80"
                      label="E-Mail"
                      type="email"
                      name="email"
                      required={requiredInputFields.email}
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
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.email || ""}
                    </div>
                  </div>
                  <div className=" mb-6">
                    <TextField
                      className="w-80"
                      disabled={editState}
                      label="Employee ID"
                      name="empId"
                      required={requiredInputFields.empId}
                      error={formErrors?.empId || ""}
                      value={formData?.empId || ""}
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
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.name || ""}
                    </div>
                  </div>

                  <div className=" mb-6 relative">
                    {/* <p className="absolute left-17 top-[-21px]">
                      <span className="text-red-600">*</span>
                      <Tooltip
                        placement="top"
                        title={
                          "Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: !@#$%*"
                        }
                      >
                        <span className="ml-1">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-blue-gray-700"
                          />
                        </span>
                      </Tooltip>
                      <Tooltip placement="top" title={"Valid Password"}>
                        <span
                          className={
                            validPwd ? "text-[#32CD32] ml-1" : "hidden"
                          }
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </Tooltip>
                      <Tooltip placement="top" title="Invalid Password">
                        <span
                          className={
                            validPwd || !pwd ? "hidden" : "text-red-600 ml-1"
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </Tooltip>
                    </p> */}
                    <TextField
                      className="w-80"
                      label="Password"
                      required={requiredInputFields.password}
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
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.password || ""}
                    </div>
                  </div>

                  <div className=" mb-6">
                    {/* <p className="">
                      Confirm Password
                      <span className="text-red-600">*</span>
                      <Tooltip
                        placement="top"
                        title={"  Must match the New password."}
                      >
                        <span className="ml-1">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-blue-gray-700"
                          />
                        </span>
                      </Tooltip>
                      <Tooltip placement="top" title="Valid Match">
                        <span
                          className={
                            validMatch && matchPwd && validPwd
                              ? "text-[#32CD32] ml-1"
                              : "hidden"
                          }
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      </Tooltip>
                      <Tooltip placement="top" title="Invalid Match">
                        <span
                          className={
                            (validMatch && validPwd) || !matchPwd
                              ? "hidden"
                              : "text-red-600 ml-1"
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </Tooltip>
                    </p> */}
                    <TextField
                      className="w-80"
                      label="Confirm Password"
                      required={requiredInputFields.confimPassword}
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

                  <div className="">
                    <Dropdown
                      submitRef={true}
                      multiple={true}
                      disabled={editState}
                      defaultValue={formData?.department || null}
                      options={deptOptions}
                      handleChange={handleDropdownChange}
                      errorMessage={formErrors?.department}
                      requiredField={requiredInputFields?.ldepartment || false}
                      defaultLabel="Choose Departments"
                      label=""
                      className="h-[39px]"
                    />
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.deptId || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          positiveButtonTitle={editState ? "Update" : "Create"}
          onClickButton={onClickButton}
        />
      )}
    </>
  );
}

export default AddAdmin;
