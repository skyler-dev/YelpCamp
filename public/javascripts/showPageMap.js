mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: campground.geometry.coordinates,
    zoom: 9
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(new mapboxgl.Popup()
        .setHTML(
            `<h6>${campground.title}</h6>
            <p>${campground.location}</p>`
        )
    )
    .addTo(map);