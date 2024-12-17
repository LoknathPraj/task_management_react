import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import { showNotification } from "../components/Toast";

export default function ViewUserTask({ insertedRecord, onUpdate }: any) {
  interface ProjectType {
    id: string | number; // Adjust the type based on your data
    name: string;
  }

  const [rows, setRows] = useState<Array<any>>([]);
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const appState: any = useContext(AppContext);
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
  const axiosHandler = useAxios();

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
        const index = rows.findIndex((e:any) => e?._id === lInsertedRecord?._id);
        const copyRow = [...rows];
        copyRow[index] = lRecord;
        setRows(copyRow);
      }
    }
  }, [insertedRecord]);
  
  


const getAllProjects = async () => {
      try {
        const response = await axiosHandler.get(`project/`);
        const data = response?.data?.data;
        setProjectList(data);
      } catch (error: any) {}
    };
    useEffect(() => {
      getAllProjects();
    }, []);

    

  useEffect(() => {
    getTaskById();
  }, []);

  const getTaskById = async () => {
    const url = `${BASE_URL}${Endpoint.GET_WORKLOG_BY_USERID}`;
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
      const taskList = data?.data;
      const r = taskList?.reverse().map((e: any) => ({
        ...e,
        display_working_date: new Date(e.working_date)?.toLocaleDateString(),
        working_hrs_mins: e.working_hrs + "hrs " + e.working_mins + "mins",
      }));

      setRows(r);
    }
  };

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
      onUpdate(row);
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

  return (
    <div>
      <div className="m-5">
        <GridTable
          onClickAction={onClickAction}
          actions={["DELETE", "EDIT"]}
          rowData={rows}
        
          columnData={columns}
          toolTipName={"Create Team"}
        />
      </div>
    </div>
  );
}
