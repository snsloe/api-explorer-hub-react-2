import React from 'react';
import { Link } from 'react-router-dom';

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
                        <Link to="github-repos" className="app-link">Explore Repos</Link>
                    </div>

                    <div className="app-card">
                        <div className="app-icon"></div>
                        <h3>Anime Facts</h3>
                        <p>Получите интересные факты и информацию о популярных аниме, включая рейтинг, жанры, год выхода и описание.</p>
                        <Link to="anime-facts" className="app-link">Explore Anime</Link>
                    </div>

                    <div className="app-card">
                        <div className="app-icon"></div>
                        <h3>Dota 2 Rankings</h3>
                        <p>Изучайте рейтинг героев Dota 2. Узнайте лучших героев по популярности и количеству побед. Для загрузки данных необходимо использовать VPN.</p>
                        <Link to="dota-rankings" className="app-link">View Rankings</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;