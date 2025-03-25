import React, { useContext, useEffect, useState } from 'react';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import People from '@mui/icons-material/People';
import LayersOutlined from '@mui/icons-material/LayersOutlined';
import { Input } from 'antd';
import { CardDataStats } from '../components/CardDataStats';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import useAxios from '../context/useAxios';
import { AppContext } from "../context/AppContext";
import Loader from '../components/Loader';
import GridTable from '../components/GridTable';
import { BASE_URL, Endpoint } from '../constant';
import ProgressCircle from '../components/ProgressCircle';
import Progressbars from '../components/Progressbars';

const NewDashboard: React.FC = () => {
  const [tasksToday, setTasksToday] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [rows, setRows] = useState<Array<any>>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [location, setLocation] = useState(0);
  const [totalDept, setTotalDept] = useState(0);
  const [totalProject, setTotalProject] = useState(0);
  const [loading, setLoading] = useState(false);
  const axiosHandler = useAxios();
  const appState = useContext(AppContext);
  const [projectList, setProjectList] = useState<any>();
  const [dates, setDates] = useState({ startDate: '', endDate: '' });
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [yearlyStatistics, setYearlyStatistics] = useState<any>();
  const [year, setYear] = useState<number>(2025);
  const [totalWorkHours, setTotalWorkHours] = useState<any[]>([]);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    getAllUsersTotalWorkHoursForMonthAndDay(currentMonth, currentYear, paginationModel.page, paginationModel.pageSize);
    getTodaysWorklog(paginationModel.page, paginationModel.pageSize);
    getAllDept();
    getTask();
    getAllProjects();
    getUserDetails();
  }, [paginationModel, year]);
  const getAllUsersTotalWorkHoursForMonthAndDay = async (month: number, year: number, page: number, pageSize: number) => {
    try {
      const response = await axiosHandler.get(
        `/worklog/getAllUsersTotalWorkHoursForMonthAndDay?month=${month}&year=${year}&page=${page + 1}&limit=${pageSize}`
      );
      setTotalWorkHours(response.data.data);
      setTotalRows(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching total work hours:", error);
    }
  };


  const getTodaysWorklog = async (page: any, pageSize: any) => {
    try {
      setLoading(true);
      const response = await axiosHandler.get(`/worklog/getTodaysWorklog?page=${page + 1}&limit=${pageSize}}`);
      setTasksToday(response?.data?.data);
    } catch (error) {
      console.error("Error fetching today's worklog:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllDept = async () => {
    setLoading(true);
    try {
      const response = await axiosHandler.post(`department/getDepartmentbyIds`);
      const data = response?.data?.data;
      const { totalItems } = response?.data;
      setTotalDept(totalItems);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTask = async () => {
    setLoading(true);
    try {
      const url = `${BASE_URL}${Endpoint.GET_WORKLOG}`;
      const headersList = {
        "Content-Type": "application/json",
        Authorization: "bearer " + appState?.userDetails?.token,
      };
      const response = await fetch(url, { method: "GET", headers: headersList });
      if (response?.status === 201) {
        const data = await response.json();
        setLocation(data?.locationCount);
        const taskList = data?.data;
        const formattedRows = taskList?.map((e: any) => ({
          ...e,
          display_working_date: new Date(e.working_date)?.toLocaleDateString(),
          working_hrs_mins: `${e.working_hrs}hrs ${e.working_mins}mins`,
        }));
        setRows(formattedRows);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosHandler.get(`/project/`);
      setProjectList(response?.data?.data);
      setTotalProject(response?.data?.totalItems);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axiosHandler.get(`auth/getUserList`);
      setUserList(response?.data?.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handlePaginationChange = (paginationModel: { page: number; pageSize: number }) => {
    console.log('paginationModel: ', paginationModel);

    setPaginationModel(paginationModel);
    getAllUsersTotalWorkHoursForMonthAndDay(currentMonth, currentYear, paginationModel.page, paginationModel.pageSize);
  };

  const filteredData = userList?.filter((user: any) => user.role === 10000);
  const userCount = filteredData?.length || 0;

  const countUniqueUsernames = (tasksToday: any) => {
    const uniqueUsernames = new Set(tasksToday?.map((worklog: any) => worklog?.username));
    return uniqueUsernames.size;
  };

  const uniqueCount = countUniqueUsernames(tasksToday);
  const progress = userCount !== 0 ? (uniqueCount / userCount) : 0;

  const generateCombinedArray = () => {
    if (tasksToday && filteredData) {
      const usersNotInTasks = filteredData.filter((user: any) =>
        !tasksToday.some((task: any) => task.userId === user.id)
      );
      return [
        ...tasksToday,
        ...usersNotInTasks.map((user: any) => ({
          username: user.name,
          userId: user.id,
          current_day_submissions: 0,
          current_day_hours: 0,
          total_hours: 0,
        })),
      ];
    }
    return [];
  };

  useEffect(() => {
    const combinedArray = generateCombinedArray();
    const formattedRows = totalWorkHours.map((user: any) => ({
      ...user,
      _id: user?.userId,
      username: user?.username || user?.name,
      current_day_submissions: user?.current_day_submissions,
      current_day_hours: user?.current_day_hours,
      total_hours: user?.total_hours || user?.working_hrs
    }));
    setRows(formattedRows);
  }, [totalWorkHours]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDates((prevDates) => ({ ...prevDates, [name]: value }));
  };

  const handleSearch = () => setSearchButtonClicked(true);

  const handleReset = () => {
    setSearchButtonClicked(false);
    setDates({ startDate: '', endDate: '' });
  };

  const isDateValid = (date: string) => Date.parse(date) > 0;

  const columns: any[] = [
    { field: "username", headerName: "Username", width: 170, headerClassName: "super-app-theme--header", cellClassName: "text-sm" },
    { field: "current_day_submissions", headerName: "No. of Submissions", width: 170, headerClassName: "super-app-theme--header", cellClassName: "text-sm" },
    { field: "current_day_hours", headerName: "Total Working Hours", width: 170, headerClassName: "super-app-theme--header", renderCell: (params: any) => (<div className="cursor-pointer">{parseInt(params.value)}hrs</div>) },
    {
      field: "total_hours", headerName: "Total Month Working Hours", width: 170, headerClassName: "super-app-theme--header", renderCell: (params: any) => (<div className="cursor-pointer">{parseInt(params.value)}hrs</div>)
    },
  ];

  return (
    <div className="p-4 text-sm">
      {/* <div className="flex flex-col md:flex-row md:justify-end gap-4 mb-6">
        <Input
          id="startDate"
          name="startDate"
          placeholder="From Date"
          type="date"
          value={dates.startDate}
          onChange={handleDateChange}
          className="w-52 bg-white border border-gray-300 rounded py-2 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Input
          id="endDate"
          name="endDate"
          placeholder="To Date"
          type="date"
          value={dates.endDate}
          onChange={handleDateChange}
          className="w-52 bg-white border border-gray-300 rounded py-2 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className={`${searchButtonClicked ? 'bg-red-600' : 'bg-blue-600'} text-white px-4 py-2 text-xs h-[36px] shadow outline-none focus:outline-none focus:ring-2 rounded`}
          onClick={searchButtonClicked ? handleReset : handleSearch}
          disabled={!isDateValid(dates.endDate) || !isDateValid(dates.startDate)}
        >
          {searchButtonClicked ? 'Reset' : 'Search'}
        </button>
      </div> */}

      <div className="flex flex-wrap gap-4 mb-6 ml-2">
        <div className="flex-1 min-w-[200px] max-w-[250px]">
          <CardDataStats total={totalRows} title="Users :">
            <People className="text-blue-600" />
          </CardDataStats>
        </div>
        <div className="flex-1 min-w-[200px] max-w-[250px]">
          <CardDataStats total={location} title="Locations :">
            <LocationOnIcon className="text-blue-600" />
          </CardDataStats>
        </div>
        <div className="flex-1 min-w-[200px] max-w-[250px]">
          <CardDataStats total={totalProject} title="Projects :">
            <LayersOutlined className="text-blue-600" />
          </CardDataStats>
        </div>
        <div className="flex-1 min-w-[200px] max-w-[250px]">
          <CardDataStats total={totalDept} title="Departments :">
            <AssignmentOutlinedIcon className="text-blue-600" />
          </CardDataStats>
        </div>
      </div>

      <div className='m-3'>
        <Progressbars
          height={400}
        />
      </div>

      <div className="grid grid-cols-3 gap-1 mr-2">
        <div className="m-5 h-15 col-span-2">
          {loading && <Loader />}
          <GridTable
            onClickAction={() => { }}
            rowData={rows}
            columnData={columns}
            toolTipName={"Create User"}
            onPaginationChange={handlePaginationChange}
            rowCount={totalRows}
          />
        </div>
        <div className="w-120 h-240 rounded-sm border border-stroke text-xs bg-white shadow-default dark:border-strokedark dark:bg-boxdark col-span-1 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="mt-8 mb-2 flex items-center justify-center">
              <ProgressCircle
                progress={progress}
                count={userCount}
                count2={uniqueCount}
                color={"#219ebc"}
                size={200}
                strokeWidth={15}
                trailColor={"#E3E5E8"}
                duration={2}
              />
            </div>
            <div className="mt-4 mb-10">
              <div className="flex items-center justify-center text-xs text-[#023047]">
                <div className="w-9 h-5 bg-[#E3E5E8] mr-5"></div>Total Employees
              </div>
              <div className="flex items-center justify-center text-xs text-[#023047]">
                <div className="w-9 h-5 bg-[#219ebc] mr-5"></div>Employees submitted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;