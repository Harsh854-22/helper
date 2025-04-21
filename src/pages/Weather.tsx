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
import { WeatherData } from '@/types';

// OpenWeatherMap API key
const OPENWEATHER_API_KEY = "3bda9fb4f7d808a621c9495a097d8379"; // Replace with your API key

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);
  const { toast } = useToast();

  // Get user's location with fallback to Delhi, India
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Could not get your location. Using default location (Delhi, India)."
          });
          // Default to Delhi, India
          setLocation({ lat: 28.6139, lon: 77.2090 });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Using default location (Delhi, India)."
      });
      setLocation({ lat: 28.6139, lon: 77.2090 });
    }
  }, [toast]);

  // Fetch weather data when location is available
  useEffect(() => {
    if (!location) return;
    
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        let locationName = "Current Location";
        
        // If using a real API key
        if (OPENWEATHER_API_KEY !== "3bda9fb4f7d808a621c9495a097d8379") {
          // First get location name
          try {
            const geoResponse = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${location.lat}&lon=${location.lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
            );
            if (geoResponse.ok) {
              const geoData = await geoResponse.json();
              if (geoData.length > 0) {
                locationName = `${geoData[0].name}, ${geoData[0].country}`;
              }
            }
          } catch (geoError) {
            console.error("Error fetching location name:", geoError);
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error("Weather API request failed");
          }
          
          const data = await response.json();
          
          // Transform API data to our format
          const transformedData: WeatherData = {
            location: locationName,
            temperature: Math.round(data.current.temp),
            humidity: data.current.humidity,
            windSpeed: Math.round(data.current.wind_speed * 3.6), // Convert m/s to km/h
            windDirection: getWindDirection(data.current.wind_deg),
            description: data.current.weather[0].description,
            condition: mapWeatherCondition(data.current.weather[0].main),
            forecast: data.daily.slice(0, 5).map((day: any, index: number) => ({
              day: index === 0 ? "Today" : index === 1 ? "Tomorrow" : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
              temperature: Math.round(day.temp.day),
              condition: mapWeatherCondition(day.weather[0].main)
            })),
            alerts: data.alerts ? data.alerts.map((alert: any) => ({
              type: alert.event,
              description: alert.description,
              severity: getSeverityFromEvent(alert.event)
            })) : [],
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setWeatherData(transformedData);
        } else {
          // Use Indian sample data if no API key is provided
          const sampleData = getSampleWeatherData();
          setTimeout(() => {
            setWeatherData(sampleData);
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
        toast({
          variant: "destructive",
          title: "Error fetching weather data",
          description: "Using sample data instead."
        });
        // Fallback to sample data
        setWeatherData(getSampleWeatherData());
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [location, toast]);

  const refreshWeather = () => {
    if (location) {
      setIsLoading(true);
      // Refetch weather data
      const fetchData = async () => {
        try {
          if (OPENWEATHER_API_KEY !== "3bda9fb4f7d808a621c9495a097d8379") {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
            );
            
            if (!response.ok) {
              throw new Error("Weather API request failed");
            }
            
            const data = await response.json();
            
            // Transform API data to our format
            const transformedData: WeatherData = {
              location: "Current Location",
              temperature: Math.round(data.current.temp),
              humidity: data.current.humidity,
              windSpeed: Math.round(data.current.wind_speed * 3.6), // Convert m/s to km/h
              windDirection: getWindDirection(data.current.wind_deg),
              description: data.current.weather[0].description,
              condition: mapWeatherCondition(data.current.weather[0].main),
              forecast: data.daily.slice(0, 5).map((day: any, index: number) => ({
                day: index === 0 ? "Today" : index === 1 ? "Tomorrow" : new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                temperature: Math.round(day.temp.day),
                condition: mapWeatherCondition(day.weather[0].main)
              })),
              alerts: data.alerts ? data.alerts.map((alert: any) => ({
                type: alert.event,
                description: alert.description,
                severity: getSeverityFromEvent(alert.event)
              })) : [],
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            setWeatherData(transformedData);
          } else {
            // Use sample data if no API key is provided
            const sampleData = getSampleWeatherData();
            setTimeout(() => {
              setWeatherData({
                ...sampleData,
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              });
            }, 1000);
          }
        } catch (error) {
          console.error("Error refreshing weather:", error);
          toast({
            variant: "destructive",
            title: "Error refreshing weather data",
            description: "Using sample data instead."
          });
          setWeatherData(getSampleWeatherData());
        } finally {
          setIsLoading(false);
          toast({
            title: "Weather updated",
            description: "Weather information has been refreshed."
          });
        }
      };
      
      fetchData();
    }
  };

  // Indian weather sample data
  const getSampleWeatherData = (): WeatherData => ({
    location: "Delhi, India",
    temperature: 32,
    humidity: 65,
    windSpeed: 15,
    windDirection: "NW",
    description: "Partly Cloudy",
    condition: "cloudy",
    forecast: [
      { day: "Today", temperature: 32, condition: "cloudy" },
      { day: "Tomorrow", temperature: 34, condition: "clear" },
      { day: "Wed", temperature: 36, condition: "clear" },
      { day: "Thu", temperature: 33, condition: "rain" },
      { day: "Fri", temperature: 31, condition: "rain" }
    ],
    alerts: [
      {
        type: "Heat Wave Advisory",
        description: "High temperatures expected. Stay hydrated and avoid direct sunlight during peak hours.",
        severity: "medium"
      }
    ],
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Helper functions (unchanged from original)
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const mapWeatherCondition = (condition: string): 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' => {
    const conditionMap: {[key: string]: 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'} = {
      'Clear': 'clear',
      'Clouds': 'cloudy',
      'Rain': 'rain',
      'Drizzle': 'rain',
      'Thunderstorm': 'storm',
      'Snow': 'snow',
      'Mist': 'fog',
      'Smoke': 'fog',
      'Haze': 'fog',
      'Dust': 'fog',
      'Fog': 'fog',
      'Sand': 'fog',
      'Ash': 'fog',
      'Squall': 'storm',
      'Tornado': 'storm'
    };
    
    return conditionMap[condition] || 'cloudy';
  };

  const getSeverityFromEvent = (event: string): 'low' | 'medium' | 'high' => {
    const highSeverityEvents = ['Cyclone', 'Tornado', 'Flood', 'Severe Thunderstorm'];
    const mediumSeverityEvents = ['Heat Wave', 'Dust Storm', 'Heavy Rain', 'Fog'];
    
    const eventLower = event.toLowerCase();
    
    for (const highEvent of highSeverityEvents) {
      if (eventLower.includes(highEvent.toLowerCase())) return 'high';
    }
    
    for (const medEvent of mediumSeverityEvents) {
      if (eventLower.includes(medEvent.toLowerCase())) return 'medium';
    }
    
    return 'low';
  };

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
                        <h3 className="text-4xl font-bold">{weatherData.temperature}°C</h3>
                        <p className="text-lg text-gray-300">{weatherData.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-5 w-5 text-helper-red" />
                        <div>
                          <p className="text-sm text-gray-400">Feels Like</p>
                          <p className="text-lg">{weatherData.temperature}°C</p>
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
                          <p className="text-lg">{weatherData.windSpeed} km/h</p>
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
                          <p className="text-lg">{day.temperature}°C</p>
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