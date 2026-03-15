import { Router } from "express"
import { streamLiveMatches } from "../controllers/liveController"

const router = Router()

router.get("/live", streamLiveMatches)

export default router