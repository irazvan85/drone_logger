import React from "react";

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Size of the spinner: 'sm', 'md', 'lg' */
  size?: "sm" | "md" | "lg";
  /** Optional loading message */
  message?: string;
  /** Optional custom className */
  className?: string;
}

/**
 * Loading Spinner component
 *
 * Displays an animated loading spinner with optional message.
 *
 * @example
 * ```tsx
 * <LoadingSpinner size="md" message="Loading photos..." />
 * ```
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  message,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="loading-spinner-inner"></div>
      </div>
      {message && <p className="loading-spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
