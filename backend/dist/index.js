"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = 3000;
class RiotAPI {
    getSummonerInfo(summoner_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${RiotAPI.BASE_URL}/lol/summoner/v4/summoners/by-name/${summoner_name}`, { headers: RiotAPI.HEADERS });
            return response.data;
        });
    }
    getMatchIds(puuid, start, count) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${RiotAPI.ASIA_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`, { headers: RiotAPI.HEADERS });
            return response.data;
        });
    }
    getMatchInfoByMatchId(match_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${RiotAPI.ASIA_URL}/lol/match/v5/matches/${match_id}`, { headers: RiotAPI.HEADERS });
            return response.data;
        });
    }
}
RiotAPI.BASE_URL = "https://kr.api.riotgames.com";
RiotAPI.ASIA_URL = "https://asia.api.riotgames.com";
RiotAPI.HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
    "Accept-Language": "ko-KR,ko;q=0.9",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com",
    "X-Riot-Token": process.env.REACT_APP_RIOT_API_KEY
};
const riotAPI = new RiotAPI();
app.get('/recent-matches/:summonerName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summonerData = yield riotAPI.getSummonerInfo(req.params.summonerName);
        console.log(`summoner Data : ${summonerData}`);
        const matches = yield riotAPI.getMatchIds(summonerData.puuid, 0, 10); // 최근 10 경기
        const matchDetails = [];
        for (const match_id of matches) {
            const matchInfo = yield riotAPI.getMatchInfoByMatchId(match_id);
            matchDetails.push(matchInfo);
        }
        res.json(matchDetails);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: 'Internal Server Error', error: err.message });
        }
        else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}));
app.get('/ping', (req, res) => {
    res.send('pong');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
