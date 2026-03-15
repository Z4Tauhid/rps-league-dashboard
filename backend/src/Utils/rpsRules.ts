export const getWinner = (playerA: any, playerB: any) => {

  const a = playerA.played?.toUpperCase()
  const b = playerB.played?.toUpperCase()

  const validMoves = ["ROCK", "PAPER", "SCISSORS"]

  if (!validMoves.includes(a) || !validMoves.includes(b)) {
    return "NO RESULT"
  }

  if (a === b) return "DRAW"

  if (
    (a === "ROCK" && b === "SCISSORS") ||
    (a === "PAPER" && b === "ROCK") ||
    (a === "SCISSORS" && b === "PAPER")
  ) {
    return playerA.name
  }

  return playerB.name
}