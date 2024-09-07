import React, { useState, useEffect } from 'react';
import DataView from './components/DataView';
import BoxVisualization from './components/BoxVisualization';
import Dropdown from './components/Dropdown';
import actualShockDataInterpolated1 from './data/shock data samples';

const App = () => {
  const [selectedSample, setSelectedSample] = useState(actualShockDataInterpolated1[0]);
  const [maxMagnitudeSample, setMaxMagnitudeSample] = useState(null);

  useEffect(() => {
    // Function to find the sample with the largest magnitude
    const findMaxMagnitudeSample = () => {
      const maxSample = actualShockDataInterpolated1.reduce((max, sample) => {
        return sample.magnitude > max.magnitude ? sample : max;
      }, actualShockDataInterpolated1[0]);

      setMaxMagnitudeSample(maxSample);
    };

    findMaxMagnitudeSample();
  }, []); // Empty dependency array means this runs once after the initial render

  const handleSampleChange = (id) => {
    const sample = actualShockDataInterpolated1.find((sample, index) => index === id);
    if (sample) {
      setSelectedSample(sample);
    }
  };

  return (
    <div className="justify-center items-center w-full h-screen">
      <div className="justify-center items-center h-[400px] w-[full]">
        <div>
         
          <DataView
            accelerometerData={{
              x: selectedSample.accelerometer.xAxis,
              y: selectedSample.accelerometer.yAxis,
              z: selectedSample.accelerometer.zAxis,
              magnitude: selectedSample.magnitude
            }}
          />
        </div>
         <Dropdown
            options={actualShockDataInterpolated1.map((sample, index) => ({ id: index, label: `Sample ${index + 1}` }))}
            onChange={handleSampleChange}
          />
        <BoxVisualization
          accelerometerData={{
            x: selectedSample.accelerometer.xAxis,
            y: selectedSample.accelerometer.yAxis,
            z: selectedSample.accelerometer.zAxis,
            magnitude: selectedSample.magnitude
          }}
          maxMagnitudeSample={maxMagnitudeSample ? {
            magnitude: maxMagnitudeSample.magnitude,
            coordinates: {
              x: maxMagnitudeSample.accelerometer.xAxis,
              y: maxMagnitudeSample.accelerometer.yAxis,
              z: maxMagnitudeSample.accelerometer.zAxis
            }
          } : null}
        />
      </div>
    </div>
  );
};

export default App;
