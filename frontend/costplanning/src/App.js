import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import HomePage from "./components/HomePage";
import SettingsPage from "./components/SettingsPage";
import StatisticsPage from "./components/StatisticsPage";
import SearchPage from "./components/SearchPage";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

const App = ({ podaci }) => {
  const [user, setUser] = useState(null);
  const padding = { padding: 5, color: '#cccccc' };

  const changeUser = (ime) => {
    setUser(ime);
  };

  useEffect(() => {
    const prijavljeni = window.localStorage.getItem("prijavljeniKorisnik");
    if (prijavljeni) {
      const korisnik = JSON.parse(prijavljeni);
      setUser(korisnik.ime);
    }
  }, []);

  const brisiLocalStorage = () => {
    localStorage.removeItem("prijavljeniKorisnik");
    document.location.reload();
  };

  return (
    <div>
      <Router>
        <div>
          <Navbar bg="dark" variant="dark">
            <div className="container">
              <Navbar.Brand href="/">costPlanning</Navbar.Brand>
              <Nav className="mr-auto">
                <NavLink style={padding} to="/">Home</NavLink>
                <NavLink style={padding} to="/settings">Settings</NavLink>
                <NavLink style={padding} to="/statistics">Statistics</NavLink>
                <NavLink style={padding} to="/search">Search</NavLink>
              </Nav>
              <Form inline>
                {user === null ? null : (
                  <>
                    <h5 style={{ color: "white" }}>{user}</h5>&nbsp;
                    <Button variant="outline-info" onClick={brisiLocalStorage}>Logout</Button>
                  </>
                )}
              </Form>
            </div>
          </Navbar>
          <Routes>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/" element={<HomePage podaci={podaci} changeUser={changeUser} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;