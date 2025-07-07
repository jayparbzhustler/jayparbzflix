import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

// Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MoviesPage from './components/MoviesPage';
import TVShowsPage from './components/TVShowsPage';
import MyListPage from './components/MyListPage';
import SearchPage from './components/SearchPage';
import PlayerPage from './components/PlayerPage';
import ProfilePage from './components/ProfilePage';

// Context
import { DataProvider } from './context/DataContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl font-bold mb-4">JayParbzFlix</div>
          <div className="text-white text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVShowsPage />} />
            <Route path="/my-list" element={<MyListPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/watch/:type/:id" element={<PlayerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
