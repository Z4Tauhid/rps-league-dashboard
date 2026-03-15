import { addClient } from "../services/liveService"

export const streamLiveMatches = (req:any,res:any)=>{

  res.setHeader("Content-Type","text/event-stream")
  res.setHeader("Cache-Control","no-cache")
  res.setHeader("Connection","keep-alive")

  addClient(res)

  req.on("close", ()=>{
    console.log("Client disconnected")
  })

}