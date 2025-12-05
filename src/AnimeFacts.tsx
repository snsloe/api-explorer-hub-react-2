import React, { useState, useEffect } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface AnimeDetail {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
  background: string;
  aired: {
    from: string;
  };
  genres: Array<{ name: string }>;
  studios: Array<{ name: string }>;
  rating: string;
  themes: Array<{ name: string }>;
  demographics: Array<{ name: string }>;
  score: number;
  episodes: number;
  status: string;
}

interface AnimeFact {
  fact_id: number;
  fact: string;
}

const AnimeFacts: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<string>('');
  const [facts, setFacts] = useState<AnimeFact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [factCount, setFactCount] = useState<string>('5');

  useEffect(() => {
    const loadAnimeList = async () => {
      setLoading(true);

      try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=20');

        if (!response.ok) {
          throw new Error(`API error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.data) {
          setAnimes(data.data);
          if (data.data.length > 0) {
            setSelectedAnime(data.data[0].mal_id.toString());
          }
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        console.error('Error loading anime list:', error);
        setError('Failed to load anime list. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAnimeList();
  }, []);

  const loadAnimeFacts = async () => {
    if (!selectedAnime) {
      setError('Please select an anime first!');
      return;
    }

    setLoading(true);
    setError('');
    setFacts([]);

    try {
      const selectedAnimeData = animes.find(a => a.mal_id.toString() === selectedAnime);

      if (!selectedAnimeData) {
        throw new Error('Selected anime not found');
      }

      const response = await fetch(`https://api.jikan.moe/v4/anime/${selectedAnime}`);

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }

      const data = await response.json();
      displayAnimeInfo(data.data, selectedAnimeData, parseInt(factCount));

    } catch (error) {
      console.error('Error loading anime facts:', error);
      setError('Failed to load anime information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateFactsFromData = (anime: AnimeDetail, count: number): AnimeFact[] => {
    const facts: AnimeFact[] = [];

    if (anime.synopsis) {
      facts.push({
        fact_id: 1,
        fact: `Synopsis: ${anime.synopsis.substring(0, 200)}...`
      });
    }

    if (anime.background) {
      facts.push({
        fact_id: 2,
        fact: `Background: ${anime.background.substring(0, 150)}...`
      });
    }

    if (anime.aired?.from) {
      const date = new Date(anime.aired.from).getFullYear();
      facts.push({
        fact_id: 3,
        fact: `First aired in ${date}`
      });
    }

    if (anime.genres?.length > 0) {
      const genres = anime.genres.map(g => g.name).join(', ');
      facts.push({
        fact_id: 4,
        fact: `Genres: ${genres}`
      });
    }

    if (anime.studios?.length > 0) {
      const studios = anime.studios.map(s => s.name).join(', ');
      facts.push({
        fact_id: 5,
        fact: `Studio: ${studios}`
      });
    }

    if (anime.rating) {
      facts.push({
        fact_id: 6,
        fact: `Rating: ${anime.rating}`
      });
    }

    if (anime.themes?.length > 0) {
      const themes = anime.themes.map(t => t.name).join(', ');
      facts.push({
        fact_id: 7,
        fact: `Themes: ${themes}`
      });
    }

    if (anime.demographics?.length > 0) {
      const demographics = anime.demographics.map(d => d.name).join(', ');
      facts.push({
        fact_id: 8,
        fact: `Demographic: ${demographics}`
      });
    }

    return facts.slice(0, count);
  };

  const displayAnimeInfo = (animeDetail: AnimeDetail, animeBasic: Anime, factCount: number) => {
    const facts = generateFactsFromData(animeDetail, factCount);
    setFacts(facts);
  };

  const clearData = () => {
    setFacts([]);
    setError('');
  };

  return (
    <main className="main-content">
      <div className="container">
        <h2>Random Anime Facts</h2>
        
        <div className="controls">
          <label htmlFor="animeSelect">Select Anime:</label>
          <select 
            id="animeSelect" 
            value={selectedAnime}
            onChange={(e) => setSelectedAnime(e.target.value)}
            disabled={loading}
          >
            {animes.length === 0 ? (
              <option value="">Select an anime...</option>
            ) : (
              <>
                <option value="">Select an anime...</option>
                {animes.map((anime) => (
                  <option key={anime.mal_id} value={anime.mal_id.toString()}>
                    {anime.title}
                  </option>
                ))}
              </>
            )}
          </select>
          
          <label htmlFor="factCount">Facts to show:</label>
          <select 
            id="factCount" 
            value={factCount}
            onChange={(e) => setFactCount(e.target.value)}
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="7">7</option>
          </select>
          
          <button id="loadFacts" className="btn" onClick={loadAnimeFacts} disabled={loading}>
            Get Anime Facts!
          </button>
          <button id="clearFacts" className="btn btn-secondary" onClick={clearData}>
            Clear
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', marginTop: '-1.5rem', marginBottom: '1.0rem' }}>
          Если некоторые картинки не загружаются, стоит использовать VPN
        </p>

        
        <div id="loading" className={`loading ${loading ? '' : 'hidden'}`}>
          <div className="spinner"></div>
          <p>Loading anime facts...</p>
        </div>

        
        <div id="error" className={`error ${error ? '' : 'hidden'}`}>
          <p>{error}</p>
        </div>

        <div id="factsContainer" className="facts-container">
          {facts.map((fact, index) => (
            <div key={index} className="fact-card">
              <div className="fact-number">Fact #{fact.fact_id}</div>
              <div className="fact-text">{fact.fact}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AnimeFacts;