import { useState } from "react";
import axios from "axios";
import {
  Crown,
  FileText,
  Scissors,
  Hammer,
  CalendarRange,
  Calendar
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

const MatchResultsByRange = () => {

  const [matches, setMatches] = useState<Match[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [singleDate, setSingleDate] = useState("");
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000/api/matches";

  /* ---------------- RANGE SEARCH ---------------- */

  const fetchRangeMatches = async () => {

    if (!startDate || !endDate) {
      alert("Select start and end date");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/range?start=${startDate}&end=${endDate}`
      );

      const sorted = res.data.sort(
        (a: Match, b: Match) => b.time - a.time
      );

      setMatches(sorted);

    } catch (error) {

      console.error("Range fetch failed", error);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- SINGLE DATE SEARCH ---------------- */

  const fetchSingleDateMatches = async (date: string) => {

    setSingleDate(date);

    if (!date) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `${API}/range?start=${date}&end=${date}`
      );

      const sorted = res.data.sort(
        (a: Match, b: Match) => b.time - a.time
      );

      setMatches(sorted);

    } catch (error) {

      console.error("Single date fetch failed", error);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- DATE FORMAT ---------------- */

  const formatDate = (timestamp: number) => {

    const date = new Date(timestamp);

    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

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

  return (

    <div className="min-h-screen bg-linear-to-b  text-white px-6 py-10">

      {/* TITLE */}

      <div className="flex items-center gap-3 mb-8">
        <CalendarRange className="text-yellow-400" size={30} />
        <h1 className="text-3xl font-bold">View Match History.</h1>
      </div>


      {/* SINGLE DATE PICKER */}

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-end">

        

      </div>


      {/* RANGE PICKER */}

      <div className="flex flex-wrap gap-4 mb-6 ">

        <div className="flex flex-col">

          <label className="text-sm text-yellow-300">
            Start Date
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/10 border border-lime-400 px-3 py-2 rounded-lg"
          />

        </div>

        <div className="flex flex-col">

          <label className="text-sm text-yellow-300">
            End Date
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/10 border border-lime-400 px-3 py-2 rounded-lg"
          />

        </div>

        <button
          onClick={fetchRangeMatches}
          className="bg-lime-400 text-black px-4 py-2 rounded-lg hover:bg-lime-300 mt-6"
        >
          Search Range
        </button>

        

        <div className="flex gap-3 items-baseline-last text-center ">

          <label className="text-yellow-300 flex items-center gap-2 mb-1"> OR Just Select A Single Date :
            <Calendar size={18} />
            
          </label>

          <input
            type="date"
            value={singleDate}
            onChange={(e) => fetchSingleDateMatches(e.target.value)}
            className="bg-white/10 border border-lime-400 px-3 py-2 rounded-lg"
          />

        </div>

      </div>


      {/* LOADING */}

      {loading && (
        <p className="text-yellow-300 text-center">Loading matches...</p>
      )}


      {/* NO DATA */}

      {!loading && matches.length === 0 && (
        <p className="text-gray-300 text-center">No matches found. Last 7 Days History are available</p>
      )}


      {/* MATCH TABLE */}

      {!loading && matches.length > 0 && (

        <div className="overflow-x-auto">

          <table className="min-w-187 w-full">

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

              {matches.map((match) => (

                <tr
                  key={match.gameId}
                  className="border-b border-white/10 hover:bg-white/10"
                >

                  <td className="p-3 text-gray-300">
                    {formatDate(match.time)}
                  </td>

                  <td className="p-3">
                    {match.playerA}
                  </td>

                  <td className="p-3 flex items-center gap-2">
                    {getMoveIcon(match.moveA)}
                    {match.moveA}
                  </td>

                  <td className="p-3">
                    {match.playerB}
                  </td>

                  <td className="p-3 flex items-center gap-2">
                    {getMoveIcon(match.moveB)}
                    {match.moveB}
                  </td>

                  <td className="p-3">

                    {match.winner === "DRAW"
                      ? <span className="text-gray-300">DRAW</span>
                      : (
                        <div className="flex items-center gap-2">
                          <Crown size={18} className="text-yellow-400" />
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

export default MatchResultsByRange;

