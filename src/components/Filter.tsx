import { Col,Form } from "react-bootstrap"
import { Filter } from "../types"
import "../styles/Home.sass"


type Props={
  handleDetail(e:React.ChangeEvent<HTMLSelectElement>):void
  filter:Filter
}
export const FilterPart=({filter,handleDetail}:Props)=>{

  return (<>
  <Col className="filter">
      <Form.Select aria-label="Default select example" name="posted" onChange={handleDetail} value={filter.posted}>
    <option value="">Date posted</option>
    <option value="&max_days_old=5" >Last 5 days</option>
    <option value="&max_days_old=10" >Last 10 days</option>
    <option value="&max_days_old=30" >Last 30 days</option>
  </Form.Select></Col>
      <Col className="filter">
      <Form.Select aria-label="Default select example" name="salary" onChange={handleDetail} value={filter.salary}>
    <option value="">Salary estimate</option>
    <option value="&salary_min=30000">$30,000+</option>
    <option value="&salary_min=50000">$50,000+</option>
    <option value="&salary_min=70000">$70,000+</option>
  </Form.Select></Col>
      <Col className="filter">
      <Form.Select aria-label="Default select example" name="employ" onChange={handleDetail} value={filter.employ}>
    <option value="">Employment type</option>
    <option value="&full_time=1">Full-time</option>
    <option value="&part_time=1">Part-time</option>
    <option value="&contract=1">Contract</option>
  </Form.Select>
  </Col>      
  </>)
}