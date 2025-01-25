import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppRoot, Tabbar } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { Home as HomeIcon, Book, Settings as SettingsIcon } from 'lucide-react';
import Practice from './pages/Practice';
import Home from './pages/Home';
import Settings from './pages/Settings';
import './index.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <div className='page'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      <Tabbar>
        <Tabbar.Item
          text="Home"
          onClick={() => navigate('/')}
          selected={location.pathname === '/'}
        >
          <HomeIcon size={24} />
        </Tabbar.Item>
        <Tabbar.Item
          text="Practice"
          onClick={() => navigate('/practice')}
          selected={location.pathname === '/practice'}
        >
          <Book size={24} />
        </Tabbar.Item>
        <Tabbar.Item
          text="Settings"
          onClick={() => navigate('/settings')}
          selected={location.pathname === '/settings'}
        >
          <SettingsIcon size={24} />
        </Tabbar.Item>
      </Tabbar>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRoot className='app'>
      <Router basename="/deutsch-flash-cards">
        <App />
      </Router>
    </AppRoot>
  </React.StrictMode>
);