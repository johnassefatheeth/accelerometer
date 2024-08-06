import React, { useState, useEffect } from 'react';

const samples = {
  sample1: [
    { x: -1, y: 0, z: 0, magnitude: 1000 },
    // Add more sample data
  ],
  sample2: [
    { x: 0, y: 1, z: 0, magnitude: 1200 },
    // Add more sample data
  ],
};

function DataView({ className }) {
  const [selectedSample, setSelectedSample] = useState('');
  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    if (selectedSample) {
      setSampleData(samples[selectedSample]);
    }
  }, [selectedSample]);

  const handleSampleChange = (e) => {
    setSelectedSample(e.target.value);
  };

  return (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-2">Data View</h2>
      <select
        value={selectedSample}
        onChange={handleSampleChange}
        className="border rounded p-2 mb-4 w-full"
      >
        <option value="">Select Sample</option>
        {Object.keys(samples).map((key) => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <pre>{JSON.stringify(sampleData, null, 2)}</pre>
    </div>
  );
}

export default DataView;
