import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import useAuth from './hooks/useAuth';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import DecksPage from './pages/DecksPage';
import DeckDetailPage from './pages/DeckDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user, loading } = useAuth();

  return (
    <div className="app-container" style={{ fontFamily: 'sans-serif', minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      <NavBar user={user} loading={loading} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/play" element={<PlayPage user={user} />} />
          <Route path="/results" element={<ResultsPage user={user} />} />
          <Route path="/leaderboard" element={<LeaderboardPage user={user} />} />
          <Route path="/decks" element={<DecksPage user={user} />} />
          <Route path="/decks/:id" element={<DeckDetailPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
