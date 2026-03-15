import { Router } from "express";
import {
  getLatestMatches,
  getMatchesByDate,
  getMatchesByRange,
  getLeaderboard,
  getLeaderboardByRange 
} from "../controllers/matchController";

const router = Router();

router.get("/matches/latest", getLatestMatches);

router.get("/matches", getMatchesByDate);

router.get("/matches/range", getMatchesByRange);

router.get("/leaderboard", getLeaderboard);
router.get("/leaderboard/range", getLeaderboardByRange);

export default router;