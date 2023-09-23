import express from "express";
import SummonerService from "../services/SummonerService.js";
const router = express.Router();


router.get("/searchSummoner", async (req, res) => {
  const { summonerName } = req.query;
  const pUuid = await SummonerService.getSummonerPuuid(summonerName);

  if (!pUuid) {
    return res.status(401).send("유효하지 않음");
  }

  res.status(200).send("검색 성공");
});

export default router;
