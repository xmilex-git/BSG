import axios from "axios";
import { BASE_URL_SUMMONER, HEADERS } from "../config/index.js";

export default class SummonerService {
  static apiClient = axios.create({
    headers: HEADERS,
  });

  static getSummonerPuuid = async (summonerName) => {
    try {
      const response = await this.apiClient.get(
        `${BASE_URL_SUMMONER}/${summonerName}`
      );
      return response.data.puuid;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
}
