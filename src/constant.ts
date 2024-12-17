// export const BASE_URL = "https://task-management-backend-orcin-phi.vercel.app/api/";
export const BASE_URL = "http://localhost:8080/api/";
export const Endpoint = {
  LOGIN: "auth/login",
  ADD_TASK: "worklog/add-worklog",
  UPDATE_TASK: "worklog/updateWorklogById",
  GET_WORKLOG: "worklog/getAllWorklog",
  GET_WORKLOG_BY_USERID: "worklog/getWorkLogByUserId",
  DELETE_BY_WORKLOG_ID: "worklog/deleteByWorklogId",
  getUserList: "worklog/getUserList",
  filterWorkLogByUserId: "worklog/filterWorkLogByUserId",
};

// Roles = {
//   Super Admin: 10002
//   Admin: 10001,
//   User: 10000,
// }