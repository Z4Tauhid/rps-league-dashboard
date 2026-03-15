import { useEffect, useState } from "react";
import axios from "axios";
import {
  Crown,
  Swords,
  FileText,
  Scissors,
  Hammer,
  Search,
  Trophy,
  Medal,
  CalendarRange
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

type Player = {
  name: string;
  wins: number;
};

const PlayerMatchResults = () => {

  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [playerMatches, setPlayerMatches] = useState<Match[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");

  const API = "https://rps-backend-ip44.onrender.com/api";

  /* ---------------- FETCH LATEST MATCHES ---------------- */

  const fetchMatches = async () => {

    try {

      setLoading(true);

      const res = await axios.get(`${API}/matches/latest`);

      setAllMatches(res.data);

      generateLeaderboard(res.data);

    } catch (error) {

      console.error("Error fetching matches", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchMatches();
  }, []);

  /* ---------------- FETCH HISTORICAL LEADERBOARD ---------------- */

  const fetchHistoricalLeaderboard = async () => {

    if(!startDate || !endDate){
      alert("Select start and end date");
      return;
    }

    try{

      setLoading(true);

      const res = await axios.get(
        `${API}/leaderboard/range?start=${startDate}&end=${endDate}`
      );

      const players = res.data.map((p:any)=>({
        name:p.player,
        wins:p.wins
      }));

      setLeaderboard(players);

    }catch(error){

      console.error("Error fetching historical leaderboard",error);

    }finally{

      setLoading(false);

    }

  };

  

  const formatDate = (time: number) => {

    const date = new Date(time);

    return date.toLocaleDateString("en-CA");

  };

  /* ---------------- GENERATE LEADERBOARD ---------------- */

  const generateLeaderboard = (matches: Match[]) => {

    const winMap: Record<string, number> = {};

    matches.forEach((match) => {

      if (match.winner !== "DRAW") {

        if (!winMap[match.winner]) {
          winMap[match.winner] = 0;
        }

        winMap[match.winner] += 1;

      }

    });

    const players = Object.entries(winMap)
      .map(([name, wins]) => ({ name, wins }))
      .sort((a, b) => b.wins - a.wins);

    setLeaderboard(players);

  };

  /* ---------------- SEARCH PLAYER ---------------- */

  const handleSearch = () => {

    const search = playerName.trim();

    if (!search) {
      setPlayerMatches([]);
      return;
    }

    const filtered = allMatches.filter((match) =>
      match.playerA.toLowerCase().includes(search.toLowerCase()) ||
      match.playerB.toLowerCase().includes(search.toLowerCase())
    );

    setPlayerMatches(filtered);

  };

  const resetSearch = () => {

    setPlayerName("");
    setPlayerMatches([]);

  };

  /* ---------------- CARD CLICK SEARCH ---------------- */

  const searchFromCard = (name: string) => {

    setPlayerName(name);

    const filtered = allMatches.filter(
      (match) => match.playerA === name || match.playerB === name
    );

    setPlayerMatches(filtered);

  };

  /* ---------------- MOVE ICON ---------------- */

  const getMoveIcon = (move: string) => {

    if (move === "ROCK")
      return <Hammer size={18} className="text-orange-400" />;

    if (move === "PAPER")
      return <FileText size={18} className="text-fuchsia-400" />;

    if (move === "SCISSORS")
      return <Scissors size={18} className="text-red-400" />;

    return null;

  };

  /* ---------------- RANK ICON ---------------- */

  const getRankIcon = (rank: number) => {

    if (rank === 0) return <Medal className="text-yellow-400" />;
    if (rank === 1) return <Medal className="text-gray-300" />;
    if (rank === 2) return <Medal className="text-orange-500" />;

    return <Trophy className="text-yellow-400" />;

  };

  return (

    <div className="min-h-screen text-white px-6 py-10">

      {/* TITLE */}

      <div className="flex items-center gap-3 mb-8">

        <Swords className="text-yellow-400 animate-pulse" size={32} />

        <h1 className="text-3xl font-bold">Player Arena</h1>

      </div>

      {/* DATE RANGE LEADERBOARD */}

      <div className="flex flex-wrap gap-4 mb-8 items-end">

        <div className="flex flex-col">

          <label className="text-yellow-300 text-sm">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e)=>setStartDate(e.target.value)}
            className="bg-white/10 border border-lime-400 px-3 py-2 rounded-lg"
          />

        </div>

        <div className="flex flex-col">

          <label className="text-yellow-300 text-sm">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e)=>setEndDate(e.target.value)}
            className="bg-white/10 border border-lime-400 px-3 py-2 rounded-lg"
          />

        </div>

        <button
          onClick={fetchHistoricalLeaderboard}
          className="bg-lime-400 text-black px-4 py-2 rounded-lg hover:bg-lime-300 flex items-center gap-2"
        >
          <CalendarRange size={18}/>
          Show Historical Leaderboard
        </button>

      </div>

      {/* SEARCH */}

      <div className="flex items-center gap-4 mb-8">

        <div className="flex items-center gap-2 text-yellow-300">

          <Search size={20} />

          <span>Search Player</span>

        </div>

        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter player name"
          className="bg-white/10 border border-lime-400 px-3 py-2 rounded-lg"
        />

        <button
          onClick={handleSearch}
          className="bg-lime-400 text-black px-4 py-2 rounded-lg hover:bg-lime-300"
        >
          Search
        </button>

        <button
          onClick={resetSearch}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg"
        >
          Reset
        </button>

      </div>

      {loading && <p className="text-yellow-300">Loading...</p>}

      {/* LEADERBOARD CARDS */}

      {!loading && playerMatches.length === 0 && (

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {leaderboard.map((player, index) => (

            <div
              key={player.name}
              onClick={() => searchFromCard(player.name)}
              className="cursor-pointer bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:scale-105 transition"
            >

              <div className="flex items-center justify-between mb-2">

                <h2 className="text-lg font-semibold">
                  {player.name}
                </h2>

                {getRankIcon(index)}

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2 text-yellow-300">

                  <Crown size={18} />

                  <span>{player.wins} Wins</span>

                </div>

                <span className="text-lime-400 font-semibold">
                  #{index + 1}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* MATCH TABLE */}

      {!loading && playerMatches.length > 0 && (

        <div className="overflow-x-auto mt-6">

          <table className="min-w-187 w-full">

            <thead>

              <tr className="border-b border-white/20 text-lime-400">

                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Player A</th>
                <th className="p-3 text-left">Move</th>
                <th className="p-3 text-left">Player B</th>
                <th className="p-3 text-left">Move</th>
                <th className="p-3 text-left">Winner</th>

              </tr>

            </thead>

            <tbody>

              {playerMatches.map((match) => (

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

                    {match.winner === "DRAW" ? (

                      <span className="text-gray-300">DRAW</span>

                    ) : (

                      <div className="flex items-center gap-2">
                        <Crown size={18} className="text-yellow-400"/>
                        <span className="text-yellow-300 font-semibold">
                          {match.winner}
                        </span>
                      </div>

                    )}

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

export default PlayerMatchResults;