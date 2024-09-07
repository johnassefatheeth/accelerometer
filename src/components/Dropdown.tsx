import React, { useState, useEffect } from 'react';

type RangeSelectorProps = {
  options: { id: number; label: string; magnitude: number }[];
  onChange: (selectedId: number) => void;
};

const RangeSelector: React.FC<RangeSelectorProps> = ({ options, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].id);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setSelectedValue(value);
    onChange(value);
  };

  const playEvent = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < options.length) {
          setSelectedValue(options[index].id);
          onChange(options[index].id);
          index++;
        } else {
          clearInterval(interval);
          setIsPlaying(false);
        }
      }, 10); // Adjust the speed as necessary (e.g., 100ms per frame)
    }
  }, [isPlaying]);

  const currentOption = options.find(option => option.id === selectedValue);

  return (
    <div className="mb-12">
      <label htmlFor="sample-range" className="block text-sm font-medium text-gray-700">
        Select Sample
      </label>
      <input
        id="sample-range"
        type="range"
        min={Math.min(...options.map(option => option.id))}
        max={Math.max(...options.map(option => option.id))}
        value={selectedValue}
        onChange={handleChange}
        className="w-full"
      />
      {currentOption && (
        <div className="mt-2 text-center">
          {/*  */}
          <p className="mt-2 text-sm font-medium text-gray-700">{currentOption.label}</p>
        </div>
      )}
      <button onClick={playEvent} className=" px-4 py-2 bg-blue-500 text-white rounded-lg">
        Play Event
      </button>
    </div>
  );
};

export default RangeSelector;
