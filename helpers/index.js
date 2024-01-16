import handlebars from "handlebars";
import { getCurrentYear, getFormatedDate } from "./currentYear.js";
import handlebarHelpers from "handlebars-helpers";

handlebars.registerHelper("getCurrentYear", getCurrentYear);
handlebars.registerHelper("getFormatedDate", getFormatedDate);
handlebars.registerHelper("eq", handlebarHelpers().eq);

export default handlebars;
