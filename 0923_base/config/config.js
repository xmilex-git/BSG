import dotenv from "dotenv";
dotenv.config();

//! Your Riot API key
export const RIOT_API_KEY = process.env.RIOT_API_KEY;
export const BASE_URL_SUMMONER = process.env.BASE_URL_SUMMONER;
export const BASE_URL_MATCH = process.env.BASE_URL_MATCH;


//! Headers
export const HEADERS = {
    "X-Riot-Token": RIOT_API_KEY,
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    Origin: "https://developer.riotgames.com",
};

const utils = {
    RIOT_API_KEY,
    BASE_URL_SUMMONER,
    BASE_URL_MATCH,
    HEADERS,
};

export default utils;
