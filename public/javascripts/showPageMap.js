// 엑세스토큰을 Show 페이지인 ejs파일에서 받아온다.
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});
// Create a new marker.
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates) //[lng, lat]
    .setPopup(new mapboxgl.Popup()
        .setHTML(
            //Sets the popup's content to the HTML provided as a string.
            `<h3>${campground.title}</h3>
            <p>${campground.location}</p>`
        )
    ) // add popup
    .addTo(map);