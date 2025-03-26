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
import Loader from "../components/Loader";

function TaskType() {
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
  const [editIsClicked, setEditIsClicked] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getAllTaskType(paginationModel.page, paginationModel.pageSize);
  };
  const [loading, setLoading] = useState(false);
  const columns: any[] = [
 
    {
      field: "name",
      headerName: "Name",
      width: 300,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "projectName",
      headerName: "Project Name",
      width: 200,
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

  const getAllTaskType = async (page: any, pageSize: any) => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`/task-type/?page=${page + 1}&limit=${pageSize}`);
      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setRows(data);
      setTotalRows(totalItems);
    } catch (error: any) {}
    finally {
      setLoading(false); 
    }
  };


  

  useEffect(() => {
    getAllProjects();
    getAllTaskType(paginationModel.page, paginationModel.pageSize)
  }, []);

  const requiredInputFields: any = {
    name: true,
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
    setEditIsClicked(true);
    const userDetails = {
      ...user,
    };
    setFormData(userDetails);
    setIsModalOpen(true);
  };

  const deleteProjectById = async (id: any) => {
    try {
      const response = await axiosHandler.get(
        `task-type/deleteTaskTypeById/${id}`
      );
      showNotification("success", "Task Type deleted successfully!");
      getAllTaskType(paginationModel.page, paginationModel.pageSize);
    } catch (error: any) {
      showNotification("error", "Something went wrong");
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

  const createProjectTaskType = async (data: any) => {
    const url = `${BASE_URL}task-type/`;
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
      console.log("response::", response);
      showNotification("success", "Task Type created successfully!");

      setIsModalOpen(!isModalOpen);
    setFormData({});
    getAllTaskType(paginationModel.page, paginationModel.pageSize);
    resetStates();
    
    } catch (error: any) {
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
    const userData: any = {
      ...formData,
    };
    const projectId=userData.projectId.value
    const projectName=userData.projectId.label
    userData.projectId = projectId;
    userData.projectName = projectName;
    await createProjectTaskType(userData);
    
  };

  const handleDepartmentChange = (e: any, option: any) => {
    setFormData((prevValues: any) => ({
      ...prevValues,
      projectId: option,
    }));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
console.log(projectList)
  return (
    <>
      <div className="m-5 h-10">
      {loading && <Loader />}
        <GridTable
          onClickAction={onClickAction}
          actions={["DELETE"]}
          rowData={rows||[]}
          onClickAdd={() => {
            setIsModalOpen(true);
            resetStates();
          }}
          columnData={columns}
          toolTipName={"Create Task"}
          onPaginationChange={handlePaginationChange}
          rowCount={totalRows}
        />
      </div>
      {isModalOpen && (
        <Modal
          isLoading={false}
          customFooter={true}
          //modalSize=""
          //modalHeight=""
          modalHeader={"Create Task"}
          modalBody={
            <div>
              <div className="relative mt-5 mb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                  <div className="mb-6">
                    <Autocomplete
                      className="w-80"
                      options={projectList?.map((e: any) => ({
                        label: e.name,
                        value: e._id,
                      }))||[]}
                      // value={formData?.department}
                      onChange={handleDepartmentChange}
                      sx={{
                        ".MuiInputBase-root": {
                          height: "40px",
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Project"
                          name="project"
                          required={requiredInputFields.project}
                          InputLabelProps={{
                            sx: {
                              marginTop: "-8px",
                            },
                          }}
                        />
                      )}
                    />
                    <div className="text-[12px] mt-1 ml-1 text-red-600">
                      {formErrors?.project || ""}
                    </div>
                  </div>
                  <div className=" mb-6">
                    <TextField
                      className="w-80"
                      label="Task Type"
                      name="name"
                      required={requiredInputFields.name}
                      error={formErrors?.["name"] || ""}
                      value={formData?.["name"] || ""}
                      type="text"
                      onKeyDown={handleKeyDown}
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

export default TaskType;
