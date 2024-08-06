import React, { useState } from 'react';
import DataView from './components/DataView';
import BoxVisualizer from './components/BoxVisualizer';

function App() {
  const [sampleData, setSampleData] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-2xl font-bold my-4">Cardboard Box Visualizer</header>
      <div className="flex w-full max-w-4xl">
        <DataView className="w-1/3 p-4" onSampleChange={setSampleData} />
        <BoxVisualizer className="w-2/3 p-4" data={sampleData} />
      </div>
    </div>
  );
}

export default App;
