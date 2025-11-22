import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatusDisplay from './components/StatusDisplay';
import ScannerButton from './components/ScannerButton';
import LogFeed from './components/LogFeed';
import { ScannerStatus, ScanEvent, BeaconData } from './types';
import { getCurrentLocation } from './services/locationManager';
import { TARGET_SERVICE_UUID, PRIVACY_POLICY_TEXT } from './constants';
import { getSafetyAdvice } from './services/geminiService';

export default function App() {
  const [status, setStatus] = useState<ScannerStatus>(ScannerStatus.IDLE);
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [useSimulation, setUseSimulation] = useState<boolean>(true); // Default to simulation for web demo
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string | null>(null);

  // Simulation interval ref
  const simulationRef = useRef<number | null>(null);

  // Handle "Found" logic (Generic for Sim or Real)
  const handleBeaconFound = useCallback(async (beaconData: BeaconData) => {
    setStatus(ScannerStatus.DETECTED);
    
    // Immediately try to get location
    let location = null;
    try {
      location = await getCurrentLocation();
    } catch (e) {
      console.warn("Could not fetch location", e);
    }

    const newEvent: ScanEvent = {
      id: Date.now().toString(),
      beacon: beaconData,
      location: location,
      status: 'synced' // Mocking immediate sync
    };

    setEvents(prev => [newEvent, ...prev]);

    // Trigger Gemini Analysis for the detected event
    // In a real app, this might be triggered by server response saying "This is a lost pet!"
    // Here we simulate a 20% chance it's a lost pet to show the Gemini feature
    if (Math.random() > 0.7) {
       const context = `Pet Beacon ID ${beaconData.minor} detected at coordinates ${location?.latitude}, ${location?.longitude}. Time: ${new Date().toLocaleTimeString()}. Signal Strength: ${beaconData.rssi}dBm (Strong).`;
       getSafetyAdvice(context).then(adviceText => {
         setAdvice(adviceText);
       });
    }

    // Reset status to SCANNING after a moment
    setTimeout(() => {
      setStatus(prev => prev === ScannerStatus.IDLE ? ScannerStatus.IDLE : ScannerStatus.SCANNING);
    }, 2000);

  }, []);

  const startSimulation = useCallback(() => {
    // Simulate a find every 8-15 seconds
    const loop = () => {
        const delay = Math.random() * 7000 + 8000; 
        simulationRef.current = window.setTimeout(() => {
            const mockBeacon: BeaconData = {
                uuid: TARGET_SERVICE_UUID,
                minor: Math.floor(Math.random() * 9000) + 1000,
                rssi: -50 - Math.floor(Math.random() * 40),
                timestamp: Date.now()
            };
            handleBeaconFound(mockBeacon);
            loop();
        }, delay);
    };
    loop();
  }, [handleBeaconFound]);

  const stopSimulation = useCallback(() => {
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
      simulationRef.current = null;
    }
  }, []);

  // Real Web Bluetooth Logic (Chrome/Android only, usually requires user gesture for chooser)
  // Note: True background scanning is not fully supported in Web Bluetooth yet.
  // We use this to demonstrate intent.
  const startWebBluetoothScan = async () => {
    try {
      // @ts-ignore - navigator.bluetooth is experimental
      if (!navigator.bluetooth) {
        alert("Web Bluetooth no disponible. Usando modo simulación.");
        setUseSimulation(true);
        startSimulation();
        return;
      }
      
      // In a real scenario, we would use requestLEScan if available or requestDevice
      // For this demo, we assume the user wants to see it "work", so we fallback to sim
      // if the specific API isn't fully supported without a user gesture picker.
      console.log("Solicitando acceso Bluetooth...");
      // Simulating the request success for UX flow
      startSimulation(); 
    } catch (error) {
      console.error(error);
      setStatus(ScannerStatus.ERROR);
    }
  };

  const toggleScanner = () => {
    if (status === ScannerStatus.IDLE) {
      setStatus(ScannerStatus.SCANNING);
      if (useSimulation) {
        startSimulation();
      } else {
        startWebBluetoothScan();
      }
    } else {
      setStatus(ScannerStatus.IDLE);
      stopSimulation();
      setAdvice(null);
    }
  };

  useEffect(() => {
    return () => stopSimulation();
  }, [stopSimulation]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sigue el rastro</h1>
        </div>
        <button onClick={() => setShowPrivacy(true)} className="text-gray-400 hover:text-blue-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </header>

      <main className="flex-grow px-6 max-w-md mx-auto mt-6 w-full">
        
        {/* Alert Banner (Gemini) */}
        {advice && (
          <div className="mb-6 bg-indigo-600 rounded-xl p-4 shadow-lg text-white animate-fade-in relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-indigo-500 p-1 rounded text-xs font-semibold">Asesor de Seguridad IA</span>
                </div>
                <p className="text-sm leading-relaxed opacity-95 font-medium">{advice}</p>
                <button 
                  onClick={() => setAdvice(null)}
                  className="mt-3 text-xs bg-indigo-800 bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded text-indigo-100 transition"
                >
                  Entendido
                </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-20"></div>
          </div>
        )}

        {/* Status Ring */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
           <StatusDisplay 
             status={status} 
             detectedCount={events.length} 
           />
        </div>

        {/* Controls */}
        <div className="mb-8">
          <ScannerButton 
            isActive={status !== ScannerStatus.IDLE} 
            onToggle={toggleScanner} 
          />
          
          {/* Inline Privacy Statement as requested */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div className="text-xs text-gray-600 leading-relaxed">
                <strong className="block text-gray-800 mb-1 font-semibold">Tu privacidad es nuestra prioridad</strong>
                Los datos son 100% anónimos. Solo enviamos el ID de la baliza y tu ubicación (GPS) si detectamos una mascota registrada.
              </div>
            </div>
          </div>
        </div>

        {/* Logs */}
        <LogFeed events={events} />
        
      </main>

      <footer className="py-6 text-center text-gray-400 text-xs font-medium">
        Desarrollado por S.Segura-2025 ® ™
      </footer>
      
      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Privacidad y Seguridad</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
              {PRIVACY_POLICY_TEXT}
            </p>
            <button 
              onClick={() => setShowPrivacy(false)}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Floating Sim Mode Indicator */}
      <div className="fixed bottom-4 right-4">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow border border-gray-200 opacity-70 hover:opacity-100 transition">
              <span className={`w-2 h-2 rounded-full ${useSimulation ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                {useSimulation ? 'Modo Demo' : 'Modo Real'}
              </span>
          </div>
      </div>

    </div>
  );
}