import React, { useState } from 'react';

interface HeroStats {
  hero_id: number;
  localized_name: string;
  name: string;
  pro_pick: number;
  pro_ban: number;
  pro_win: number;
}

const DotaRankings: React.FC = () => {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [rankingType, setRankingType] = useState<string>('popularity');

  const loadRankings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.opendota.com/api/heroStats');
      
      if (!response.ok) {
        throw new Error('Failed to load hero stats');
      }

      const heroStats: HeroStats[] = await response.json();
      displayHeroesRanking(heroStats, rankingType);

    } catch (error) {
      console.error('Error loading rankings:', error);
      setError('Failed to load rankings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const displayHeroesRanking = (heroStats: HeroStats[], rankingType: string) => {
    let sortedHeroes = [...heroStats];
    
    switch (rankingType) {
      case 'popularity':
        sortedHeroes.sort((a, b) => (b.pro_pick + b.pro_ban) - (a.pro_pick + a.pro_ban));
        break;
      case 'winrate':
        sortedHeroes.sort((a, b) => {
          const aWinrate = (a.pro_win / a.pro_pick) || 0;
          const bWinrate = (b.pro_win / b.pro_pick) || 0;
          return bWinrate - aWinrate;
        });
        break;
      case 'matches':
        sortedHeroes.sort((a, b) => b.pro_pick - a.pro_pick);
        break;
    }

    const topHeroes = sortedHeroes.slice(0, 10);
    
    if (topHeroes.length === 0) {
      setError('No ranking data available');
      return;
    }

    setRankings(topHeroes.map((hero, index) => ({
      ...hero,
      rank: index + 1,
      winrate: hero.pro_pick > 0 ? ((hero.pro_win / hero.pro_pick) * 100).toFixed(1) : '0.0'
    })));
  };

  const getHeroImageUrl = (hero: HeroStats) => {
    if (hero.name) {
      const heroName = hero.name.replace('npc_dota_hero_', '');
      return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${heroName}.png`;
    }
    return '';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#f1c40f';
    if (rank === 2) return '#bdc3c7';
    if (rank === 3) return '#cd7f32';
    return '#0366d6';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏆';
  };

  const getRankingDescription = (rankingType: string) => {
    const descriptions: { [key: string]: string } = {
      'popularity': 'Based on total picks and bans in professional Dota 2 matches',
      'winrate': 'Heroes with the highest win rate in professional matches',
      'matches': 'Heroes played in the most professional matches'
    };
    return descriptions[rankingType] || 'Professional Dota 2 statistics';
  };

  const clearData = () => {
    setRankings([]);
    setError('');
  };

  return (
    <main className="main-content">
      <div className="container">
        <h2>Dota 2 Hero Rankings</h2>

        <div className="controls">
          <label htmlFor="rankingType">Ranking Type:</label>
          <select 
            id="rankingType" 
            value={rankingType}
            onChange={(e) => setRankingType(e.target.value)}
            disabled={loading}
          >
            <option value="popularity">Most Popular Heroes</option>
            <option value="winrate">Highest Win Rate</option>
            <option value="matches">Most Played</option>
          </select>

          <button id="loadRankings" className="btn" onClick={loadRankings} disabled={loading}>
            Load Rankings
          </button>
          <button id="clearRankings" className="btn btn-secondary" onClick={clearData}>
            Clear
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '-1.5rem', marginBottom: '1.0rem' }}>
          API работает только с VPN
        </p>

        <div id="loading" className={`loading ${loading ? '' : 'hidden'}`}>
          <div className="spinner"></div>
          <p>Loading Dota 2 rankings...</p>
        </div>

        <div id="error" className={`error ${error ? '' : 'hidden'}`}>
          <p>{error}</p>
        </div>

        <div id="rankingsContainer" className="facts-container">
          {rankings.length > 0 && (
            <div className="fact-card">
              <h3 style={{ color: '#586069', margin: '0.5rem 0 0 0' }}>
                {getRankingDescription(rankingType)}
              </h3>
            </div>
          )}
          
          {rankings.map((hero) => (
            <div key={hero.hero_id} className={`fact-card ${hero.rank <= 3 ? `rank-${hero.rank}` : ''}`}>
              <div 
                className="fact-number" 
                style={{ 
                  color: getRankColor(hero.rank), 
                  borderLeftColor: getRankColor(hero.rank) 
                }}
              >
                {getRankIcon(hero.rank)} Rank #{hero.rank}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src={getHeroImageUrl(hero)} 
                  alt={hero.localized_name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    border: `2px solid ${getRankColor(hero.rank)}`
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextSibling = target.nextElementSibling as HTMLElement;
                    if (nextSibling) nextSibling.style.display = 'flex';
                  }}
                />
                <div 
                  className="hero-avatar"
                  style={{
                    display: 'none',
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    border: `2px solid ${getRankColor(hero.rank)}`,
                    background: 'linear-gradient(45deg, #0366d6, #764ba2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem'
                  }}
                >
                  🎮
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="repo-name">{hero.localized_name}</h3>
                  <p className="repo-description">
                    {rankingType === 'popularity' && `Popularity: ${(hero.pro_pick + hero.pro_ban).toLocaleString()} games`}
                    {rankingType === 'winrate' && `Win Rate: ${hero.winrate}%`}
                    {rankingType === 'matches' && `Matches: ${hero.pro_pick.toLocaleString()}`}
                  </p>
                  <div className="repo-stats">
                    <span className="stat">📊 {hero.winrate}% win rate</span>
                    <span className="stat">🎯 {hero.pro_pick?.toLocaleString() || 0} picks</span>
                    <span className="stat">🚫 {hero.pro_ban?.toLocaleString() || 0} bans</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DotaRankings;