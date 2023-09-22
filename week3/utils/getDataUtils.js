import axios from "axios";
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import {
  BASE_URL_MATCH,
  BASE_URL_SUMMONER,
  HEADERS,
} from "../utils/fileUtils.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

const USERS_FILE = path.join(__dirname, "./users.json");
const apiClient = axios.create({
  headers: HEADERS,
});

const getUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveUsers = async (users) => {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

const getSummonerPuuid = async (summonerName) => {
  try {
    const response = await apiClient.get(
      `${BASE_URL_SUMMONER}/${summonerName}`
    );

    return response.data.puuid;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const getMatchIdsByPuuid = async (puuid) => {
  const response = await apiClient.get(
    `${BASE_URL_MATCH}/by-puuid/${puuid}/ids?start=0&count=20`
  );
  return response.data;
};

const getMatchResultByMatchId = async (matchId, puuid) => {
  const response = await apiClient.get(`${BASE_URL_MATCH}/${matchId}`);
  const participant = response.data.info.participants.find(
    (p) => p.puuid === puuid
  );
  return participant.win;
};

const getLast20Games = async (summonerName) => {
  try {
    console.log("summonor:", summonerName);

    const puuid = await getSummonerPuuid(summonerName);

    console.log("puuid:", puuid);

    const matchIds = await getMatchIdsByPuuid(puuid);
    console.log("matchIds", matchIds);

    const matchResults = [];
    for (const matchId of matchIds) {
      const result = await getMatchResultByMatchId(matchId, puuid);
      if (result) {
        matchResults.push("승리");
      } else {
        matchResults.push("패배");
      }
    }
    console.log(matchResults);

    return matchResults;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const utils = {
  getUsers,
  saveUsers,
  getSummonerPuuid,
  getMatchIdsByPuuid,
  getMatchResultByMatchId,
  getLast20Games,
};

export default utils;
