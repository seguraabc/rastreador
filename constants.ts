// Target UUID for the PetTrackr Association
export const TARGET_SERVICE_UUID = 'F0012345-0000-0000-0000-000000000000';

// Mock API Endpoint
export const API_ENDPOINT = 'https://api.pettrackr.org/v1/report';

export const PRIVACY_POLICY_TEXT = `
  Compromiso de Privacidad:
  Esta aplicación funciona como un nodo 100% anónimo.
  
  1. No guardamos tu identidad.
  2. Solo enviamos datos cuando se detecta una mascota perdida.
  3. Tu ubicación se comparte solo en ese instante preciso.
  
  Gracias por ayudar a reunir mascotas con sus familias.
`;

export const GEMINI_SYSTEM_INSTRUCTION = `
  Eres un asesor de seguridad IA para una comunidad de rastreo de mascotas ("Sigue el rastro").
  Los usuarios escanean buscando balizas de mascotas perdidas. Si se detecta una, proporciona un consejo
  inmediato, calmado y centrado en la seguridad, basándote en la hora o contexto simulado.
  
  Reglas:
  1. Responde SIEMPRE en Español.
  2. Sé breve (menos de 40 palabras).
  3. Prioriza el bienestar del animal y del voluntario.
  4. No inventes detalles específicos de la mascota que no se te hayan dado.
`;