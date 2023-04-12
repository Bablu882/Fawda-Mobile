
import api from "./api";


const GetBookingDetails = () =>
  api.get("api/my_booking_details");
  const GetMyJobs = () => 
  api.get("/api/myjobs/");
const UpdateColor = (id, data = null) => api.post("update-color/" + id, data);
const MakeActiveInactive = (id, data = null) =>
  api.post("alpha/users/make-active-inactive/" + id, data);
const UpdateStatus = (id, data = null) =>
  api.post("alpha/users/update-status/" + id, data);
const UpdateLoginAuth = (id, data = null) =>
  api.post("alpha/users/update-login-auth/" + id, data);

  export {
    GetBookingDetails,
    GetMyJobs,
  }