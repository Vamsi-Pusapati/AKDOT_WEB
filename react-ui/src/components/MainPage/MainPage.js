import React, { useEffect, useState } from 'react';
import './MainPage.css';
import portpic from './portpic2.png';  
import infoIcon from './infoIcon.png'; 
import WeatherComponent from './WeatherComponent';
import IncidentAlerts from './IncidentAlerts'; 
import { Tooltip } from 'react-tooltip'

function MainPage({ setActiveComponent }) {
  const [date, setDate] = useState(new Date());
  const [totalExpectedCars, setTotalExpectedCars] = useState(0);
  const [totalExpectedTrucks, setTotalExpectedTrucks] = useState(0);
  const [expectedCarsSoFar, setExpectedCarsSoFar] = useState(0);
  const [expectedTrucksSoFar, setExpectedTrucksSoFar] = useState(0);


  const currentHour = new Date().getHours();

  const baseUrl = process.env.REACT_APP_BACKEND_SERVER_URL;

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    // Fetch expected cars
    const fetchExpectedCars = async () => {
      try {
        const response = await fetch(baseUrl + '/dashboard/hourly_counts?vehicle=cars&day=0');
        if (!response.ok) {
          throw new Error('Failed to fetch data for cars');
        }
        const data = await response.json();
        
        if (data && data.Mean) { // Ensure data and Mean exist
          const totalCars = data.Mean.reduce((acc, curr) => acc + curr, 0); // Sum of all mean values for total cars
          const carsSoFar = data.Mean.slice(0, currentHour + 1).reduce((acc, curr) => acc + curr, 0); // Sum of mean values till current hour
          setTotalExpectedCars(totalCars);
          setExpectedCarsSoFar(carsSoFar);
        } else {
          console.error('Mean array is undefined or missing for cars');
        }
      } catch (error) {
        console.error('Error fetching expected cars:', error);
      }
    };
  
    // Fetch expected trucks
    const fetchExpectedTrucks = async () => {
      try {
        const response = await fetch(baseUrl+'/dashboard/hourly_counts?vehicle=trucks&day=0');
        if (!response.ok) {
          throw new Error('Failed to fetch data for trucks');
        }
        const data = await response.json();
        
        if (data && data.Mean) { // Ensure data and Mean exist
          const totalTrucks = data.Mean.reduce((acc, curr) => acc + curr, 0); // Sum of all mean values for total trucks
          const trucksSoFar = data.Mean.slice(0, currentHour + 1).reduce((acc, curr) => acc + curr, 0); // Sum of mean values till current hour
          setTotalExpectedTrucks(totalTrucks);
          setExpectedTrucksSoFar(trucksSoFar);
        } else {
          console.error('Mean array is undefined or missing for trucks');
        }
      } catch (error) {
        console.error('Error fetching expected trucks:', error);
      }
    };
  
    fetchExpectedCars();
    fetchExpectedTrucks();
  }, [currentHour]);

  const handleSubscribeClick = () => {
    setActiveComponent('Subscribe');
  };

  return (
    <div className="main-page">
      <div className="header-mainpage" style={{ backgroundImage: `url(${portpic})` }}>
        <div className="clock-and-date">
          <div className="clock">{date.toLocaleTimeString()}</div>
          <div className="date">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
      <div className="content">
        {/* ----------------- UPDATED ABOUT SECTION ----------------- */}
        <div className="about section">
          <div className="header">
            About the Portal 
            <a
              data-tooltip-id="aboutTip"
              data-tooltip-content="Learn about the key features and functionalities of the portal, including real-time updates, optimization tools, and other resources to enhance operational efficiency."
              className="tooltip-circle"
            >
              ?
            </a>
            <Tooltip id="aboutTip" place="top" effect="solid" className="custom-tooltip" />
          </div>
          <div className="section-contents-mp">
            <img
              src={infoIcon}
              style={{ display: 'flex', alignItems: 'center', marginLeft: '42%' }}
              alt="Info Icon"
            />
            <p>
              This portal provides advanced tools and features designed specifically to enhance the efficiency of landside operations 
              and collaboration among stakeholders at Port of Alaska. By integrating semi real-time data, simulation technologies, 
              and communication tools, the platform ensures everybody remains well-informed and equipped to optimize port activities.
            </p>

            <p><strong>Key Functionalities:</strong></p>
            <ul>
              <li>
                <strong>Incident and Maintenance Tracking:</strong> The system disseminates timely updates regarding any operational 
                disruptions or scheduled maintenance activities, allowing stakeholders to proactively manage and mitigate potential 
                impacts on port operations.
              </li>
              <li>
                <strong>Landside Operations Simulation:</strong> The simulation tool estimates the arrival rates and paths of various 
                vehicles entering the port, including trucks and cars. The simulation predicts key performance indicators such as vehicle 
                waiting times and turnaround times to provide valuable insights to enhance operational planning, port expansion policies, 
                and other managerial decision-makings.
              </li>
              <li>
                <strong>Traffic Analytics Dashboard:</strong> Interactive dashboards provide detailed insights into truck and car 
                movements and facilitates effective management of landside traffic. These dashboards support data-driven decisions 
                for enhancing landside operational efficiency for the current day and the next 7 days.
              </li>
              <li>
                <strong>Alternative Route Management:</strong> The portal simulates multiple alternative scenarios for potential roadblock 
                locations, categorized into short-term and long-term roadblocks. It evaluates key performance indicators for each 
                alternative, enabling informed decision-making to maintain efficient operations despite disruptions.
              </li>
              <li>
                <strong>Incident Communication Management:</strong> In case of incidents, the system notifies designated stakeholders, 
                providing essential details such as the location of the incident, the start time, estimated duration, recommended 
                mitigation actions, and ongoing operational status updates. This targeted communication ensures efficient coordination, 
                rapid response, and minimal operational disruption.
              </li>
            </ul>
          </div>
        </div>
        {/* ----------------- END UPDATED ABOUT SECTION ----------------- */}

        <div className="weather section">
          <div className="header">Traffic In Port

          <a data-tooltip-id="aboutTip" data-tooltip-content="Displays the total expected trucks and cars for the day that provides data-driven projections to monitor traffic flow at the port. Data-driven projections are forecasts based on historical data to anticipate future events, such as traffic flow."
               className="tooltip-circle">
               ?
            </a>
            <Tooltip id="aboutTip" place="top" effect="solid" className="custom-tooltip"/>
          </div>
          <div className="today-in-port">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-circle">{Math.round(totalExpectedTrucks)}</div>
                <span>Total Expected Trucks</span>
              </div>
              <div className="stat-item">
                <div className="stat-circle">{Math.round(totalExpectedCars)}</div>
                <span>Total Expected Cars</span>
              </div>
              <div className="stat-item">
                <div className="stat-circle">{Math.round(expectedTrucksSoFar)}</div>
                <span>Expected Trucks So Far</span>
              </div>
              <div className="stat-item">
                <div className="stat-circle">{Math.round(expectedCarsSoFar)}</div>
                <span>Expected Cars So Far</span>
              </div>
            </div>
          </div>
        </div>
        <div className="alerts section">
          <div className="header">Alerts
          <a data-tooltip-id="aboutTip" data-tooltip-content="Get important notifications about incidents, maintenance activities, and other critical updates that could impact port operations. Incidents refer to any unexpected event, such as roadblocks, breakdowns, or maintenance, that disrupt normal operations."
               className="tooltip-circle">
               ?
            </a>
            <Tooltip id="aboutTip" place="top" effect="solid" className="custom-tooltip"/>

          </div>
          <div className="section-contents-mp">
            <IncidentAlerts />
          </div>
        </div>
        <div className="useful-links section">
          <div className="header">Useful Links

          <a data-tooltip-id="aboutTip" data-tooltip-content="Quick access to important links related to port operations, including official websites and live traffic tracking."
               className="tooltip-circle">
               ?
            </a>
            <Tooltip id="aboutTip" place="top" effect="solid" className="custom-tooltip"/>
          </div>
          <div className="section-contents-mp">
            <ul>
              <li><a href="https://www.portofalaska.com/" target='_blank'>Port of Anchorage Official Site</a></li>
              <li><a href="https://511.alaska.gov/" target='_blank'>Alaska 511</a></li>
              <li><a href="https://www.muni.org/pages/default.aspx" target='_blank'>Municipality of Anchorage</a></li>
              <li><a href="https://dot.alaska.gov/amhs/index.shtml" target='_blank'>Alaska Marine Highway System</a></li>
              <li><a href="https://www.marinetraffic.com/" target='_blank'>Marine Traffic Global Ship Tracking</a></li>
            </ul>
            <div className=" subscribe-mp  section-contents-mp">
            <button onClick={handleSubscribeClick}>Subscribe</button>
          </div>
          </div>
        </div>
        <div className="subscribe-mp section">
          <div className="header">Weather Today
          <a data-tooltip-id="aboutTip" data-tooltip-content="Stay updated on current weather conditions at the port location, with temperature, wind speed, and humidity information to plan accordingly."
               className="tooltip-circle">
               ?
            </a>
            <Tooltip id="aboutTip" place="top" effect="solid" className="custom-tooltip"/>
          </div>
          <div className="section-contents-mp">
            <WeatherComponent />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
