import React, { useContext, useEffect, useState } from "react";
import GridTable from "../components/GridTable";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";

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
  const [departmentData, setDepartmentData] = useState<
    Department[] | undefined
  >();
  const [selectedValueInDropdown, setSelectedValueInDropdown] = useState<any>();
  const [selectedValueInDropdown2, setSelectedValueInDropdown2] = useState<any>();

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);  // Total rows for pagination


  // Function to handle pagination changes
  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getTask(paginationModel.page, paginationModel.pageSize);
  };


  console.log(paginationModel);
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



  useEffect(() => {
    getTask(paginationModel?.page, paginationModel?.pageSize);
  }, []);
  const axiosHandler = useAxios();
  const getUserDetails = async () => {
    try {
      const response = await axiosHandler.get(`auth/getUserList`);

      const data = response?.data?.data;
      setUserDetails(data);
    } catch (error: any) { }
  };
  useEffect(() => {
    getUserDetails();
  }, []);



  const getAllDept = async () => {
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds`);
      const data = response?.data?.data;
      setDepartmentData(data);
    } catch (error: any) { }
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


  const userOptions = userDetails?.map((item: any) => {

    if (appState?.userDetails?.adminId === item?.adminId)
      return {
        value: item?.id,
        label: item?.name
      }
  })

  const getTask = async (page: any, pageSize: any) => {
    const url = `${BASE_URL}${Endpoint.GET_WORKLOG}?page=${page + 1}&limit=${pageSize}`;

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
      console.log(data);
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


  const getUsers = async () => {
    const url = `${BASE_URL}${Endpoint.getUserList}`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headersList,
    });
    if (response?.status === 200) {
      const data = await response?.json();
      const lUserList = data?.data;

      setUserList(lUserList);

    }
  };
  useEffect(() => {
    getUsers();
  }, []);


  const getTaskByUserId = async (userId: any) => {
    if (!userId) {
      getTask(paginationModel?.page, paginationModel?.pageSize);
      return;
    }
    const url = `${BASE_URL}${Endpoint.filterWorkLogByUserId}/${userId}`;
    let headersList = {
      "Content-Type": "application/json",
      Authorization: "bearer " + appState?.userDetails?.token,
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headersList,
    });
    if (response?.status === 200) {
      const data = await response?.json();
      const taskList = data?.data;
      const r = taskList?.().map((e: any) => ({
        ...e,
        display_working_date: new Date(e.working_date)?.toLocaleDateString(),
        working_hrs_mins: e.working_hrs + "hrs " + e.working_mins + "mins",
      }));

      setRows(r);
    }
  };
  const handleDropdownChangeInGridTable = (option: any) => {
    setSelectedValueInDropdown(option);
  };
  const handleDropdownChangeInGridTable2 = (option: any) => {

    setSelectedValueInDropdown2(option);
    getTaskByUserId(option?.value)
  };

  return (
    <div>

      <div className="w-full items-end"></div>
      <div className="m-5">
        <GridTable
          // showAction={false}
          //   onClickAction={onClickAction}
          // actions={["DELETE", "EDIT"]}
          rowData={rows}
          columnData={columns}
          filterDropdownData={userList}
          filterDropdownData2={userList}
          onClickDropdown={handleDropdownChangeInGridTable}
          onClickDropdown2={handleDropdownChangeInGridTable2}
          selectedValue={selectedValueInDropdown}
          selectedValue2={selectedValueInDropdown2}
          dropdownLabel={"Departments"}
          dropdownLabel2={"Users"}
          dropdownOptions={deptOptions}
          dropdownOptions2={userOptions}
          dropdownName={"department"}
          dropdownName2={"user"}


          onPaginationChange={handlePaginationChange}
          rowCount={totalRows}



        />
      </div>
    </div>
  );
}
