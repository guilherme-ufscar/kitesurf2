'use client'
import { useEffect, useRef } from 'react'

interface MapViewProps {
  lat: number
  lng: number
  label?: string
  className?: string
}

export default function MapView({ lat, lng, label, className }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let map: L.Map
    import('leaflet').then((L) => {
      if (!containerRef.current) return

      // Fix default icon paths
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      // Approximate circle (privacy — not exact location)
      L.circle([lat, lng], { radius: 2000, color: '#001e40', fillColor: '#001e40', fillOpacity: 0.1, weight: 2 }).addTo(map)
      if (label) {
        L.popup({ closeOnClick: false, autoClose: false })
          .setLatLng([lat, lng])
          .setContent(`<strong>${label}</strong><br><small>Localização aproximada</small>`)
          .openOn(map)
      }
    })

    return () => { map?.remove() }
  }, [lat, lng, label])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={containerRef} className={`h-64 rounded-xl overflow-hidden border border-outline-variant ${className ?? ''}`} />
    </>
  )
}
