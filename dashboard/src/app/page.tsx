"use client";

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
const RealTimeLineChart = dynamic(() => import('./RealTimeLineChart'), {
  ssr: false // Disable server-side rendering for this component
});
const Test = () => {

  const [windSpeedData, setWindSpeedData] = useState([]);
  const [loadData, setLoadData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://esp32_local_ip_here/ws'); // ESP32 WebSocket endpoint

    // Listen for messages
    socket.addEventListener("message", (event) => {
      const message = event.data;
      console.log(message)
      if (message.startsWith("wind:")) {
        const windSpeed = parseInt(message.slice(5));
        const newDataPoint = {
          x: new Date().getTime(),
          y: isNaN(windSpeed) ? 0 : windSpeed
        }

        // const newDataPoint = generateLiveData();
        setWindSpeedData((prevData) => [...prevData, newDataPoint]);
      }
      if (message.startsWith("load:")) {
        const load = parseInt(message.slice(5));
        const newDataPoint = {
          x: new Date().getTime(),
          y: isNaN(load) ? 0 : load
        }

        // const newDataPoint = generateLiveData();
        setLoadData((prevData) => [...prevData, newDataPoint]);
      }
    });
  }, [])

  const generateLiveData = () => {
    const timestamp = new Date().getTime(); // Current timestamp
    const randomValue = Math.floor(Math.random() * 100); // Random y-value
    return { x: timestamp, y: randomValue };
  };

  return (
    <div className="h-screen p-3">
      <div className="w-full h-1/2">
        <div className="p-3 inline-block w-1/4 h-full align-top">
          <div className="h-full border text-gray-700 flex align-top justify-center items-center flex-col rounded-lg shadow">
            <div className="text-xl font-bold text-gray-700" style={{fontVariant: "small-caps"}}>Windspeed</div>
            <div className="text-7xl">{windSpeedData.length > 0 ? windSpeedData[windSpeedData.length-1].y : "-"}</div>
            <div className="text-2xl">km/h</div>
          </div>
        </div>
        <div className="inline-block p-3 w-3/4 h-full">
          <div className="shadow border rounded-lg p-3 h-full">
            <RealTimeLineChart data={windSpeedData}/>
          </div>
        </div>
      </div>
      <div className="w-full h-1/2">
        <div className="p-3 inline-block w-1/4 h-full align-top">
          <div className="h-full border text-gray-700 flex align-top justify-center items-center flex-col rounded-lg shadow p-3">
            <div className="text-xl font-bold text-gray-700" style={{fontVariant: "small-caps"}}>Force</div>
            <div className="text-7xl">{loadData.length > 0 ? loadData[loadData.length-1].y : "-"}</div>
            <div className="text-2xl">g</div>
          </div>
        </div>
        <div className="inline-block p-3 w-3/4 h-full">
          <div className="shadow border rounded-lg p-3 h-full">
            <RealTimeLineChart data={loadData} />
          </div>
        </div>
      </div>
    </div>
  );
};




export default Test;
