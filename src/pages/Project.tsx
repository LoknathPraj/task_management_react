import { Autocomplete, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Radio from "../components/Radio";
import { BASE_URL } from "../constant";

function Project() {
  interface Department {
    createdAt: string; // ISO date string
    id: string; // Unique identifier
    is_active: boolean; // Status of the department
    name: string; // Name of the department
    projects: any[]; // Assuming projects can be of any type, you can specify a more accurate type if needed
    updatedAt: string; // ISO date string
    __v: number; // Version key, if applicable
    _id: string; // Another unique identifier, often the same as `id`
  }
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState<any>();
  const [projectList, setProjectList] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>();
  const [departmentData, setDepartmentData] = useState<
  Department[] | undefined
>();
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
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "department",
      headerName: "Department",
      width: 150,
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
      width: 200,
      headerClassName: "super-app-theme--header", 
    },
  ];

  const axiosHandler = useAxios();
  const getAllProjects = async () => {
    try {
      const response = await axiosHandler.get(`/project/`);
      const data = response?.data?.data;
      setProjectList(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getAllProjects();
  }, []);
  useEffect(() => {
    if (Array.isArray(projectList)) {
      const formattedRows = projectList.map((dept: any, index: number) => ({
        ...dept,
        
        s_no: index + 1,
        department: deptOptions.find(
          (item: { value:any}) => item.value === dept?.department
        )?.label,
        createdAt: formatDate(dept?.createdAt),
      }));

      setRows(formattedRows);
    }
  }, [projectList]);
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
  const resetStates = () => {
    setFormErrors({});
    setFormData({});
    setEditIsClicked(false);
  };
  const handleEdit = (user: any) => {
    
    

    setEditIsClicked(true)
    const userDetails = {
      ...user,
      department: deptOptions.find(
        (item: { label: string; value: string }) => item.label === user?.department
      )
    };
    setFormData(userDetails);
    setIsModalOpen(true);
  };

  const deleteProjectById = async (id: any) => {
    try {
      const response = await axiosHandler.get(`project/deleteProjectById/${id}`);
      showNotification("success", "Project deleted successfully!")
      getAllProjects();
      
    } catch (error: any) {
      showNotification("error", "Something went wrong")
    }
  };
  const handleDelete = (_id: string) => {
    deleteProjectById(_id);
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

  const departments = appState?.userDetails?.user?.department;
  

  const deptOptions = departments
    ?.map((deptId: string) => {
      const department = departmentData?.find(
        (dept: Department) => dept.id === deptId
      );

      return department
        ? { value: department.id, label: department.name }
        : null;
    })
    .filter(Boolean);
    

  const createProject = async (data: any) => {
    const url = `${BASE_URL}project/`;
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
    showNotification("success", "Project created successfully!")
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

        deptId: formData?.deptId?.value

      };

      

      if (userData?.id) {
        // await updateUser(userData, userData?.id);
      } else {
        await createProject(userData);
      }
      setIsModalOpen(!isModalOpen);
      setFormData({});
      getAllProjects();
      resetStates();
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData((prevValues: any) => ({
      ...prevValues,

      isActive: value,
    }));
  };
  const handleDepartmentChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      deptId: option,
    }));
  };
 const department = deptOptions.find(
    (item: { label: string; value: string }) => item.value === projectList?.department
  )?.label 
  

  
  return (
    <>
   
      <div className="m-5 h-10">
        <GridTable
          onClickAction={onClickAction}
          actions={["DELETE"]}
          rowData={rows}
          onClickAdd={() => {
            setIsModalOpen(true);
            resetStates();
          }}
          columnData={columns}
          toolTipName={"Create Project"}
        />
      </div>
      {isModalOpen && (
        <Modal
          isLoading={false}
          customFooter={true}
          //modalSize=""
          //modalHeight=""
          modalHeader={"Create Project"}
          modalBody={
            <div>
              <div className="relative mt-5 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <div className="mb-6">
                    <Autocomplete
                      className="w-80"
                      options={deptOptions}
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
                          name="department"
                          required={requiredInputFields.deptId}
                          InputLabelProps={{
                            sx: {
                              marginTop: "-8px",
                            },
                          }}
                        />
                      )}
                    />
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.deptId || ""}
                    </div>
                  </div>
                  <div className=" mb-6">
                    <TextField
                      className="w-80"
                      label="Project"
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
                  {/* <div className="ml-2 mb-4 mt-[-10px]">
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

export default Project;
