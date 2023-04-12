export type UserData={
  email:"",
  password:""
}

export type NewUser={
  name:"",
  email:"",
  password:""
}
export type Filter={
  salary:string,
  posted:string,
  employ:string
}
export type Job={
  title:string,
  category:Category,
  company:Company,
  location:string,
  salary_min:number,
  created:string,
  description:string,
  id:string,
  savedDate:string
}
export type Company={
  display_name:string
}
export type Category={
  label:string
}
