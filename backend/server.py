from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
import aiohttp
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="EcoSphere API", description="Environmental monitoring and reporting system")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# LLM Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Models
class LocationData(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None

class AQIData(BaseModel):
    aqi: int
    pm25: float
    pm10: float
    o3: float
    no2: float
    so2: float
    co: float
    status: str
    forecast: List[Dict] = []

class WeatherData(BaseModel):
    temperature: float
    humidity: int
    wind_speed: float
    wind_direction: int
    pressure: float
    visibility: float

class CivicReport(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    location: LocationData
    report_type: str  # water_log, visibility, tree_fall, road_block
    description: str
    severity: str  # low, medium, high
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reporter_id: Optional[str] = None
    status: str = "active"  # active, resolved, investigating

class CivicReportCreate(BaseModel):
    location: LocationData
    report_type: str
    description: str
    severity: str
    reporter_id: Optional[str] = None

class EnvironmentalReport(BaseModel):
    location: LocationData
    aqi_data: AQIData
    weather_data: WeatherData
    noise_level: Optional[float] = None
    water_logging_risk: str  # low, medium, high
    civic_complaints: List[CivicReport] = []
    ai_suggestions: List[str] = []
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatMessage(BaseModel):
    message: str
    location: Optional[LocationData] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []

# Helper functions
async def fetch_aqi_data(lat: float, lon: float) -> AQIData:
    """Fetch Air Quality Index data from WAQI API"""
    try:
        # Using WAQI API (World Air Quality Index)
        # Note: In production, you'd need an API key from aqicn.org
        url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token=demo"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.json()
                
                if data.get('status') == 'ok':
                    aqi_info = data['data']
                    iaqi = aqi_info.get('iaqi', {})
                    
                    # Create forecast (mock data for demo)
                    forecast = [
                        {"day": "Today", "aqi": aqi_info.get('aqi', 50), "status": "Good"},
                        {"day": "Tomorrow", "aqi": aqi_info.get('aqi', 50) + 10, "status": "Moderate"},
                        {"day": "Day 3", "aqi": aqi_info.get('aqi', 50) + 5, "status": "Good"}
                    ]
                    
                    return AQIData(
                        aqi=aqi_info.get('aqi', 50),
                        pm25=iaqi.get('pm25', {}).get('v', 15.0),
                        pm10=iaqi.get('pm10', {}).get('v', 25.0),
                        o3=iaqi.get('o3', {}).get('v', 30.0),
                        no2=iaqi.get('no2', {}).get('v', 20.0),
                        so2=iaqi.get('so2', {}).get('v', 10.0),
                        co=iaqi.get('co', {}).get('v', 0.5),
                        status="Good" if aqi_info.get('aqi', 50) <= 50 else "Moderate" if aqi_info.get('aqi', 50) <= 100 else "Unhealthy",
                        forecast=forecast
                    )
    except Exception as e:
        logging.error(f"Error fetching AQI data: {e}")
    
    # Fallback mock data
    return AQIData(
        aqi=45,
        pm25=12.5,
        pm10=20.0,
        o3=25.0,
        no2=18.0,
        so2=8.0,
        co=0.4,
        status="Good",
        forecast=[
            {"day": "Today", "aqi": 45, "status": "Good"},
            {"day": "Tomorrow", "aqi": 52, "status": "Moderate"},
            {"day": "Day 3", "aqi": 48, "status": "Good"}
        ]
    )

async def fetch_weather_data(lat: float, lon: float) -> WeatherData:
    """Fetch weather data from OpenWeatherMap API"""
    try:
        # Using OpenWeatherMap API (you'd need an API key in production)
        # For demo purposes, using mock data
        pass
    except Exception as e:
        logging.error(f"Error fetching weather data: {e}")
    
    # Mock weather data
    return WeatherData(
        temperature=24.5,
        humidity=65,
        wind_speed=8.2,
        wind_direction=180,
        pressure=1013.2,
        visibility=10.0
    )

async def calculate_water_logging_risk(lat: float, lon: float) -> str:
    """Calculate water logging risk based on location and historical data"""
    # In a real implementation, this would use topographical data,
    # drainage system data, and historical flooding records
    
    # Mock calculation based on coordinates (simplified)
    if lat > 28.6 and lat < 28.7:  # Delhi area example
        return "medium"
    elif lat > 19.0 and lat < 19.2:  # Mumbai area example  
        return "high"
    else:
        return "low"

async def get_ai_suggestions(environmental_data: Dict) -> List[str]:
    """Generate AI-powered environmental suggestions using Gemini"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="environmental_suggestions",
            system_message="You are an environmental expert providing actionable suggestions based on air quality, weather, and local conditions. Provide 3-5 concise, practical suggestions."
        ).with_model("gemini", "gemini-2.5-pro")
        
        prompt = f"""
        Based on the following environmental data, provide specific actionable suggestions:
        
        Air Quality Index: {environmental_data.get('aqi', 'Unknown')}
        Temperature: {environmental_data.get('temperature', 'Unknown')}°C
        Humidity: {environmental_data.get('humidity', 'Unknown')}%
        Wind Speed: {environmental_data.get('wind_speed', 'Unknown')} km/h
        Water Logging Risk: {environmental_data.get('water_logging_risk', 'Unknown')}
        
        Provide 3-5 bullet points with practical advice for residents in this area.
        """
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Parse the response into bullet points
        suggestions = []
        lines = response.strip().split('\n')
        for line in lines:
            line = line.strip()
            if line and (line.startswith('•') or line.startswith('-') or line.startswith('*')):
                suggestions.append(line[1:].strip())
            elif line and not line.startswith('Based on') and len(line) > 20:
                suggestions.append(line)
        
        return suggestions[:5] if suggestions else [
            "Monitor air quality regularly using reliable sources",
            "Stay hydrated and avoid outdoor activities during peak pollution hours",
            "Use air purifiers indoors when AQI is high",
            "Keep windows closed during high pollution periods",
            "Consider wearing N95 masks when outdoors"
        ]
        
    except Exception as e:
        logging.error(f"Error generating AI suggestions: {e}")
        # Fallback suggestions
        return [
            "Monitor air quality regularly using reliable sources",
            "Stay hydrated and avoid outdoor activities during peak pollution hours",
            "Use air purifiers indoors when AQI is high",
            "Keep windows closed during high pollution periods",
            "Consider wearing N95 masks when outdoors"
        ]

# API Routes
@api_router.get("/")
async def root():
    return {"message": "EcoSphere API - Environmental Monitoring System"}

@api_router.post("/environmental-report", response_model=EnvironmentalReport)
async def get_environmental_report(location: LocationData):
    """Get comprehensive environmental report for a location"""
    try:
        # Fetch data from various sources
        aqi_data = await fetch_aqi_data(location.latitude, location.longitude)
        weather_data = await fetch_weather_data(location.latitude, location.longitude)
        water_logging_risk = await calculate_water_logging_risk(location.latitude, location.longitude)
        
        # Get nearby civic complaints
        civic_complaints = await db.civic_reports.find({
            "location.latitude": {"$gte": location.latitude - 0.01, "$lte": location.latitude + 0.01},
            "location.longitude": {"$gte": location.longitude - 0.01, "$lte": location.longitude + 0.01},
            "status": "active"
        }).to_list(10)
        
        civic_reports = [CivicReport(**report) for report in civic_complaints]
        
        # Generate AI suggestions
        environmental_context = {
            "aqi": aqi_data.aqi,
            "temperature": weather_data.temperature,
            "humidity": weather_data.humidity,
            "wind_speed": weather_data.wind_speed,
            "water_logging_risk": water_logging_risk
        }
        
        ai_suggestions = await get_ai_suggestions(environmental_context)
        
        # Calculate noise level (mock data)
        noise_level = 45.0  # dB
        
        report = EnvironmentalReport(
            location=location,
            aqi_data=aqi_data,
            weather_data=weather_data,
            noise_level=noise_level,
            water_logging_risk=water_logging_risk,
            civic_complaints=civic_reports,
            ai_suggestions=ai_suggestions
        )
        
        return report
        
    except Exception as e:
        logging.error(f"Error generating environmental report: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate environmental report")

@api_router.post("/civic-reports", response_model=CivicReport)
async def create_civic_report(report: CivicReportCreate):
    """Create a new civic complaint/report"""
    try:
        civic_report = CivicReport(**report.dict())
        
        # Store in database
        report_dict = civic_report.dict()
        report_dict['timestamp'] = report_dict['timestamp'].isoformat()
        
        await db.civic_reports.insert_one(report_dict)
        
        return civic_report
        
    except Exception as e:
        logging.error(f"Error creating civic report: {e}")
        raise HTTPException(status_code=500, detail="Failed to create civic report")

@api_router.get("/civic-reports", response_model=List[CivicReport])
async def get_civic_reports(
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    report_type: Optional[str] = None,
    radius: float = 0.01  # Default radius in degrees (~1km)
):
    """Get civic reports, optionally filtered by location and type"""
    try:
        query = {"status": "active"}
        
        if latitude and longitude:
            query["location.latitude"] = {"$gte": latitude - radius, "$lte": latitude + radius}
            query["location.longitude"] = {"$gte": longitude - radius, "$lte": longitude + radius}
            
        if report_type:
            query["report_type"] = report_type
            
        reports = await db.civic_reports.find(query).to_list(50)
        
        return [CivicReport(**report) for report in reports]
        
    except Exception as e:
        logging.error(f"Error fetching civic reports: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch civic reports")

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(message_data: ChatMessage):
    """Chat with AI assistant about environmental concerns"""
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id="environmental_chat",
            system_message="You are EcoSphere's environmental AI assistant. Help users understand air quality, weather conditions, and environmental health. Provide accurate, helpful, and actionable advice. Keep responses concise but informative."
        ).with_model("gemini", "gemini-2.5-pro")
        
        # Add location context if provided
        context = ""
        if message_data.location:
            # You could fetch current environmental data for the location here
            context = f"\nUser's location: {message_data.location.latitude}, {message_data.location.longitude}"
        
        prompt = message_data.message + context
        
        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        # Generate related suggestions
        suggestions = [
            "Check current air quality index",
            "Get weather forecast",
            "Report environmental issue",
            "Find nearby water logging areas"
        ]
        
        return ChatResponse(
            response=response.strip(),
            suggestions=suggestions
        )
        
    except Exception as e:
        logging.error(f"Error in AI chat: {e}")
        return ChatResponse(
            response="I'm sorry, I'm experiencing some technical difficulties. Please try again later.",
            suggestions=[]
        )

@api_router.get("/water-logging-zones")
async def get_water_logging_zones(
    latitude: float,
    longitude: float,
    radius: float = 0.05  # Default 5km radius
):
    """Get water logging prone areas near the specified location"""
    try:
        # In a real implementation, this would query a geospatial database
        # For demo purposes, returning mock data
        
        prone_areas = [
            {
                "id": "zone_1",
                "name": "Industrial Area Sector 15",
                "latitude": latitude + 0.01,
                "longitude": longitude + 0.01,
                "risk_level": "high",
                "last_flooding": "2024-07-15",
                "drainage_status": "blocked"
            },
            {
                "id": "zone_2", 
                "name": "Market Complex Road",
                "latitude": latitude - 0.008,
                "longitude": longitude + 0.015,
                "risk_level": "medium",
                "last_flooding": "2024-06-20",
                "drainage_status": "partially_blocked"
            }
        ]
        
        return {"prone_areas": prone_areas}
        
    except Exception as e:
        logging.error(f"Error fetching water logging zones: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch water logging zones")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)