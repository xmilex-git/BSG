import axios from "axios";
import {BASE_URL_MATCH, HEADERS} from "../config/index.js";

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
        const response = await this.apiClient.get(`${BASE_URL_MATCH}/${matchId}`);
        const participant = response.data.info.participants.find(
            (p) => p.puuid === pUuid
        );
        return participant.win;
    };


}