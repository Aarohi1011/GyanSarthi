import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const units = searchParams.get('units') || 'metric'

  // 🚨 Validate input
  if (!lat || !lon) {
    console.warn(`[⚠️ ForecastAPI] Missing coordinates -> lat: ${lat}, lon: ${lon}`)
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    )
  }

  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&forecast_days=3`

  try {
    console.info(`[🌍 ForecastAPI] Fetching forecast`)
    console.info(`   → Lat: ${lat}, Lon: ${lon}, Units: ${units}`)
    console.info(`   → Endpoint: ${endpoint}`)

    const response = await fetch(endpoint)
    const data = await response.json()

    if (!response.ok) {
      console.error(`[❌ ForecastAPI] Failed response: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: 'Forecast API returned an error', details: data },
        { status: response.status }
      )
    }

    console.info(`[✅ ForecastAPI] Forecast retrieved successfully!`)
    console.debug(`[📊 ForecastAPI] Sample data:`, {
      temperature: data?.hourly?.temperature_2m?.slice(0, 3),
      wind: data?.hourly?.wind_speed_10m?.slice(0, 3),
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error(`[🔥 ForecastAPI] Unexpected error:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: 500 }
    )
  }
}
