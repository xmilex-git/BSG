import React, { useState } from 'react';
import './App.css';

function App() {
  const [summoner, setSummoner] = useState<string>('');
  const [displayedSummoner, setDisplayedSummoner] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayedSummoner(summoner);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BSG</h1>
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            value={summoner}
            onChange={(e) => setSummoner(e.target.value)}
            placeholder="소환사 이름 입력"
          />
          <button type="submit">검색</button>
        </form>
        {displayedSummoner && (
          <div>
            <h2>{displayedSummoner}</h2>
            <p>여기에 {displayedSummoner}의 게임 통계를 표시합니다.</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
