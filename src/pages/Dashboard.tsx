import { blue } from "@mui/material/colors";
import React, { useContext, useEffect, useState } from "react";
import ProgressCircle from "../components/ProgressCircle";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import GridTable from "../components/GridTable";
import Loader from "../components/Loader";

function Dashboard() {
  const [allTasks, SetAllTasks] = useState<any>()
  const [tasksToday, setTasksToday] = useState<any>(); 
  const [usernames, setUsernames] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [rows, setRows] = useState<Array<any>>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const axiosHandler = useAxios();
  const appState: any = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const columns: any[] = [
    {
      field: "username",
      headerName: "Username",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalSubmissions",
      headerName: "No. of Submissions",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "totalHours",
      headerName: "Total Working Hours",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params:any) => (
        <div>
            <span className="cursor-pointer">{parseInt(params.value)}hrs</span>
        </div>
    ),
    },
   
  ];


  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    setPaginationModel(paginationModel);
    getUserDetails(paginationModel.page, paginationModel.pageSize);
  };

  useEffect(() => {
    getUserDetails(paginationModel?.page, paginationModel?.pageSize);
  }, []);
  const getTodaysWorklog = async () => {
    try {
      setLoading(true); 

      const response = await axiosHandler.get(`/worklog/getTodaysWorklog`);

      const data = response?.data?.data;
      setTasksToday(data);
    } catch (error: any) {}
    finally {
      setLoading(false); 
    }
  };
  useEffect(() => {
    getTodaysWorklog();
  }, []);

  const getUserDetails = async (page: any, pageSize: any) => {
    try {
      const response = await axiosHandler.get(`auth/getUserList?page=${page + 1}&limit=${pageSize}`);

      const { data } = response?.data;

      const { totalItems } = response?.data;



      setUserList(data);
      setTotalRows(totalItems);
    } catch (error: any) {
      
    }
  };
  const filteredData = userList?.filter((user: any) => user.role === 10000);

  

const userCount = (filteredData || [])?.length
const countUniqueUsernames = (tasksToday:any) => {
  const uniqueUsernames = new Set(tasksToday?.map((worklog:any) => worklog?.username));
  return uniqueUsernames.size;
};
const uniqueCount = countUniqueUsernames(tasksToday);

const generateCombinedArray=()=>{
  if(tasksToday){
    const usersNotInTasks = (filteredData || [])?.filter((user:any) => 
      !tasksToday?.some((task:any) => task.userId === user.id)
    );
    
    const combinedArray = [
      ...(Array.isArray(tasksToday) ? tasksToday : []), 
      ...(Array.isArray(usersNotInTasks) 
        ? usersNotInTasks?.map((user: any) => ({
            name: user.name,
            id: user.id,
            working_hrs: 0,
            totalSubmissions: 0,
          }))
        : [])
    ];
    
    return combinedArray
  }else{
    return undefined;
  }
  
  

}

useEffect(() => {
  if (Array.isArray(generateCombinedArray())) {
    const formattedRows = generateCombinedArray()?.map((user: any, index: number) => ({
      ...user,
    _id: user?.id,
    username: user?.username ||  user?.name,
    totalHours: user?.totalHours || user?.working_hrs

    }));

    if (formattedRows) setRows(formattedRows);
  }
}, [tasksToday]);



const progress = (uniqueCount/userCount)

  return (
    <>
      <div className="grid grid-cols-3">
      <div className="m-5 h-8 col-span-2">
      {loading && <Loader />}
        <GridTable
          onClickAction={()=>{}}
          rowData={rows}
          columnData={columns}
          toolTipName={"Create User"}
         onPaginationChange={handlePaginationChange}
          rowCount={totalRows}
        />
      </div>
  <div className="col-span-1 mt-8 ">
      <div className="flex items-center justify-center ">   
        <ProgressCircle
                progress={progress}
                count={userCount}
                count2={uniqueCount}
                color={"#219ebc"}
                size = {200} 
                strokeWidth = {15} 
                trailColor = {"#E3E5E8"} 
                duration={2}
              
              />
              
              </div>
              <div>
              <div className="flex items-center justify-center mt-4 text-lg text-[#023047]"><div className="w-9 h-5 bg-[#E3E5E8] mr-5"></div>Total Employees</div>
              <div className="flex items-center justify-center text-lg text-[#023047]" ><div className="w-9 h-5 bg-[#219ebc] mr-5"></div> Employees submitted</div>
              </div>
              </div>
              </div>
    </>
  );
}

export default Dashboard;
