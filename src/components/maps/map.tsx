'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Menu, X } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';
import { Location } from '@/types';
import { getMarker, MarkerPopup, onClusterCLick, Renderer } from './location';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import Loading from '../ui/loading';
import MessageBox from '../ui/message';
import { config } from '@/lib/config';

declare global {
  interface Window {
    initMap: () => void;
    googleMaps: any;
  }
}

export default function Map() {
  const htmlMapRef = useRef(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const tempMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [locName, setLocName] = useState<string>('');
  const [showSidebar, setShowSidebar] = useState<Boolean>(false);

  // initialze map
  useEffect(() => {
    const loader = new Loader({
      apiKey: config.google.key!,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    loader
      .load()
      .then(async () => {
        const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

        const map = new Map(htmlMapRef.current!, {
          center: { lat: -33.860664, lng: 151.208138 },
          zoom: 13,
          mapId: config.google.map_id,
        });
        mapRef.current = map;

        map.addListener('click', async (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            const name = await latLngToName(lat, lng);
            setTemporaryMarker(lat, lng, name);
            setLocName(name);
            setLatLng({ lat: lat, lng: lng });
          }
        });

        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }

        const locations = await loadLocations();
        await populateMarkers(locations);
        setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
      })
      .catch(error => {
        console.error('Error loading Google Maps:', error);
      });
  }, [setLatLng]);

  // Get current lat and lng from user's browser
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLatLng({ lat: latitude, lng: longitude });
      },
      error => {},
    );
  }, []);

  // load locations
  const loadLocations = async () => {
    const locations: Location[] = [
      {
        id: '1',
        name: 'Sydney Opera House',
        description: 'Famous performing arts center in Sydney.',
        latitude: -33.8568,
        longitude: 151.2153,
        createdAt: '2025-07-20T10:00:00.000Z',
        updatedAt: '2025-07-20T10:00:00.000Z',
      },
      {
        id: '2',
        name: 'Harbour Bridge',
        description: 'Iconic steel arch bridge.',
        latitude: -33.8523,
        longitude: 151.2108,
        createdAt: '2025-07-20T10:00:00.000Z',
        updatedAt: '2025-07-20T10:00:00.000Z',
      },
      {
        id: '3',
        name: 'Bondi Beach',
        description: 'Popular beach in Sydney.',
        latitude: -33.8908,
        longitude: 151.2743,
        createdAt: '2025-07-20T10:00:00.000Z',
        updatedAt: '2025-07-20T10:00:00.000Z',
      },
      {
        id: '4',
        name: 'Darling Harbour',
        description: 'Recreational and pedestrian precinct.',
        latitude: -33.8748,
        longitude: 151.1987,
        createdAt: '2025-07-20T10:00:00.000Z',
        updatedAt: '2025-07-20T10:00:00.000Z',
      },
      {
        id: '5',
        name: 'The Rocks',
        description: 'Historic area of Sydney.',
        latitude: -33.8599,
        longitude: 151.2091,
        createdAt: '2025-07-20T10:00:00.000Z',
        updatedAt: '2025-07-20T10:00:00.000Z',
      },
    ];

    return locations;
  };

  // render locations
  const populateMarkers = async (locations: Location[]) => {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    const markers = locations.map(loc => {
      // color
      const temp_color_hex_str = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;
      const markerContent = getMarker(document, temp_color_hex_str); // TODO: Color based on rating

      // marker
      const marker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat: loc.latitude, lng: loc.longitude },
        title: loc.name,
        content: markerContent,
      });

      // info window of marker
      marker.addListener('click', () => {
        onMarckerClicked(marker, loc);
      });

      return marker;
    });

    new MarkerClusterer({ markers, map: mapRef.current, renderer: new Renderer(), onClusterClick: onClusterCLick });
  };

  const populateOneMarker = async (location: Location) => {
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    // random color
    const temp_color_hex_str = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`;
    const markerContent = getMarker(document, temp_color_hex_str); // TODO: Color based on rating

    // marker
    const marker = new AdvancedMarkerElement({
      map: mapRef.current,
      position: { lat: location.latitude, lng: location.longitude },
      title: location.name,
      content: markerContent,
    });

    if (infoWindowRef.current) {
      onMarckerClicked(marker, location);
    }

    marker.addListener('click', () => {
      onMarckerClicked(marker, location);
    });

    return marker;
  };

  // user interaction
  const onMarckerClicked = (marker: any, location: any) => {
    if (infoWindowRef.current) {
      setLocName(location.name);
      setLatLng({ lat: location.latitude, lng: location.longitude });

      infoWindowRef.current.close();
      const content = ReactDOMServer.renderToString(
        <MarkerPopup
          location={location}
          onAddRating={() => {
            setShowSidebar(true);
            console.log('asdfsd');
          }}
        />,
      );
      infoWindowRef.current.setContent(content);
      infoWindowRef.current.open(mapRef.current, marker);

      setTimeout(() => {
        const btn = document.getElementById('add-rating-btn');
        if (btn) {
          btn.addEventListener('click', () => setShowSidebar(true));
        }
      }, 100);
    }

    // clear form info
  };

  const setTemporaryMarker = async (lat: number, lng: number, name: string) => {
    // remove old marker
    if (tempMarkerRef.current) {
      tempMarkerRef.current.setMap(null); // unlinks from map
      tempMarkerRef.current = null;
    }

    // create new marker
    const newLocation: Location = {
      id: '-1', // -1 for temporary/unsaved
      latitude: lat,
      longitude: lng,
      name: `Your selected location: ${name}`,
      description: "Leave a rating about this place's safetyness?",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const marker = await populateOneMarker(newLocation);
    tempMarkerRef.current = marker;
  };

  const latLngToName = async (lat: number, lng: number) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.google.key}`);

    const data = await response.json();
    if (data.status === 'OK' && data.results[0]) {
      const address = data.results[0].formatted_address;
      return address;
    }
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: Database - stuff
  };

  return (
    <div className="h-full w-full overflow-hidden">
      {!isLoaded && <Loading message={'Loading map...'} />}

      <div className="flex h-full w-full">
        <div ref={htmlMapRef} className="h-full flex-1"></div>

        {isLoaded && (
          <button
            className={`${showSidebar ? 'right-81' : 'right-1'} absolute top-22 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg transition hover:bg-blue-700`}
            onClick={() => setShowSidebar(v => !v)}
            aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}>
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {isLoaded && showSidebar && (
          <div className="z-10 flex h-full w-80 flex-col gap-4 rounded-lg border border-gray-200 bg-white/95 p-6 shadow-lg">
            {latLng == null && (
              <MessageBox color="red" className="mb-3">
                Please select a location first
              </MessageBox>
            )}
            <div className={`${latLng == null ? 'pointer-events-none opacity-50' : ''} flex flex-col gap-y-4`}>
              {/* header + description */}
              <div>
                <h2 className="mb-1 text-lg font-semibold">Add New Rating To:</h2>
                <span className="text-gray-500">{locName}</span>
              </div>

              {/* form inputs */}
              <form onSubmit={handleFormSubmission}>
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Rating</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="rounded border px-2 py-1"
                    placeholder="1-5"
                    disabled={latLng == null}
                    name="rating"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Description</span>
                  <input type="text" className="rounded border px-2 py-1" placeholder="Description" disabled={latLng == null} name="description" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Time</span>
                  <div className="flex items-center gap-2">
                    <input type="datetime-local" className="flex-1 rounded border px-2 py-1" disabled={latLng == null} name="time" />
                    <button
                      type="button"
                      className="rounded bg-gray-200 px-2 py-1 text-xs"
                      onClick={() => {
                        const now = new Date();
                        const local = now.toISOString().slice(0, 16);
                        const input = document.querySelector('input[type=\"datetime-local\"]') as HTMLInputElement;
                        if (input) input.value = local;
                      }}
                      disabled={latLng == null}>
                      Now
                    </button>
                  </div>
                </label>
              </form>

              {/* buttons (cancel and save) */}
              <div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="flex-1 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                    onClick={() => setShowSidebar(false)}
                    disabled={latLng == null}>
                    Cancel
                  </button>
                  <button className="flex-1 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" disabled={latLng == null}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
