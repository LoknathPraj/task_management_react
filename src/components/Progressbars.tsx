import React, { useContext, useEffect, useState } from "react";  
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import useAxios from "../context/useAxios";
import { AppContext } from "../context/AppContext";

interface ProgressbarsProps {
  height?: number;
}

interface State {
  series: {
    name: string; // Added 'name' field
    data: number[];
  }[]; 
}

const options: ApexOptions = {
  colors: ["#5DADE2"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      speed: 1500,
      dynamicAnimation: {
        speed: 1500,
      },
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "30%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  yaxis: {
    min: 0,
    max: 100, 
    labels: {
      formatter: function (value: number) {
        return value.toFixed(0) + "%"; 
      },
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
  },
  fill: {
    opacity: 1,
    type: "solid",
  },
};

const Progressbars: React.FC<ProgressbarsProps> = ({ height }) => {
  const [state, setState] = useState<State>({
    series: [
      {
        name: "Record", // Default series name
        data: [],
      },
    ],
  });

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [yearlyStatistics, setYearlyStatistics] = useState<any>([]);
  const [seriesName, setSeriesName] = useState<string>("Record"); 
  console.log('yearlyStatistics: ', yearlyStatistics);
  const axiosHandler = useAxios();
  const appState: any = useContext(AppContext);

  const getYearlyWorkHours = async (year: number) => {
    try {
      setLoading(true);
      const response = await axiosHandler.get(`/worklog/getYearlyWorkHours?year=${year}`);
      setYearlyStatistics(response.data?.yearly_Statistics); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getYearlyWorkHours(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const allYears = Array.from({ length: 10 }, (_, i) => currentYear - i);
    setYears(allYears);

    if (yearlyStatistics?.length) {
      const chartData = yearlyStatistics.map((month: any) =>
        parseFloat(month.percentageHours.toFixed(2)) || 0
      );
      setState({
        series: [
          {
            name: seriesName, 
            data: chartData, 
          },
        ],
      });
    }
  }, [yearlyStatistics, selectedYear, seriesName]);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value);
    setSelectedYear(selectedYear); 
  };

  const handleSeriesNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeriesName(event.target.value);
  };

  return (
    <div>
      <div className="col-span-12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="mb-4 justify-between gap-4 sm:flex">
          <div className="mt-4 ml-4">
            <span className="font-semibold text-black dark:text-white pt-3">
              Total Year Working Hr:
            </span>
          </div>
          <div className="mt-4 mr-4 flex items-center space-x-4">
            <div className="relative z-20 inline-block">
              <label
                htmlFor="year-select"
                className="block text-sm font-medium dark:text-white"
              >
                Select Year
              </label>
            </div>
            <div className="relative z-20 inline-block">
              <select
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                className="mt-1 block w-full rounded-md border border-blue-500 bg-white dark:bg-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:border-blue-500 dark:focus:ring-blue-400 transition duration-150 ease-in-out py-1 px-6 text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-white dark:bg-gray-800">
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <div id="chartTwo">
            <ReactApexChart
              options={options}
              series={state.series}
              type="bar"
              height={height || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progressbars;
