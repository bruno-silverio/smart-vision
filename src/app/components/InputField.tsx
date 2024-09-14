import React from 'react';

export interface InputFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ id, name, type, label, placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm font-semibold text-gray-200">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 rounded bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};
