import React from 'react';

type DropdownProps = {
  options: { id: number; label: string }[];
  onChange: (selectedId: number) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ options, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(parseInt(event.target.value, 10));
  };

  return (
    <div className="mb-12">
      <label htmlFor="sample-select" className="block text-sm font-medium text-gray-700">
        Select Sample
      </label>
      <select
        id="sample-select"
        onChange={handleChange}
        className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
