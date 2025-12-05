import React, { useState } from 'react';

interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
}

const GitHubRepos: React.FC = () => {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [repoCount, setRepoCount] = useState<string>('5');

    const loadGitHubData = async () => {
        const count = repoCount;
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `https://api.github.com/search/repositories?q=stars:>1000&sort=stars&order=desc&per_page=${count}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`GitHub API error! status: ${response.status}`);
            }

            const data = await response.json();
            setRepos(data.items || []);
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            setError('Failed to load GitHub data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearData = () => {
        setRepos([]);
        setError('');
    };

    return (
        <main className="main-content">
            <div className="container">
                <h2>Popular GitHub Repositories</h2>

                <div className="controls">
                    <label htmlFor="repoCount">Number of repos:</label>
                    <select
                        id="repoCount"
                        value={repoCount}
                        onChange={(e) => setRepoCount(e.target.value)}
                    >
                        <option value="3">3</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>

                    <button id="loadRepos" className="btn" onClick={loadGitHubData} disabled={loading}>
                        Get Repositories!
                    </button>
                    <button id="clearRepos" className="btn btn-secondary" onClick={clearData}>
                        Clear
                    </button>
                </div>

                <div id="loading" className={`loading ${loading ? '' : 'hidden'}`}>
                    <div className="spinner"></div>
                    <p>Loading GitHub repositories...</p>
                </div>

                <div id="error" className={`error ${error ? '' : 'hidden'}`}>
                    <p>{error}</p>
                </div>

                <div id="reposContainer" className="facts-container">
                    {repos.map((repo, index) => (
                        <div key={repo.id} className="fact-card">
                            <div className="fact-number">Repository #{index + 1}</div>
                            <h3 className="repo-name">{repo.name}</h3>
                            <p className="repo-description">{repo.description || 'No description available'}</p>
                            <div className="repo-stats">
                                <span className="stat">⭐ {repo.stargazers_count.toLocaleString()} stars</span>
                                <span className="stat">🍴 {repo.forks_count.toLocaleString()} forks</span>
                                <span className="stat">{repo.language || 'Not specified'}</span>
                            </div>
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="repo-link"
                            >
                                View on GitHub
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default GitHubRepos;