const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Part = (props) => {
  return <p>{props.part} {props.exercises}</p>
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => {
        return <Part key={part.id} part={part.name} exercises={part.exercises} />})}
    </div>
  )
}

const Total = (props) => {
  return (
  <p>
    Number of exercises {props.parts.reduce((s, p) => s + p.exercises, 0)}
  </p>
  )
}


const Course = ({course}) => {

    return (
        <div>
        <Header course={course.name} />
        <Content parts = {course.parts} />
        <Total parts = {course.parts}/>
        </div>
    )
}


export default Course