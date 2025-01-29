import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { normalize_aqi, normalize_pollu } from "../public/constant";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import "./styles.css";

const stations = [1, 2, 3, 4];

// Pollutant mapping
const getPollutantName = (code) => {
  const pollutants = {
    0: "PM2.5",
    1: "O₃",
    2: "CO",
    3: "NO₂",
  };
  return pollutants[code] || code;
};

const fetchData = async (stationId) => {
  try {
    const response = await fetch(
      `https://rhvclppzab.execute-api.ap-southeast-2.amazonaws.com/default/get_forecast_data?station=${stationId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const formatDateTime = (date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    day: "numeric",
    month: "short",
  });
};

// Hàm lấy màu sắc tương ứng với AQI
const getAQIColor = (aqi) => {
  if (aqi <= 50) return "good"; // Green
  if (aqi <= 100) return "moderate"; // Yellow
  if (aqi <= 150) return "unhealthy-for-sensitive-groups"; // Orange
  if (aqi <= 200) return "unhealthy"; // Red
  if (aqi <= 300) return "very-unhealthy"; // Purple
  return "hazardous"; // Maroon
};

// Helper function to get the appropriate class based on AQI value
const getAQIColorClass = (aqi, prefix = "") => {
  if (aqi <= 50) return `${prefix}-aqi-good`;
  if (aqi <= 100) return `${prefix}-aqi-moderate`;
  if (aqi <= 150) return `${prefix}-aqi-unhealthy-for-sensitive-groups`;
  if (aqi <= 200) return `${prefix}-aqi-unhealthy`;
  if (aqi <= 300) return `${prefix}-aqi-very-unhealthy`;
  return `${prefix}-aqi-hazardous`;
};

const MainPage = () => {
  // Mock data for main page - replace with actual data fetching logic
  const mainPageData = {
    location: "HCM AQI",
    aqi: 110,
    mainPollutant: "PM2.5",
    stations: [
      {
        id: 1,
        name: "Urban Area of Viet Nam National University, Thu Duc City",
        aqi: null,
        mainPollutant: null,
      },
      {
        id: 2,
        name: "Department of Education and Training of Binh Tan District",
        aqi: 110,
        mainPollutant: "PM2.5",
      },
      {
        id: 3,
        name: "MobiFone Transmission Station, Tan Binh District",
        aqi: 77,
        mainPollutant: "PM2.5",
      },
      {
        id: 4,
        name: "Cu Chinh Lan School, Thanh Da, Binh Thanh District",
        aqi: 71,
        mainPollutant: "PM2.5",
      },
      {
        id: 5,
        name: "Thanh Nien Newspaper Headquarters, D3",
        aqi: null,
        mainPollutant: null,
      },
      {
        id: 6,
        name: "MobiFone Thanh Thai, District 10",
        aqi: 78,
        mainPollutant: "NO2",
      },
    ],
  };

  return (
    <main className="content main-page-bg">
      <div className="page-header">
        <span className="breadcrumb">Pages/Main Page</span>
        <h1>Main Page</h1>
      </div>

      <div className="main-page-content">
        <div className="map-container">
          {/* Replace with actual map component */}
          <img
            src={require("/resrouces/station_map.png")}
            alt="Map of monitoring stations"
          />
        </div>

        {/* Dynamic class for aqi-overview */}
        <div className={`aqi-overview aqi-${getAQIColor(mainPageData.aqi)}`}>
          <h2>{mainPageData.aqi}</h2>
          <p>{mainPageData.location}</p>
          <p>Main Pollutant: {mainPageData.mainPollutant}</p>
          <p className="aqi-status">
            {/* Hiển thị trạng thái dựa trên AQI */}
            {mainPageData.aqi <= 50
              ? "Good"
              : mainPageData.aqi <= 100
              ? "Moderate"
              : mainPageData.aqi <= 150
              ? "Unhealthy for Sensitive Groups"
              : mainPageData.aqi <= 200
              ? "Unhealthy"
              : mainPageData.aqi <= 300
              ? "Very Unhealthy"
              : "Hazardous"}
          </p>
        </div>

        <table className="stations-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Stations</th>
              <th>AQI</th>
              <th>Main Pollutant</th>
            </tr>
          </thead>
          <tbody>
            {mainPageData.stations.map((station, index) => (
              <tr key={station.id}>
                <td>{index + 1}</td>
                <td>{station.name}</td>
                <td
                  className={`aqi-cell ${
                    station.aqi === null
                      ? ""
                      : `aqi-${getAQIColor(station.aqi)}`
                  }`}
                >
                  {station.aqi ? station.aqi : ""}
                </td>
                <td
                  className={`pollutant-cell pollutant-${station.mainPollutant}`}
                >
                  {station.mainPollutant ? station.mainPollutant : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

const ForecastPage = () => {
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [containerRef, setContainerRef] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchData(selectedStation);
        setData(result);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStation]);

  useEffect(() => {
    const updateChartWidth = () => {
      if (containerRef) {
        const containerWidth = containerRef.offsetWidth;
        setChartWidth(Math.min(800, containerWidth - 40)); // 40px for padding
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);
    return () => window.removeEventListener("resize", updateChartWidth);
  }, [containerRef]);

  const chartData = data.map((item, index) => ({
    hour: index,
    AQI: normalize_aqi(item.aqi_pred),
    maxPollutant: normalize_pollu(item.aqi_pollutant_pred),
  }));

  const currentTime = new Date();
  const hourlyForecast = data.map((item, index) => {
    const forecastTime = new Date(currentTime);
    forecastTime.setHours(currentTime.getHours() + index);
    return {
      time: index === 0 ? "Now" : formatDateTime(forecastTime),
      value: normalize_aqi(item.aqi_pred).toFixed(1),
      pollutant: getPollutantName(item.aqi_pollutant_pred),
    };
  });

  return (
    <main className="content">
      <div className="page-header">
        <span className="breadcrumb">Pages/Forecast</span>
        <h1>Forecast</h1>
      </div>

      <div className="station-forecast" ref={setContainerRef}>
        <div className="flex justify-between items-center mb-4">
          <h2>Station {selectedStation}</h2>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(Number(e.target.value))}
            className="px-4 py-2 border rounded-md bg-white"
          >
            {stations.map((station) => (
              <option key={station} value={station}>
                Station {station}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : (
          <>
            {/* Graph Section */}
            <div className="mb-8 flex justify-center">
              <div className="overflow-x-auto" style={{ maxWidth: "100%" }}>
                <LineChart
                  width={chartWidth}
                  height={400}
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <XAxis
                    dataKey="hour"
                    label={{
                      value: "Hours Ahead",
                      position: "bottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "AQI",
                      angle: -90,
                      position: "insideLeft",
                      offset: 10,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Pollutant Level",
                      angle: 90,
                      position: "insideRight",
                      offset: 10,
                    }}
                  />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? value.toFixed(2) : value
                    }
                    labelFormatter={(label) => `Hour +${label}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="AQI"
                    stroke="#8884d8"
                    name="AQI Prediction"
                    dot={false}
                    strokeWidth={2}
                  />
                  {/* <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="maxPollutant"
                      stroke="#82ca9d"
                      name="Pollutant Level"
                      dot={false}
                      strokeWidth={2}
                    /> */}
                </LineChart>
              </div>
            </div>

            {/* Table Section */}
            <div className="forecast-info">
              <p>
                Current time: <b>{formatDateTime(currentTime)}</b>
              </p>
            </div>
            <p>
              The trending pollutant:{" "}
              <b>{getPollutantName(data[0]?.aqi_pollutant_pred)}</b>
            </p>

            {/* Horizontally scrollable hourly data container */}
            <div
              style={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid #ced4da",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "10px",
                  gap: "10px",
                  width: "fit-content",
                }}
              >
                {hourlyForecast.map((hour, i) => (
                  <div
                    key={i}
                    className={`hour-block ${getAQIColorClass(
                      Number(hour.value),
                      "forecast"
                    )}`}
                    style={{
                      flex: "0 0 150px",
                      margin: 0,
                    }}
                  >
                    <p className="time">{hour.time}</p>
                    <p className="value">{hour.value}</p>
                    <p className="pollutant">{hour.pollutant}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

const AQIDashboard = () => {
  const [currentPage, setCurrentPage] = useState("main");

  return (
    <div className="app">
      <nav className="sidebar">
        <ul>
          <li>
            <a
              href="#!"
              onClick={() => setCurrentPage("main")}
              className={currentPage === "main" ? "active" : ""}
            >
              <i className="fas fa-home"></i> Main Page
            </a>
          </li>
          <li>
            <a
              href="#!"
              onClick={() => setCurrentPage("forecast")}
              className={currentPage === "forecast" ? "active" : ""}
            >
              <i className="fas fa-chart-line"></i> Forecast
            </a>
          </li>
          <li>
            <a href="/history">
              <i className="fas fa-history"></i> History
            </a>
          </li>
          <li>
            <a href="/datasource">
              <i className="fas fa-database"></i> Datasource
            </a>
          </li>
          <li>
            <a href="/profile">
              <i className="fas fa-user"></i> Profile
            </a>
          </li>
          <li>
            <a href="/signin">
              <i className="fas fa-sign-in-alt"></i> Sign In
            </a>
          </li>
        </ul>
      </nav>

      {currentPage === "main" && <MainPage />}
      {currentPage === "forecast" && <ForecastPage />}
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<AQIDashboard />, rootElement);
