import React from 'react';

type DataViewProps = {
  accelerometerData: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
};

const DataView: React.FC<DataViewProps> = ({ accelerometerData }) => {
  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-400">
      <h2 className="text-xl font-semibold mb-2">Accelerometer Data</h2>
      <div className="text-gray-700">
        <p>X: {accelerometerData.x.toFixed(2)}</p>
        <p>Y: {accelerometerData.y.toFixed(2)} </p>
        <p>Z: {accelerometerData.z.toFixed(2)} </p>
        <p>Magnitude: {accelerometerData.magnitude.toFixed(2)} milliG</p>
      </div>
      <div className="mt-4">
        <div className="relative w-full h-4 bg-gray-200">
          
        </div>
      </div>
    </div>
  );
};

export default DataView;
