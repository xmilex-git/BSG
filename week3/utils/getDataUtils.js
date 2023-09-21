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

export const getUsers = async () => {
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const saveUsers = async (users) => {
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
    const puuid = await getSummonerPuuid(summonerName);
    console.log(puuid);

    const matchIds = await getMatchIdsByPuuid(puuid);
    console.log(matchIds);

    const matchResults = [];
    for (const matchId of matchIds) {
      const result = await getMatchResultByMatchId(matchId, puuid);
      matchResults.push(result);
      console.log(result);
      // No need to sleep here as per the original comment
    }

    console.log(matchResults);
    return matchResults;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export { getSummonerPuuid, getMatchResultByMatchId, getLast20Games };
