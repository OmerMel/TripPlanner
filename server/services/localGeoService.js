import fs from "fs";
import path from "path";
import rbush from "geojson-rbush";
import * as turf from "@turf/turf";

const WATER_PATH =
    process.env.WATER_GEOJSON_PATH ||
    path.join(process.cwd(), "data", "water_osm.geojson");


const WATER_BUFFER_METERS = Number(process.env.WATER_BUFFER_M || 0);

const SEARCH_RADIUS_M = Number(process.env.WATER_SEARCH_RADIUS_M || 80);

const PROBE_RADIUS_M = Number(process.env.WATER_PROBE_RADIUS_M || 3);

let waterIndex = null;

function loadFeatureCollection(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Water polygons file not found at ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const fc = JSON.parse(raw);
    if (fc?.type !== "FeatureCollection" || !Array.isArray(fc.features)) {
        throw new Error("Expected a GeoJSON FeatureCollection");
    }
    return fc;
}

function maybeBuffer(fc, meters) {
    if (!meters) return fc;
    const km = meters / 1000;
    const out = { type: "FeatureCollection", features: [] };
    for (const f of fc.features) {
        try {
            const bf = turf.buffer(f, km, { units: "kilometers", steps: 8 });
            if (bf) out.features.push(bf);
        } catch {
            // skip invalid geometries
        }
    }
    return out;
}

/** Call once on server startup */
export function initLocalLandIndex() {
    const waterFC = loadFeatureCollection(WATER_PATH);
    const prepared = maybeBuffer(waterFC, WATER_BUFFER_METERS);

    waterIndex = rbush();
    waterIndex.load(prepared);

    console.log(
        `[localGeoService] loaded water polygons: ${waterFC.features.length} ` +
        `(buffer=${WATER_BUFFER_METERS}m, searchRadius=${SEARCH_RADIUS_M}m, probe=${PROBE_RADIUS_M}m)`
    );
}

/** true = on land, false = water */
export function isPointOnLand(lat, lng) {
    if (!waterIndex) {
        throw new Error("Water index not initialized. Call initLocalLandIndex() at startup.");
    }

    // IMPORTANT: [lng, lat]
    const pt = turf.point([lng, lat]);

    // Build a bbox around the point to fetch candidates from the index
    const km = SEARCH_RADIUS_M / 1000;
    const searchArea = turf.buffer(pt, km, { units: "kilometers", steps: 8 });
    let [minX, minY, maxX, maxY] = turf.bbox(searchArea);

    // Fetch candidates by bbox ARRAY (rbush expects [minX,minY,maxX,maxY])
    let candidatesFC = waterIndex.search([minX, minY, maxX, maxY]);

    // Fallback: if no candidates, widen the search once
    if (!candidatesFC || !Array.isArray(candidatesFC.features) || candidatesFC.features.length === 0) {
        const km2 = Math.max(0.5, km * 5); // up to ~1–2km
        const widen = turf.buffer(pt, km2, { units: "kilometers", steps: 8 });
        [minX, minY, maxX, maxY] = turf.bbox(widen);
        candidatesFC = waterIndex.search([minX, minY, maxX, maxY]);
    }

    // Probe buffer around the point (handles boundary/precision issues)
    const probe = turf.buffer(pt, PROBE_RADIUS_M / 1000, { units: "kilometers", steps: 8 });

    // If the probe intersects any water polygon => it's water
    for (const f of candidatesFC.features) {
        // booleanIntersects is tolerant (works for touching/overlapping)
        if (turf.booleanIntersects(probe, f)) {
            return false; // water
        }
        // As a stricter fallback, also check point-in-polygon
        if (turf.booleanPointInPolygon(pt, f)) {
            return false; // water
        }
    }

    // Not intersecting any water polygon → consider land
    return true;
}

/** Validate a full route and collect points that fall in water */
export function validateRouteOnLandLocal(route) {
    const waterPoints = [];

    const points = [
        { where: "startPoint", lat: route?.startPoint?.lat, lng: route?.startPoint?.lng },
        ...(Array.isArray(route?.waypoints)
            ? route.waypoints.map(w => ({
                where: `waypoint#${w.order ?? "?"}`,
                lat: w.lat,
                lng: w.lng,
            }))
            : []),
        { where: "endPoint", lat: route?.endPoint?.lat, lng: route?.endPoint?.lng },
    ].filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));

    for (const p of points) {
        const onLand = isPointOnLand(p.lat, p.lng);
        if (!onLand) {
            waterPoints.push(p);
        }
    }

    return { ok: waterPoints.length === 0, waterPoints };
}