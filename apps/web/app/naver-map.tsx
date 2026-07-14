"use client";

import { useEffect, useRef, useState } from "react";

const NAVER_MAP_SCRIPT_ID = "naver-maps-sdk";
const FALLBACK_CENTER = { latitude: 37.5666805, longitude: 126.9784147 };

type NaverLatLng = Readonly<{
  lat: () => number;
  lng: () => number;
}>;

type NaverMap = {
  destroy: () => void;
  setCenter: (center: NaverLatLng) => void;
  setSize: (size: unknown) => void;
  setZoom: (zoom: number) => void;
};

type NaverMarker = {
  setMap: (map: NaverMap | null) => void;
  setPosition: (position: NaverLatLng) => void;
};

type NaverMapsNamespace = {
  LatLng: new (latitude: number, longitude: number) => NaverLatLng;
  Map: new (
    element: HTMLElement,
    options: Readonly<{
      center: NaverLatLng;
      mapDataControl: boolean;
      scaleControl: boolean;
      zoom: number;
    }>,
  ) => NaverMap;
  Marker: new (options: Readonly<{ map: NaverMap; position: NaverLatLng }>) => NaverMarker;
  Size: new (width: number, height: number) => unknown;
};

declare global {
  interface Window {
    naver?: { maps: NaverMapsNamespace };
  }
}

type MapStatus = "loading" | "ready" | "missing-key" | "error";
type LocationStatus = "idle" | "requesting" | "located" | "fallback";

type NaverMapProps = Readonly<{
  clientId: string | undefined;
}>;

let naverMapsLoadPromise: Promise<NaverMapsNamespace> | undefined;

export function NaverMap({ clientId }: NaverMapProps) {
  const normalizedClientId = clientId?.trim();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<NaverMap | null>(null);
  const locationMarkerRef = useRef<NaverMarker | null>(null);
  const [mapStatus, setMapStatus] = useState<MapStatus>("loading");
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [message, setMessage] = useState("네이버 지도를 불러오고 있습니다.");
  const effectiveMapStatus = normalizedClientId ? mapStatus : "missing-key";
  const effectiveMessage = normalizedClientId
    ? message
    : "지도 Client ID를 설정하면 실제 지도가 표시됩니다.";

  useEffect(() => {
    if (!normalizedClientId) {
      return;
    }

    let isDisposed = false;
    let resizeObserver: ResizeObserver | undefined;
    let map: NaverMap | undefined;

    loadNaverMaps(normalizedClientId)
      .then((maps) => {
        if (isDisposed || !containerRef.current) {
          return;
        }

        const center = new maps.LatLng(
          FALLBACK_CENTER.latitude,
          FALLBACK_CENTER.longitude,
        );

        map = new maps.Map(containerRef.current, {
          center,
          zoom: 14,
          mapDataControl: false,
          scaleControl: false,
        });
        mapRef.current = map;

        // The SDK fixes its initial canvas size, so keep it aligned with responsive layout changes.
        resizeObserver = new ResizeObserver(([entry]) => {
          if (!entry || !map) {
            return;
          }

          map.setSize(
            new maps.Size(entry.contentRect.width, entry.contentRect.height),
          );
        });
        resizeObserver.observe(containerRef.current);

        setMapStatus("ready");
        setMessage("서울시청을 기준으로 지도를 표시하고 있습니다.");
      })
      .catch(() => {
        if (!isDisposed) {
          setMapStatus("error");
          setMessage("지도 SDK를 불러오지 못했습니다. 설정과 허용 URL을 확인해 주세요.");
        }
      });

    return () => {
      isDisposed = true;
      resizeObserver?.disconnect();
      locationMarkerRef.current?.setMap(null);
      locationMarkerRef.current = null;
      map?.destroy();
      mapRef.current = null;
    };
  }, [normalizedClientId]);

  function moveToCurrentLocation() {
    const map = mapRef.current;
    const maps = window.naver?.maps;

    if (!map || !maps || effectiveMapStatus !== "ready") {
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus("fallback");
      setMessage("이 브라우저는 위치 확인을 지원하지 않아 서울시청 지도를 유지합니다.");
      return;
    }

    setLocationStatus("requesting");
    setMessage("현재 위치를 확인하고 있습니다.");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position = new maps.LatLng(coords.latitude, coords.longitude);

        map.setCenter(position);
        map.setZoom(16);

        if (locationMarkerRef.current) {
          locationMarkerRef.current.setPosition(position);
        } else {
          locationMarkerRef.current = new maps.Marker({ map, position });
        }

        setLocationStatus("located");
        setMessage("현재 위치를 지도 중심으로 표시했습니다.");
      },
      () => {
        setLocationStatus("fallback");
        setMessage("위치를 확인할 수 없어 서울시청 기준 지도를 계속 표시합니다.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(39,117,72,0.12),transparent_28%),linear-gradient(135deg,#f9fbf5,#edf4ea)]">
      <div ref={containerRef} className="size-full" aria-label="네이버 지도" />

      {effectiveMapStatus !== "ready" ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center px-4">
          <p
            className="m-0 max-w-md rounded-panel border border-app-border bg-white/95 px-4 py-3 text-center text-sm text-app-muted shadow-panel"
            role={effectiveMapStatus === "error" ? "alert" : "status"}
          >
            {effectiveMessage}
          </p>
        </div>
      ) : null}

      <div className="absolute bottom-[270px] right-3 z-10 flex max-w-[min(88vw,360px)] flex-col items-end gap-2 md:bottom-36 md:right-map-gutter">
        <button
          className="min-h-11 rounded-control border border-app-border bg-white px-4 text-sm font-bold text-app-text shadow-marker disabled:cursor-wait disabled:text-app-muted"
          disabled={
            effectiveMapStatus !== "ready" || locationStatus === "requesting"
          }
          onClick={moveToCurrentLocation}
          type="button"
        >
          {locationStatus === "requesting" ? "위치 확인 중" : "내 위치"}
        </button>
        <p
          className="m-0 rounded-control border border-app-border bg-white/95 px-3 py-2 text-right text-xs leading-5 text-app-muted shadow-marker"
          role="status"
        >
          {effectiveMessage}
        </p>
      </div>
    </div>
  );
}

function loadNaverMaps(clientId: string): Promise<NaverMapsNamespace> {
  if (window.naver?.maps) {
    return Promise.resolve(window.naver.maps);
  }

  if (naverMapsLoadPromise) {
    return naverMapsLoadPromise;
  }

  naverMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(
      NAVER_MAP_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    const script: HTMLScriptElement =
      existingScript ?? document.createElement("script");

    const handleLoad = () => {
      if (window.naver?.maps) {
        resolve(window.naver.maps);
      } else {
        reject(new Error("NAVER Maps namespace is unavailable after SDK load."));
      }
    };

    const handleError = () => {
      naverMapsLoadPromise = undefined;
      reject(new Error("NAVER Maps SDK script failed to load."));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.id = NAVER_MAP_SCRIPT_ID;
      script.async = true;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
      document.head.append(script);
    }
  });

  return naverMapsLoadPromise;
}
