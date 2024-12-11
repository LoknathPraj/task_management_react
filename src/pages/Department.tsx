import { TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Radio from "../components/Radio";

function Department() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [departmentList, setDepartmentList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>();
  const [editIsClicked, setEditIsClicked] = useState(false)

  const columns: any[] = [
    {
      field: "s_no",
      headerName: "S. No",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "name",
      headerName: "Name",
      width: 300,
      headerClassName: "super-app-theme--header",
    },
    // {
    //   field: "is_active",
    //   headerName: "Is Active",
    //   width: 150,
    //   headerClassName: "super-app-theme--header",
    // },

    {
      field: "createdAt",
      headerName: "Created Date",
      width: 300,
      headerClassName: "super-app-theme--header", 
    },
  ];

  const axiosHandler = useAxios();
  const getAllDept = async () => {
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds`);
      const data = response?.data?.data;
      setDepartmentList(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getAllDept();
  }, []);
  useEffect(() => {
    if (Array.isArray(departmentList)) {
      const formattedRows = departmentList.map((dept: any, index: number) => ({
        ...dept,
        id: dept?._id,
        s_no: index + 1,
        createdAt: formatDate(dept?.createdAt),
      }));

      setRows(formattedRows);
    }
  }, [departmentList]);
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  };

  const requiredInputFields: any = {
    name: true,
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
          if (trimmedValue && key === "mobile") {
            if (trimmedValue.length < 10 || trimmedValue.length > 10) {
              validationErrors[key] = "Phone Number must have 10 Digits!";
            }
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
    showNotification("info", "Edit User");
    const userDetails = {
      ...user,
      joiningDate: formatDate(user?.joiningDate), 
      
    };
    setFormData(userDetails);
    setIsModalOpen(true);
    setEditIsClicked(true);
  };

  const deleteDeptById = async (id: any) => {
    try {
      const response = await axiosHandler.get(`department/deleteDepartmentById/${id}`);
      showNotification("success", "Department deleted successfully!")
      getAllDept();
      
    } catch (error: any) {
      showNotification("error", "Something went wrong")
    }
  };
  const handleDelete = (_id: string) => {
    deleteDeptById(_id);
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

  const appState: any = useContext(AppContext);

  const createDept = async (data: any) => {
    const url = `http://localhost:8080/api/department`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };

    try{
    const response = await fetch(url, {
      method: "POST",
      headers: headersList,
      body: JSON.stringify(data),
    });
    showNotification("success", "Department created successfully!")
  } catch(error:any){
    showNotification("error", "Something went wrong")
  }
  };
  // const updateUser = async (data: any, id: any) => {
  //   const url = `http://localhost:8080/api/auth/updateUserById/${id}`;
  //   let headersList = {
  //     "Content-Type": "application/json",
  //     Authorization: "bearer " + appState?.userDetails?.token,
  //   };
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: headersList,
  //     body: JSON.stringify(data),
  //   });

  //   if (response) {
  //     getUserDetails();
  //   }
  // };



  const onClickButton = (type: string) => {
    if (type) {
      handleSubmit();
    } else {
      setIsModalOpen(!isModalOpen);
      setFormErrors("");
    }
  };
  const handleSubmit = async () => {
    if (true) {
      const userData: any = {
        ...formData,
        isActive: formData?.isActive==="true"?true : false,
      };

      if (editIsClicked) {
      
      } else {
        await createDept(userData);
      }
      setIsModalOpen(!isModalOpen);
      setFormData({});
      getAllDept();
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData((prevValues: any) => ({
      ...prevValues,

      isActive: value,
    }));
  };

  return (
    <>
      <h1 className="py-2 w-[96%] rounded-sm mb-8 mx-auto bg-blue-700 text-white text-center text-2xl">
        Departments
      </h1>
      <div className="m-5 h-10">
        <GridTable
          onClickAction={onClickAction}
          actions={["DELETE"]}
          rowData={rows}
          onClickAdd={() => {
            setIsModalOpen(true);
          }}
          columnData={columns}
          toolTipName={"Create Department"}
        />
      </div>
      {isModalOpen && (
        <Modal
          isLoading={false}
          customFooter={true}
          //modalSize=""
          //modalHeight=""
          modalHeader={"Create Department"}
          modalBody={
            <div>
              <div className="relative mt-5 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                  <div className=" mb-6">
                    <TextField
                      className="w-80"
                      label="Department Name"
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
                  </div>
                  {/* <div className=" ml-15 mb-4 mt-[-10px]">
                    <Radio
                      label={"Is Active:"}
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                      selectedValue={formData?.isActive}
                      name={""}
                      onChange={handleRadioChange}
                    />
                  </div> */}
                </div>
              </div>
            </div>
          }
          positiveButtonTitle={"Create"}
          onClickButton={onClickButton}
        />
      )}
    </>
  );
}

export default Department;
