export const labels=[
  "Accounting & Finance Jobs",
  "Sales Jobs",
  "IT Jobs",
  "Engineering Jobs",
  "Customer Services Jobs",
  "HR & Recruitment Jobs",
  "Trade & Construction Jobs",
  "Advertising & Marketing Jobs",
  "Logistics & Warehouse Jobs",
  "Energy, Oil & Gas Jobs",
  "Healthcare & Nursing Jobs",
  "Hospitality & Catering Jobs",
  "Teaching Jobs",
  "Creative & Design Jobs",
  "Scientific & QA Jobs",
  "Travel Jobs",
  "Domestic help & Cleaning Jobs"
]

const date = new Date();
let day = date.getDate();
export let monthsStr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
let month = monthsStr[date.getMonth()];
export let currentDate=`${month} ${day}`

