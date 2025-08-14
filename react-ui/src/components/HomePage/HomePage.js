import './HomePage.css';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScenarioAnalysis from '../ScenarioAnalysis/ScenarioAnalysis';
import MainPage from '../MainPage/MainPage';
import Dashboard from '../Dashboard/Dashboard';
import Subscribe from '../Subscribe/Subscribe';
import IncidentMaintenance from '../IncidentMaintenance/IncidentMaintenance';

function HomePage() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // <-- Track admin status
  const [activeComponent, setActiveComponent] = useState('Main Page');

  const baseuri = process.env.REACT_APP_BACKEND_SERVER_URL;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const session_token = localStorage.getItem('akdot_session_token');
        const username = localStorage.getItem('akdot_username');
        setUserName(username);

        // Check if user is authenticated
        const res = await fetch(baseuri + `/is_authenticated`, {
          headers: {
            'session-token': session_token,
          },
        });

        // If not authenticated, redirect to login
        if (res.status === 401) {
          navigate('/loginpage');
          return;
        }

        // Otherwise, set user data
        setUser(res.data);

        // Fetch user role and set isAdmin
        const roleResponse = await fetch(baseuri + '/userdetails?username=' + username);
        const roleData = await roleResponse.json();

        if (roleResponse.ok && roleData.response.group === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/loginpage');
      }
    })();
  }, [baseuri, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('akdot_session_token');
    localStorage.removeItem('akdot_username');
    navigate('/loginpage');
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="component-name">{activeComponent || 'Welcome'}</div>
        <div className="user-section">
          <span className="login-name">{userName}</span>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="nav-buttons">
        <button onClick={() => setActiveComponent('Main Page')}>Main Page</button>
        <button onClick={() => setActiveComponent('Dashboard')}>Dashboards</button>
        <button onClick={() => setActiveComponent('Incident & Maintenance')}>
          Incident & Maintenance
        </button>
        {/* Only show Scenario Analysis button if user is admin */}
        {isAdmin && (
          <button onClick={() => setActiveComponent('Scenario Analysis')}>
            Scenario Analysis
          </button>
        )}
        <button onClick={() => setActiveComponent('Subscribe')}>Subscribe</button>
      </nav>

      <main>
        {activeComponent === 'Main Page' && <MainPage setActiveComponent={setActiveComponent} />}
        {activeComponent === 'Dashboard' && <Dashboard />}
        {activeComponent === 'Incident & Maintenance' && <IncidentMaintenance />}
        {activeComponent === 'Subscribe' && <Subscribe />}
        
        {/* Only render the Scenario Analysis component if user is admin */}
        {activeComponent === 'Scenario Analysis' && isAdmin && <ScenarioAnalysis />}
      </main>
    </div>
  );
}

export default HomePage;
