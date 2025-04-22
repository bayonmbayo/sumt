import { connect } from 'react-redux';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import NewTransfer from './components/NewTransfer';
import { PasswortVergessen } from './components/PasswortVergessen';
import Registrieren from './components/Registrierung';
import Settings from './components/Settings';
import ViewTransfer from './components/ViewTransfer';

function App() {
  return (
    <BrowserRouter basename="/sumt">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrieren" element={<Registrieren />} />
        <Route path="/passwortvergessen" element={<PasswortVergessen />} />
        <Route path="/transfers" element={<Home />} />
        <Route path="/transfer/:transfer" element={<ViewTransfer />} />
        <Route path="/new" element={<NewTransfer />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

const connectedApp = connect(null)(App);
export { connectedApp as App };
