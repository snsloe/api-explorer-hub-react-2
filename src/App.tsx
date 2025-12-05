import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import GitHubRepos from './GitHubRepos';
import AnimeFacts from './AnimeFacts';
import DotaRankings from './DotaRankings';
import './index.css';

const App: React.FC = () => {
    return (
        <Router>
            <div id="app">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/github-repos" element={<GitHubRepos />} />
                    <Route path="/anime-facts" element={<AnimeFacts />} />
                    <Route path="/dota-rankings" element={<DotaRankings />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;