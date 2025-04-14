
export interface Alert {
  id: string;
  type: string;
  title: string;
  location: string;
  time: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  instructions: string[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'shelter' | 'hospital' | 'food' | 'supplies';
  address: string;
  phone: string;
  distance: string;
  hours: string;
  status: 'open' | 'closed' | 'limited';
  notes?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  type: 'emergency' | 'family' | 'friend' | 'medical' | 'other';
  notes?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  description: string;
  condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';
  forecast: {
    day: string;
    temperature: number;
    condition: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';
  }[];
  alerts: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
  lastUpdated: string;
}

export interface MedicalInfo {
  conditions: string;
  medications: string;
  allergies: string;
  bloodType: string;
  notes: string;
}

export interface ProfileInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalInfo: MedicalInfo;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}
