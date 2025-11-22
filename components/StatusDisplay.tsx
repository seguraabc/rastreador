import React from 'react';
import { ScannerStatus } from '../types';

interface StatusDisplayProps {
  status: ScannerStatus;
  detectedCount: number;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, detectedCount }) => {
  const isScanning = status === ScannerStatus.SCANNING;
  const isDetected = status === ScannerStatus.DETECTED;

  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* Background Radar Effect */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {isScanning && (
          <>
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-radar"></div>
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-radar" style={{ animationDelay: '1s' }}></div>
          </>
        )}
        
        {/* Central Indicator */}
        <div className={`
          relative z-10 w-40 h-40 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500
          ${isScanning ? 'bg-gradient-to-br from-blue-500 to-blue-600 scale-105' : 'bg-gray-200'}
          ${isDetected ? 'from-green-500 to-green-600 scale-110 ring-4 ring-green-300' : ''}
        `}>
          <div className="text-center text-white">
            {isScanning ? (
              <svg className="w-16 h-16 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            ) : (
              <svg className="w-16 h-16 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            )}
            <span className={`text-sm font-medium ${!isScanning ? 'text-gray-500' : 'text-blue-100'}`}>
              {isScanning ? 'Escaneo activo' : 'En espera'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Balizas Detectadas</p>
        <p className="text-4xl font-bold text-gray-800 mt-1">{detectedCount}</p>
      </div>
    </div>
  );
};

export default StatusDisplay;