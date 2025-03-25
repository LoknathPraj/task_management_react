import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Modal from "../components/Modal";
import moment from "moment";
import Loader from "../components/Loader";

export default function ViewUserTask({ insertedRecord, onUpdate, styleFromComponent }: any) {
  interface ProjectType {
    id: string | number; // Adjust the type based on your data
    name: string;
  }

  const [rows, setRows] = useState<Array<any>>([]);
  const [isModalOpen, setisModalOpen] = useState(false)
  const appState: any = useContext(AppContext);

  const [project, setProject] = useState("");
  const [taskType, setTaskType] = useState("");
  const [workingHrs, setWorkingHrs] = useState("");
  const [workingMinutes, setWorkingMinutes] = useState("");
  const [description, setDescription] = useState("");
  const [workingDate, setWorkingDate] = useState("");
  const [location, setLocation] = useState("");
  const [newInsertedData, setNewInsertedData] = useState<any>(null);
  const [workId, setWorkId] = useState<any>("");
  const [projectData, setProjectData] = useState<any>();
  const [taskTypeList, setTaskTypeList] = useState<Array<any>>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);  // Total rows for pagination
 const [loading, setLoading] = useState(false);

  // Function to handle pagination changes
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getTaskById(paginationModel?.page, paginationModel?.pageSize);
  };
  // const rowData: any = teamState?.teamList?.map(
  //     (team: any, index: number) => ({
  //       ...team,
  //       s_no: index + 1,
  //       createdDate: formatCreatedDate(team?.createdDate),
  //       administrator: team?.administrator ? "Yes" : "No",
  //     })
  //   );
  //   setRows(rowData);

  //   useEffect(() => {
  //     const obj: any = {
  //       _id: "422232",
  //       project: "FHUP",
  //       task_type: "Bugs",
  //       working_hrs: "2hr 30min",
  //       working_date: "20/03/0333",
  //       descriptions: "sd",
  //       location: "Thane",
  //     };
  //     // setRows([obj])
  //   }, []);


  useEffect(() => {
    if (insertedRecord) {
      const lInsertedRecord = insertedRecord?.data;
      const lRecord = {
        ...lInsertedRecord,
        display_working_date: new Date(
          lInsertedRecord.working_date
        )?.toLocaleDateString(),
        working_hrs_mins:
          lInsertedRecord.working_hrs +
          "hrs " +
          lInsertedRecord.working_mins +
          "mins",
      };
      if (insertedRecord?.isInserted) {
        setRows([lRecord, ...rows]);
      } else if (!insertedRecord?.isInserted) {
        const index = rows.findIndex((e: any) => e?._id === lInsertedRecord?._id);
        const copyRow = [...rows];
        copyRow[index] = lRecord;
        setRows(copyRow);
      }
    }
  }, [insertedRecord]);




  const getAllProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`project/`);
      console.log('response: ', response);
      
      const data = response?.data?.data;
      setProjectData(data);
    } catch (error: any) { }
    finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getAllProjects();
  }, []);





  const getTaskById = async (page: any, pageSize: any) => {
    const url = `${BASE_URL}${Endpoint.GET_WORKLOG_BY_USERID}?page=${page + 1}&limit=${pageSize}`;


    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headersList,
    });
    if (response?.status === 201) {
      const data = await response?.json();
      setTotalRows(data?.totalItems)
      const taskList = data?.data;
        const r = taskList?.map((e: any) => ({
          ...e,
          display_working_date: new Date(e.working_date)?.toLocaleDateString(),
          working_hrs_mins: e.working_hrs + "hrs " + e.working_mins + "mins",
        }));

      setRows(r);
    }
  };
  useEffect(() => {
    getTaskById(paginationModel?.page, paginationModel?.pageSize);
  }, []);
  const deleteTaskById = async (taskId: string) => {
    const url = `${BASE_URL}${Endpoint.DELETE_BY_WORKLOG_ID}/${taskId}`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headersList,
    });
    if (response?.status === 200) {
      const lRow = rows.filter((e) => e._id !== taskId);
      setRows(lRow);
      showNotification("success", "Task Deleted Successfully!")
    }
  };

  const onClickAction = (value: any, row?: any, _id?: any) => {


    if (value === "DELETE") {
      deleteTaskById(row?._id);
    } else if (value === "EDIT") {
      handleUpdate(row)
      setisModalOpen(true)
    }
  };
  const columns: any[] = [
    {
      field: "project_name",
      headerName: "Project",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "task_type",
      headerName: "Tasks",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "working_hrs_mins",
      headerName: "Working Hrs",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "display_working_date",
      headerName: "Working Date",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "task_description",
      headerName: "Descriptions",
      width: 200,
      height:400,
      headerClassName: "super-app-theme--header",
      
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
  ];



  const resetForm = () => {
    setProject("");
    setWorkingHrs("");
    setTaskType("");
    setWorkingMinutes("");
    setDescription("");
    setWorkingDate("");
    setLocation("");
    setWorkId("");
  };
  const axiosHandler = useAxios();

 
  const getMinutes = () => {
    const mins = [];
    for (let i = 0; i <= 60; i++) {
      if (i % 5 == 0) {
        mins.push(i);
      }
    }
    return mins;
  };
  async function updateTask(payload: any) {
    try {
      const url = `${BASE_URL}${Endpoint.UPDATE_TASK}/${payload?._id}`;
      let headersList = {
        "Content-Type": "application/json",
        Authorization: "bearer " + appState?.userDetails?.token,
      };
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headersList,
      });
      if (response?.status === 200) {
        const data = await response?.json();
        resetForm();
        setNewInsertedData({ data: data?.worklog, isInserted: false });
        showNotification("success", "Task Updated Successfully!");
        setisModalOpen(false)

        const updatedRow = {
          ...data?.worklog,
          display_working_date: new Date(data?.worklog?.working_date)?.toLocaleDateString(),
          working_hrs_mins: `${data?.worklog?.working_hrs}hrs ${data?.worklog?.working_mins}mins`,
        };
        setRows((prevRows) => {
          const rowIndex = prevRows.findIndex((row) => row._id === updatedRow._id);
          if (rowIndex > -1) {
            const updatedRows = [...prevRows];
            updatedRows[rowIndex] = updatedRow;
            return updatedRows;
          }
          return [updatedRow, ...prevRows];
        });

      } else {
        showNotification("error", "Something went wrong");
      }
    } catch (err) {
      showNotification("error", "Something went wrong");
    }
  }

  const _submitForm = (event: any) => {
    const param = {
      _id: workId,
      projectId: project,
      project_name: projectData?.find(
        (project2: any) => project2.id === project
      )?.name,
      task_type: taskType,
      working_date: workingDate,
      working_hrs: workingHrs,
      working_mins: workingMinutes,
      location,
      task_description: description,
      username: appState?.userDetails?.user?.name,
      departmentId: appState?.userDetails?.user?.department,
      adminId: appState?.userDetails?.adminId,
    };

    if (workId) {
      updateTask(param);
  
      
    }
  };
 
  const handleUpdate = (row: any) => {
    const projectName = row?.project_name
    
    const projectId = projectData?.find(
      (project2: any) => project2.name === projectName
    )?.id
    const {
      task_type,
      working_date,
      working_hrs,
      working_mins,
      location,
      task_description,
      _id,
    } = row;
    setProject(projectId);
    

    setWorkingHrs(working_hrs);
    setTaskType(task_type);
    setWorkingMinutes(working_mins);
    setDescription(task_description);
    setWorkingDate(working_date);
    setLocation(location);
    setWorkId(_id);

  };

  

  const onClickButton = (type: string) => {
    if (type) {
      _submitForm(type);
    } else {
      setisModalOpen(false);
    }
  };

  const getAllTaskTypeByprojectId = async () => {
    try {
      const response = await axiosHandler.get(`/task-type/` + project);
      const data = response?.data?.data;
      setTaskTypeList(data);
    } catch (error: any) { }
  };
  useEffect(() => {
    if (project) {
      getAllTaskTypeByprojectId()
    }
  }, [project])

  return (
    <div>
      <div className="m-5"
        style={styleFromComponent}
      >
           {loading && <Loader />}
        <GridTable
          onClickAction={onClickAction}
          actions={["DELETE", "EDIT"]}
          rowData={rows}
          columnData={columns}
          toolTipName={""}
        />
      </div>
      {isModalOpen && <Modal
       
       customFooter={true}
       //modalSize=""
       modalHeight = "h-[500px]"
       modalHeader={"Update Task"}
       modalBody={
         <div
           className="grid  gap-x-4 gap-y-4"
         >
       <form className="p-4">
               {/* <img src="/logo.png" className="m-auto" /> */}
               <div className="w-full  m-auto text-left">
                 <div className="w-full mb-2 ">
                   <label className="text-left">Projects</label>
                   <select
                     required
                     value={project}
                     onChange={(e) => {
                       setProject(e.target.value);
                     }}
                     style={{ borderWidth: 1 }}
                     className="border-1 border-gray-400 w-full h-8 rounded"
                   >
                     <option value="">Select Projects</option>
                     {projectData?.map((option: any) => (
                       <option key={option.id} label={option.name} value={option.id}>
                         {option.name}
                       </option>
                     ))}
                   </select>
                 </div>
       
                 <div>
                   <label>Tasks</label>
                   <select
                     required
                     value={taskType}
                     onChange={(e) => setTaskType(e.target.value)}
                     style={{ borderWidth: 1 }}
                     className="border-1 border-gray-400 w-full h-8 rounded mb-2"
                   >
                     <option value={""}>Select Tasks</option>
                     {projectData?.[0]?.department==="676175237bf34482eb021c89"?
                     <>
                     <option value={"Code Development"}>Code Development</option>
                     <option value={"Debugging"}>Debugging</option>
                     <option value={"Testing"}>Testing</option>
                     <option value={"Ui Design"}>Ui Design</option>
                     <option value={"Meeting"}>Meeting</option>
                     <option value={"Customer Support"}>Customer Support</option>
                     </>
       :
       taskTypeList?.map((option: any) => (
                       <option key={option.id} label={option.name} value={option.name}>
                         {option.name}
                       </option>
                     ))}
       
                   </select>
                 </div>
       
                 <div>
                   <label>Time</label>
                   <div className="flex">
                     <select
                       required
                       value={workingHrs}
                       onChange={(e) => setWorkingHrs(e.target.value)}
                       style={{ borderWidth: 1 }}
                       className="border-1 border-gray-400 w-full h-8 rounded mb-2"
                     >
                       <option value={""}>Select Hours</option>
                       {[
                         1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                       ].map((e) => (
                         <option value={e}>{e}</option>
                       ))}
                     </select>
       
                     <select
                       required
                       value={workingMinutes}
                       onChange={(e) => setWorkingMinutes(e.target.value)}
                       style={{ borderWidth: 1 }}
                       className="border-1 border-gray-400 w-full h-8 rounded mb-2 ml-2"
                     >
                       <option value={""}>Select Minutes</option>
                       {getMinutes().map((e) => (
                         <option value={e}>{e}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label>Work Date</label>
                     <input
                       value={moment(workingDate).format("YYYY-MM-DD")}
                       onChange={(e) => {
                         setWorkingDate(e.target.value);
                       }}
                       required
                       type="date"
                       // min={moment().subtract(2, "days").format("YYYY-MM-DD")}
                       style={{ borderWidth: 1 }}
                       className="border-1 border-gray-400 w-full h-8 rounded mb-2 pl-1"
                     />
                   </div>
                 </div>
                 <div className="mb-2">
                   <label>Location</label>
       
                   <select
                     value={location}
                     onChange={(e) => setLocation(e.target.value)}
                     required
                     style={{ borderWidth: 1 }}
                     className="border-1 border-gray-400 w-full h-8 rounded mb-2"
                   >
                     <option color="gray">Select Location</option>
                     <option value={"Thane"}>Thane</option>
                     <option value={"Nashik"}>Nashik</option>
                     <option value={"Chh Sambhaji Nagar"}>Chh Sambhaji Nagar</option>
                     
                   </select>
                 </div>
                 <div className="">
                   <label>Descriptions</label>
                   <textarea
                     maxLength={2000}
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     required
                     style={{ height: 200, borderWidth: 1 }}
                     className="border-1 border-gray-400 w-full h-8 rounded mb-2 pl-1 pr-1"
                   ></textarea>
                 </div>
               </div>
             </form>
         </div>
       }
       positiveButtonTitle={"Update"}
       onClickButton={onClickButton}
     />
      

      
}
    </div>
   
  );
}
