import React from "react";

interface ProgressCircleProps {
    progress: number; // A value between 0 and 1
    size?: number; // Diameter of the circle
    strokeWidth?: number; // Width of the progress bar
    color?: string; // Color of the progress bar
    trailColor?: string; // Color of the trail
    duration?: number; // Animation duration in seconds
    count: number | string; // Count to display in the center
    count2: number | string; // Count to display in the center
  }

  const ProgressCircle: React.FC<ProgressCircleProps> = ({
    progress,
  size = 110,
  strokeWidth = 6,
  color = '#FFEA82',
  trailColor = '#eee',
  duration = 1.4,
  count,
  count2,
  }) => {
    const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ margin: '20px' }}
    >
      <circle
        stroke={trailColor}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: `stroke-dashoffset ${duration}s ease-in-out`,
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
        }}
      />
      <text
        x="50%"
        y="50%"
        dy=".3em"
        textAnchor="middle"
        fontSize="20"
        fill={"#023047"}
      >
      {count2} / {count}
      </text>
    </svg>
  );
};

  export default ProgressCircle;
