import { EventSource } from "eventsource"
import { getWinner } from "../Utils/rpsRules"
import { addMatch } from "../store/matchStore"
import dotenv from "dotenv"

dotenv.config()

let clients:any[] = []

export const addClient = (res:any)=>{
  clients.push(res)
}

export const startLiveStream = ()=>{

    

  const stream = new EventSource(
  `${process.env.RPS_API_BASE_URL}/live`,
  {
    fetch: (url: any, init: any) => {
      return fetch(url, {
        ...init,
        headers: {
          ...init.headers,
          Authorization: `Bearer ${process.env.RPS_API_TOKEN}`,
        },
      })
    }
  } as any
)

  

  stream.onmessage = (event)=>{

    
    
    const match = JSON.parse(event.data)

    const formatted = {

      gameId: match.gameId,
      time: match.time,

      playerA: match.playerA.name,
      playerB: match.playerB.name,

      moveA: match.playerA.played,
      moveB: match.playerB.played,

      winner: getWinner(match.playerA, match.playerB)

    }

    addMatch(formatted)

    clients.forEach(client=>{
      client.write(`data: ${JSON.stringify(formatted)}\n\n`)
    })

  }

}