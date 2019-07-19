const dateToString = (date) => {
  const year = date.getFullYear().toString();
  let month = (Number(date.getMonth()) + 1).toString();
  let day = (date.getDate()).toString();
  month = (month.length === 1) ? "0" + month : month;
  day = (day.length === 1) ? "0" + day : day;
  return year + "-" + month + "-" + day;
};

const getWeekDay = (i) => {
  let now = new Date();
  let firstDay = new Date(now - (now.getDay() - 1) * 86400000);
  firstDay.setDate(firstDay.getDate() + i);
  return dateToString(firstDay)
};
const getNowDay = () => {
  let now = new Date();
  return dateToString(now)
};

export {getWeekDay, getNowDay};
