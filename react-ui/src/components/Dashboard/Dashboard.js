import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import mapImage from './poa.png';
import Plot from 'react-plotly.js';
import DashboardMapComponent from '../MapComponent/DashboardMap';
import { Tooltip } from 'react-tooltip'

const helpData = {
  cycleTime: {
    title: "Cycle Time Module Help",
    content: (
      <>
        <p>
          <strong>Cycle Time</strong> represents the total duration a truck spends in port from the moment it enters until it departs. It is typically measured in minutes and reflects the efficiency of port operations.
        </p>

        <h4>Importance</h4>
        <ul>
          <li>
            <strong>Operational Efficiency:</strong> Monitoring average and maximum cycle times helps identify bottlenecks, optimize gate processes, and reduce overall congestion.
          </li>
          <li>
            <strong>Resource Allocation:</strong> Knowing peak hours or areas with higher cycle times can guide better staffing and equipment allocation.
          </li>
          <li>
            <strong>Performance Benchmarking:</strong> Tracking changes in cycle times over days, weeks, or months can highlight trends and areas needing improvement.
          </li>
        </ul>

        <h4>Key Definitions</h4>
        <ul>
          <li>
            <strong>Average Cycle Time:</strong> The average of all recorded cycle times within a specified period or hour of the day.
          </li>
          <li>
            <strong>Maximum Cycle Time:</strong> The longest cycle time recorded during the same period.
          </li>
        </ul>

        <h4>Use Cases</h4>
        <ol>
          <li>
            <strong>Gate Operations:</strong> Gate supervisors can use this data to identify peak congestion times and allocate staff more effectively.
          </li>
          <li>
            <strong>Yard Management:</strong> Yard planners can detect delays in yard handling processes (e.g., container loading/unloading).
          </li>
          <li>
            <strong>Transport Coordination:</strong> Trucking companies can plan arrivals based on historical cycle time data to minimize waiting.
          </li>
        </ol>

        <h4>How to Use This Module</h4>
        <ol>
          <li>
            <strong>Hour-by-Hour Analysis:</strong> Hover over the chart to see detailed cycle time statistics (average and maximum) for each hour of the day.
          </li>
          <li>
            <strong>Filtering Options:</strong>
            <ul>
              <li>
                <strong>Date Range:</strong> Select a specific day to analyze cycle times over different periods.
              </li>
              <li>
                <strong>Vehicle Type:</strong> Filter by truck, car, or all vehicle categories if applicable.
              </li>
            </ul>
          </li>
        </ol>

        <h4>Data Sources</h4>
        <p>
          Way in Motion Data:{" "}
          <a
            href="https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA
          </a>
        </p>
      </>
    ),
  },

  hourlyArrival: {
    title: "Hourly Arrival Module Help",
    content: (
      <>
        <p>
          The <strong>Hourly Arrival</strong> metric shows how many vehicles (e.g., trucks) enter the port during each hour of the day. This information helps identify busy (peak) times and slower (off-peak) periods, allowing for better operational planning and resource allocation.
        </p>

        <h4>Importance</h4>
        <ul>
          <li>
            <strong>Traffic Management:</strong> Understanding arrival patterns helps manage gate congestion and reduces wait times.
          </li>
          <li>
            <strong>Resource Allocation:</strong> Port operators can plan staffing levels, yard equipment usage, and gate operations more effectively.
          </li>
          <li>
            <strong>Predictive Planning:</strong> Historical arrival data enables forecasting of future demand and aids in scheduling to avoid bottlenecks.
          </li>
        </ul>

        <h4>Key Definitions</h4>
        <ul>
          <li>
            <strong>Mean (Average) Arrivals:</strong> The average number of vehicles arriving in each hour, calculated over the selected date range.
          </li>
          <li>
            <strong>Upper Bound:</strong> An expected high threshold indicating when arrivals are at or near peak levels.
          </li>
          <li>
            <strong>Lower Bound:</strong> An expected low threshold indicating when arrivals are minimal or below average.
          </li>
        </ul>

        <h4>Use Cases</h4>
        <ol>
          <li>
            <strong>Gate Operations:</strong> Gate supervisors can review hourly arrival data to ensure adequate staffing during peak hours.
          </li>
          <li>
            <strong>Yard Planning:</strong> Yard managers can anticipate vehicle flows, scheduling loading/unloading activities efficiently.
          </li>
          <li>
            <strong>Carrier Coordination:</strong> Trucking and shipping companies can plan vehicle dispatch based on typical arrival patterns to avoid congestion.
          </li>
        </ol>

        <h4>How to Use This Module</h4>
        <ol>
          <li>
            <strong>Hourly Overview:</strong> Hover over the chart to see the mean arrivals for each hour, along with the upper and lower bounds.
          </li>
          <li>
            <strong>Filtering Options:</strong>
            <ul>
              <li>
                <strong>Date Range:</strong> Select specific days, weeks, or months to compare arrival patterns across different periods.
              </li>
              <li>
                <strong>Vehicle Type:</strong> Filter by truck, trailer, or other vehicle categories if applicable.
              </li>
            </ul>
          </li>
        </ol>

        <h4>Data Sources</h4>
        <p>
          Way in Motion Data:{" "}
          <a
            href="https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA
          </a>
        </p>
      </>
    ),
  },

  expectedVehicles: {
    title: "Expected Vehicles in Each Route Module Help",
    content: (
      <>
        <p>
          This table displays the various sections or routes within the port and the mean count (average) of vehicles expected to pass through each one. By understanding which areas see higher or lower traffic, port operators can allocate resources more effectively and minimize congestion.
        </p>

        <h4>Importance</h4>
        <ul>
          <li>
            <strong>Traffic Distribution:</strong> Identify high-traffic routes to manage or reroute vehicles, reducing bottlenecks.
          </li>
          <li>
            <strong>Resource Allocation:</strong> Assign staff, equipment, and maintenance schedules based on expected traffic volume in each section.
          </li>
          <li>
            <strong>Operational Planning:</strong> Gain insights into potential peak or off-peak times for specific sections to streamline port operations.
          </li>
        </ul>

        <h4>Key Definitions</h4>
        <ul>
          <li>
            <strong>Section Name:</strong> The name or identifier of the route/area within the port (e.g., “Ocean Dock Drive,” “Terminal Rd”).
          </li>
        </ul>

        <h4>Use Cases</h4>
        <ol>
          <li>
            <strong>Route Management:</strong> Port traffic managers can see which sections handle the most traffic and plan diversions if needed.
          </li>
          <li>
            <strong>Maintenance Scheduling:</strong> Infrastructure teams can schedule maintenance during off-peak times to reduce disruptions.
          </li>
          <li>
            <strong>Resource Deployment:</strong> Security personnel or gate staff can be positioned strategically in sections with higher traffic.
          </li>
        </ol>

        <h4>How to Use This Module</h4>
        <p>
          <strong>Table Overview:</strong> Review the “Section Name” and “Mean Count” columns to see expected traffic distribution.
        </p>

        <h4>Data Sources</h4>
        <p>
          Way in Motion Data:{" "}
          <a
            href="https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA
          </a>
        </p>
      </>
    ),
  },

  correlationMonths: {
    title: "Correlation by Months Module Help",
    content: (
      <>
        <p>
          This heatmap displays how monthly vehicle arrivals (or other operational metrics) correlate with each other throughout the year. A correlation indicates the degree to which two months’ data move in tandem—whether increases or decreases in one month are associated with similar changes in another.
        </p>

        <h4>Importance</h4>
        <ul>
          <li>
            <strong>Seasonal Insights:</strong> Identify months with similar or contrasting arrival patterns (e.g., high summer traffic vs. lower winter traffic).
          </li>
          <li>
            <strong>Resource Forecasting:</strong> Predict demand for staffing, equipment, and yard space based on historical correlations between months.
          </li>
          <li>
            <strong>Strategic Planning:</strong> Recognize trends such as peak season shifts, enabling better scheduling and capacity management.
          </li>
        </ul>

        <h4>Key Definitions</h4>
        <ul>
          <li>
            <strong>Correlation Coefficient:</strong> A numerical value (often between -1 and +1) that indicates how strongly two months’ data are related. Positive means both months tend to increase or decrease together; negative means they move in opposite directions.
          </li>
          <li>
            <strong>Color Scale:</strong> The heatmap uses colors (e.g., from cool to warm tones) to represent correlation strength. Closer to 1 (warm tones) indicates a stronger positive correlation, while closer to 0 or negative values (cooler tones) indicates weaker or negative correlations.
          </li>
        </ul>

        <h4>Use Cases</h4>
        <ol>
          <li>
            <strong>Seasonal Planning:</strong> Terminal operators can spot which months have similar traffic volumes, preparing for recurring patterns.
          </li>
          <li>
            <strong>Staffing & Equipment Allocation:</strong> If two or more months show strong positive correlation in traffic spikes, resources can be planned accordingly.
          </li>
          <li>
            <strong>Budget & Procurement:</strong> Knowing when demand peaks or dips across multiple months helps with procurement of materials and negotiation with service providers.
          </li>
        </ol>

        <h4>How to Use This Module</h4>
        <ol>
          <li>
            <strong>Hover for Details:</strong> Hover over a cell in the heatmap to see the exact correlation value between two months.
          </li>
          <li>
            <strong>Identify Strong Correlations:</strong> Look for cells with higher (warmer) colors, which signal that traffic or arrivals in these months tend to follow similar trends.
          </li>
          <li>
            <strong>Filter & Compare:</strong>
            <ul>
              <li>
                <strong>Vehicle Type:</strong> Focus on particular types of vehicles or cargo to get more targeted insights.
              </li>
            </ul>
          </li>
        </ol>

        <h4>Data Sources</h4>
        <p>
          Way in Motion Data:{" "}
          <a
            href="https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA
          </a>
        </p>
      </>
    ),
  },

  correlationWeekdays: {
    title: "Correlation by Weekdays Module Help",
    content: (
      <>
        <p>
          This heatmap shows how vehicle arrivals or other operational metrics correlate across different days of the week (Monday through Sunday). A correlation indicates the degree to which data for one day of the week moves in tandem with another—whether increases or decreases in one day’s traffic are associated with similar changes in another.
        </p>

        <h4>Importance</h4>
        <ul>
          <li>
            <strong>Operational Insights:</strong> Identify which weekdays exhibit similar or contrasting traffic patterns (e.g., higher arrivals on weekdays vs. lower on weekends).
          </li>
          <li>
            <strong>Staffing & Resource Allocation:</strong> Spotting correlations between days can help schedule staff and equipment more efficiently.
          </li>
          <li>
            <strong>Strategic Planning:</strong> Recognize consistent patterns (e.g., peak midweek traffic) to improve gate operations and reduce waiting times.
          </li>
        </ul>

        <h4>Key Definitions</h4>
        <ul>
          <li>
            <strong>Correlation Coefficient:</strong> A numerical value (commonly between -1 and +1) indicating how strongly two days’ data are related. Positive values show similar upward/downward trends; negative values show opposite trends.
          </li>
          <li>
            <strong>Color Scale:</strong> The heatmap uses color gradations to represent the correlation strength. Brighter or warmer colors often indicate a stronger positive correlation, while cooler or darker colors can indicate weaker or negative correlations.
          </li>
        </ul>

        <h4>Use Cases</h4>
        <ol>
          <li>
            <strong>Weekday Planning:</strong> Terminal managers can identify which days consistently align in traffic volume, guiding better staff scheduling.
          </li>
          <li>
            <strong>Maintenance Windows:</strong> If certain days are less correlated with peak traffic days, those might be optimal for scheduled maintenance.
          </li>
          <li>
            <strong>Performance Benchmarking:</strong> Compare correlations across different weeks or seasons to see if operational changes (e.g., new policies) affect day-to-day traffic relationships.
          </li>
        </ol>

        <h4>How to Use This Module</h4>
        <ol>
          <li>
            <strong>Hover for Values:</strong> Hover over any cell in the heatmap to view the exact correlation coefficient between two weekdays.
          </li>
          <li>
            <strong>Look for Patterns:</strong> Cells with higher (warmer) values indicate days that experience similar trends in arrivals; lower (cooler) values suggest differing patterns.
          </li>
          <li>
            <strong>Filtering Options (if applicable):</strong>
            <ul>
              <li>
                <strong>Vehicle Type:</strong> Focus on certain types of traffic (e.g., container trucks, passenger vehicles) for more precise insights.
              </li>
            </ul>
          </li>
        </ol>

        <h4>Data Sources</h4>
        <p>
          Way in Motion Data:{" "}
          <a
            href="https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA
          </a>
        </p>
      </>
    ),
  },

  vehicleFilter: {
    title: "Filter Vehicle Type Help",
    content: (
      <>
        <p>
          This filter allows you to view data for either Cars or Trucks specifically, helping you focus on the vehicle type most relevant to your analysis.
        </p>

        <h4>How Are Vehicles Classified?</h4>
        <ul>
          <li>
            <strong>Cars:</strong> Any vehicle not listed in the “Truck” categories (passenger cars, light-duty vans, or smaller vehicles).
          </li>
          <li>
            <strong>Trucks:</strong> Vehicles categorized under:
            <ul>
              <li>R3X: Rigid 3-axle</li>
              <li>R4X: Rigid 4 or more axles</li>
              <li>A4: Artic 4 or fewer axles</li>
              <li>A5X: Artic 5 or more axles</li>
              <li>A6+X: Artic 6 or more axles</li>
              <li>AT5-X / AT6X / AT7+X: Multi-trailer vehicles</li>
              <li>And any other specified “Truck” category with multiple axles or trailer configurations.</li>
            </ul>
          </li>
        </ul>

        <p>
          These truck classifications are generally heavier vehicles used for freight, cargo transport, or multi-axle operations.
        </p>

        <h4>Why Use This Filter?</h4>
        <ul>
          <li>
            <strong>Targeted Analysis:</strong> Focus on specific trends relevant to either passenger traffic or freight operations.
          </li>
          <li>
            <strong>Operational Efficiency:</strong> Identify and address issues unique to heavy trucks (e.g., longer wait times) vs. smaller vehicles.
          </li>
          <li>
            <strong>Resource Allocation:</strong> Plan staffing and equipment needs more accurately by separating truck volumes from car volumes.
          </li>
        </ul>
      </>
    ),
  },

  waitingTimes: {
    title: "Waiting Times Module Help",
    content: (
      <>
        <p>
          <strong>Waiting Time</strong> is the amount of time a vehicle spends queued at the port’s entrance gate before completing its check-in process. It measures how long trucks, cars, or other vehicles are delayed before they can proceed with their journey inside the port.
        </p>

        <h4>Importance</h4>
        <ul>
          <li>
            <strong>Operational Efficiency:</strong> High waiting times may indicate bottlenecks at the gate, signaling a need for process improvements or additional staff.
          </li>
          <li>
            <strong>Driver Satisfaction:</strong> Reducing waiting times can improve driver experience and minimize disruptions to delivery schedules.
          </li>
          <li>
            <strong>Cost & Resource Allocation:</strong> Long wait times can lead to increased fuel consumption, driver hours, and overall operational costs.
          </li>
        </ul>

        <h4>Key Definitions</h4>
        <ul>
          <li>
            <strong>Average Waiting Time:</strong> The average time vehicles spend waiting during a specific hour or period, providing a general overview of gate efficiency.
          </li>
          <li>
            <strong>Maximum Waiting Time:</strong> The longest recorded wait during that same hour or period, highlighting potential worst-case scenarios.
          </li>
        </ul>

        <h4>Use Cases</h4>
        <ol>
          <li>
            <strong>Gate Management:</strong> Gate supervisors can monitor waiting times to ensure adequate staffing and adjust gate processes during peak hours.
          </li>
          <li>
            <strong>Traffic Flow Analysis:</strong> Planners can combine waiting time data with arrivals or cycle time metrics to identify systemic delays and schedule improvements.
          </li>
          <li>
            <strong>Carrier Coordination:</strong> Trucking and shipping companies can plan arrival times or notify drivers of expected delays, reducing congestion.
          </li>
        </ol>

        <h4>How to Use This Module</h4>
        <ol>
          <li>
            <strong>Hour-by-Hour Trends:</strong> Hover over the chart to view average and maximum waiting times for each hour of the day.
          </li>
          <li>
            <strong>Filtering Options (if applicable):</strong>
            <ul>
              <li>
                <strong>Date Range:</strong> Focus on a particular day to see trends over time.
              </li>
              <li>
                <strong>Vehicle Type:</strong> Filter by “Cars” or “Trucks” (or more specific categories) to spot differences in waiting times.
              </li>
            </ul>
          </li>
        </ol>

        <h4>Data Sources</h4>
        <p>
          Way in Motion Data:{" "}
          <a
            href="https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://alaskatrafficdata.drakewell.com/sitedashboard.asp?node=AKDOT_CCS&cosit=000000000POA
          </a>
        </p>
      </>
    ),
  },
};


// Add modal state and render function inside your Dashboards component


function Dashboards() {
  const baseUrl = process.env.REACT_APP_BACKEND_SERVER_URL + "/dashboard/";
  
  const [cycleTime, setCycleTime] = useState({})
  const [hourlyCount, setHourlyCount] = useState({})
  const [waitingTime, setWaitingTime] = useState({})
  const [maxQueueData, setMaxQueueData] = useState({});
  const [sectionCount, setSectionCount] = useState({})
  const [weeklyCount, setWeeklyCount] = useState({})
  const [monthCorrelation, setMonthCorrelation] = useState({})
  const [weekCorrelation, setWeekCorrelation] = useState({})


  const [vehicleType, setVehicleType] = useState('cars');
  const [selectedDay, setSelectedDay] = useState(0);

  const [openModalKey, setOpenModalKey] = useState(null);

  const renderModal = () => {
    if (!openModalKey) return null;
    const { title, content } = helpData[openModalKey];
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{title}</h2>
          <div className="modal-body">{content}</div>
          <button onClick={() => setOpenModalKey(null)}>Close</button>
        </div>
      </div>
    );
  };




  const dayOptions = [
    { value: 0, label: 'Today' },
    { value: 1, label: 'Tomorrow' },
    { value: 2, label: '2 Days from Now' },
    { value: 3, label: '3 Days from Now' },
    { value: 4, label: '4 Days from Now' },
    { value: 5, label: '5 Days from Now' },
    { value: 6, label: '6 Days from Now' },
  ];

  const handleDayChange = (event) => {
    setSelectedDay(parseInt(event.target.value)); // Parse string value to integer
    fetchCycleTimeData(selectedDay); 
    fetchHourlyCountsData(vehicleType, selectedDay);
    fetchWaitingTimeData(selectedDay);
    //fetchMaximumQueueData(selectedDay);
    fetchSectionCounts(vehicleType, selectedDay);
    fetchWeeklyCounts(vehicleType, selectedDay);
    fetchMonthCorrelation(selectedDay);
    fetchWeekCorrelation(selectedDay);
  };
  const handleVehicleTypeChange = (event) => {
    setVehicleType(event.target.value);
    fetchHourlyCountsData(event.target.value, selectedDay)
    fetchSectionCounts(event.target.value, selectedDay);
    fetchWeeklyCounts(event.target.value, selectedDay);
  };

  const fetchCycleTimeData = useCallback(async (selectedDay) => {
    try {
      const response = await fetch(baseUrl + "cycle_times?day=" + selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Convert seconds to decimal minutes
        const convertToMinutes = (seconds) => seconds / 60;
  
        const avgCycleTimesInMinutes = data.average_cycle_times.map(convertToMinutes);
        const maxCycleTimesInMinutes = data.max_cycle_times.map(convertToMinutes);
  
        const cycleplot = {};
        const cycleplot_data = [
          {
            x: data.hours,
            y: avgCycleTimesInMinutes, // Use converted values
            name: 'Average Cycle Time',
            mode: 'lines+markers',
            line: {
              dash: 'solid',
            },
          },
          {
            x: data.hours,
            y: maxCycleTimesInMinutes, // Use converted values
            name: 'Maximum Cycle Time',
            mode: 'lines+markers',
            line: {
              dash: 'dot',
            },
          },
        ];
  
        
      //  const formatToMinutesSeconds = (value) => {
      //    const minutes = Math.floor(value);
      //    const seconds = Math.round((value - minutes) * 60);
      //    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      // };
  
        const cycleplot_layout = {
          xaxis: {
            title: 'Hour of day',
            showline: true,
            showgrid: true,
            showticklabels: true,
            tickvals: data.hours,
            tickangle: -45,
          },
          yaxis: {
            title: 'Cycle Time (Minutes)', 
            //tickformat: '.2f',
            //tickvals: avgCycleTimesInMinutes.concat(maxCycleTimesInMinutes),
            //ticktext: avgCycleTimesInMinutes.concat(maxCycleTimesInMinutes).map(formatToMinutesSeconds),
          },
          legend: {
            orientation: 'h',
            x: 0.5,
            y: 1.0,
            xanchor: 'center',
            yanchor: 'bottom',
          },
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 0,
          },
        };
  
        cycleplot.data = cycleplot_data;
        cycleplot.layout = cycleplot_layout;
        setCycleTime(cycleplot);
      }
    } catch (error) {
      console.error('Error fetching cycle time data:', error);
    }
  }, []);
  

  const fetchHourlyCountsData = useCallback(async (vehicleType, selectedDay) => {
    try{
      const response = await fetch(baseUrl + "hourly_counts?vehicle="+vehicleType+"&day=" + selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        let data = await response.json();
        const hourlyCountPlot = {}
        const hourlyCountPlot_data = [
          {
            x : data.hourly_sorted,
            y : data["Upper Bound"],
            name: 'Upper Bound',
            mode: 'lines+markers',
            line: {
              dash: 'dot'
            }
          },
          {
            x : data.hourly_sorted,
            y : data["Mean"],
            name: 'Mean',
            mode: 'lines+markers',
            line: {
              dash: 'line'
            }
          },
          {
            x : data.hourly_sorted,
            y : data["Lower Bound"],
            name: 'Lower Bound',
            mode: 'lines+markers',
            line: {
              dash: 'dot'
            }
          }
          
        ]
        const hourlyCountPlot_layout = {
          // title:'Hourly Arrival Comparision', 
          xaxis: {
            title: 'Hour of day',
            showline: true,
            showgrid: true,
            showticklabels: true,
            tickvals: data.hourly_sorted,
            tickangle: -45

          },
          yaxis: {
            title: 'Arrivals' 
          },
          legend: {
            orientation: 'h',
            x: 0.5, // X position 0 (left) to 1 (right)
            y: 1.1, // Y position 0 (bottom) to 1 (top)
            xanchor: 'center',
            yanchor: 'bottom',
          },
          margin: {
            l: 50, // left margin
            r: 50, // right margin
            b: 50, // bottom margin
            t: 50, // top margin
            pad: 4
          },
        }
        hourlyCountPlot.data = hourlyCountPlot_data
        hourlyCountPlot.layout = hourlyCountPlot_layout;
        setHourlyCount(hourlyCountPlot);
      }

    } catch (error){
      console.error('Error fetching  hourly counts data: ', error);
    }
  },[]);

  const fetchWaitingTimeData = useCallback(async (selectedDay) => {
    try {
      const response = await fetch(baseUrl + "waiting_times?day=" + selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.ok) {
        let data = await response.json();
  
        // Convert seconds to decimal minutes
        const convertToMinutes = (seconds) => seconds / 60;
  
        // Convert waiting times to minutes
        const avgWaitingTimesInMinutes = data.average_cycle_times.map(convertToMinutes);
        const maxWaitingTimesInMinutes = data.max_cycle_times.map(convertToMinutes);
  
        const waitingTimePlot = {};
        const waitingTimePlot_data = [
          {
            x: data.hours,
            y: avgWaitingTimesInMinutes, // Use converted values
            name: 'Average Waiting Time',
            mode: 'lines+markers',
            line: {
              dash: 'solid',
            },
          },
          {
            x: data.hours,
            y: maxWaitingTimesInMinutes, // Use converted values
            name: 'Maximum Waiting Time',
            mode: 'lines+markers',
            line: {
              dash: 'dot',
            },
          },
        ];
  
        const waitingTimePlot_layout = {
          xaxis: {
            title: 'Hour of day',
            showline: true,
            showgrid: true,
            showticklabels: true,
            tickvals: data.hours,
            tickangle: -45,
          },
          yaxis: {
            title: 'Waiting Time (Minutes)', 
          },
          legend: {
            orientation: 'h',
            x: 0.5, // X position 0 (left) to 1 (right)
            y: 1.1, // Y position 0 (bottom) to 1 (top)
            xanchor: 'center',
            yanchor: 'bottom',
          },
          margin: {
            l: 50, // left margin
            r: 50, // right margin
            b: 50, // bottom margin
            t: 50, // top margin
            pad: 4,
          },
        };
  
        waitingTimePlot.data = waitingTimePlot_data;
        waitingTimePlot.layout = waitingTimePlot_layout;
  
        setWaitingTime(waitingTimePlot);
      }
    } catch (err) {
      console.log("Fetch Error :-S", err);
    }
  }, []);
  

  const fetchMaximumQueueData = useCallback(async(selectedDay) => {
    try{
      const response = await fetch(baseUrl + "max_queue_length?day="+selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        let queueData = await response.json();

        const maxQueuePlot = {}
        const maxQueuePlot_data = [
          {
            x: Object.keys(queueData.most_likely), // Extract keys for x-axis
            y: Object.values(queueData.most_likely), // Extract values for y-axis
            name: 'Most Likely',
            type: 'bar', // Bar plot type
            marker: {
              color: 'rgb(255, 127, 80)' // Orange for most likely
            }
          },
          {
            x: Object.keys(queueData.optimistic),
            y: Object.values(queueData.optimistic),
            name: 'Optimistic',
            type: 'bar',
            marker: {
              color: 'rgb(144, 238, 144)' // Green for optimistic
            }
          },
          {
            x: Object.keys(queueData.pessimistic),
            y: Object.values(queueData.pessimistic),
            name: 'Pessimistic',
            type: 'bar',
            marker: {
              color: 'red' // Red for pessimistic
            }
          }
        ]
        const maxQueuePlot_layout = {
          // title:'Comparision of Maximum Queue Length by Hours Accross Environment', 
          xaxis: {
            title: 'Hour of day',
            showticklabels: true,
            tickvals: Object.keys(queueData.pessimistic),
            tickangle: -45

          },
          yaxis: {
            title: 'Maximum Queue Length' 
          },
          barmode: 'group',
          legend: {
            orientation: 'h',
            x: 0.5, // X position 0 (left) to 1 (right)
            y: 1.1, // Y position 0 (bottom) to 1 (top)
            xanchor: 'center',
            yanchor: 'bottom',
          },
          margin: {
            l: 50, // left margin
            r: 50, // right margin
            b: 50, // bottom margin
            t: 50, // top margin
            pad: 4
          },
        }
        maxQueuePlot.data = maxQueuePlot_data
        maxQueuePlot.layout = maxQueuePlot_layout
        setMaxQueueData(maxQueuePlot)
      }
    } catch  (error) {
      console.log('Error', error) 
    }
  },[]);

  const fetchSectionCounts = useCallback(async(vehicleType, selectedDay) => {
    try{
      console.log(baseUrl + "section_counts_stats?vehicle="+vehicleType+"&day="+selectedDay)
      const response = await fetch(baseUrl + "section_counts_stats?vehicle="+vehicleType, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const sectionCountsData = await response.json();
        sectionCountsData.push({
          "Mean Count": 0,
          "Section ID": "8",
          "Section Name": "ABI road"
        })
        sectionCountsData.push({
          "Mean Count": 0,
          "Section ID": "9",
          "Section Name": "Transit A Area"
        })

        const filteredSections = sectionCountsData.filter(
          (section) => section["Section ID"] === "1" || section["Section ID"] === "4" || section["Section ID"] === "5" || section["Section ID"] === "9"
        );
  
        // Rename the sections
        const renamedSections = filteredSections.map((section) => {
          if (section["Section ID"] === "1") {
            section["Section Name"] = "Ocean Dock Drive (Section 1 to 3)";
          } else if (section["Section ID"] === "4") {
            section["Section Name"] = "Terminal Rd (Sections 5 and 6)";
          } else if (section["Section ID"] === "5") {
            section["Section Name"] = "Anchorage Port Rd (Sections 4, 7, and 8)"; 
          } else if (section["Section ID"] === "9") {
            section["Section Name"] = "Marathon and Transit Area (Sections 9)"; 
          }
          return section;
        });
        setSectionCount(renamedSections)
        
      }
    }catch (err){
      console.log("Fetch Section Error", err)
    }
  },[]);
  const fetchWeeklyCounts = useCallback(async(vehicleType, selectedDay) => {
    try {
      const response = await fetch(baseUrl + "weekly_counts?vehicle="+vehicleType+'&day='+selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const weeklyCountData = await response.json();
        const weeklyCountPlot = {}
        const weeklyCountPlot_data = [
          {
            mean:10,
            sd:2,
            name: "Monday",
            type:'box',
            showwhiskers:false,
            sizemode:"sd"
          },
          {
             // Dummy x-axis values (will be overridden)
            mean:10,
            sd:2,
            type: 'box',
            mode: 'box', // Set mode to 'boxes' for box plot
            fillcolor: 'rgb(0, 144, 255)', // Set box fill colo
            name: "Tuesday" ,
            sizemode:"sd"
            
          }
        ]
        const weeklyCountPlot_layout = {
          // title:'Expected Truck Arrivals by Day of Week',
          xaxis: {
            title: 'Day of Week',
            showticklabels: true,
            tickangle: 0

          },
          yaxis: {
            title: 'Number of Arrivals' 
          },
          legend: {
            orientation: 'h',
            x: 0.5, // X position 0 (left) to 1 (right)
            y: 1.1, // Y position 0 (bottom) to 1 (top)
            xanchor: 'center',
            yanchor: 'bottom',
          },
          margin: {
            l: 50, // left margin
            r: 50, // right margin
            b: 50, // bottom margin
            t: 50, // top margin
            pad: 4
          },
        }
        weeklyCountPlot.data = weeklyCountPlot_data
        weeklyCountPlot.layout = weeklyCountPlot_layout
        setWeeklyCount(weeklyCountPlot);
      }

    }catch (error){
      console.error("Error while fetching Weekly Counts", error)
    }
  },[]);

  const fetchMonthCorrelation = useCallback( async (selectedDay) => {
    try {
      
      const response = await fetch(baseUrl + "correlation?type=months&day="+selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const monthlyCountsData = await response.json();
        const months = Object.keys(monthlyCountsData);
        const monthData = [];
        const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Loop through months in the desired order
        for (const month of monthLabels) {
          const monthValues = [];
          // Check if data exists for the current month
          if (monthlyCountsData.hasOwnProperty(month)) {
            for (const otherMonth of monthLabels) {
              // Extract correlation value for the current month with other months
              const correlationValue = monthlyCountsData[month][otherMonth];
              monthValues.push(correlationValue);
            }
          } else {
            // Handle missing month data (optional)
            console.warn(`Data missing for month: ${month}`);
            monthValues.push(...Array(monthLabels.length).fill(null)); // Fill with null values
          }
          monthData.push(monthValues);
        }

        const heatmapData = [
          {
            z: monthData,
            type: 'heatmap',
            colorscale: 'Viridis', // Adjust colorscale as needed
          },
        ];

        const heatmapLayout = {
          xaxis: {
            title: 'Months',
            ticktext: monthLabels, // Set custom tick labels for months
            tickvals: Array.from({ length: monthLabels.length }, (_, i) => i), // Set tick positions
          },
          yaxis: {
            title: 'Months',
            ticktext: monthLabels, // Set custom tick labels for months
            tickvals: Array.from({ length: monthLabels.length }, (_, i) => i), // Set tick positions
          },
        };

        const monthCorrelationData = {}
        monthCorrelationData.data = heatmapData 
        monthCorrelationData.layout = heatmapLayout

        setMonthCorrelation(monthCorrelationData)

      }

    }catch (error){
      console.error("Error while fetching Monthly Correlation", error)
    }
  },[])

  const fetchWeekCorrelation = useCallback(async (selectedDay) => {
    try {
      const response = await fetch(baseUrl + "correlation?type=weeks&day="+selectedDay, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const weeklyCountsData = await response.json();
        console.log(weeklyCountsData)
        const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const weekData = [];
  
        // Loop through weekdays in the desired order
        for (const day of weekDays) {
          const dayValues = [];
          // Check if data exists for the current day
          if (weeklyCountsData.hasOwnProperty(day)) {
            for (const otherDay of weekDays) {
              // Extract correlation value for the current day with other days
              const correlationValue = weeklyCountsData[day][otherDay];
              dayValues.push(correlationValue);
            }
          } else {
            // Handle missing day data (optional)
            console.warn(`Data missing for day: ${day}`);
            dayValues.push(...Array(weekDays.length).fill(null)); // Fill with null values
          }
          weekData.push(dayValues);
        }
  
        const heatmapData = [
          {
            z: weekData,
            type: 'heatmap',
            colorscale: 'Viridis', // Adjust colorscale as needed
          },
        ];
  
        const heatmapLayout = {
          xaxis: {
            title: 'Day Of Week',
            ticktext: weekDays, // Set custom tick labels for weekdays
            tickvals: Array.from({ length: weekDays.length }, (_, i) => i), // Set tick positions
          },
          yaxis: {
            title: 'Day Of Week',
            ticktext: weekDays, // Set custom tick labels for weekdays
            tickvals: Array.from({ length: weekDays.length }, (_, i) => i), // Set tick positions
          },
        };
  
        const weekCorrelationData = {};
        weekCorrelationData.data = heatmapData;
        weekCorrelationData.layout = heatmapLayout;
  
        setWeekCorrelation(weekCorrelationData); // Assuming you have a state for weekly data
  
      }
    } catch (error) {
      console.error("Error while fetching Weekly Correlation", error);
    }
  }, []);
  



  useEffect(() => {
    
    fetchCycleTimeData(selectedDay); 
    fetchHourlyCountsData(vehicleType, selectedDay);
    fetchWaitingTimeData(selectedDay);
    //fetchMaximumQueueData(selectedDay);
    fetchSectionCounts(vehicleType, selectedDay);
    fetchWeeklyCounts(vehicleType, selectedDay);
    fetchMonthCorrelation(selectedDay);
    fetchWeekCorrelation(selectedDay);
  }, []); 



  return (
    <div className="dashboards-container">
      {/* 4. Render the modal at the top so it overlays the dashboard */}
      {renderModal()}
      {/* First column */}
      <div className="dashboard-column first-column">
      <h3 className="h3-db">Cycle Times
        <span className="help-icon" onClick={() => setOpenModalKey("cycleTime")}>?</span>
      </h3>
        <Plot data={cycleTime.data} layout={cycleTime.layout} />
  
        <h3 className="h3-db">Hourly Arrival
  <span className="help-icon" onClick={() => setOpenModalKey("hourlyArrival")}>?</span>
</h3>
        <Plot data={hourlyCount.data} layout={hourlyCount.layout} />
  
        <h3 className="h3-db">Waiting Times
  <span className="help-icon" onClick={() => setOpenModalKey("waitingTimes")}>?</span>
</h3>
        <Plot data={waitingTime.data} layout={waitingTime.layout} />
      </div>
  
      {/* Second column */}
      <div className="dashboard-column second-column">
      <h3 className="h3-db">Filter Vehicle Type
  <span className="help-icon" onClick={() => setOpenModalKey("vehicleFilter")}>?</span>
</h3>
        <div style={{ display: 'flex', gap: '20px', paddingBottom: '20px', paddingLeft: '280px', paddingTop: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <label style={{ fontWeight: 'bold' }}>
            <input type="radio" id="cars" name="vehicleType" value="cars" style={{ marginRight: '5px' }} checked={vehicleType === 'cars'} onChange={handleVehicleTypeChange} />
            Cars
          </label>
          <label style={{ fontWeight: 'bold' }}>
            <input type="radio" id="trucks" name="vehicleType" value="trucks" style={{ marginRight: '5px' }} checked={vehicleType === 'trucks'} onChange={handleVehicleTypeChange} />
            Trucks
          </label>
          <label style={{ fontWeight: 'bold' }}>
            <input type="radio" id="both" name="vehicleType" value="both" style={{ marginRight: '5px' }} checked={vehicleType === 'both'} onChange={handleVehicleTypeChange} />
            Both
          </label>
        </div>
  
        <h3 class="h3-db">Select Day</h3>
        <div style={{ display: 'flex', gap: '20px', paddingBottom: '20px', paddingLeft: '280px', paddingTop: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <select value={selectedDay} onChange={handleDayChange}>
            {dayOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <DashboardMapComponent />
        </div>
  
        <h3 className="h3-db">Expected Vehicles in Each Route
  <span className="help-icon" onClick={() => setOpenModalKey("expectedVehicles")}>?</span>
</h3>
        <div>
          <table>
            <thead>
              <tr>
                <th>Section Name</th>
                <th>Mean Count</th>
              </tr>
            </thead>
            <tbody>
              {sectionCount && sectionCount.length > 0 ? (
                sectionCount.map((section) => (
                  <tr key={section["Section ID"]}>
                    <td>{section["Section Name"]}</td>
                    <td>{section["Mean Count"]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Data still not available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Third column */}
      <div className="dashboard-column third-column">
        {/* <h3 class="h3-db">Maximum Hazmat Queue Length
          <a data-tooltip-id="aboutTipQueueLength" data-tooltip-content="A bar chart that displays the maximum expected queue length at Hazmat Lane, categorized by the hour, with projections for different scenarios: most likely, optimistic, and pessimistic."
             className="tooltip-circle">?</a>
          <Tooltip id="aboutTipQueueLength" place="top" effect="solid" className="custom-tooltip"/>
        </h3>
        <Plot data={maxQueueData.data} layout={maxQueueData.layout} /> */}
  
  <h3 className="h3-db">Correlation by Months
  <span className="help-icon" onClick={() => setOpenModalKey("correlationMonths")}>?</span>
</h3>
        <Plot data={monthCorrelation.data} layout={monthCorrelation.layout} />
  
        <h3 className="h3-db">Correlation by Weekdays
  <span className="help-icon" onClick={() => setOpenModalKey("correlationWeekdays")}>?</span>
</h3>
        <Plot data={weekCorrelation.data} layout={weekCorrelation.layout} />
      </div>
    </div>
  );
  
}

export default Dashboards;
