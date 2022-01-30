/* 
At the moment, there's no package that supports google street view.
The best approach i found out on the internet was to create a webview with the streetview js on it.
*/

export default (lat: number, lng: number) => `
<html>
  <head>
    <script>
      let panorama;

      function initialize() {
        panorama = new google.maps.StreetViewPanorama(
          document.getElementById("street-view"),
          {
            position: { lat: ${lat}, lng: ${lng} },
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
          }
        );
      }
    </script>
    <style>
      html,
      body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      
      #street-view {
        height: 100%;
        border-radius: 25opx;
        overflow: hidden;
      }                  
    </style>
  </head>
  <body>
    <div id="street-view"></div>
    <script
      src="https://maps.googleapis.com/maps/api/js?&callback=initialize&libraries=&v=weekly"
      async
    ></script>
  </body>
</html>
`;