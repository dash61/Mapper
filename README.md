# Mapper

Copyright 2017, 2018 Zoba LLC

A PWA using React, Redux and Leaflet.

Credit for globe icon photos (favicons) to:  Andrew Neel on Unsplash

Credit also goes to the [KrateLabs demo](https://github.com/KrateLabs/KrateLabs-App).


This is just a *sample* app. I pulled public data on country/state/county boundaries and use those in the map to draw borders. Those json files are in: src/components/MapComponent.

You can click on a country, state, or county to zoom into it. You have to be at a certain zoom level to select a county, so you may need to manually zoom into the large states before counties are clickable.

## Screenshot

![screenshot](https://i.imgur.com/TihOJcy.png)


Things still to be done:

* Add more data sources (BLS, FEMA, etc.). I tried adding in BLS, but it doesn't allow API access via a browser (because it is not set up for CORS), so a workaround is needed, like going through another server.
* Add in markers or popups when hovering over a county to show the name and value. For example, put labels on counties when zoomed in 8 or more AND highlighted, or if zoomed in 10 or more and highlighted or not.
* Add in district borders; some data comes in districts, not counties.

To run this:

* First, you will need to get API keys for 1) the Census Bureau, and 2) for mapbox/leaflet.
* Open Chrome
* Copy this project to a local directory.
* In your terminal window set to that local directory, do:
  *  $ export REACT_APP_CENSUS_KEY='put your census key here'
  *    $ export REACT_APP_MAP_ACCESS_TOKEN='put your mapbox key here'
  *    $ npm start
* Chrome will display the app at localhost:3000.
* Select a data source, data type, year, and hit the 'Go!' button to show the results. If there is no data for that combination, a red error message will appear to the right of the 'Clear' button. Usually it says 'Error: Not Found'.
