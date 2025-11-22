import React from 'react';
import { ScanEvent } from '../types';

interface LogFeedProps {
  events: ScanEvent[];
}

const LogFeed: React.FC<LogFeedProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        <p>No hay actividad reciente.</p>
        <p className="mt-1">Activa el escáner para comenzar a colaborar.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-bold text-sm uppercase tracking-wide">Registro de Actividad</h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">En Vivo</span>
      </div>
      
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start animate-fade-in">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-semibold text-gray-800 text-sm">Señal Detectada</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">UUID: ...{event.beacon.uuid.slice(-8)}</p>
              <p className="text-xs text-gray-500">Minor ID: <span className="font-mono text-gray-700 font-medium">{event.beacon.minor}</span></p>
              {event.location && (
                 <p className="text-[10px] text-gray-400 mt-1">
                   GPS: {event.location.latitude.toFixed(4)}, {event.location.longitude.toFixed(4)}
                 </p>
              )}
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] text-gray-400">
                 {new Date(event.beacon.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
               {event.status === 'synced' ? (
                 <span className="mt-2 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Enviado</span>
               ) : (
                 <span className="mt-2 text-[10px] bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded border border-yellow-100">Pendiente</span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogFeed;