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
  location:Location,
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
export type Location={
  display_name:string,
  area:Array<string>
}

export type File={
  name:string
}
export type SavedJob={
  title:string,
  company:Company,
  location:string,
  id:string,
  savedDate:string,
}
export type Search={
  title:string,
  location:string,
  id:string,
  searchDate:string
}