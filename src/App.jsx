import React, { useState, useEffect } from 'react';
import DataView from './components/DataView';
import BoxVisualization from './components/BoxVisualization';
import Dropdown from './components/Dropdown';
import shockDataWithoutVideo64Samples2But1200Samples from './data/shock data samples';

const App = () => {
const [selectedSample, setSelectedSample] = useState(shockDataWithoutVideo64Samples2But1200Samples[0]);
const [maxMagnitudeSample, setMaxMagnitudeSample] = useState(null);

useEffect(() => {
const findMaxMagnitudeSample = () => {
const maxSample = shockDataWithoutVideo64Samples2But1200Samples.reduce((max, sample) => {
return sample.magnitude > max.magnitude ? sample : max;
}, { magnitude: -Infinity });


  setMaxMagnitudeSample(maxSample);
};


findMaxMagnitudeSample();
}, []); 

const handleSampleChange = (id) => {
const sample = shockDataWithoutVideo64Samples2But1200Samples.find((sample, index) => index === id);
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
        options={shockDataWithoutVideo64Samples2But1200Samples.map((sample, index) => ({ id: index, label: `Sample ${index + 1}` }))}
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
          x: maxMagnitudeSample?.accelerometer.xAxis,
          y: maxMagnitudeSample?.accelerometer.yAxis,
          z: maxMagnitudeSample?.accelerometer.zAxis
        }
      } : null}
    />
  </div>
</div>
);
};

export default App;