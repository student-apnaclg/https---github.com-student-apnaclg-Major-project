mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 13 // starting zoom
});


const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)// Listing.geometry.coordinates
.setPopup(
    new mapboxgl.Popup({offset: 25}).setHTML(
    `<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`
    )
)
.addTo(map);



// let mapToken = mapToken;/*isme ejs template ko access nhi kr sakte islia use mapToken from Show.ejs*/
