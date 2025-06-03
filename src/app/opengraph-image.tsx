import { ImageResponse } from 'next/og'
 
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 60,
              marginRight: 30,
            }}
          >
            🍽️
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#374151',
            }}
          >
            Wheel of Lunch
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Can&apos;t decide where to eat? Spin the wheel to discover your next meal!
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#f97316',
            marginTop: 30,
            fontWeight: 600,
          }}
        >
          Find nearby restaurants • Interactive roulette wheel
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}