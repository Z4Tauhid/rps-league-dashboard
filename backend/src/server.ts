import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import matchRoutes from "./routes/matchRoutes";
import liveRoutes from "./routes/liveRoutes";

import { fetchHistory } from "./services/historyService";
import { startLiveStream } from "./services/liveService";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", matchRoutes);
app.use("/api", liveRoutes);

const PORT = Number(process.env.PORT) || 5000;



app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

  fetchHistory()
    .then(() => {
      console.log("History loaded");
    })
    .catch(err => {
      console.error("History load failed", err);
    });

  startLiveStream();
});