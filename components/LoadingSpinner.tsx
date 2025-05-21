import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "text-sky-400",
  className = "",
}) => {
  let spinnerSizeClass = "w-10 h-10";

  if (size === "sm") spinnerSizeClass = "w-5 h-5";
  if (size === "lg") spinnerSizeClass = "w-16 h-16";

  return (
    <div className={`${className}`}>
      <div className={`animate-spin rounded-full ${spinnerSizeClass} ${color}`}>
        <div
          className="h-full w-full rounded-full border-4 border-t-transparent border-b-transparent animate-pulse"
          style={{
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
          }}
        ></div>
      </div>
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${spinnerSizeClass} rounded-full border-t-2 border-b-2 border-transparent animate-spin`}
        style={{
          borderTopColor: "currentColor",
          borderBottomColor: "currentColor",
          borderRightColor: "transparent",
          borderLeftColor: "transparent",
        }}
      ></div>
    </div>
  );
};

// Simple pulsing dot loading indicator
export const PulsingDots: React.FC<{ color?: string }> = ({
  color = "bg-sky-400",
}) => {
  return (
    <div className="flex space-x-2 justify-center items-center">
      <div className={`h-2 w-2 ${color} rounded-full animate-pulse-fast`}></div>
      <div
        className={`h-2 w-2 ${color} rounded-full animate-pulse-fast delay-75`}
      ></div>
      <div
        className={`h-2 w-2 ${color} rounded-full animate-pulse-fast delay-150`}
      ></div>
    </div>
  );
};

// Skeleton loading placeholder
export const SkeletonLoader: React.FC<{ className?: string }> = ({
  className = "h-4 w-full",
}) => {
  return (
    <div className={`${className} bg-slate-700 rounded animate-pulse`}></div>
  );
};
