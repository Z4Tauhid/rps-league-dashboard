
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Crown,
  FileText,
  Scissors,
  Hammer,
  Swords
} from "lucide-react";

type Match = {
  gameId: string;
  playerA: string;
  playerB: string;
  moveA: string;
  moveB: string;
  winner: string;
  time: number;
};

const LatestMatches = () => {

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api";

  /* ---------------- FETCH HISTORY ---------------- */

  const fetchMatches = async () => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}/matches/latest`);

      setMatches(res.data);

    } catch (error) {

      console.error("Failed to fetch matches", error);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- LIVE STREAM ---------------- */

  const startLiveStream = () => {

    const eventSource = new EventSource(`${API}/live`);

    eventSource.onmessage = (event) => {

      const liveMatch: Match = JSON.parse(event.data);

      setMatches((prev) => {

        const updated = [liveMatch, ...prev];

        // remove duplicates
        const unique = updated.filter(
          (match, index, self) =>
            index === self.findIndex(m => m.gameId === match.gameId)
        );

      
        return unique.slice(0, 300);

      });

    };

    eventSource.onerror = () => {
      console.log("Live connection lost");
      eventSource.close();
    };

  };

  useEffect(() => {

    fetchMatches();
    startLiveStream();

  }, []);

  

  const formatDate = (time:number)=>{
    return new Date(time).toLocaleString();
  };

  /* ---------------- MOVE ICON ---------------- */

  const getMoveIcon = (move:string)=>{

    if(move==="ROCK")
      return <Hammer size={18} className="text-orange-400"/>;

    if(move==="PAPER")
      return <FileText size={18} className="text-fuchsia-400"/>;

    if(move==="SCISSORS")
      return <Scissors size={18} className="text-red-400"/>;

    return null;
  };

  return (

    <div className="min-h-screen bg-gradient-to-b  text-white px-6 py-10">

      {/* TITLE */}

      <div className="flex items-center gap-3 mb-8">
        <Swords className="text-yellow-400 animate-pulse" size={30}/>
        <h1 className="text-3xl font-bold">
          Live RPS Match Results
        </h1>
      </div>

      {loading && (
        <p className="text-yellow-300 text-center">Loading matches...</p>
      )}

      {!loading && matches.length===0 && (
        <p className="text-gray-300 text-center">No matches found</p>
      )}

      {!loading && matches.length>0 && (

        <div className="overflow-x-auto">

          <table className="min-w-[750px] w-full">

            <thead>

              <tr className="border-b border-white/20 text-lime-400">

                <th className="p-3">Date</th>
                <th className="p-3">Player A</th>
                <th className="p-3">Move</th>
                <th className="p-3">Player B</th>
                <th className="p-3">Move</th>
                <th className="p-3">Winner</th>

              </tr>

            </thead>

            <tbody>

              {matches.map(match=>(
                <tr
                  key={match.gameId}
                  className="border-b border-white/10 hover:bg-white/10"
                >

                  <td className="p-3 text-gray-300">
                    {formatDate(match.time)}
                  </td>

                  <td className="p-3">{match.playerA}</td>

                  <td className="p-3 flex items-center gap-2">
                    {getMoveIcon(match.moveA)}
                    {match.moveA}
                  </td>

                  <td className="p-3">{match.playerB}</td>

                  <td className="p-3 flex items-center gap-2">
                    {getMoveIcon(match.moveB)}
                    {match.moveB}
                  </td>

                  <td className="p-3">

                    {match.winner==="DRAW"
                      ? <span className="text-gray-300">DRAW</span>
                      : (
                        <div className="flex items-center gap-2">
                          <Crown size={18} className="text-yellow-400"/>
                          <span className="text-yellow-300 font-semibold">
                            {match.winner}
                          </span>
                        </div>
                      )
                    }

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

};

export default LatestMatches;

