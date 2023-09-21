import express from "express";
import axios from "axios";
import readline from "readline";
import {
  BASE_URL_MATCH,
  BASE_URL_SUMMONER,
  HEADERS,
} from "../utils/fileUtils.js";
import {
  getUsers,
  saveUsers,
  getSummonerPuuid,
  getLast20Games,
} from "../utils/getDataUtils.js";

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
router.post("/searchSummoner", async (req, res) => {
  const { summonerName } = req.body;
  const puuid = await getSummonerPuuid(summonerName);
  const users = await getUsers();

  /* const user = users.find(
    (u) => u.username === username && u.password === password
  ); */

  if (!puuid) {
    return res.status(401).send("유효하지 않음");
  }
  users.push({ summonerName });
  await saveUsers(users);

  //res.cookie("auth", "valid-user", { maxAge: 900000 });
  res.status(200).send("검색 성공");
});

export default router;
