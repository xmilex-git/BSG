const http = require("http");
const fs = require("fs");
const riotAPI = require("./RiotAPI");

const PORT = 3000;

function ShowPages(Player, win_list) {
  http
    .createServer((req, res) => {
      fs.readFile("./Front.html", "utf8", (err, data) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
          return;
        }

        let content = data;
        for (let i = 1; i <= 20; i++) {
          const placeholder = `{{w${i}}}`;
          const classPlaceholder = `{{w${i}-class}}`;
          const result = win_list[i - 1] ? "Win" : "Loose"; // Subtract 1 because arrays are 0-indexed
          const className = win_list[i - 1] ? "win" : "loose";

          content = content.replace(placeholder, result);
          content = content.replace(classPlaceholder, className);
        }
        content = content.replace("{{Player}}", Player);

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      });
    })
    .listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
}

async function main() {
  const summoner = "디도리탕";
  const puuid = await riotAPI.getPuuid(summoner);
  const matchIds = await riotAPI.getLast20MatchIds(puuid);
  const win_list = await riotAPI.getMatchResults(matchIds, puuid);
  ShowPages(summoner, win_list);
}

main();
