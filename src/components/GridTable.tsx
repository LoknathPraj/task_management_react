import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IoSearchSharp } from "react-icons/io5";
import { escapeRegExp } from "@mui/x-data-grid/internals";
import { RxCross2 } from "react-icons/rx";
import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { TbTrash } from "react-icons/tb";
import { FiEdit, FiEye, FiDownload, FiFilter, FiUsers, FiHome } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Dropdown from "./Dropdown";
import InlineLoader from "./InlineLoader";

interface Props {
  rowData: any;
  columnData: any;
  onClickAction?: (type: string, row: any, id?: any) => void;
  showAction?: boolean;
  rowCount?: number;
  onPaginationChange?: (paginationModel: { page: number; pageSize: number }) => void;
  onClickAdd?: () => void;
  onClickDropdown?: (option: any) => void;
  onClickDropdown2?: (option: any) => void;
  onClickExport?: () => void;
  onClickFilter?: (id?: string) => void;
  topActionButtonTitle?: string;
  filterButtonTitle?: string;
  toolTipName?: string;
  actions?: Array<"DELETE" | "EDIT" | "VIEW">;
  filterDropdownData?: Array<any>;
  filterDropdownData2?: Array<any>;
  dropdownLabel?: any;
  dropdownName?: any;
  dropdownOptions?: any;
  dropdownState?: any;
  selectedValue?: any;
  dropdownLabel2?: any;
  dropdownName2?: any;
  dropdownOptions2?: any;
  selectedValue2?: any;
  isLoading?: boolean;
  exportButtonDisabled?: boolean;
  isExporting?: boolean;
}

function GridTable({
  rowData,
  columnData,
  onClickAction,
  actions = [],
  onClickAdd,
  onClickExport,
  onClickFilter,
  onClickDropdown,
  onClickDropdown2,
  filterButtonTitle = "Filters",
  topActionButtonTitle = "Add",
  toolTipName,
  filterDropdownData = [],
  filterDropdownData2 = [],
  dropdownLabel,
  dropdownName,
  dropdownOptions,
  dropdownState,
  dropdownLabel2,
  dropdownName2,
  dropdownOptions2,
  isLoading,
  selectedValue,
  selectedValue2,
  onPaginationChange,
  rowCount,
  isExporting = false,
}: Props) {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState<Array<any>>([]);
  const [searchString, setSearchString] = useState<string>("");
  const [filterData, setFilterData] = useState<string>("");

  useEffect(() => {
    setFilterData("");
  }, []);
  
  useEffect(() => {
    if (rowData || columnData) {
      setRows(rowData);
    }
    if (actions?.length > 0 && columnData) {
      const actionColumn: any = {
        field: "action",
        headerName: "Actions",
        width: 120,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
        sortable: false,
        renderCell: (param: any) => (
          <ActionOption
            actions={actions}
            onClick={(type: any) => {
              onClickAction && onClickAction(type, param.row, param.row.id);
            }}
          />
        ),
      };
      const newCols = [actionColumn, ...columnData];
      setCols(newCols);
    } else {
      setCols(columnData);
    }
  }, [rowData, columnData, actions]);

  const requestSearch = (searchValue: any) => {
    setSearchString(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    if (rowData && Array.isArray(rowData)) {
      const filteredRows: any = rowData.filter((row: any) => {
        return Object.keys(row).some((field: any) => {
          const fieldValue = row[field];
          if (fieldValue !== undefined && fieldValue !== null) {
            return searchRegex.test(fieldValue.toString());
          }
          return false;
        });
      });
      setRows(filteredRows);
    } else {
      setRows([]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          {/* Left Side - Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Search records..."
                value={searchString}
                onChange={(e: any) => setSearchString(e.target.value)}
              />
              <IoSearchSharp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              {searchString && (
                <button
                  onClick={() => requestSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RxCross2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Dropdown 1 - Department */}
            {onClickDropdown && (
              <div className="min-w-[180px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="h-4 w-4 text-gray-400" />
                  </div>
                  <Dropdown
                    submitRef={true}
                    multiple={false}
                    defaultValue={selectedValue || null}
                    options={dropdownOptions}
                    handleChange={onClickDropdown}
                    defaultLabel={dropdownLabel}
                    label=""
                    className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Dropdown 2 - Users */}
            {onClickDropdown2 && (
              <div className="min-w-[180px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUsers className="h-4 w-4 text-gray-400" />
                  </div>
                  <Dropdown
                    submitRef={true}
                    multiple={false}
                    defaultValue={selectedValue2 || null}
                    options={dropdownOptions2}
                    handleChange={onClickDropdown2}
                    defaultLabel={dropdownLabel2}
                    isClearable={true}
                    label=""
                    className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Button */}
            {onClickFilter && (
              <button
                onClick={() => onClickFilter()}
                className="btn btn-outline flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <FiFilter className="w-3 h-3" />
                {filterButtonTitle}
              </button>
            )}

            {/* Add Button */}
            {onClickAdd && (
              <button
                onClick={onClickAdd}
                className="btn btn-primary flex items-center gap-2 px-3 py-2 text-sm hover:shadow-md transition-all duration-200"
              >
                <FaPlus className="w-3 h-3" />
                {topActionButtonTitle}
              </button>
            )}

            {/* Export Button */}
            {onClickExport && (
              <button
                onClick={onClickExport}
                disabled={isExporting}
                className={`btn flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 ${
                  isExporting 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'btn-primary hover:shadow-md'
                }`}
              >
                {isExporting ? (
                  <InlineLoader text="Exporting..." />
                ) : (
                  <>
                    <FiDownload className="w-3 h-3" />
                    Export
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Legacy Filter Section */}
        {filterDropdownData?.length > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUsers className="h-4 w-4 text-gray-400" />
              </div>
              <select
                required
                value={filterData}
                onChange={(e) => setFilterData(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 appearance-none"
              >
                <option value="">Select User</option>
                {filterDropdownData?.map((e: any) => (
                  <option key={e?._id} value={e?._id}>
                    {e?.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onClickFilter && onClickFilter(filterData)}
              className="btn btn-primary px-4 py-2 text-sm hover:shadow-md transition-all duration-200"
            >
              Filter
            </button>
          </div>
        )}
      </div>

      {/* DataGrid */}
      <div className="h-[600px] w-full">
        <DataGrid
          sx={{
            "& .super-app-theme--header": {
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              backgroundColor: "#f9fafb",
              borderBottom: "2px solid #e5e7eb",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              padding: "16px 12px",
              borderBottom: "1px solid #f3f4f6",
              display: "flex",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f8fafc",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "#fafafa",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "1px solid #e5e7eb",
              backgroundColor: "#f9fafb",
            },
            "& .MuiDataGrid-pagination": {
              color: "#374151",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #e5e7eb",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-virtualScrollerRenderZone": {
              backgroundColor: "#ffffff",
            },
          }}
          getRowHeight={() => 60}
          getRowId={(row: any) => row?._id || row?.id}
          className="border-0"
          rows={rows}
          rowCount={rowCount}
          loading={isLoading}
          columns={cols}
          rowSelection={false}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableColumnMenu={true}
          paginationMode="server"
          onPaginationModelChange={(paginationModel) => {
            const { page, pageSize } = paginationModel;
            if (onPaginationChange) {
              onPaginationChange({ page, pageSize });
            }
          }}
          autoHeight={false}
          density="comfortable"
        />
      </div>
    </div>
  );
}

export default GridTable;

interface OptionProps {
  onClick: (type: any) => void;
  actions: Array<"DELETE" | "EDIT" | "VIEW">;
}

const ActionOption = ({ onClick, actions = [] }: OptionProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {actions.includes("VIEW") && (
        <button
          onClick={() => onClick("VIEW")}
          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
          title="View"
        >
          <FiEye className="w-4 h-4" />
        </button>
      )}

      {actions.includes("EDIT") && (
        <button
          onClick={() => onClick("EDIT")}
          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
          title="Edit"
        >
          <FiEdit className="w-4 h-4" />
        </button>
      )}

      {actions.includes("DELETE") && (
        <button
          onClick={() => onClick("DELETE")}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
          title="Delete"
        >
          <TbTrash className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
