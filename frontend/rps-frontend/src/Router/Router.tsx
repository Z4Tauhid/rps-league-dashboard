import { createBrowserRouter } from "react-router"

import RootLayout from "../RootLayout/RootLayout"
import Home from "@/pages/Home"
import Matches from "../pages/Matches"
import Player from "../pages/Player"
import Leaderboard from "../pages/Leaderboard"
import MatchHistory from "../pages/MatchHistory"


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
       index: true,
       Component: Home
      },
      {
       path: "matches",
       Component: Matches
      },
      {
       path: "player",
       Component: Player
      },
      {
       path: "leaderboard",
       Component: Leaderboard
      },
      {
       path: "matchHistory",
       Component: MatchHistory
      },
    ],
  },

  {
   
  },
  {
    
  },
])

export default router