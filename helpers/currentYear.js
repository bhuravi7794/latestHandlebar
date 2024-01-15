const getCurrentYear = () => {
  console.log("inside the current year function");
  return new Date().getFullYear();
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat().format(new Date(date));
};
export { getCurrentYear, formatDate };
