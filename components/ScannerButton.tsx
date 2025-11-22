import React from 'react';

interface ScannerButtonProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const ScannerButton: React.FC<ScannerButtonProps> = ({ isActive, onToggle, disabled }) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-2xl text-lg font-bold shadow-lg transition-all transform active:scale-95
        flex items-center justify-center space-x-3
        ${isActive 
          ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200' 
          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isActive ? (
        <>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          <span>Detener Escáner</span>
        </>
      ) : (
        <>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Activar Colaboración</span>
        </>
      )}
    </button>
  );
};

export default ScannerButton;
