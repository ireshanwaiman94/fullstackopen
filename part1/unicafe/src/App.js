import { useState } from "react";

const Header = props => <h1>{props.name}</h1>

const StatisticLine = ({ text, value }) => {
  console.log("Positive", text);
  if (text === "positive") {
    return (
      <tr><td>{text} {value} %</td></tr>
    )
  }

  return (
    <tr><td>{text} {value}</td></tr>
  )
}

const Statistic = ({ clicks }) => {
  const total = clicks.good + clicks.neutral + clicks.bad
  const average = (clicks.good * 1 + clicks.bad * -1) / total
  const positive = clicks.good * (100 / total)

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }

  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value={clicks.good} />
          <StatisticLine text="neutral" value={clicks.neutral} />
          <StatisticLine text="bad" value={clicks.bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)


const App = () => {
  // save clicks of each button to its own state

  const [clicks, setClicks] = useState(
    { good: 0, neutral: 0, bad: 0 }
  )


  const handleGoodClicks = () => {
    setClicks(
      {
        ...clicks,
        good: clicks.good + 1
      }
    );
  }
  const handleNeutralClicks = () => {
    setClicks({ ...clicks, neutral: clicks.neutral + 1 })
  }
  const handleBadclicks = () => {
    setClicks({ ...clicks, bad: clicks.bad + 1 })
  }

  return (
    <div>
      <Header name="Give Feedback" />
      <Button onClick={handleGoodClicks} text="good" />
      <Button onClick={handleNeutralClicks} text="neutral" />
      <Button onClick={handleBadclicks} text="bad" />
      <Header name="Statictics" />
      <Statistic clicks={clicks} />
    </div>
  );
}

export default App;
