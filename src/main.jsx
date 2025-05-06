import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import Heroes from './pages/heroes.jsx';
import Maps from './pages/maps.jsx';
import Patches from './pages/patches.jsx';
import './index.css';
import { Provider } from './components/ui/provider.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/heroes" element={<Heroes />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/patches" element={<Patches />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);