import express from "express";
import GameService from "../services/GameService.js";

const router = express.Router();

//! match 정보 얻기
router.get("/match", async (req, res) => {
  const { summonerName } = req.query;

  const matchBoolList = await GameService.getLast20Games(summonerName);

  const matchInfo = {
    m1: matchBoolList[0],
    m2: matchBoolList[1],
    m3: matchBoolList[2],
    m4: matchBoolList[3],
    m5: matchBoolList[4],
    m6: matchBoolList[5],
    m7: matchBoolList[6],
    m8: matchBoolList[7],
    m9: matchBoolList[8],
    m10: matchBoolList[9],
    m11: matchBoolList[10],
    m12: matchBoolList[11],
    m13: matchBoolList[12],
    m14: matchBoolList[13],
    m15: matchBoolList[14],
    m16: matchBoolList[15],
    m17: matchBoolList[16],
    m18: matchBoolList[17],
    m19: matchBoolList[18],
    m20: matchBoolList[19],
  };

  res.json(matchInfo);
});

export default router;
