import axios from "axios";
import { BASE_URL_MATCH, HEADERS } from "../config/index.js";

export default class MatchService {
  static apiClient = axios.create({
    headers: HEADERS,
  });

  static getMatchIdsByPUuid = async (pUuid) => {
    const response = await this.apiClient.get(
      `${BASE_URL_MATCH}/by-puuid/${pUuid}/ids?start=0&count=20`
    );
    return response.data;
  };

  static getMatchResultByMatchId = async (matchId, pUuid) => {
    try {
      const response = await this.apiClient.get(`${BASE_URL_MATCH}/${matchId}`);
      const participant = response.data.info.participants.find(
        (p) => p.puuid === pUuid
      );

      if (!participant) {
        console.error("Participant not found:", pUuid);
        return null;
      }

      const matchResult = {
        win: participant.win,
        championName: participant.championName,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        largestMultiKill: participant.largestMultiKill,
      };

      return matchResult;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
}
