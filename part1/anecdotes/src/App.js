import { useState } from "react";

const Header = ({ title }) => <h1>{title}</h1>

const Anecdote = ({ text, voteCount }) => {
  return (
    <div>
      <p>{text}</p>
      <p>has {voteCount} votes</p>
    </div>
  )
}

const MostVote = ({ anecdotes, allVotes }) => {
  console.log("allVotes", allVotes);
  const highestVote = Math.max(...allVotes);
  console.log("highestVote", highestVote);
  const highestVoteIndex = allVotes.indexOf(highestVote);
  console.log("highestVoteIndex", highestVoteIndex);
  const highestVoteName = anecdotes[highestVoteIndex]
  console.log("highestVoteName", highestVoteName);

  if (highestVote === 0) {
    return (
      <p>No votes</p>
    )
  }

  return (
    <div>
      <p>{highestVoteName}</p>
      <p>has {highestVote} votes</p>
    </div>
  )
}

const Button = ({ onClick, text }) => <div><button onClick={onClick}>{text}</button></div>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [allVotes, setAllVotes] = useState(Array(8).fill(0))



  const handleAnecdoteClick = () => {
    const randomAnecdotes = Math.floor(Math.random() * anecdotes.length);
    console.log("randomAnecdotes", randomAnecdotes);
    //this is set to selected
    setSelected(randomAnecdotes);
  }
  const handleVoteClick = () => {
    console.log("selected", selected);
    const newAllVotes = [...allVotes]
    newAllVotes[selected] += 1
    setAllVotes(newAllVotes)
  }

  return (
    <div>
      <Header title="Anecdote of the day" />
      <Anecdote text={anecdotes[selected]} voteCount={allVotes[selected]} />
      <Button onClick={handleAnecdoteClick} text="Next anecdote"></Button>
      <Button onClick={handleVoteClick} text="Vote"></Button>

      <Header title="Anecdote with most votes" />
      <MostVote anecdotes={anecdotes} allVotes={allVotes}></MostVote>
    </div>
  )
}

export default App;
