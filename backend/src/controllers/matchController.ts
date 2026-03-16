import { Request, Response } from "express";
import { getMatches } from "../store/matchStore";


export const getLatestMatches = (req: Request, res: Response) => {
  try {

    const matches = getMatches();

    const result = [...matches]
      .sort((a, b) => b.time - a.time)
      .slice(0, 50);

    res.json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching latest matches" });

  }
};



  // Returns all matches from a specific date

export const getMatchesByDate = (req: Request, res: Response) => {

  try {

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date query required" });
    }

    const matches = getMatches();

    const startTime = new Date(date as string);
    startTime.setHours(0, 0, 0, 0);

    const endTime = new Date(date as string);
    endTime.setHours(23, 59, 59, 999);

    const filtered = matches.filter(
      (m) => m.time >= startTime.getTime() && m.time <= endTime.getTime()
    );

    res.json(filtered);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching matches by date" });

  }

};



  // Returns matches within a date range

export const getMatchesByRange = (req: Request, res: Response) => {

  try {

    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end required" });
    }

    const matches = getMatches();

    const startTime = new Date(start as string);
    startTime.setHours(0,0,0,0);

    const endTime = new Date(end as string);
    endTime.setHours(23,59,59,999);

    const filtered = matches.filter(
      (m) => m.time >= startTime.getTime() && m.time <= endTime.getTime()
    );

    res.json(filtered);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching matches by range" });

  }

};



  // Returns matches played by a specific player
 
export const getMatchesByPlayer = (req: Request, res: Response) => {

  try {

    const { name } = req.params;

    const matches = getMatches();

    const filtered = matches.filter(
      (m) => m.playerA === name || m.playerB === name
    );

    res.json(filtered);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching player matches" });

  }

};



  // Global leaderboard based on total wins

export const getLeaderboard = (req: Request, res: Response) => {

  try {

    const matches = getMatches();

    const leaderboard: Record<string, number> = {};

    matches.forEach((match) => {

      if (!match.winner || match.winner === "DRAW") return;

      leaderboard[match.winner] =
        (leaderboard[match.winner] || 0) + 1;

    });

    const result = Object.entries(leaderboard)
      .map(([player, wins]) => ({ player, wins }))
      .sort((a, b) => b.wins - a.wins);

    res.json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching leaderboard" });

  }

};



  // Leaderboard within a date range

export const getLeaderboardByRange = (req: Request, res: Response) => {

  try {

    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Start and end required" });
    }

    const matches = getMatches();

    const startTime = new Date(`${start}T00:00:00`).getTime();
    const endTime = new Date(`${end}T23:59:59.999`).getTime();

    const filtered = matches.filter(
      (m) => m.time >= startTime && m.time <= endTime
    );

    const leaderboard: Record<string, number> = {};

    filtered.forEach((match) => {

      if (!match.winner || match.winner === "DRAW") return;

      leaderboard[match.winner] =
        (leaderboard[match.winner] || 0) + 1;

    });

    const result = Object.entries(leaderboard)
      .map(([player, wins]) => ({ player, wins }))
      .sort((a, b) => b.wins - a.wins);

    res.json(result);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error fetching leaderboard by range" });

  }

};