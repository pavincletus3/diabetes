import React, { useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
          focused ? "text-sky-400" : "text-slate-300"
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
        className={`w-full px-4 py-3 bg-slate-800 border rounded-xl shadow-sm outline-none transition-all duration-200 text-slate-100 placeholder-slate-500
          ${
            focused
              ? "border-sky-500 ring-2 ring-sky-500/20"
              : "border-slate-600 hover:border-slate-500"
          }`}
      />
    </div>
  );
};

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
          focused ? "text-sky-400" : "text-slate-300"
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
          className={`w-full appearance-none px-4 py-3 bg-slate-800 border rounded-xl shadow-sm outline-none transition-all duration-200 text-slate-100
            ${
              focused
                ? "border-sky-500 ring-2 ring-sky-500/20"
                : "border-slate-600 hover:border-slate-500"
            }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
          focused ? "text-sky-400" : "text-slate-300"
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
        className={`w-full px-4 py-3 bg-slate-800 border rounded-xl shadow-sm outline-none transition-all duration-200 text-slate-100 placeholder-slate-500 resize-y
          ${
            focused
              ? "border-sky-500 ring-2 ring-sky-500/20"
              : "border-slate-600 hover:border-slate-500"
          }`}
      />
    </div>
  );
};
