import { blue } from "@mui/material/colors";
import React, { useContext, useEffect, useState } from "react";
import ProgressCircle from "../components/ProgressCircle";
import { BASE_URL, Endpoint } from "../constant";
import { AppContext } from "../context/AppContext";
import useAxios from "../context/useAxios";
import GridTable from "../components/GridTable";

function Dashboard() {
  const [allTasks, SetAllTasks] = useState<any>()
  const [tasksToday, setTasksToday] = useState<any>(); 
  const [usernames, setUsernames] = useState<any>();
  const [userList, setUserList] = useState<any>();
   const [rows, setRows] = useState<Array<any>>([]);

  const axiosHandler = useAxios();
  const appState: any = useContext(AppContext);

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
    },
   
  ];
   
  useEffect(() => {
    getUserDetails();
  }, []);
  const getTodaysWorklog = async () => {
    try {
      const response = await axiosHandler.get(`/worklog/getTodaysWorklog`);

      const data = response?.data?.data;
      setTasksToday(data);
    } catch (error: any) {}
  };
  useEffect(() => {
    getTodaysWorklog();
  }, []);

  const getUserDetails = async () => {
    try {
      const response = await axiosHandler.get(`auth/getUserList`);
  
      const data = response?.data?.data;
  
      
      const filteredData = data?.filter((user: any) => user.role === 10000);
  
      setUserList(filteredData || []); 
    } catch (error: any) {
      
    }
  };
  

const userCount = userList?.length
const countUniqueUsernames = (tasksToday:any) => {
  const uniqueUsernames = new Set(tasksToday?.map((worklog:any) => worklog?.username));
  return uniqueUsernames.size;
};
const uniqueCount = countUniqueUsernames(tasksToday);

const generateCombinedArray=()=>{
  if(tasksToday){
    const usersNotInTasks = userList?.filter((user:any) => 
      !tasksToday?.some((task:any) => task.userId === user.id)
    );
    
    const combinedArray = [
      ...tasksToday, 
      ...usersNotInTasks?.map((user:any) => ({
        name: user.name,
        id: user.id,
        working_hrs: 0,
        totalSubmissions: 0,
      

      }))
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
        <GridTable
          onClickAction={()=>{}}
          rowData={rows}
          columnData={columns}
          toolTipName={"Create User"}
         
        />
      </div>
  <div className="col-span-1 mt-8 ">
      <div className="flex items-center justify-center ">   <ProgressCircle
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
