import Part from "./Part";

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part, i) =>
                <Part key={i} parts={part.name} exercises={part.exercises}></Part>
            )}
        </div>
    )
}
export default Content;