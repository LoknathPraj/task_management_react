import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import Loader from "../components/Loader";

export default function ViewAllUserTask({ insertedRecord, onUpdate }: any) {
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

  const [rows, setRows] = useState<Array<any>>([]);
  const appState: any = useContext(AppContext);
  const [userList, setUserList] = useState([]);
  const [departmentValue, setDepartmentValue] = useState<any>();
  const [userDetails, setUserDetails] = useState<any>();
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [selectedValueInDropdown, setSelectedValueInDropdown] = useState<any>();
  const [selectedValueInDropdown2, setSelectedValueInDropdown2] = useState<any>();
  const [selectedValueInDropdown3, setSelectedValueInDropdown3] = useState<any>();
  const [projectData, setProjectData] = useState<any>();
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);  // Total rows for pagination
  const [loading, setLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

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
        const index = rows.findIndex(
          (e: any) => e?._id === lInsertedRecord?._id
        );
        const copyRow = [...rows];
        copyRow[index] = lRecord;
        setRows(copyRow);
      }
    }
  }, [insertedRecord]);

  const axiosHandler = useAxios();
  const getUserDetails = async () => {
    try {
      const res = await axiosHandler.get(`auth/getUserList?limit=2000`);
      setUserDetails(res?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllProjects = async () => {
    try {
      const res = await axiosHandler.get(
        `project/${appState?.userDetails?.user?.department?.[0]}`
      );
      setProjectData(res?.data?.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getAllDept = async () => {
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds`);
      const data = response?.data?.data;
      setDepartmentData(data);
    } catch (error: any) { }
  };


  const departments = appState?.userDetails?.user?.department;

  useEffect(() => {
    if (departments?.length) {
      const defaultDeptId = departments[0];
      setDepartmentValue(defaultDeptId);
      setSelectedValueInDropdown({ value: defaultDeptId, label: "" });
    }
  }, [departments]);

  const deptOptions = departments?.map((deptId: string) => {
    const dept = departmentData.find((d) => d.id === deptId);
    return dept ? { value: dept.id, label: dept.name } : null;
  }).filter(Boolean);

  const userOptions = userDetails?.filter((item: any) =>
    appState?.userDetails?.adminId === item?.adminId
  ).map((item: any) => ({
    value: item?.id,
    label: item?.name,
  }));

  const projectOptions = projectData?.filter((proj: any) =>
    appState?.userDetails?.adminId === proj?.adminId
  ).map((proj: any) => ({
    value: proj.id,
    label: proj.name,
  }));

  const getTask = async (page: number, pageSize: number, userId?: string, projectId?: string) => {
    setLoading(true);
    try {
      let url = `${BASE_URL}${Endpoint.GET_WORKLOG}?page=${page + 1}&limit=${pageSize}`;
      if (userId) url += `&userId=${userId}`;
      if (projectId) url += `&projectId=${projectId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + appState?.userDetails?.token,
        },
      });

      if (res.status === 201) {
        const data = await res.json();
        setTotalRows(data.totalItems);
        const r = data.data?.map((e: any) => ({
          ...e,
          display_working_date: new Date(e.working_date).toLocaleDateString(),
          working_hrs_mins: `${e.working_hrs}hrs ${e.working_mins}mins`,
        }));
        setRows(r);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      field: "username",
      headerName: "Username",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
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
      height: 400,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
  ];


  // const getUsers = async () => {
  //   const url = `${BASE_URL}${Endpoint.getUserList}`;
  //   let headersList = {
  //     "Content-Type": "application/json",
  //     Authorization: "bearer " + appState?.userDetails?.token,
  //   };
  //   const response = await fetch(url, {
  //     method: "GET",
  //     headers: headersList,
  //   });
  //   if (response?.status === 200) {
  //     const data = await response?.json();
  //     const lUserList = data?.data;

  //     setUserList(lUserList);

  //   }
  // };
  // useEffect(() => {
  //   getUsers();
  // }, []);
  useEffect(() => {
    getUserDetails();
    getAllDept();
    getAllProjects();
    getTask(paginationModel.page, paginationModel.pageSize);
  }, []);
  // const getTaskByUserId = async (userId: any) => {
  //   setLoading(true);
  //   try {
  //     if (!userId) {
  //       await getTask(paginationModel?.page, paginationModel?.pageSize);
  //       return;
  //     }
  //     const url = `${BASE_URL}${Endpoint.filterWorkLogByUserId}/${userId}`;
  //     const headersList = {
  //       "Content-Type": "application/json",
  //       Authorization: "bearer " + appState?.userDetails?.token,
  //     };
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: headersList,
  //     });
  //     if (response?.status === 200) {
  //       const data = await response.json();
  //       const taskList = data?.data;
  //       const r = taskList?.map((e: any) => ({
  //         ...e,
  //         display_working_date: new Date(e.working_date)?.toLocaleDateString(),
  //         working_hrs_mins: e.working_hrs + "hrs " + e.working_mins + "mins",
  //       }));
  //       setRows(r);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePaginationChange = (model: any) => {
    setPaginationModel(model);
    getTask(model.page, model.pageSize, selectedUserId, selectedProjectId);
  };

  const handleDropdownChangeInGridTable2 = (option: any) => {
    const userId = option?.value || "";
    setSelectedValueInDropdown2(option);
    setSelectedUserId(userId);
    getTask(paginationModel.page, paginationModel.pageSize, userId, selectedProjectId);
  };

  const handleProjectDropdownChange = (option: any) => {
    const projectId = option?.value || "";
    setSelectedValueInDropdown3(option);
    setSelectedProjectId(projectId);
    getTask(paginationModel.page, paginationModel.pageSize, selectedUserId, projectId);
  };

  const downloadExcelData = async () => {
    const url = `${BASE_URL}worklog/downloadExcel?departmentIds=${selectedValueInDropdown?.value}&userId=${selectedValueInDropdown2?.value}`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    if (selectedValueInDropdown?.value && selectedValueInDropdown2?.value) {
      const response = await fetch(url, {
        method: "GET",
        headers: headersList,
      });
      if (response?.status === 200) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "worklog.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

    }


  }
  return (
    <div>

      <div className="w-full items-end"></div>
      <div className="m-5">
        {loading && <Loader />}
        <GridTable
          // showAction={false}
          //   onClickAction={onClickAction}
          // actions={["DELETE", "EDIT"]}
          rowData={rows}
          columnData={columns}
          onClickDropdown2={handleDropdownChangeInGridTable2}
          onClickDropdown3={handleProjectDropdownChange}
          selectedValue={selectedValueInDropdown}
          selectedValue2={selectedValueInDropdown2}
          selectedValue3={selectedValueInDropdown3}
          dropdownLabel={"Departments"}
          dropdownLabel2={"Users"}
          dropdownLabel3={"Projects"}
          dropdownOptions={deptOptions}
          dropdownOptions2={userOptions}
          dropdownOptions3={projectOptions}
          dropdownName={"department"}
          dropdownName2={"user"}
          dropdownName3={"project"}
          onPaginationChange={handlePaginationChange}
          rowCount={totalRows}
          onClickExport={downloadExcelData}
        />
      </div>
    </div>
  );
}
