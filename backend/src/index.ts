import express from 'express';
import axios from 'axios';
import fs from 'fs';

const app = express();
const PORT = 3000;◊

class RiotAPI {
    private static readonly BASE_URL = "https://kr.api.riotgames.com";
    private static readonly ASIA_URL = "https://asia.api.riotgames.com";
    private static readonly HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://developer.riotgames.com",
        "X-Riot-Token": process.env.REACT_APP_RIOT_API_KEY
    };

    async getSummonerInfo(summoner_name: string) {
        const response = await axios.get(`${RiotAPI.BASE_URL}/lol/summoner/v4/summoners/by-name/${summoner_name}`, { headers: RiotAPI.HEADERS });
        return response.data;
    }

    async getMatchIds(puuid: string, start: number, count: number) {
        const response = await axios.get(`${RiotAPI.ASIA_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`, { headers: RiotAPI.HEADERS });
        return response.data;
    }

    async getMatchInfoByMatchId(match_id: string) {
        const response = await axios.get(`${RiotAPI.ASIA_URL}/lol/match/v5/matches/${match_id}`, { headers: RiotAPI.HEADERS });
        return response.data;
    }
}

const riotAPI = new RiotAPI();

app.get('/recent-matches/:summonerName', async (req, res) => {
    try {
        const summonerData = await riotAPI.getSummonerInfo(req.params.summonerName);
        console.log(`summoner Data : ${summonerData}`);
        const matches = await riotAPI.getMatchIds(summonerData.puuid, 0, 10); // 최근 10 경기
        
        const matchDetails = [];
        for (const match_id of matches) {
            const matchInfo = await riotAPI.getMatchInfoByMatchId(match_id);
            matchDetails.push(matchInfo);
        }

        res.json(matchDetails);
    } catch (err) {
        if (err instanceof Error) {
                res.status(500).json({ message: 'Internal Server Error', error: err.message });
        } else {
        res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

app.get('/ping', (req, res) => {
        res.send('pong');
    });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});