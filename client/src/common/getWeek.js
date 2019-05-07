const getWeek = (i) => {
  let now = new Date();
  let firstDay = new Date(now - (now.getDay() - 1) * 86400000);
  firstDay.setDate(firstDay.getDate() + i);
  let mon = Number(firstDay.getMonth()) + 1;
  return now.getFullYear() + "-" + mon + "-" + firstDay.getDate();
};
export default getWeek;
