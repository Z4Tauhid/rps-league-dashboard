import { useEffect, useState } from "react";
import axios from "axios";
import {
  Crown,
  Trophy,
  Swords,
  Hammer,
  FileText,
  Scissors
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

type Match = {
  gameId: string;
  playerA: string;
  playerB: string;
  moveA: string;
  moveB: string;
  winner: string;
  time: number;
};

const COLORS = ["#facc15", "#22c55e", "#38bdf8"];

export default function Home() {

  const [matches,setMatches] = useState<Match[]>([]);
  const [loading,setLoading] = useState(true);

  const API = "https://rps-backend-ip44.onrender.com/api/matches/latest"; 

  useEffect(()=>{

    const fetchMatches = async ()=>{

      try{

        const res = await axios.get(API);

        setMatches(res.data);

      }catch(err){

        console.error(err);

      }finally{

        setLoading(false);

      }

    };

    fetchMatches();

  },[]);

  /* ---------------- STATS ---------------- */

  const totalMatches = matches.length;

  const totalDraws = matches.filter(m=>m.winner==="DRAW").length;

  const winners = matches.filter(m=>m.winner!=="DRAW");

  const uniquePlayers = new Set(
    matches.flatMap(m=>[m.playerA,m.playerB])
  ).size;

  /* ---------------- WIN DATA ---------------- */

  const winMap:Record<string,number> = {};

  winners.forEach(match=>{

    if(!winMap[match.winner]){
      winMap[match.winner] = 0;
    }

    winMap[match.winner]++;

  });

  const winData = Object.entries(winMap)
    .map(([player,wins])=>({player,wins}))
    .sort((a,b)=>b.wins-a.wins)
    .slice(0,5);

  /* ---------------- MOVE STATS ---------------- */

  const moveMap:Record<string,number> = {
    ROCK:0,
    PAPER:0,
    SCISSORS:0
  };

  matches.forEach(m=>{
    moveMap[m.moveA]++;
    moveMap[m.moveB]++;
  });

  const moveData = [
    {name:"Rock",value:moveMap.ROCK},
    {name:"Paper",value:moveMap.PAPER},
    {name:"Scissors",value:moveMap.SCISSORS}
  ];

  /* ---------------- ICONS ---------------- */

  const getMoveIcon = (move:string)=>{

    if(move==="ROCK") return <Hammer size={18} className="text-orange-400"/>;
    if(move==="PAPER") return <FileText size={18} className="text-fuchsia-400"/>;
    if(move==="SCISSORS") return <Scissors size={18} className="text-red-400"/>;

  };

  if(loading){
    return (
      <div className="text-white p-10">
        Loading Dashboard...
      </div>
    );
  }

  return (

    <div className="min-h-screen   text-white px-8 py-10">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-10">

        <Swords className="text-yellow-400 animate-pulse" size={34}/>

        <h1 className="text-3xl font-bold">
          Rock Paper Scissors Dashboard
        </h1>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:scale-105 transition">

          <p className="text-gray-300 mb-1">
            Total Matches
          </p>

          <h2 className="text-3xl font-bold text-yellow-400">
            {totalMatches}
          </h2>

        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:scale-105 transition">

          <p className="text-gray-300 mb-1">
            Players
          </p>

          <h2 className="text-3xl font-bold text-lime-400">
            {uniquePlayers}
          </h2>

        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl hover:scale-105 transition">

          <p className="text-gray-300 mb-1">
            Draw Matches
          </p>

          <h2 className="text-3xl font-bold text-blue-400">
            {totalDraws}
          </h2>

        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

        {/* WIN LEADERBOARD */}

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">

            <Trophy className="text-yellow-400"/>

            Recent Top Winners

          </h2>

          <ResponsiveContainer width="100%" height={320}>
  <BarChart
    data={winData}
    layout="vertical"
    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
  >

    <XAxis type="number" stroke="#ccc" />

    <YAxis
      dataKey="player"
      type="category"
      stroke="#ccc"
      width={120}
    />

    <Tooltip />

    <Bar
      dataKey="wins"
      fill="#22c55e"
      radius={[0, 6, 6, 0]}
      label={{ position: "right", fill: "#fff" }}
    />

  </BarChart>
</ResponsiveContainer>

        </div>

        {/* MOVE DISTRIBUTION */}

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">

          <h2 className="text-xl font-semibold mb-6">

            Move Distribution

          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <PieChart>

              <Pie
                data={moveData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >

                {moveData.map((_,index)=>(
                  <Cell key={index} fill={COLORS[index % COLORS.length]}/>
                ))}

              </Pie>

              <Tooltip/>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= RECENT MATCHES ================= */}

      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">

        <h2 className="text-xl font-semibold mb-6">

          Recent Matches

        </h2>

        <div className="space-y-3">

          {matches.slice(0,6).map(match=>(

            <div
              key={match.gameId}
              className="flex items-center justify-between border-b border-white/10 pb-2 hover:bg-white/5 px-2 rounded"
            >

              <div className="flex items-center gap-3">

                <span className="font-semibold">
                  {match.playerA}
                </span>

                {getMoveIcon(match.moveA)}

                <span className="text-gray-400">
                  vs
                </span>

                {getMoveIcon(match.moveB)}

                <span className="font-semibold">
                  {match.playerB}
                </span>

              </div>

              <div className="flex items-center gap-2">

                {match.winner !== "DRAW" ? (

                  <>
                    <Crown size={16} className="text-yellow-400"/>

                    <span className="text-yellow-300">
                      {match.winner}
                    </span>
                  </>

                ) : (

                  <span className="text-gray-400">
                    DRAW
                  </span>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}