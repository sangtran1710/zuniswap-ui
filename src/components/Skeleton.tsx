import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  height = '1.5rem',
  width = '100%',
  circle = false,
}) => {
  const skeletons = Array(count).fill(0);

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-surface-3 rounded ${circle ? 'rounded-full' : ''} ${className}`}
          style={{ height, width }}
        />
      ))}
    </>
  );
};

export default Skeleton; 