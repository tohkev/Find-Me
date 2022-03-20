import React from "react";

import "./Map.css";

const Map = (props) => {
	// ***************If using openlayer instead of Google Maps **************
	// const mapRef = React.useRef();

	// const { center, zoom } = props;

	// React.useEffect(() => {
	//   new window.ol.Map({
	//     target: mapRef.current.id,
	//     layers: [
	//       new window.ol.layer.Tile({
	//         source: new window.ol.source.OSM(),
	//       }),
	//     ],
	//     view: new window.ol.View({
	//       center: window.ol.proj.fromLonLat([center.lng, center.lat]),
	//       zoom: zoom,
	//     }),
	//   });
	// }, [center, zoom]);

	// ***************Using Google Maps API**************
	const mapRef = React.useRef();

	const { center, zoom } = props;

	React.useEffect(() => {
		const map = new window.google.maps.Map(mapRef.current, {
			center: center,
			zoom: zoom,
		});

		new window.google.maps.Marker({ position: props.center, map: map });
	}, [center, zoom]);

	return (
		<div
			ref={mapRef}
			className={`map ${props.className}`}
			style={props.style}
			id="map"
		></div>
	);
};

export default Map;
