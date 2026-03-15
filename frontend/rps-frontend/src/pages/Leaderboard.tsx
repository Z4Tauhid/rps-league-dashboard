import { useEffect, useState } from "react";
import axios from "axios";
import { Crown, Trophy } from "lucide-react";


type Player = {
  player: string;
  wins: number;
};

type Match = {
  gameId: string;
  playerA: string;
  playerB: string;
  moveA: string;
  moveB: string;
  winner: string;
  time: number;
};

const LiveLeaderboard = () => {

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api";

  

 const today = new Date().toLocaleDateString("en-CA");

  /* ---------- FETCH TODAY LEADERBOARD ---------- */

  const fetchLeaderboard = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/leaderboard/range?start=${today}&end=${today}`
      );

      setPlayers(res.data);

    } catch (error) {

      console.error("Leaderboard fetch failed", error);

    } finally {

      setLoading(false);

    }

  };

  /* ---------- LIVE STREAM UPDATE ---------- */

  const startLiveStream = () => {

    const eventSource = new EventSource(`${API}/live`);

    eventSource.onmessage = (event) => {

      const match: Match = JSON.parse(event.data);

      if (match.winner === "DRAW") return;

      setPlayers(prev => {

        const updated = [...prev];

        const index = updated.findIndex(
          p => p.player === match.winner
        );

        if (index !== -1) {

          updated[index].wins += 1;

        } else {

          updated.push({
            player: match.winner,
            wins: 1
          });

        }

        return updated.sort((a, b) => b.wins - a.wins);

      });

    };

  };

  useEffect(() => {

    fetchLeaderboard();
    startLiveStream();

  }, []);

  return (

    <div className="min-h-screen   text-white px-6 py-10 w-11/12 mx-auto ">

      <div className="flex items-center gap-3 mb-8 ">

        <Trophy size={32} className="text-yellow-400"/>

        <h1 className="text-3xl font-bold">
          Today's Live Leaderboard
        </h1>

        <span className="text-red-400 animate-pulse ml-2">
          LIVE
        </span>

      </div>

      {loading && (
        <div className="flex justify-center items-center text-center">
          <p className="text-yellow-300">
          Loading leaderboard...
        </p>
        </div>
      )}

      {!loading && players.length === 0 && (
        <p className="text-gray-300 text-center">
          No players yet today
        </p>
      )}

      {!loading && players.length > 0 && (

        <div className="max-w-xl  mx-auto">

          <table className="w-full ">

            <thead>

              <tr className="border-b border-white/20 text-lime-400">

                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Player</th>
                <th className="p-3 text-left">Wins</th>

              </tr>

            </thead>

            <tbody>

              {players.map((player, index) => (

                <tr
                  key={player.player}
                  className="border-b border-white/10 hover:bg-white/10"
                >

                  <td className="p-3">

                    {index === 0 ? (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Crown size={18}/>
                        #1
                      </div>
                    ) : (
                      `#${index + 1}`
                    )}

                  </td>

                  <td className="p-3 font-semibold">
                    {player.player}
                  </td>

                  <td className="p-3 text-lime-400 font-bold">
                    {player.wins}
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

export default LiveLeaderboard;

