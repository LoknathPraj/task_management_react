import React, { useContext, useEffect, useState } from "react";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import moment from "moment";
import ViewUserTask from "./ViewUserTask";
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
      project_name: project,
      task_type: taskType,
      working_date: workingDate,
      working_hrs: workingHrs,
      working_mins: workingMinutes,
      location,
      task_description: description,
      username: appState?.userDetails?.user?.name,
    };
    if (checkEmptyData()) return;
    if (workId) {
      updateTask(param);
    } else {
      addTask(param);
    }
  };
  const checkEmptyData = () => {
    if (
      project &&
      taskType &&
      workingDate &&
      workingHrs &&
      location &&
      description?.trim()
    ) {
      return false;
    } else return true;
  };

  async function addTask(payload: any) {
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
      } else {
        alert("Found duplicate task");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  }

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
      } else {
        alert("Found duplicate task");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  }

  const onUpdate = (row: any) => {
    const {
      project_name,
      task_type,
      working_date,
      working_hrs,
      working_mins,
      location,
      task_description,
      _id,
    } = row;
    setProject(project_name);
    setWorkingHrs(working_hrs);
    setTaskType(task_type);
    setWorkingMinutes(working_mins);
    setDescription(task_description);
    setWorkingDate(working_date);
    setLocation(location);
    setWorkId(_id);
  };
  return (
    <div>
      <form className="p-4" onSubmit={_submitForm}>
        <img src="/logo.png" className="m-auto" />
        <div className="md:w-1/2 sm:w-full  m-auto text-left">
          <div className="w-full mb-2 ">
            <label className="text-left">Projects</label>
            <select
              required
              value={project}
              onChange={(e) => setProject(e.target.value)}
              style={{ borderWidth: 1 }}
              className="border-1 border-gray-400 w-full h-8 rounded"
            >
              <option value={""}>Select Projects</option>
              <option value={"FHUP"}>FHUP</option>
              <option value={"LSR"}>LSR</option>
              <option value={"LetterLinks"}>Letter Links</option>
              <option value={"CorforKindergaten"}>Cor for Kindergaten</option>
              <option value={"ClassroomCoach"}>Classroom Coach</option>
              <option value={"CorAdvantage"}>CorAdvantage</option>
              <option value={"Curriculum"}>Curriculum</option>
              <option value={"LearningManagementSystem"}>
                Learning Management System
              </option>
              <option value={"PQA"}>PQA</option>
              <option value={"ReadySchoolAssessment"}>
                ReadySchoolAssessment
              </option>
              <option value={"TPRM"}>TPRM</option>
              <option value={"PW Water"}>PW Water Mobile</option>
              <option value={"Acquaa Mobile"}>Acquaa Mobile</option>
              <option value={"Helpdesk"}>Helpdesk</option>
              <option value={"Onboarding"}>Onboarding</option>
              <option value={"HRMS"}>HRMS</option>
              <option value={"Others"}>Others</option>
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
              <option value={"Code Development"}>Code Development</option>
              <option value={"Debugging"}>Debugging</option>
              <option value={"Testing"}>Testing</option>
              <option value={"Ui Design"}>Ui Design</option>
              <option value={"Meeting"}>Meeting</option>
              <option value={"Customer Support"}>Customer Support</option>
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
      <ViewUserTask insertedRecord={newInsertedData} onUpdate={onUpdate} />
    </div>
  );
}
