import SummonerService from "./SummonerService.js";
import MatchService from "./MatchService.js";
import Bluebird from "bluebird";
export default class GameService {
  static getLast20Games = async (summonerName) => {
    try {
      const pUuid = await SummonerService.getSummonerPuuid(summonerName);
      console.log("pUuid Check: ", pUuid);
      const matchIds = await MatchService.getMatchIdsByPUuid(pUuid);
      console.log("matchIds Check: ", matchIds);

      const tmp_ = await Bluebird.map(
        matchIds,
        async (matchId) => {
          return await MatchService.getMatchResultByMatchId(matchId, pUuid);
        },
        { concurrency: 1 }
      );
      console.log("matchIds info: ", tmp_);

      return tmp_;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
}
