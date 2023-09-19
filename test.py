import requests
import json
import os

class RiotAPI:
    BASE_URL = "https://kr.api.riotgames.com"
    ASIA_URL = "https://asia.api.riotgames.com"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5.2 Safari/605.1.15",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://developer.riotgames.com"
    }

    def __init__(self, api_key):
        self.api_key = api_key
        self.HEADERS["X-Riot-Token"] = self.api_key
        self.cache = {}
        # 캐시 로드
        self.load_from_file()

    def load_from_file(self, filename="data.json"):
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as file:
                self.cache = json.load(file)

    def get_summoner_info(self, summoner_name: str):
        if summoner_name in self.cache:
            return self.cache[summoner_name]
        
        url = f"{self.BASE_URL}/lol/summoner/v4/summoners/by-name/{summoner_name}"
        response = requests.get(url, headers=self.HEADERS)
        data = response.json()
        self.cache[summoner_name] = data
        
        return data

    def get_match_ids(self, puuid: str, start: int, count: int):
        cache_key = f"match_ids_{puuid}_{start}_{count}"
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        url = f"{self.ASIA_URL}/lol/match/v5/matches/by-puuid/{puuid}/ids?start={start}&count={count}"
        response = requests.get(url, headers=self.HEADERS)
        data = response.json()
        self.cache[cache_key] = data
        
        return data

    def get_match_info_by_match_id(self, match_id: str):
        if match_id in self.cache:
            return self.cache[match_id]
        
        url = f"{self.ASIA_URL}/lol/match/v5/matches/{match_id}"
        response = requests.get(url, headers=self.HEADERS)
        data = response.json()
        self.cache[match_id] = data
        
        return data

    def save_to_file(self, filename="data.json"):
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(self.cache, file, ensure_ascii=False, indent=4)

    @staticmethod
    def is_player_win(puuid: str, match_info):
        for participant in match_info['info']['participants']:
            if participant['puuid'] == puuid:
                return participant['win'] == True

if __name__ == '__main__':
    with open('API_KEY', 'r') as f:
        API_KEY = f.readline().rstrip()
    api = RiotAPI(API_KEY)
    summoner_data = api.get_summoner_info("BicDixMan")
    matches = api.get_match_ids(summoner_data['puuid'], 0, 20)
    for match_id in matches:
        match_info = api.get_match_info_by_match_id(match_id)
        if RiotAPI.is_player_win(summoner_data['puuid'], match_info):
            print("승")
        else:
            print("패")
    
    api.save_to_file()  # 캐시 데이터를 파일로 저장
