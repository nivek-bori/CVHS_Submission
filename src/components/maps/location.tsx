import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Location } from '@/types';

// MARKERS
interface MarkerPopupParams {
  location: Location;
  onAddRating: () => void;
}

export function MarkerPopup({ location, onAddRating }: MarkerPopupParams) {
  // TODO: Rewrite to fit database's location dtye
  return (
    <div className="flex w-72 flex-col gap-2 rounded-lg border border-gray-200 bg-white/95 p-4 shadow-lg">
      <div className="mb-1 text-lg font-semibold">{location.name}</div>
      <div className="mb-2 text-sm text-gray-700">{location.description}</div>
      <button id="add-rating-btn" className="mt-2 w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-blue-700">
        Add Rating
      </button>
    </div>
  );
}

export function getMarker(document: any, hex: string) {
  const markerContent = document.createElement('div');
  markerContent.style.background = hex;
  markerContent.style.width = '24px';
  markerContent.style.height = '24px';
  markerContent.style.borderRadius = '50%';
  markerContent.style.border = '2px solid #fff';
  return markerContent;
}

// CLUSTERS
function coordsToColor(lat: number, lng: number) {
  const normLat = (lat + 90) / 180;
  const normLng = (lng + 180) / 360;

  const min = 50;
  const max = 150;
  const range = max - min;
  const r = Math.round(normLat * range + min);
  const g = Math.round(normLng * range + min);
  const b = Math.round(((normLat + normLng) / 2) * range + min);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export class Renderer {
  public render(cluster: any, stats: any, map: google.maps.Map) {
    const pos = cluster.position;
    const color = coordsToColor(pos.lat(), pos.lng()); // You can pass min/max if desired

    const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
                    <circle cx="120" cy="120" opacity="1.0" r="50" />
                    <circle cx="120" cy="120" opacity=".8" r="80" />
                    <circle cx="120" cy="120" opacity=".7" r="100" stroke="#000" stroke-width="6"/>
                    <text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${cluster.count}</text>
                  </svg>`;
    const parser = new DOMParser();
    const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
    svgEl.setAttribute('transform', 'translate(0 25)');

    const title = `${cluster.count} Locations`;

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: cluster.position,
      title: title,
      content: svgEl,
    });

    return marker;
  }
}

export const onClusterCLick = (_: google.maps.MapMouseEvent, cluster: any, map: google.maps.Map): void => {
  if (cluster.bounds) {
    map.fitBounds(cluster.bounds, { top: 200, bottom: 200, left: 200, right: 200 });
  }
};
