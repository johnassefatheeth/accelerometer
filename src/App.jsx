import React, { useState } from 'react';
import DataView from './components/DataView';
import BoxVisualization from './components/BoxVisualization';
import Dropdown from './components/Dropdown';
import actualShockDataInterpolated1 from './data/shock data samples';

const App = () => {
  const [selectedSample, setSelectedSample] = useState(actualShockDataInterpolated1[0]);

  const handleSampleChange = (id) => {
    const sample = actualShockDataInterpolated1.find((sample, index) => index === id);
    if (sample) {
      setSelectedSample(sample);
    }
  };

  return (
    <div className="  justify-center items-center w-full h-screen ">
      <div className=" justify-center items-center h-[400px]">
        <div className=''>
          <Dropdown
            options={actualShockDataInterpolated1.map((sample, index) => ({ id: index, label: `Sample ${index + 1}` }))}
            onChange={handleSampleChange}
          />
          <DataView
            accelerometerData={{
              x: selectedSample.accelerometer.xAxis,
              y: selectedSample.accelerometer.yAxis,
              z: selectedSample.accelerometer.zAxis,
              magnitude: selectedSample.magnitude
            }}
          />
        </div>
        <BoxVisualization
          accelerometerData={{
            x: selectedSample.accelerometer.xAxis,
            y: selectedSample.accelerometer.yAxis,
            z: selectedSample.accelerometer.zAxis,
            magnitude: selectedSample.magnitude
          }}
        />
      </div>
    </div>
  );
};

export default App;
