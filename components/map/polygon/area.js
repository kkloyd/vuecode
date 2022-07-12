import geodesy from "leaflet-geodesy"

function calcPolygonArea(polygon) {
  return +(geodesy.area(polygon) / 10000).toFixed(2)
}

export {
  calcPolygonArea,
}
