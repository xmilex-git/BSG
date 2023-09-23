import SummonerService from "./SummonerService.js";
import MatchService from "./MatchService.js";
import * as Promise from "bluebird";
export default class GameService {


    static  getLast20Games = async (summonerName) => {
        try {

            const pUuid = await SummonerService.getSummonerPuuid(summonerName)
            const matchIds = await MatchService.getMatchIdsByPUuid(pUuid);

            return Promise.mapSeries(matchIds,async (matchId) => {
                return await MatchService.getMatchResultByMatchId(matchId, pUuid) ? "승리" : "패배;"
            })

        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    };

}