import express from "express";
import GameService from "../services/GameService.js";

const router = express.Router();

//! match 정보 얻기
router.get("/match", async (req, res) => {
  const { summonerName } = req.query;

  const matchInfo = await GameService.getLast20Games(summonerName);
  console.log("matchIds Check: ", matchInfo);

  res.json(matchInfo);
});

export default router;
