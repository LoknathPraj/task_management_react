import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IoSearchSharp } from "react-icons/io5";
import { escapeRegExp } from "@mui/x-data-grid/internals";
import { RxCross2 } from "react-icons/rx";
import { Autocomplete, TextField, Tooltip } from "@mui/material";
import { TbTrash } from "react-icons/tb";
import { FiEdit, FiEye } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import Dropdown from "./Dropdown";

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
  isLoading?: boolean


  // checkbox:boolean
  // onPageChange?: (currentPage: any) => void;
  // onRowsPerPageChange?: (rowCountPage: any) => void;
  // totalCount?: number;
  // onClickSearch?: (serchData: any) => void;
  // hidePagination?: boolean;
  // hideSearch?: boolean;
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
        headerName: "Action",
        width: 150,
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        align: "center",
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
  }, [rowData, columnData,]);

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
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark mt-[-20px] dark:bg-boxdark">
      <div className="realative flex items-center gap-x-4 justify-between my-3 mx-2">
        <div className="flex items-center  rounded-sm border border-bgray ">
          <input
            className="p-2 text-base  float-left w-[200px] lg:w-[300px] bg-white focus:border-transparent outline-none"
            placeholder="Search..."
            value={searchString}
            onChange={(e: any) => setSearchString(e.target.value)}
          />
          {searchString ? (
            <RxCross2
              className="w-5 h-5 mr-2"
              onClick={() => requestSearch("")}
            />
          ) : (
            <div className="w-5 h-5 mr-2" />
          )}
          <div
            className="border-l border-bgray py-2.5 px-3 "
            onClick={() => requestSearch(searchString)}
          >
            <IoSearchSharp className="h-5 w-5 " />
          </div>
        </div>

        <div className="grid grid-cols-5">
          <div>
            {onClickDropdown && (
              <>

                <div>


                  <Dropdown
                    submitRef={true}
                    multiple={false}
                    defaultValue={selectedValue || null}
                    options={dropdownOptions}
                    handleChange={onClickDropdown}
                    defaultLabel={dropdownLabel}
                    label=""
                    className="mb-[-22px] w-[12.5rem]"
                  />
                </div>

              </>
            )}
          </div>
          <div>
            {onClickDropdown2 && (
              <>
                <Tooltip title={"Apply Filters"}>
                  <div className="ml-20">
                    <Dropdown
                      submitRef={true}
                      multiple={false}
                      defaultValue={selectedValue2 || null}
                      options={dropdownOptions2}
                      handleChange={onClickDropdown2}
                      defaultLabel={dropdownLabel2}
                      isClearable={true}
                      label=""
                      className="mb-[-22px] w-[12.5rem]"
                    />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div>
            {onClickFilter && (
              <>
                <Tooltip title={"Apply Filters"}>
                  <div
                    className="cursor-pointer w-25 h-9 ml-12 col-span-1 text-white flex items-center justify-center bg-blue-700 border border-white rounded-lg"
                    onClick={() => {
                      onClickFilter && onClickFilter();
                    }}
                  >
                    <span className="mr-1">{filterButtonTitle}</span>
                    <HiAdjustmentsHorizontal className="h-4 w-6" />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div>
            {onClickAdd && (
              <>
                <Tooltip title={toolTipName}>
                  <div
                    className="cursor-pointer w-20 h-9 ml-12 text-white col-span-1 flex items-center justify-center bg-blue-700 border border-white rounded-lg"
                    onClick={() => {
                      onClickAdd && onClickAdd();
                    }}
                  >
                    <span className="mr-1">{topActionButtonTitle}</span>
                    <FaPlus className="h-4 w-4" />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div>
            {onClickExport && (
              <>
                <Tooltip title={toolTipName}>
                  <div
                    className="cursor-pointer w-25 p-2 h-10 ml-12 text-white flex col-span-1 items-center justify-center bg-blue-700 border border-white rounded-lg"
                    onClick={() => {
                      onClickExport && onClickExport();
                    }}
                  >
                    <span className="mr-1">Export</span>
                    <FaPlus className="h-3 w-3" />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
        </div>
        {filterDropdownData?.length > 0 && (
          <div className="flex w-1/4">
            <select
              required
              value={filterData}
              onChange={(e) => setFilterData(e.target.value)}
              style={{
                borderWidth: 1,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
              className="border-1 border-gray-400 w-full"
            >
              <option value={""}>Select User</option>
              {filterDropdownData?.map((e) => (
                <option value={e?._id}>{e?.name}</option>
              ))}
            </select>
            <button
              style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
              type="button"
              onClick={() => onClickFilter && onClickFilter(filterData)}
              className="bg-blue-700 text-white p-2  m-auto w-1/2"
            >
              Filter
            </button>
          </div>
        )}
      </div>
      <div style={{ height: 450, width: "100%" }} className="max-h-fit">
        <DataGrid
          sx={{
            "& .super-app-theme--header": {
              fontSize: "16px",
              fontWeight: "bold",
              color: "#1f7fbb",
            },
            "& .MuiDataGrid-cell": {
              fontFamily: "sans-serif",
              maxHeight: "200px",
              paddingTop: "15px",
              paddingBottom: "15px",
            },
          }}
          getRowHeight={(params) => "auto"}
          // getRowHeight={(param)}
          getRowId={(row: any) => row?._id}
          className="bg-white rounded-none dark:border-strokedark dark:bg-boxdark "
          rows={rows}
          rowCount={rowCount}
          // loading={isLoading}
          // slotProps={{
          //   loadingOverlay: {
          //     variant: "skeleton",
          //     noRowsVariant: "skeleton",
          //   },
          // }}
          columns={cols}
          rowSelection={false}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          // checkboxSelection={checkbox}
          disableColumnMenu={true}
          rowHeight={48}
          paginationMode="server"
          onPaginationModelChange={(paginationModel) => {
            const { page, pageSize } = paginationModel;
            if (onPaginationChange) {
              onPaginationChange({ page, pageSize });
            }
          }}
        // slots={{pagination:()=><>Hello</>}}
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
    <div className="flex justify-center items-start gap-x-2 h-full">
      {actions.includes("DELETE") && (
        <p className="cursor-pointer">
          <TbTrash
            className="w-5 h-5 text-red-500"
            onClick={() => onClick && onClick("DELETE")}
          />
        </p>
      )}

      {actions.includes("EDIT") && (
        <p className="cursor-pointer w-5 h-5">
          <FiEdit
            className="w-5 h-5"
            onClick={() => onClick && onClick("EDIT")}
          />
        </p>
      )}

      {actions.includes("VIEW") && (
        <p className="cursor-pointer w-5 h-5">
          <FiEye
            className="w-5 h-5 text-blue-500"
            onClick={() => onClick && onClick("VIEW")}
          />
        </p>
      )}
    </div>
  );
};
