import React, { useState, useEffect } from 'react';
import './ScenarioAnalysis.css';
import ReactPlayer from 'react-player';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CircularProgress from '@mui/material/CircularProgress';
import Plot from 'react-plotly.js';
import { Tooltip } from 'react-tooltip';

function ScenarioAnalysis() {
  const [parameters, setParameters] = useState({
    disruptionLocation: '',
    inOutRoute: '',
    disruptionLength: '',
    disruptionTimeDate: '',
    startDate: '',
    endDate: '',
    blockLocation: '',
    routeDistribution: 0.0,
  });

  // Near the top of ScenarioAnalysis.js, before the component definition:
const scenarioHelpData = {
  statisticsAndPlots: {
    title: "Statistics and Plots Overview",
    content: (
      <>
        <p>
          Once the simulation is run, this section displays various statistics and
          plots that illustrate the impact of disruptions and compare different
          operational scenarios. These charts help you understand how changes in
          routes or procedures affect cycle time, wait time, and other key
          performance indicators across the port.
        </p>

        <h3>Cycle Time Box Plot</h3>
        <h4>What It Shows:</h4>
        <p>
          This box plot compares the total time a vehicle spends from entering to
          leaving the port (<strong>cycle time</strong>) under different scenarios
          (e.g., <em>No Reaction</em>, <em>Normal Operation</em>, <em>Taking Detour</em>).
        </p>

        <h4>How to Interpret:</h4>
        <ul>
          <li>
            The box represents the middle 50% of data (from the 25th to the 75th percentile).
          </li>
          <li>The line in the box is the median (50th percentile).</li>
          <li>
            Whiskers (vertical lines extending from the box) indicate the range of
            values, excluding outliers.
          </li>
          <li>
            Dots outside the whiskers may represent outliers or unusual data points.
          </li>
          <li>
            Compare the height of the boxes across scenarios to see which strategy
            yields lower (faster) or higher (slower) cycle times.
          </li>
        </ul>

        <h4>Why It’s Useful:</h4>
        <p>
          Quickly identify the most efficient operational scenario by observing which
          one has the lowest median cycle time and the smallest spread (indicating more
          consistent performance).
        </p>

        <h3>Wait Time Box Plot</h3>
        <h4>What It Shows:</h4>
        <ul>
          <li>
            This box plot visualizes the time vehicles spend waiting (e.g., in a queue
            at the gate) before completing check-in, across the same scenarios (<em>No Reaction</em>,
            <em>Normal Operation</em>, <em>Taking Detour</em>).
          </li>
        </ul>

        <h4>How to Interpret:</h4>
        <ul>
          <li>
            Similar to the cycle time box plot, you can gauge the median wait time and see
            how widely wait times vary.
          </li>
          <li>
            A taller box or higher whiskers indicate longer or more variable wait times.
          </li>
          <li>
            Check if detours or operational adjustments significantly reduce wait time
            compared to the baseline scenario.
          </li>
        </ul>

        <h4>Why It’s Useful:</h4>
        <ul>
          <li>
            High wait times often indicate bottlenecks or inefficiencies. This chart helps
            pinpoint which scenario best minimizes queuing and gate congestion.
          </li>
        </ul>

        <h3>Section Analysis</h3>
        <h4>What It Shows:</h4>
        <p>
          A bar chart illustrating metrics for different port sections (e.g., <em>Section&nbsp;1</em>,
          <em>Section&nbsp;2</em>, etc.) under various criteria such as:
        </p>
        <ul>
          <li>Alternative Route Efficacy</li>
          <li>Alternative Route Diversity</li>
          <li>Amount of Traffic Impacted</li>
          <li>Overall Risk Level</li>
        </ul>

        <h4>How to Interpret:</h4>
        <ul>
          <li>Each bar represents a specific metric’s value for a given section.</li>
          <li>
            Taller bars may indicate higher efficacy, higher traffic impact, or higher risk
            — depending on the metric.
          </li>
          <li>
            Compare bars across sections to see where disruptions are most significant or
            where alternative routes are most effective.
          </li>
        </ul>

        <h4>Why It’s Useful:</h4>
        <p>
          Helps you identify which sections of the port are most affected by disruptions and
          where alternative routes or mitigation strategies might yield the best results.
        </p>

        <h3>Route Analysis</h3>
        <h4>What It Shows:</h4>
        <p>
          Another bar chart focusing on specific routes (e.g., “Insulfoam to Insulfoam,”
          “Marathon,” “ABT,” etc.) and displaying metrics such as:
        </p>
        <ul>
          <li>Ease of Implementation</li>
          <li>Overall Efficacy</li>
          <li>Relative Performance</li>
          <li>Route Diversity</li>
        </ul>

        <h4>How to Interpret:</h4>
        <ul>
          <li>
            Each bar indicates the score or value of a particular metric for that route.
          </li>
          <li>
            Compare different routes to see which has the highest efficacy or which is easiest
            to implement.
          </li>
          <li>
            Look at route diversity to assess whether there are multiple viable alternatives
            in case of disruption.
          </li>
        </ul>

        <h4>Why It’s Useful:</h4>
        <p>
          Enables decision-makers to quickly evaluate and compare route options, identifying
          which paths are most effective or least risky under certain conditions.
        </p>
      </>
    ),
  },

  suggestionsTable: {
    title: "Suggestions Table Helper Function",
    content: (
      <>
        <p>
          After running the simulation, this table presents key metrics (<em>Average Cycle Time</em> 
          and <em>Average Waiting Time</em>) for each route under different operational scenarios 
          (<em>No Reaction</em>, <em>Normal</em>, or <em>Taking Detour</em>). It helps you quickly 
          compare how these strategies affect travel efficiency and waiting times.
        </p>

        <h4>Key Columns:</h4>
        <ol>
          <li>
            <strong>Average Cycle Time</strong> (No Reaction / Normal / Taking Detour):
            <ul>
              <li>
                Each scenario represents a different operational response (no special measures, 
                standard operations, or using a detour).
              </li>
              <li>Lower values generally indicate faster total travel through the port.</li>
            </ul>
          </li>

          <li>
            <strong>Average Waiting Time</strong> (No Reaction / Normal / Taking Detour):
            <ul>
              <li>Lower waiting times suggest smoother check-in and less congestion.</li>
            </ul>
          </li>

          <li>
            <strong>Route</strong>: The specific route (e.g., “Insulfoam–Insulfoam”) for which 
            these average times apply.
          </li>
        </ol>

        <h4>How to Use This Table:</h4>
        <ul>
          <li>
            <strong>Compare Scenarios:</strong> Look at the difference in average cycle and 
            waiting times between the scenarios to see if a detour or specific strategy 
            significantly reduces travel or queue times.
          </li>
          <li>
            <strong>Identify Best Options:</strong> Focus on whichever route/scenario yields 
            the lowest cycle and waiting times if you plan to implement new strategies or 
            routes.
          </li>
          <li>
            <strong>Balance Trade-Offs:</strong> A route with the shortest cycle time might 
            have a slightly higher waiting time, so weigh these factors to find the most 
            efficient or feasible overall solution.
          </li>
        </ul>

        <h4>Why It’s Useful:</h4>
        <ul>
          <li>
            <strong>Informed Decision-Making:</strong> Quickly assess which scenario and route 
            combination provides the best operational outcome.
          </li>
          <li>
            <strong>Bottleneck Detection:</strong> Identify if certain routes or scenarios 
            consistently have high waiting or cycle times, indicating a need for 
            improvements.
          </li>
          <li>
            <strong>Operational Planning:</strong> Helps teams decide whether a detour is 
            worthwhile, based on data-driven insights.
          </li>
        </ul>
      </>
    ),
  },
};



  const [scenarioType, setScenarioType] = useState('shortTerm');
  const [showShortTermInputs, setShowShortTermInputs] = useState(true);
  const [showLongTermInputs, setShowLongTermInputs] = useState(false);
  const [isRunDisabled, setIsRunDisabled] = useState(true);
  const [suggestions, setSuggestions] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  const [plots, setPlots] = useState([]);
  const [currentPlotIndex, setCurrentPlotIndex] = useState(0);
  const [alternativeRouteOptions, setAlternativeRouteOptions] = useState([]);

  // States to store map image paths
  const [shortTermMapPath, setShortTermMapPath] = useState('');
  const [longTermMapPaths, setLongTermMapPaths] = useState([]); // will hold two image paths

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');


  let baseUrl = process.env.REACT_APP_BACKEND_SERVER_URL;

  const [openHelpKey, setOpenHelpKey] = useState(null);

  const renderHelpModal = () => {
    const helpItem = scenarioHelpData[openHelpKey];
    if (!helpItem) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{helpItem.title}</h2>
          <div className="modal-body">{helpItem.content}</div>
          <button onClick={() => setOpenHelpKey(null)}>Close</button>
        </div>
      </div>
    );
  };

  // -------------- CSV Upload Logic --------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setUploadMsg('');
      return;
    }

    // Frontend check if it's .csv
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadMsg('Error: Please select a .csv file.');
      setSelectedFile(null);
      return;
    }

    // OK to proceed
    setSelectedFile(file);
    setUploadMsg('');
  };

  const handleUploadCSV = async () => {
    if (!selectedFile) {
      alert("No CSV file selected.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(baseUrl + "/upload_csv", {
        method: "POST",
        body: formData,
      });

      const resJson = await response.json();

      if (!response.ok) {
        // The server returned a 400 or 500
        setUploadMsg(`Error uploading CSV: ${resJson.error || "Unknown error"}`);
      } else {
        // success
        setUploadMsg(resJson.message || "CSV uploaded and processed successfully!");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setUploadMsg("Error uploading CSV file.");
    }
  };
  // -------------- END CSV Upload Logic --------------
  

  const validateFields = () => {
    if (scenarioType === 'shortTerm') {
      const { disruptionLocation, inOutRoute, disruptionLength, disruptionTimeDate } = parameters;
      
      setIsRunDisabled(
        !disruptionLocation || !inOutRoute || !disruptionLength || !disruptionTimeDate
      );
    } else {
      const { startDate, endDate, blockLocation, routeDistribution } = parameters;
      setIsRunDisabled(!startDate || !endDate || !blockLocation || !routeDistribution);
    }
  };

  useEffect(() => {
    validateFields();
  }, [parameters, scenarioType]);

  const sectionNamesMap = {
    'Section 1': 'Section 1 - Ocean Dock Rd before turn into Marathon Terminal',
    'Section 2': 'Section 2 - Ocean Dock Rd between turn into Marathon Terminal and turn into ABl',
    'Section 3': 'Section 3 - Between turn into ABl and turn onto Roger Graves Rd',
    'Section 4': 'Section 4 - Occurs along Anchorage Port Rd before turn onto Terminal Rd',
    'Section 5': 'Section 5 - Start of Terminal Rd, opposite the Control Center',
    'Section 6': 'Section 6 - Terminal Rd to the entrance of Tote yard',
    'Section 7': 'Section 7 - Anchorage Rd across from Petro Star and AFSC',
    'Section 8': 'Section 8 - Anchorage Rd from across Delta Western to across Matson yard',
    //'Section 9': 'Section 9 - Marathon Rd and south float access towards Matson yard',
  }


  const inOutRouteMap = {
    'Section 1': ['Insulfoam-Insulfoam', 
      'Insulfoam-Military', 
      'Military-Insulfoam', 
      'Military-Military'],
    'Section 2': [
      'Marathon-Military',
      'Marathon-Marathon',
      'Military-Marathon',
      'Military-Military',
      'Bluff-Marathon',
      'Marathon-Bluff',
      'Bluff-Military',
      'Military-Bluff',
      'Bluff-Bluff',
      'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid',
    ],
    'Section 3': ['Marathon Transit Area Hybrid-Marathon Transit Area Hybrid', 
      'Marathon Transit Area Hybrid-Military', 
      'Military-Marathon Transit Area Hybrid', 
      'Military-Military'],
    'Section 4': ['ABI-Roger', 
      'Roger-ABI', 
      'ABI-ABI', 
      'Roger-Roger', 
      'ABI-Military', 
      'Military-ABI',
      'Military-Military', 
      'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid'],
    'Section 5': ['Military-Military', 
      'Roger-Military', 
      'Military-Roger'],
    'Section 6': [
       'Transit-Transit',
       'Military-Military'],
    'Section 7': ['Marathon Transit Area Hybrid-Military', 
      'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid', 
      'Military-Marathon Transit Area Hybrid', 
      'Military-Military', 
      'Tidewater-Tidewater', 
      'PertoStar-Tidewater', 
      'Tidewater-PertoStar'],
    'Section 8': ['Tidewater-Tidewater',
      'Marathon Transit Area Hybrid-Military',
      'Marathon Transit Area Hybrid-Marathon Transit Area Hybrid',
      'Military-Marathon Transit Area Hybrid',
      'Military-Military'],
    //'Section 9': ['Main Route-Main Route'],
  };

  const longTermRouteMap = {
    'Construction at Crossing Before Checkpoint': ['Track J', 'Insulfoam'],
    'Construction at Ocean Dock Rd and Roger Graves Rd': ['Marathon', 'Track J'],
    'Anchorage Port Rd': ['ABI', 'Transit'],
    'Terminal Rd': ['Transit', 'Transit'],
  };

  // -------------- ShortTerm & LongTerm Risk Tables --------------
  function ShortTermRiskTable() {
    return (
      <div className="risk-assessment-container short-term-scenarios">
        <h3 className="sa-headers">Risk Assessment for Short-term Incidents</h3>
        <table>
          <thead>
            <tr>
              <th>Disruption Location</th>
              <th>Alternative Route Efficacy</th>
              <th>Diversity</th>
              <th>Traffic Impacted</th>
              <th>Overall Risk Level</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Section 1</td>
              <td>3</td>
              <td>2</td>
              <td>1</td>
              <td>6</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Section 2</td>
              <td>5</td>
              <td>2</td>
              <td>1</td>
              <td>8</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Section 3</td>
              <td>5</td>
              <td>4</td>
              <td>3</td>
              <td>12</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Section 4</td>
              <td>5</td>
              <td>6</td>
              <td>4</td>
              <td>15</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Section 5</td>
              <td>9</td>
              <td>9</td>
              <td>7</td>
              <td>25</td>
              <td>7</td>
            </tr>
            <tr>
              <td>Section 6</td>
              <td>8</td>
              <td>8</td>
              <td>7</td>
              <td>23</td>
              <td>6</td>
            </tr>
            <tr>
              <td>Section 7</td>
              <td>8</td>
              <td>7</td>
              <td>7</td>
              <td>22</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Section 8</td>
              <td>10</td>
              <td>10</td>
              <td>8</td>
              <td>28</td>
              <td>8</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontStyle: 'italic' }}>Key: 10 = Least Risk, 1 = Most Risk</p>
      </div>
    );
  }

  function LongTermRiskTable() {
    return (
      <div className="risk-assessment-container long-term-scenarios">
        <h3 className="sa-headers">Risk Assessment for Long-term Blocks</h3>
        <table>
          <thead>
            <tr>
              <th>Alternative Route</th>
              <th>Ease of Implementation</th>
              <th>Relative Performance</th>
              <th>Route Diversity</th>
              <th>Overall Efficacy</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Military Base</td>
              <td>3</td>
              <td>2</td>
              <td>9</td>
              <td>14</td>
              <td>7</td>
            </tr>
            <tr>
              <td>Tract J</td>
              <td>1</td>
              <td>3</td>
              <td>7</td>
              <td>11</td>
              <td>8</td>
            </tr>
            <tr>
              <td>Insulfoam</td>
              <td>3</td>
              <td>3</td>
              <td>1</td>
              <td>7</td>
              <td>9</td>
            </tr>
            <tr>
              <td>Marathon</td>
              <td>7</td>
              <td>4</td>
              <td>7</td>
              <td>18</td>
              <td>4</td>
            </tr>
            <tr>
              <td>ABI</td>
              <td>5</td>
              <td>7</td>
              <td>7</td>
              <td>19</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Transit Area A</td>
              <td>8</td>
              <td>8</td>
              <td>4</td>
              <td>20</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Roger Graves Rd</td>
              <td>7</td>
              <td>6</td>
              <td>3</td>
              <td>16</td>
              <td>5</td>
            </tr>
            <tr>
              <td>Petro Star</td>
              <td>4</td>
              <td>10</td>
              <td>1</td>
              <td>15</td>
              <td>6</td>
            </tr>
            <tr>
              <td>Terminal Rd</td>
              <td>10</td>
              <td>10</td>
              <td>3</td>
              <td>23</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontStyle: 'italic' }}>Key: 10 = Least Risk, 1 = Most Risk</p>
      </div>
    );
  }
  // -------------- END ShortTerm & LongTerm Risk Tables --------------

  // --- Helper Functions to Build Map Paths ---
  function buildShortTermMapPath(disruptionLocation, inOutRoute) {
    const sectionClean = disruptionLocation.replace(/\s+/g, '');
    const [left = '', right = ''] = inOutRoute.split('-');
    const leftLast = left.trim().split(/\s+/).pop();
    const rightLast = right.trim().split(/\s+/).pop();
    return `/maps/short-term/${sectionClean}_${leftLast}_${rightLast}.png`;
  }

  function buildLongTermMapPaths(blockLocation) {
    const locClean = blockLocation.replace(/\s+/g, '');
    return [
      `/maps/long-term/${locClean}_map1.png`,
      `/maps/long-term/${locClean}_map2.png`,
    ];
  }

  // New: Fetch Risk Section Data
  const fetchRiskSectionData = async (section) => {
    const response = await fetch(baseUrl + `/riskSection?section=${section}`);
    return response.json();
  };

  // New: Fetch Risk Route Data
  const fetchRiskRouteData = async (inroute, outroute) => {
    const response = await fetch(baseUrl + `/riskRoute?inroute=${inroute}&outroute=${outroute}`);
    return response.json();
  };

  // New: Render Section Plot
  const renderSectionPlot = (data, selectedSection) => {
    const {
      "Alternative Route Diversity": diversity,
      "Alternative Route Efficacy": efficacy,
      "Amount of Traffic Impacted": traffic,
      "Overall Risk Level": risk,
      "Disruption Location": locations,
    } = data;
  
    // Filter data to only include the selected section
    const selectedIndex = locations.indexOf(selectedSection);
    if (selectedIndex === -1) return; // Exit if the section is not found
  
    const filteredData = {
      locations: [locations[selectedIndex]],
      diversity: [diversity[selectedIndex]],
      efficacy: [efficacy[selectedIndex]],
      traffic: [traffic[selectedIndex]],
      risk: [risk[selectedIndex]],
    };
  
    // Define the data for each subplot
    const subplotsData = [
      {
        x: filteredData.locations,
        y: filteredData.efficacy,
        type: 'bar',
        name: 'Alternative Route Efficacy',
        marker: { color: 'orange' },
      },
      {
        x: filteredData.locations,
        y: filteredData.diversity,
        type: 'bar',
        name: 'Alternative Route Diversity',
        marker: { color: '#CC7E85' },
      },
      {
        x: filteredData.locations,
        y: filteredData.traffic,
        type: 'bar',
        name: 'Amount of Traffic Impacted',
        marker: { color: '#E8DBC5' },
      },
      {
        x: filteredData.locations,
        y: filteredData.risk,
        type: 'bar',
        name: 'Overall Risk Level',
        marker: { color: '#93B7BE' },
      },
    ];
  
    // Create subplots layout
    const layout = {
      title: `Section Analysis: ${selectedSection}`,
      grid: { rows: 2, columns: 2, pattern: 'independent' },
      showlegend: false,
      xaxis: { showgrid: false },
      xaxis2: { showgrid: false },
      xaxis3: { showgrid: false },
      xaxis4: { showgrid: false },
      yaxis: { title: 'Efficacy', showgrid: false },
      yaxis2: { title: 'Diversity', showgrid: false },
      yaxis3: { title: 'Traffic Impacted', showgrid: false },
      yaxis4: { title: 'Risk Level', showgrid: false },
    };
  
    // Combine all plots into subplots
    const plots = subplotsData.map((plotData, index) => ({
      ...plotData,
      xaxis: `x${index + 1}`,
      yaxis: `y${index + 1}`,
    }));
  
    const subplotLayout = {
      ...layout,
      annotations: subplotsData.map((_, index) => ({
        text: subplotsData[index].name,
        font: { size: 12 },
        showarrow: false,
        xref: `x${index + 1}`,
        yref: `y${index + 1}`,
        x: 0.5,
        y: 1.1,
        xanchor: 'center',
        yanchor: 'bottom',
      })),
    };
  
    setPlots((prevPlots) => [
      ...prevPlots,
      {
        data: plots,
        layout: subplotLayout,
      },
    ]);
  };
  
  
  

  // New: Render Route Plot
  function renderRoutePlot(data, inroute, outroute) {
    const {
      "Alternative Route": routes,
      "Ease of Implementation": ease,
      "Overall Efficacy": efficacy,
      "Relative Performance": performance,
      "Route Diversity": diversity,
    } = data;
  
    const subplotsData = [
      {
        x: routes,
        y: ease,
        type: 'bar',
        name: 'Ease of Implementation',
        marker: { color: '#03DAC5' },
      },
      {
        x: routes,
        y: efficacy,
        type: 'bar',
        name: 'Overall Efficacy',
        marker: { color: '#CC7E85' },
      },
      {
        x: routes,
        y: performance,
        type: 'bar',
        name: 'Relative Performance',
        marker: { color: '#E8DBC5' },
      },
      {
        x: routes,
        y: diversity,
        type: 'bar',
        name: 'Route Diversity',
        marker: { color: '#93B7BE' },
      },
    ];
  
    // Set up subplots layout with extra margins & tick rotation
    const layout = {
      title: `Route Analysis: ${inroute} to ${outroute}`,
      grid: { rows: 2, columns: 2, pattern: 'independent' },
      showlegend: false,
      margin: {
        t: 80,   // top margin
        b: 100,  // bottom margin (important if you rotate labels)
        l: 60,   // left margin
        r: 60,   // right margin
      },
      // Rotate x-axis labels in each subplot & let Plotly auto-manage margins
      xaxis:  { tickangle: -45, automargin: true, showgrid: false},
      xaxis2: { tickangle: -45, automargin: true, showgrid: false },
      xaxis3: { tickangle: -45, automargin: true, showgrid: false },
      xaxis4: { tickangle: -45, automargin: true, showgrid: false },
  
      // Optionally reduce text size (if still overlapping)
      // xaxis: { tickangle: -45, tickfont: { size: 10 }, automargin: true },
  
      yaxis:  { title: 'Ease of Implementation', showgrid: false },
      yaxis2: { title: 'Overall Efficacy', showgrid: false },
      yaxis3: { title: 'Relative Performance', showgrid: false },
      yaxis4: { title: 'Route Diversity', showgrid: false },
    };
  
    // Combine subplots
    const plots = subplotsData.map((plotData, index) => ({
      ...plotData,
      xaxis: `x${index + 1}`,
      yaxis: `y${index + 1}`,
    }));
  
    const subplotLayout = {
      ...layout,
      annotations: subplotsData.map((_, index) => ({
        text: subplotsData[index].name,
        font: { size: 12 },
        showarrow: false,
        xref: `x${index + 1}`,
        yref: `y${index + 1}`,
        x: 0.5,
        y: 1.1,
        xanchor: 'center',
        yanchor: 'bottom',
      })),
    };
  
    // Then setPlots or return as needed
    setPlots((prevPlots) => [
      ...prevPlots,
      {
        data: plots,
        layout: subplotLayout,
      },
    ]);
  }
  


  useEffect(() => {
    const selectedLocation = parameters.disruptionLocation;
    if (selectedLocation && inOutRouteMap.hasOwnProperty(selectedLocation)) {
      setFilteredRoutes(inOutRouteMap[selectedLocation]);
    } else {
      setFilteredRoutes([]); // Clear options if location is invalid or not matched
    }
  }, [parameters.disruptionLocation]);

  // Function to render the table
  const renderTable = () => {
    if (data && data.length > 0) {
      // Grab all keys from the first data row
      let allKeys = Object.keys(data[0]);

      // Reorder columns based on scenarioType
      if (scenarioType === 'shortTerm') {
        // Put "Route" first, if it exists
        const routeIndex = allKeys.indexOf('Route');
        if (routeIndex !== -1) {
          allKeys.splice(routeIndex, 1);
          allKeys.unshift('Route');
        }
      } else if (scenarioType === 'longTerm') {
        // Put "Distribution" first, if it exists
        const distIndex = allKeys.indexOf('Distribution');
        if (distIndex !== -1) {
          allKeys.splice(distIndex, 1);
          allKeys.unshift('Distribution');
        }
      }

      // List of columns to exclude from numeric conversion
      const excludedColumns = ['Route', 'Distribution'];

      // Transform headers: replace " - " with line breaks and update Maximum Waiting Time text
      const headers = allKeys.map(header => {
        let transformedHeader = header.replace(/ - /g, '<br>');
        if (header.includes("Maximum Waiting Time (sec)")) {
          transformedHeader = transformedHeader.replace("Maximum Waiting Time (sec)", "Maximum Waiting Time (min)");
        }
        return transformedHeader;
      });

      // Build rows while converting values
      const rows = data.map((item) => {
        return allKeys.map((key) => {
          // If it's the "Maximum Waiting Time (sec)" column, convert seconds to minutes
          if (key.includes("Maximum Waiting Time (sec)")) {
            const valueInMinutes = item[key] / 60;
            return valueInMinutes.toFixed(2);
          }
          // Otherwise, if the key is not excluded, convert numeric values to 2 decimals
          if (!excludedColumns.includes(key)) {
            return typeof item[key] === 'number' ? item[key].toFixed(2) : item[key];
          }
          // For excluded columns, return the value as-is
          return item[key];
        });
      });

      return (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} dangerouslySetInnerHTML={{ __html: header }}></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={headers.length}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <div>No data to display.</div>;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'endDate' && parameters.startDate) {
      const startDate = new Date(parameters.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        alert('End date must be greater than start date.');
        return;
      }
    }

    if (name === 'routeDistribution') {
      setParameters((prevParams) => ({
        ...prevParams,
        routeDistribution: parseFloat(value), // Convert to float
      }));
    } else {
      setParameters((prevParams) => ({
        ...prevParams,
        [name]: value,
      }));
    }

    if (name === 'blockLocation') {
      setParameters((prev) => ({ ...prev, [name]: value }));
      if (longTermRouteMap[value]) {
        setAlternativeRouteOptions(longTermRouteMap[value]);
      } else {
        setAlternativeRouteOptions([]);
      }
      return;
    }
  };

  const handlePrevPlot = () => {
    setCurrentPlotIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : plots.length - 1)); // Updated
  };

  const handleNextPlot = () => {
    setCurrentPlotIndex((prevIndex) => (prevIndex + 1) % plots.length); // Updated
  };

  async function fetchData(scenario) {
    let baseUrl = process.env.REACT_APP_BACKEND_SERVER_URL;
    let type = ''
    if(scenario === 'shortTerm'){
      type = 'short'
    }else if (scenario === 'longTerm'){
      type = 'long'
    }
    const response = await fetch(baseUrl + '/scenario_analysis/plots_suggestions?type='+type, {
      method: 'GET',
    });

    if (response.status === 200) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      console.error('Error fetching data:', response.statusText);
      return null;
    }
  }

  const prepareBoxPlotData = (data) => {
    return Object.keys(data).map((key) => ({
      y: data[key],
      type: 'box',
      name: `${key}`,
    }));
  };

  const prepareLinePlotData = (data) => {
    return Object.keys(data).map((key) => ({
      x: Array.from({ length: data[key].length }, (_, index) => index),
      y: data[key],
      type: 'scatter',
      mode: 'lines+markers',
      name: `${key}`,
    }));
  };

  const handleRunScenario = async () => {

    if (isRunDisabled) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsLoading(true);
    setHasData(false);
    setData(null);
    setPlots([]); 
    setShortTermMapPath('');
    setLongTermMapPaths([]);

    const baseUrl = process.env.REACT_APP_BACKEND_SERVER_URL;
    const apiUrl = baseUrl + '/scenario_analysis';
    const beVideoUrl = baseUrl + '/videoUrls';

    const disruptionDateTime = new Date(parameters.disruptionTimeDate);
    const disruptionLength = parameters.disruptionLength;
    const disruptionLocation = parameters.disruptionLocation;
    const inOutRoute = parameters.inOutRoute;
    const month = disruptionDateTime.toLocaleString('en-US', { month: 'short' });
    const dayOfWeek = getNumericDayOfWeek(disruptionDateTime.toLocaleString('en-US', { weekday: 'short' }));
    const hour = disruptionDateTime.getHours();

    function getNumericDayOfWeek(shortDay) {
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const index = daysOfWeek.indexOf(shortDay);
      return index !== -1 ? (index + 1).toString() : '';
    }

    const scenarioType = document.querySelector('input[name="scenarioType"]:checked').value;
    let video_url_before = '';
    let video_url_after = '';
    let videoRequestBody = {
      analysis_type: scenarioType,
    };
    if(scenarioType === "shortTerm"){
      videoRequestBody.disruption_location = disruptionLocation;
      videoRequestBody.inOutRoute = inOutRoute;
    } else if (scenarioType === "longTerm"){
      videoRequestBody.disruption_location = parameters.blockLocation
    }

    try {
      const videoResponse = await fetch(beVideoUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoRequestBody),
      });

      if (videoResponse.status === 200) {
        const videoData = await videoResponse.json();
        video_url_before = videoData.video_url_before;
        video_url_after = videoData.video_url_after;

        setVideoUrl(video_url_before);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Video API request failed with status:', error);
    }

    if (scenarioType === 'shortTerm' && disruptionLocation && inOutRoute) {
      const mapPath = buildShortTermMapPath(disruptionLocation, inOutRoute);
      setShortTermMapPath(mapPath);
    } else if (scenarioType === 'longTerm' && parameters.blockLocation) {
      const paths = buildLongTermMapPaths(parameters.blockLocation);
      setLongTermMapPaths(paths);
    }

    const requestBody = {};

    

    if (scenarioType === 'shortTerm') {
      requestBody.disruption_length = disruptionLength;
      requestBody.disruption_location = disruptionLocation;
      requestBody.inOutRoute = inOutRoute;
      requestBody.date_hour = disruptionDateTime;
      requestBody.month = month;
      requestBody.day = dayOfWeek;
      requestBody.hour = hour;
    } else {
      requestBody.start_date = parameters.startDate;
      requestBody.end_date = parameters.endDate;
      requestBody.block_location = parameters.blockLocation;
      requestBody.route_distribution = [parameters.routeDistribution, 1 - parameters.routeDistribution];
    }
    requestBody.analysis_type = scenarioType;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 200) {
        setHasData(true);
        setIsLoading(false);

        const baseUrl2 = process.env.REACT_APP_BACKEND_SERVER_URL + '/files/';
        

        const scenarioData = await fetchData(scenarioType);
        if (scenarioData) {
          //console.log(scenarioData);
          setData(scenarioData.simulation_results);

          if (scenarioType === 'shortTerm') {
            const cyclePlot = {
              data: prepareBoxPlotData(Object.fromEntries(
                Object.entries(scenarioData.cycle_data).map(([key, values]) => [
                  key,
                  values.map((value) => value / 60), // Convert seconds to minutes
                ])
              )
            ),
              layout: { title: 'Cycle Time Box Plot', boxmode: 'group',
                xaxis: { showgrid: false },
                yaxis: {
                  title: 'Cycle Time (Minutes)', showgrid: false 
                },
              },
            };

            const waitPlot = {
              data: prepareBoxPlotData(Object.fromEntries(
                Object.entries(scenarioData.waiting_data).map(([key, values]) => [
                  key,
                  values.map((value) => value / 60), // Convert seconds to minutes
                ])
              )
            ),
              layout: { title: 'Wait Time Box Plot', boxmode: 'group',
                xaxis: { showgrid: false },
                yaxis: {
                  title: 'Wait Time (Minutes)', showgrid: false
                },
              },
            };



            setPlots([cyclePlot, waitPlot]);
            if(disruptionLocation){
              const sectionData = await fetchRiskSectionData(disruptionLocation);
              renderSectionPlot(sectionData, disruptionLocation);
            }

            
            if (inOutRoute) {
              const [inroute, outroute] = inOutRoute.split('-');
            const routeData = await fetchRiskRouteData(inroute, outroute);

              renderRoutePlot(routeData, inroute, outroute);
            }
            

          }
          else if (scenarioType === 'longTerm'){
            const replaceZerosWithAverage = (arr) => {
              const nonZero = arr.filter(v => v !== 0);
              const avg = nonZero.length > 0 ? nonZero.reduce((a, b) => a + b, 0) / nonZero.length : 0;
              return arr.map(v => v === 0 ? avg : v);
            };

            // Process cycle times: convert seconds to minutes and replace zeros
            const processedCycleTimes = Object.fromEntries(
              Object.entries(scenarioData.average_cycle_times).map(([key, values]) => [key, replaceZerosWithAverage(values.map(v => v ))])
            );

            // Process waiting times: replace zeros with average
            const processedWaitingTimes = Object.fromEntries(
              Object.entries(scenarioData.average_waiting_times).map(([key, values]) => [key, replaceZerosWithAverage(values)])
            );
            const cycleLinePlot = {
              data: prepareLinePlotData(processedCycleTimes),
              layout: { title: 'Average Cycle Time Plot',

                yaxis: {
                  title: 'Cycle Time (Minutes)', showgrid: false
                },
                xaxis: {
                  title: 'Hour of the day', showgrid: false
                },
               },
            };
          
            const waitLinePlot = {
              data: prepareLinePlotData(processedWaitingTimes),
              layout: { title: 'Average Waiting Time Plot' ,
                yaxis: {
                  title: 'Wait Time (Sec)', showgrid: false
                },
                xaxis: {
                  title: 'Hour of the day', showgrid: false
                },
              },
            };

            const hazmatWaitLinePlot = {
              data: prepareLinePlotData(scenarioData.hazmat_wait_times),
              layout: { title: 'Hazmat Waiting Time Plot' },
            }
          
            setPlots([cycleLinePlot, waitLinePlot, hazmatWaitLinePlot]);

          }

          setVideoUrl(video_url_after);
          
        } else {
          console.error('Failed to retrieve data for scenario:', scenarioType);
        }

        
      } else {
        console.error('API request failed with status:', response.status);
      }
    } catch (error) {
      console.error('Error while sending API request:', error);
    }
  };

  const handleScenarioTypeChange = (e) => {
    const newType = e.target.value;
    setScenarioType(newType);

    if (newType === 'shortTerm') {
      setShowShortTermInputs(true);
      setShowLongTermInputs(false);
    } else {
      setShowShortTermInputs(false);
      setShowLongTermInputs(true);
    }
  };

  const handleClear = () => {
    

    setParameters({
      disruptionLocation: '',
      inOutRoute: '',
      disruptionLength: '',
      disruptionTimeDate: '',
      startDate: '',
      endDate: '',
      blockLocation: '',
      routeDistribution: 0.0,
    });
    setScenarioType('shortTerm');
  
    setVideoUrl('');
    setPlots([]);
    setShortTermMapPath('');
    setLongTermMapPaths([]);
    setHasData(false)
    setData(null);

  };

  return (
    <div className="scenario-analysis-container">
      {openHelpKey && renderHelpModal()}
      <div className="left-panel">
        {/* Radio Buttons for Scenario Type */}
        <div className="scenario-type-radio">
          <label>
            <input
              type="radio"
              name="scenarioType"
              value="shortTerm"
              checked={scenarioType === 'shortTerm'}
              onChange={handleScenarioTypeChange}
            />
            Short-term
          </label>
          <label>
            <input
              type="radio"
              name="scenarioType"
              value="longTerm"
              checked={scenarioType === 'longTerm'}
              onChange={handleScenarioTypeChange}
            />
            Long-term
          </label>
        </div>

        {/* Scenario Parameters */}
        <div className="scenario-parameters">
          <h3 className="sa-headers">Scenario Parameters</h3>

          {showShortTermInputs && (
            <div className="short-term-inputs">
              {/* Disruption Location */}
              <div className="parameter">
                <label htmlFor="disruptionLocation">Disruption Location:
                <a data-tooltip-id="aboutTipDL" data-tooltip-content="Select the location where the disruption is expected to occur."
                 className="tooltip-circle">?</a>
              <Tooltip id="aboutTipDL" place="top" effect="solid" className="custom-tooltip" />
            
                </label>
                <select id="disruptionLocation" name="disruptionLocation" onChange={handleInputChange}>
                  <option value="">Select</option>
                  {Object.keys(sectionNamesMap).map((section) => (
                    <option key={section} value={section}>
                      {sectionNamesMap[section]}
                    </option>
                  ))}
                </select>
              </div>

              {/* In - Out Route */}
              <div className="parameter">
                <label htmlFor="inIutRoute">EntryRoute - ExitRoute
                <a data-tooltip-id="aboutTipEE" data-tooltip-content="Choose the entry and exit routes affected by the disruption to simulate its impact on traffic and logistics."
                 className="tooltip-circle">?</a>
              <Tooltip id="aboutTipEE" place="top" effect="solid" className="custom-tooltip" />
            
                </label>
                <select id="inOutRoute" name="inOutRoute" onChange={handleInputChange}>
                  <option value="">Select</option>
                  {filteredRoutes.map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disruption Length */}
              <div className="parameter">
                <label htmlFor="disruptionLength">Disruption Length:
                <a data-tooltip-id="aboutTipDisruption" data-tooltip-content="Enter the exact date and time when the disruption is expected to start. This helps in scheduling and analysis."
                 className="tooltip-circle">?</a>
              <Tooltip id="aboutTipDisruption" place="top" effect="solid" className="custom-tooltip" />
            
                </label>
                <select id="disruptionLength" name="disruptionLength" onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="short">Short (15 Min- 30 Min)</option>
                  <option value="medium">Medium (30 Min - 2 Hrs)</option>
                  <option value="long">Long (2 Hrs - 4 Hrs)</option>
                </select>
              </div>
              {/* Disruption Time & Date */}
              <div className="parameter">
                <label htmlFor="disruptionTimeDate">Disruption Time & Date:</label>
                <input type="datetime-local" id="disruptionTimeDate" name="disruptionTimeDate" onChange={handleInputChange} />
              </div>
            </div>
          )}

          {showLongTermInputs && (
            <div className="long-term-inputs">
              <div className="parameter">
                <label htmlFor="startDate">Start Date:</label>
                <input type="date" id="startDate" name="startDate" onChange={handleInputChange} />
              </div>
              <div className="parameter">
                <label htmlFor="endDate">End Date:</label>
                <input type="date" id="endDate" name="endDate" onChange={handleInputChange} />
              </div>
              <div className="parameter">
                <label htmlFor="blockLocation">Block Location:</label>
                <select id="blockLocation" name="blockLocation" onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="Construction at Crossing Before Checkpoint">Construction at Crossing Before Checkpoint</option>
                  <option value="Construction at Ocean Dock Rd and Roger Graves Rd">Construction at Ocean Dock Rd and Roger Graves Rd</option>
                  <option value="Anchorage Port Rd">Anchorage Port Rd</option>
                  <option value="Terminal Rd">Terminal Rd</option>
                </select>
              </div>
              <div className="parameter">
                <label>Alternative Route Options:</label>
                <div className="alternative-route-display">
                  {alternativeRouteOptions.length > 0 ? alternativeRouteOptions.join(', ') : 'N/A'}
                </div>
              </div>
              <div className="parameter">
                <label htmlFor="routeDistribution">Alternative Route Distribution:</label>
                <select id="routeDistribution" name="routeDistribution" onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="0.000000000001">0 , 1</option>
                  <option value="0.25">0.25 , 0.75</option>
                  <option value="0.5">0.5 , 0.5</option>
                  <option value="0.75">0.75 , 0.25</option>
                  <option value="1">1 , 0</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="run-button" disabled={isRunDisabled} onClick={handleRunScenario} >
            Run
          </button>
          <button className="stop-button">Stop</button>
          <button className="clear-button" onClick={handleClear}>Clear</button>
        </div>

        {/* CSV Upload Section */}

        <h3 className="sa-headers">Vehicle Data Upload</h3>
        <div className="action-buttons" style={{ marginTop: '10px' }}>
        <input type="file" onChange={handleFileChange} />
          <button onClick={handleUploadCSV}>Upload CSV</button>
        </div>
        {uploadMsg && (
          <p style={{ padding: '8px', fontStyle: 'italic', color: 'red' }}>
            {uploadMsg}
          </p>
        )}
      </div>
      <div className="center-panel">
        <div className="statistics-and-plots">
        <h3 className="sa-headers">
            Statistics and Plots
            {/* Add a help icon that references scenarioHelpData.statisticsAndPlots */}
            <span className="help-icon" onClick={() => setOpenHelpKey('statisticsAndPlots')}>
              ?
            </span>
          </h3>
        
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={100} />
            </div>
          ) : hasData ? (
            <div className="plot-container">
              <ArrowBackIosIcon className="arrow-icon left-arrow" onClick={handlePrevPlot} />
              <div className="plot-wrapper">
                {plots[currentPlotIndex] && (
                  <Plot
                  data={plots[currentPlotIndex].data}
                  layout={{
                    ...plots[currentPlotIndex].layout,
                    autosize: true, // Let Plotly auto-size
                    margin: { t: 50, b: 50, l: 50, r: 50 }, // optional margins
                  }}
                  useResizeHandler={true} // Enable Plotly’s built-in responsive behavior
                  style={{ width: '100%', height: '100%' }} // Fill the parent container
                />
                )}
              </div>
              <ArrowForwardIosIcon className="arrow-icon right-arrow" onClick={handleNextPlot} />
            </div>
          ) : (
            <div>Run scenario analysis to see the corresponding plots.</div>
          )}
        </div>

        <div className="sa-suggestions-box">
        <h3 className="sa-headers">
            Suggestions
            <span className="help-icon" onClick={() => setOpenHelpKey('suggestionsTable')}>
              ?
            </span>
          </h3>
          <p>{suggestions}</p>
          {data ? renderTable() : <div>Run scenario analysis to see suggestions...</div>}
        </div>
        {/* RISK TABLES BELOW: only show them if hasData === true */}
        {hasData && scenarioType === 'shortTerm' && <ShortTermRiskTable />}
        {hasData && scenarioType === 'longTerm' && <LongTermRiskTable />}
      </div>
      {/* Video and Suggestions */}
      <div className="right-panel">
        {/* Video Container */}
        <div className="video-placeholder">
          {videoUrl ? (
            <ReactPlayer url={videoUrl} playing={isPlaying} loop controls width="100%" height="100%" />
          ) : (
            <video width="100%" height="100%" controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        {(
          <div className="maps-container">
            {scenarioType === 'shortTerm' && shortTermMapPath && (
              <div className="short-term-map">
                <img src={shortTermMapPath} alt="Short-Term Map" />
              </div>
            )}
            {scenarioType === 'longTerm' && longTermMapPaths.length === 2 && (
              <div className="long-term-maps">
                <img src={longTermMapPaths[0]} alt="Long-Term Map 1" />
                <img src={longTermMapPaths[1]} alt="Long-Term Map 2" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ScenarioAnalysis;
