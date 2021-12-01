// Messages
const Msgs = {
  validTime: "Date is required！",
  validMethod: "Method is required！",
  validActivity: "Activities status is required！",
  validAnalyst: "Analyst is required！",
  ticketCreateSucc: "You've successfully created the ticket！",
  ticketUpdateSucc: "You've successfully updated the ticket！",
  ticketDelCheck: "Are you sure you want to delete this ticket？",
  ticketDelSucc: "You've successfully deleted the ticket！",
  activityCreateSucc: "You've successfully created the activity！",
  activityUpdateSucc: "You've successfully updated the activity！",
  activityDelCheck: "Are you sure you want to delete this activity？",
  activityDelSucc: "You've successfully deleted the activity！"
};

// Class name list for method status.
const methodCls = ['green', 'gray', 'brown', 'red', 'purple', 'orange'];
// Class name list for activity types.
const actvtsCls = ['purple', 'blue', 'orange', 'brown', 'gray', 'green'];

// Week title
const weekTitles = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Get week length
const weekLength = () => {
  const tableWidth = 360;
  const pagePadding = 30;
  const width = window.innerWidth - tableWidth - pagePadding * 2;
  const length = (Math.floor(width / 7 / 22) > 10)
                ? 10 : Math.floor(width / 7 / 22);
  return (length > 0) ? length : 1;
}

export {
  Msgs,
  methodCls,
  actvtsCls,
  weekTitles,
  weekLength
};