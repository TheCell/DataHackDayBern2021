import L from 'leaflet';
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

/*
https://github.com/PaulLeCam/react-leaflet/issues/453#issuecomment-731732137
Fixes wrong/missing Icon/Marker displays
*/
