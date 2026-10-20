import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DecksPage from './pages/DecksPage';
import DeckDetailPage from './pages/DeckDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="app-container" style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#2c3e50',
        color: '#fff'
      }}>
        <h2 style={{ margin: 0 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Tandem</Link>
        </h2>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          <Link to="/play" style={{ color: '#fff', textDecoration: 'none' }}>Play</Link>
          <Link to="/leaderboard" style={{ color: '#fff', textDecoration: 'none' }}>Leaderboard</Link>
          <Link to="/decks" style={{ color: '#fff', textDecoration: 'none' }}>Decks</Link>
          <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
        </nav>
      </header>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/decks/:id" element={<DeckDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
