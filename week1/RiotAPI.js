const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Constants
const RIOT_API_KEY = "RGAPI-e436417a-5f65-448e-9325-3ced74531f15"; // Your Riot API key
const BASE_URL_SUMMONER =
  "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name";
const BASE_URL_MATCH = "https://asia.api.riotgames.com/lol/match/v5/matches";

// Headers
const headers = {
  "X-Riot-Token": RIOT_API_KEY,
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
  "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://developer.riotgames.com",
};

//! Setup axios instance with headers
const apiClient = axios.create({
  headers: headers,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getLast20Games(summonerName) {
  try {
    //! Step 1: 소환사 명으로 puuid 받아오기
    const summonerResponse = await apiClient.get(
      `${BASE_URL_SUMMONER}/${summonerName}`
    );
    const puuid = summonerResponse.data.puuid;
    console.log(puuid);
    await sleep(200); //* 라이엇 서버에서 받아오는 시간차 고려

    //! Step 2: puuid로 최근 20 게임 matchId list 형식으로 받기
    const matchIdsResponse = await apiClient.get(
      `${BASE_URL_MATCH}/by-puuid/${puuid}/ids?start=0&count=20`
    );
    const matchIds = matchIdsResponse.data;
    console.log(matchIds);

    //! Step 3: matchId 20개를 하나씩 검색해서 match 정보 중 win = boolean값 받기
    const matchResults = [];
    for (const matchId of matchIds) {
      const matchDetailsResponse = await apiClient.get(
        `${BASE_URL_MATCH}/${matchId}`
      );
      const participant = matchDetailsResponse.data.info.participants.find(
        (p) => p.puuid === puuid
      );
      let result = participant.win;
      matchResults.push(result);
      console.log(result);
      // await sleep(10); //* 사실 이거 쓸 필요 없었네
    }
    console.log(matchResults);
    return matchResults;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

const http = require("http");
const fs = require("fs");

const PORT = 3000;

async function ShowPages(Player, win_list) {
  http
    .createServer((req, res) => {
      fs.readFile("./week1.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");

          return;
        }

        let content = data;
        for (let i = 1; i <= 20; i++) {
          const placeholder = `{{w${i}}}`;
          const classPlaceholder = `{{w${i}-class}}`;
          const result = win_list[i - 1] ? "Win" : "Loose";
          const className = win_list[i - 1] ? "win" : "loose";

          content = content.replace(placeholder, result);
          content = content.replace(classPlaceholder, className);
        }
        content = content.replace("{{Player}}", Player);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      });
    })
    .listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
}

async function main() {
  // console.log("Input Summor's name : ");
  const summoner = "디도리탕";
  const win_list = await getLast20Games(summoner);
  ShowPages(summoner, win_list);
}

main();
