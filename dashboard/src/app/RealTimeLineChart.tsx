"use client";

import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {ApexOptions} from 'apexcharts';

const RealTimeLineChart = ({ title, data } : {title: string, data: number[]}) => {

  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      id: "realtime",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000 // Update chart every second
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth"
    },
    title: {
      text: title,
      align: "left"
    },
    xaxis: {
      type: "datetime",
      range: 30_000 // Show data for last 10 seconds
    },
    yaxis: {
      max: 100
    }
  });



  return (
    <div>
        <Chart
          options={options}
          series={[{
            name: "Data Series 1",
            data: data // Initialize with empty data
          }]}
          type="line"
          height="295"
        />

    </div>
  );
};

export default RealTimeLineChart;
