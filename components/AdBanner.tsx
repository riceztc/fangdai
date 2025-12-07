import React from 'react';

interface AdBannerProps {
  size?: 'small' | 'large';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ size = 'small', className = '' }) => {
  const heightClass = size === 'large' ? 'h-32' : 'h-16';
  
  return (
    <div className={`w-full bg-white p-2 ${className}`}>
        <div className={`w-full ${heightClass} bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm relative overflow-hidden`}>
            <span className="z-10 font-bold tracking-widest">广告位</span>
            <span className="text-xs z-10 opacity-70">点击查看详情</span>
            <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-transparent via-gray-400 to-transparent transform -skew-x-12"></div>
        </div>
    </div>
  );
};