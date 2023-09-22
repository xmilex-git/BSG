import express from "express";
import axios from "axios";
import readline from "readline";
import {
  BASE_URL_MATCH,
  BASE_URL_SUMMONER,
  HEADERS,
} from "../utils/fileUtils.js";
import dataUtils from "../utils/getDataUtils.js";

const { getSummonerPuuid } = dataUtils;
const router = express.Router();

/* //! 회원가입 endPoint
router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const users = await getUsers();

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).send("이미 존재하는 회원");
  }

  users.push({ username, password, email });
  await saveUsers(users);
  console.log(users);
  res.status(201).send("회원가입 성공");
}); */

//! 소환사 검색 endPoint
router.get("/searchSummoner", async (req, res) => {
  const { summonerName } = req.query;
  const puuid = await getSummonerPuuid(summonerName);
  console.log(puuid);
  if (!puuid) {
    return res.status(401).send("유효하지 않음");
  }

  res.status(200).send("검색 성공");
});

export default router;
