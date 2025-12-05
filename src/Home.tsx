import React from 'react';

const Home: React.FC = () => {
  return (
    <div>
      <div className="hero">
        <h1>API Explorer Hub</h1>
        <p>Исследуйте различные API и находите интересную информацию о Github репозиториях, аниме и доте2</p>
      </div>

      <main className="main-content">
        <div className="apps-grid">
          <div className="app-card">
            <div className="app-icon"></div>
            <h3>GitHub Repositories</h3>
            <p>Откройте для себя самые популярные репозитории GitHub с подробной информацией о звездах, форках и языках программирования.</p>
            <a href="/github-repos" className="app-link">Explore Repos</a>
          </div>
          
          <div className="app-card">
            <div className="app-icon"></div>
            <h3>Anime Facts</h3>
            <p>Получите интересные факты и информацию о популярных аниме, включая рейтинг, жанры, год выхода и описание.</p>
            <a href="/anime-facts" className="app-link">Explore Anime</a>
          </div>

          <div className="app-card">
            <div className="app-icon"></div>
            <h3>Dota 2 Rankings</h3>
            <p>Изучайте рейтинг героев Dota 2. Узнайте лучших героев по популярности и количеству побед. Для загрузки данных необходимо использовать VPN.</p>
            <a href="/dota-rankings" className="app-link">View Rankings</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;