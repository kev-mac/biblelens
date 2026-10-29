// Reviewed exclusions from the pinned Theographic snapshot, not replacement locations.
// The shared pair is already in upstream latitude/longitude and openBibleLat/Long.
// It conflicts with the southern Judah/Simeon descriptions. The upstream author’s
// reason for reusing it is undocumented; treat it as a placeholder, never a pin.
export const placeholderCoordinates = [[32.049953, 35.733402]];
export const unresolvedPlaceCoordinates = new Set(['recgHRXfPTqW94gKC', 'recSPzi0p68v5OEah']);
export function excludeUnknownPlaceCoordinates(places) {
  const excluded = [];
  for (const place of places) {
    const f = place.fields;
    const placeholder = placeholderCoordinates.some(([lat, lon]) => Number(f.latitude) === lat && Number(f.longitude) === lon);
    if (!placeholder && !unresolvedPlaceCoordinates.has(place.id)) continue;
    excluded.push({id: place.id, name: f.displayTitle, latitude: f.latitude, longitude: f.longitude,
      reason: placeholder ? 'Shared upstream placeholder; source descriptions conflict with this point.' : 'Reviewed source/context conflict; no supported alternative coordinate in the dataset.'});
    f.latitude = null;
    f.longitude = null;
    f.identificationUncertain = true;
  }
  return excluded;
}
