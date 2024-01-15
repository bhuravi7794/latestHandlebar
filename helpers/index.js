import handlebars from "handlebars";
import { getCurrentYear, formatDate } from "./currentYear.js";
import handlebarHelpers from "handlebars-helpers";

handlebars.registerHelper("getCurrentYear", getCurrentYear);
handlebars.registerHelper("formatDate", formatDate);
handlebars.registerHelper("eq", handlebarHelpers().eq);

export default handlebars;
