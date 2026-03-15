import axiosSecure from "../config/axiosSecure";
import { getWinner } from "../Utils/rpsRules";
import { setMatches } from "../store/matchStore";

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchHistory = async () => {

  let url = "/history";
  let allMatches: any[] = [];

  let page = 0;
  const MAX_PAGES = 365;

  while (url && page < MAX_PAGES) {
    try {

      const response = await axiosSecure.get(url);

      const formatted = response.data.data.map((m: any) => ({
        gameId: m.gameId,
        time: m.time,

        playerA: m.playerA.name,
        playerB: m.playerB.name,

        moveA: m.playerA.played,
        moveB: m.playerB.played,

        winner: getWinner(m.playerA, m.playerB)
      }));

      allMatches.push(...formatted);
      console.log("Loaded matches:", allMatches.length);

      url = response.data.cursor || null;

      page++;

      await sleep(500); 

    } catch (error: any) {

      if (error.response?.status === 429) {
        const wait = error.response.data.retryAfterMs || 30000;

        console.log(`Rate limited. Waiting ${wait}ms`);

        await sleep(wait);
      } else {
        throw error;
      }

    }
  }

  setMatches(allMatches);

  console.log("History loaded:", allMatches.length);
};