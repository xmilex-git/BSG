const axios = require("axios");
require("dotenv").config();

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const BASE_URL_SUMMONER =
  "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name";
const BASE_URL_MATCH = "https://asia.api.riotgames.com/lol/match/v5/matches";

const headers = {
  "X-Riot-Token": RIOT_API_KEY,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://developer.riotgames.com",
};

const apiClient = axios.create({ headers });

exports.getPuuid = async (summonerName) => {
  const response = await apiClient.get(`${BASE_URL_SUMMONER}/${summonerName}`);
  return response.data.puuid;
};

exports.getLast20MatchIds = async (puuid) => {
  const response = await apiClient.get(
    `${BASE_URL_MATCH}/by-puuid/${puuid}/ids?start=0&count=20`
  );
  return response.data;
};

exports.getMatchResults = async (matchIds, puuid) => {
  const results = [];
  for (const matchId of matchIds) {
    const response = await apiClient.get(`${BASE_URL_MATCH}/${matchId}`);
    const participant = response.data.info.participants.find(
      (p) => p.puuid === puuid
    );
    results.push(participant.win);
  }
  return results;
};
