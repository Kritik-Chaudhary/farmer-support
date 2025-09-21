import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface IpApiComResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  query: string;
}

interface IpApiCoResponse {
  latitude: number;
  longitude: number;
  city: string;
  country_name: string;
}

interface IpGeolocationIoResponse {
  latitude: number;
  longitude: number;
  city: string;
  country_name: string;
}

interface IpInfoIoResponse {
  loc: string;
  city: string;
  region: string;
  country: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    let lat = searchParams.get('lat');
    let lon = searchParams.get('lon');
    let locationName = ''; // Initialize location name

    // Only use IP-based location detection for reliability
    if (!lat || !lon) {
      // Default coordinates for major Indian cities
      const cityCoordinates: { [key: string]: { lat: number; lon: number } } = {
        'Delhi': { lat: 28.6139, lon: 77.2090 },
        'Mumbai': { lat: 19.0760, lon: 72.8777 },
        'Bangalore': { lat: 12.9716, lon: 77.5946 },
        'Chennai': { lat: 13.0827, lon: 80.2707 },
        'Kolkata': { lat: 22.5726, lon: 88.3639 },
        'Hyderabad': { lat: 17.3850, lon: 78.4867 },
        'Pune': { lat: 18.5204, lon: 73.8567 },
        'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
        'Jaipur': { lat: 26.9124, lon: 75.7873 },
        'Lucknow': { lat: 26.8467, lon: 80.9462 },
        'Ludhiana': { lat: 30.9010, lon: 75.8573 },
        'Amritsar': { lat: 31.6340, lon: 74.8723 },
        'Chandigarh': { lat: 30.7333, lon: 76.7794 },
        'Bhopal': { lat: 23.2599, lon: 77.4126 },
        'Indore': { lat: 22.7196, lon: 75.8577 },
        'Patna': { lat: 25.5941, lon: 85.1376 },
        'Nagpur': { lat: 21.1458, lon: 79.0882 },
        'Surat': { lat: 21.1702, lon: 72.8311 },
        'Varanasi': { lat: 25.3176, lon: 82.9739 },
        'Agra': { lat: 27.1767, lon: 78.0081 },
        'Dehradun': { lat: 30.3275, lon: 78.0325 }
      };

      console.log('Detecting location from IP...');
      
      // Get the user's IP address from the request headers
      const forwardedFor = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const userIP = forwardedFor?.split(',')[0] || realIp || 'unknown';
      
      console.log(`User IP: ${userIP}`);
      
      let locationDetected = false;
      
      // Try IP-API.com first as it was working before
      try {
        console.log('Trying ip-api.com for location detection');
        const ipResponse = await axios.get(
          `http://ip-api.com/json/${userIP}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,query`,
          { timeout: 5000 }
        );
        
        if (ipResponse.data.status === 'success' && ipResponse.data.lat && ipResponse.data.lon) {
          lat = ipResponse.data.lat.toString();
          lon = ipResponse.data.lon.toString();
          locationName = ipResponse.data.city || ipResponse.data.regionName || ipResponse.data.region;
          locationDetected = true;
          console.log(`IP location detected: ${locationName} (${lat}, ${lon})`);
        }
      } catch (error) {
        console.log('ip-api.com failed, trying backup services');
      }
      
      // Fallback to other services if ip-api.com fails
      if (!locationDetected) {
        const backupServices = [
          {
            url: 'https://ipapi.co/json/',
            parser: (data: IpApiCoResponse) => ({
              lat: data.latitude?.toString(),
              lon: data.longitude?.toString(),
              city: data.city,
              valid: data.latitude && data.longitude
            })
          },
          {
            url: 'https://ipinfo.io/json',
            parser: (data: IpInfoIoResponse) => ({
              lat: data.loc?.split(',')[0],
              lon: data.loc?.split(',')[1], 
              city: data.city || data.region,
              valid: data.loc && data.loc.includes(',')
            })
          }
        ];
        
        for (const service of backupServices) {
          try {
            console.log(`Trying backup service: ${service.url}`);
            const response = await axios.get(service.url, { timeout: 5000 });
            const locationData = service.parser(response.data);
            
            if (locationData.valid) {
              lat = locationData.lat;
              lon = locationData.lon;
              locationName = locationData.city || 'Detected Location';
              locationDetected = true;
              console.log(`Backup service detected location: ${locationName} (${lat}, ${lon})`);
              break;
            }
          } catch (error) {
            console.log(`Backup service failed: ${service.url}`);
            continue;
          }
        }
      }
      
      // Final fallback to Delhi if all services fail
      if (!locationDetected) {
        console.log('All IP services failed, using Delhi as fallback');
        const coords = cityCoordinates['Delhi'];
        lat = coords.lat.toString();
        lon = coords.lon.toString();
        locationName = 'Delhi';
      }
    }

    // Use Open-Meteo API (free, no key required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast`;
    
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
      timezone: 'Asia/Kolkata',
      forecast_days: 5
    };

    // Get weather data from Open-Meteo with enhanced error handling
    console.log(`Fetching weather data for coordinates: ${lat}, ${lon}`);
    
    let weatherData;
    try {
      const weatherResponse = await axios.get(weatherUrl, { params, timeout: 10000 });
      weatherData = weatherResponse.data;
      console.log('Weather data fetched successfully');
      
      if (!weatherData || !weatherData.current) {
        throw new Error('Invalid weather data structure');
      }
    } catch (error: unknown) {
      console.error('Failed to fetch weather data:', (error instanceof Error) ? error.message : error);
      throw new Error('Weather service unavailable');
    }

    // Helper function to get weather description from code
    const getWeatherDescription = (code: number) => {
      const weatherCodes: { [key: number]: { main: string; description: string; icon: string } } = {
        0: { main: 'Clear', description: 'Clear sky', icon: '01d' },
        1: { main: 'Clear', description: 'Mainly clear', icon: '01d' },
        2: { main: 'Clouds', description: 'Partly cloudy', icon: '02d' },
        3: { main: 'Clouds', description: 'Overcast', icon: '03d' },
        45: { main: 'Fog', description: 'Foggy', icon: '50d' },
        48: { main: 'Fog', description: 'Depositing rime fog', icon: '50d' },
        51: { main: 'Drizzle', description: 'Light drizzle', icon: '09d' },
        53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
        55: { main: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
        61: { main: 'Rain', description: 'Slight rain', icon: '10d' },
        63: { main: 'Rain', description: 'Moderate rain', icon: '10d' },
        65: { main: 'Rain', description: 'Heavy rain', icon: '10d' },
        71: { main: 'Snow', description: 'Slight snow', icon: '13d' },
        73: { main: 'Snow', description: 'Moderate snow', icon: '13d' },
        75: { main: 'Snow', description: 'Heavy snow', icon: '13d' },
        77: { main: 'Snow', description: 'Snow grains', icon: '13d' },
        80: { main: 'Rain', description: 'Slight rain showers', icon: '09d' },
        81: { main: 'Rain', description: 'Moderate rain showers', icon: '09d' },
        82: { main: 'Rain', description: 'Violent rain showers', icon: '09d' },
        85: { main: 'Snow', description: 'Slight snow showers', icon: '13d' },
        86: { main: 'Snow', description: 'Heavy snow showers', icon: '13d' },
        95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
        96: { main: 'Thunderstorm', description: 'Thunderstorm with slight hail', icon: '11d' },
        99: { main: 'Thunderstorm', description: 'Thunderstorm with heavy hail', icon: '11d' }
      };
      return weatherCodes[code] || { main: 'Unknown', description: 'Unknown', icon: '01d' };
    };

    const currentWeather = weatherData.current || {};
    const currentWeatherCode = getWeatherDescription(currentWeather.weather_code || 0);
    
    // For IP-detected locations, use reverse geocoding to get more accurate city name
    if (!locationName || locationName === 'Detected Location') {
      console.log(`Attempting reverse geocoding for coordinates: ${lat}, ${lon}`);
      try {
        const geocodeResponse = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1`,
          { timeout: 6000 }
        );
        
        if (geocodeResponse.data && geocodeResponse.data.address) {
          const address = geocodeResponse.data.address;
          console.log('Reverse geocode response:', JSON.stringify(address, null, 2));
          
          // Get the best available location name
          const detectedLocationName = address.city || 
                                      address.town || 
                                      address.village || 
                                      address.state_district ||
                                      address.county;
          
          if (detectedLocationName) {
            locationName = detectedLocationName;
            console.log(`Reverse geocoded location: ${locationName}`);
          } else if (!locationName) {
            // If no specific location found, use state or region
            locationName = address.state || address.region || 'Your Location';
            console.log(`Using state/region as location: ${locationName}`);
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log('Reverse geocoding failed:', errorMessage);
        
        if (!locationName) {
          locationName = 'Your Location';
        }
      }
    } else {
      console.log(`Using IP-detected location name: ${locationName}`);
    }

    // Generate weather alerts based on conditions
    const alerts = [];
    
    if (currentWeather.temperature_2m > 35) {
      alerts.push({
        type: 'heat_warning',
        severity: 'high',
        message: 'High temperature alert! Ensure adequate irrigation and protect crops from heat stress.',
        icon: '🌡️'
      });
    }

    if (currentWeather.relative_humidity_2m > 80) {
      alerts.push({
        type: 'humidity_warning',
        severity: 'medium',
        message: 'High humidity detected. Monitor crops for fungal diseases and ensure proper ventilation.',
        icon: '💧'
      });
    }

    if (currentWeather.wind_speed_10m > 36) { // 36 km/h = 10 m/s
      alerts.push({
        type: 'wind_warning',
        severity: 'medium',
        message: 'Strong winds expected. Secure loose structures and check crop support systems.',
        icon: '💨'
      });
    }

    // Check for rain in forecast
    const dailyData = weatherData.daily || {};
    const rainForecast = dailyData.precipitation_sum?.some((precip: number) => precip > 0);

    if (rainForecast) {
      alerts.push({
        type: 'rain_forecast',
        severity: 'low',
        message: 'Rain expected in the coming days. Plan fieldwork accordingly.',
        icon: '🌧️'
      });
    }

    // Process forecast data
    const forecast = [];
    if (dailyData.time) {
      for (let i = 0; i < Math.min(5, dailyData.time.length); i++) {
        const dayWeather = getWeatherDescription(dailyData.weather_code?.[i] || 0);
        forecast.push({
          date: new Date(dailyData.time[i]).toLocaleDateString(),
          temperature: {
            min: Math.round(dailyData.temperature_2m_min?.[i] || 0),
            max: Math.round(dailyData.temperature_2m_max?.[i] || 0)
          },
          weather: dayWeather,
          humidity: dailyData.precipitation_probability_max?.[i] || 0
        });
      }
    }

    console.log(`Final location name being returned: ${locationName}`);
    
    return NextResponse.json({
      success: true,
      current: {
        temperature: Math.round(currentWeather.temperature_2m || 25),
        feels_like: Math.round(currentWeather.apparent_temperature || 25),
        humidity: Math.round(currentWeather.relative_humidity_2m || 60),
        pressure: 1013, // Open-Meteo doesn't provide pressure in free tier
        weather: currentWeatherCode,
        wind: { 
          speed: Math.round(currentWeather.wind_speed_10m || 0),
          deg: currentWeather.wind_direction_10m || 0
        },
        location: locationName,
        country: 'IN'
      },
      forecast,
      alerts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather API error:', error);
    
    // Return fallback weather data for Delhi
    const mockData = {
      success: true,
      current: {
        temperature: 28,
        feels_like: 32,
        humidity: 65,
        pressure: 1013,
        weather: {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        },
        wind: { speed: 3.5, deg: 0 },
        location: 'Delhi',
        country: 'IN'
      },
      forecast: [
        {
          date: new Date().toLocaleDateString(),
          temperature: { min: 22, max: 30 },
          weather: { main: 'Clear', description: 'clear sky' },
          humidity: 60
        },
        {
          date: new Date(Date.now() + 86400000).toLocaleDateString(),
          temperature: { min: 23, max: 31 },
          weather: { main: 'Clouds', description: 'partly cloudy' },
          humidity: 65
        },
        {
          date: new Date(Date.now() + 172800000).toLocaleDateString(),
          temperature: { min: 24, max: 32 },
          weather: { main: 'Clear', description: 'clear sky' },
          humidity: 55
        },
        {
          date: new Date(Date.now() + 259200000).toLocaleDateString(),
          temperature: { min: 25, max: 33 },
          weather: { main: 'Clear', description: 'clear sky' },
          humidity: 50
        },
        {
          date: new Date(Date.now() + 345600000).toLocaleDateString(),
          temperature: { min: 24, max: 31 },
          weather: { main: 'Rain', description: 'light rain' },
          humidity: 70
        }
      ],
      alerts: [
        {
          type: 'general',
          severity: 'low',
          message: 'Weather data temporarily unavailable. Showing default conditions.',
          icon: 'ℹ️'
        }
      ],
      timestamp: new Date().toISOString(),
      note: 'Showing default data - weather service temporarily unavailable'
    };

    return NextResponse.json(mockData);
  }
}
