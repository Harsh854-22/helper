
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudLightning, 
  CloudSnow, 
  CloudFog,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Clock,
  MapPin,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeatherData {
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

// Sample weather data
const sampleWeatherData: WeatherData = {
  location: "Current Location",
  temperature: 68,
  humidity: 75,
  windSpeed: 12,
  windDirection: "NE",
  description: "Partly Cloudy",
  condition: "cloudy",
  forecast: [
    { day: "Today", temperature: 68, condition: "cloudy" },
    { day: "Tomorrow", temperature: 72, condition: "clear" },
    { day: "Wed", temperature: 65, condition: "rain" },
    { day: "Thu", temperature: 63, condition: "rain" },
    { day: "Fri", temperature: 70, condition: "cloudy" }
  ],
  alerts: [
    {
      type: "Flood Watch",
      description: "Potential flooding in low-lying areas due to recent rainfall.",
      severity: "medium"
    }
  ],
  lastUpdated: "10:30 AM"
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching weather data
    const fetchWeather = async () => {
      try {
        setTimeout(() => {
          setWeatherData(sampleWeatherData);
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching weather data",
          description: "Please try again later."
        });
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [toast]);

  const renderWeatherIcon = (condition: string, size = 24) => {
    switch (condition) {
      case 'clear':
        return <Sun size={size} className="text-yellow-400" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-400" />;
      case 'rain':
        return <CloudRain size={size} className="text-blue-400" />;
      case 'storm':
        return <CloudLightning size={size} className="text-purple-400" />;
      case 'snow':
        return <CloudSnow size={size} className="text-white" />;
      case 'fog':
        return <CloudFog size={size} className="text-gray-300" />;
      default:
        return <Cloud size={size} className="text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-helper-red';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const refreshWeather = () => {
    setIsLoading(true);
    // Simulate refreshing weather data
    setTimeout(() => {
      setWeatherData(sampleWeatherData);
      setIsLoading(false);
      toast({
        title: "Weather updated",
        description: "Weather information has been refreshed."
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <Layout title="Weather">
        <div className="container mx-auto p-4 md:p-6 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-10 w-10 text-helper-red animate-spin mb-4" />
          <p>Loading weather information...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Weather">
      <div className="container mx-auto p-4 md:p-6">
        {weatherData && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-helper-red" />
                <h2 className="text-xl font-bold">{weatherData.location}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock size={14} /> Last updated: {weatherData.lastUpdated}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshWeather}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-helper-darkgray border-helper-darkgray md:col-span-2">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center gap-6 mb-4 md:mb-0">
                      {renderWeatherIcon(weatherData.condition, 64)}
                      
                      <div className="text-center md:text-left">
                        <h3 className="text-4xl font-bold">{weatherData.temperature}°F</h3>
                        <p className="text-lg text-gray-300">{weatherData.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-helper-red" />
                        <div>
                          <p className="text-sm text-gray-400">Feels Like</p>
                          <p className="text-lg">{weatherData.temperature}°F</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Humidity</p>
                          <p className="text-lg">{weatherData.humidity}%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Wind</p>
                          <p className="text-lg">{weatherData.windSpeed} mph</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Compass className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Direction</p>
                          <p className="text-lg">{weatherData.windDirection}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-helper-darkgray border-helper-darkgray">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">5-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <p className={index === 0 ? "font-medium" : "text-gray-400"}>
                          {day.day}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          {renderWeatherIcon(day.condition, 20)}
                          <p className="text-lg">{day.temperature}°F</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">Weather Alerts</h3>
              
              {weatherData.alerts.length > 0 ? (
                <div className="space-y-4">
                  {weatherData.alerts.map((alert, index) => (
                    <Card key={index} className="bg-helper-darkgray border-helper-darkgray">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`h-4 w-4 mt-1 rounded-full ${getSeverityColor(alert.severity)}`} />
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-helper-red" />
                              <h4 className="font-medium">{alert.type}</h4>
                            </div>
                            
                            <p className="mt-1 text-sm text-gray-300">{alert.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-helper-darkgray border-helper-darkgray">
                  <CardContent className="p-4 text-center">
                    <p className="text-gray-400">No active weather alerts for your area</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-400">
              <p>Weather data is provided for informational purposes only.</p>
              <p>Always follow official guidance during severe weather events.</p>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Weather;
