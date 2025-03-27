import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import ViewUserTask from "./ViewUserTask";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";
import Loader from "../components/Loader";
export default function AddTask() {
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
  const [taskTypeList,setTaskTypeList]=useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState(false);
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

  const getAllProjects = async () => {
    try {
      const response = await axiosHandler.get(
        `project/${appState?.userDetails?.user?.department?.[0]}`
      );
      const data = response?.data?.data;
      setProjectData(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getAllProjects();
  }, []);

  const getMinutes = () => {
    const mins = [];
    for (let i = 0; i <= 60; i++) {
      if (i % 5 == 0) {
        mins.push(i);
      }
    }
    return mins;
  };
  const _submitForm = (event: any) => {
    event.preventDefault();
    const param = {
      _id: workId,
      projectId: project,
      project_name: projectData?.find(
        (project2: any) => project2.id === project
      )?.name,
      task_type: taskType,
      working_date: workingDate,
      working_hrs: workingHrs||"0",
      working_mins: workingMinutes||"0",
      location,
      task_description: description,
      username: appState?.userDetails?.user?.name,
      departmentId: appState?.userDetails?.user?.department,
      adminId: appState?.userDetails?.adminId,
    };
    if (checkEmptyData()) return;
    if (workId) {
      updateTask(param);
    } else {
      addTask(param);
    }
  };

  const display = { display: "none" };
  const checkEmptyData = () => {

    if (
      project &&
      taskType &&
      workingDate &&
      workingHrs &&
      location &&
      description?.trim() &&projectData?.[0]?.department==="676175237bf34482eb021c89"
    ) {
      return false;
    }
    else if(project &&
      taskType &&
      workingDate &&
      location &&
      description?.trim()){
        return false;
    }
    else return true;
  };

  async function addTask(payload: any) {
    setIsLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.ADD_TASK}`;
      let headersList = {
        "Content-Type": "application/json",
        Authorization: "bearer " + appState?.userDetails?.token,
      };
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: headersList,
      });
      if (response?.status === 201) {
        const data = await response?.json();
        resetForm();
        setNewInsertedData({ data: data?.data, isInserted: true });
        showNotification("success", "Task Added Successfully!");
      } else {
        showNotification("error", "Something went wrong");
      }
    } catch (err) {
      showNotification("error", "Something went wrong");
    }
    finally {
      setIsLoading(false); 
    }
  }

  async function updateTask(payload: any) {
    setIsLoading(true); 
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
      } else {
        showNotification("error", "Something went wrong");
      }
    } catch (err) {
      showNotification("error", "Something went wrong");
    }
    finally {
      setIsLoading(false); 
    }
  }

  const onUpdate = (row: any) => {
    const {
      projectId,
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


const getAllTaskTypeByprojectId = async () => {
  try {
    const response = await axiosHandler.get(`/task-type/`+project);
    const data = response?.data?.data;
    setTaskTypeList(data);
  } catch (error: any) {}
};
useEffect(()=>{
if(project){
  getAllTaskTypeByprojectId()
}
},[project])
  return (
    <div>
       {isLoading&& <Loader />}
      <form className="p-4" onSubmit={_submitForm}>
        {/* <img src="/logo.png" className="m-auto" /> */}
        <div className="md:w-1/2 sm:w-full  m-auto text-left">
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
                // required
                required={projectData?.[0]?.department==="676175237bf34482eb021c89"?true:false}
                value={workingHrs}
                onChange={(e) => {
                  if(!workingHrs){
                    setWorkingMinutes("0")
                  }
                  setWorkingHrs(e.target.value)
                }}
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
                 required={projectData?.[0]?.department==="676175237bf34482eb021c89"?true:false}
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
          <div className="m-auto text-center mt-2 flex">
            <button
              disabled={checkEmptyData()}
              type="submit"
              className={`${
                checkEmptyData()
                  ? "bg-gray-500 text-black-300"
                  : "bg-blue-700 text-white"
              } p-2 rounded m-auto w-1/3`}
            >
              {workId ? "Update" : "Submit"}
            </button>
            {workId && (
              <button
                onClick={resetForm}
                type="button"
                className="bg-blue-700 text-white p-2 rounded m-auto w-1/3"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
      <ViewUserTask
        insertedRecord={newInsertedData}
        onUpdate={onUpdate}
        styleFromComponent={display}
      />
    </div>
  );
}
