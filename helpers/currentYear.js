const getCurrentYear = () => {
  console.log("inside the current year function");
  return new Date().getFullYear();
};

const getFormatedDate = (date) => {
  return new Intl.DateTimeFormat().format(new Date(date));
};
export { getCurrentYear, getFormatedDate };
