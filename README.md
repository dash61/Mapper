# Mapper

A PWA using React, Redux and Leaflet.

Credit for globe icon photos (favicons) to:  Andrew Neel on Unsplash

Credit goes to the [KrateLabs demo](https://github.com/KrateLabs/KrateLabs-App).


This is just a *sample* app. I pulled public data on country/state/county boundaries and use those in the map to draw borders. Those json files are in: src/components/MapComponent.

You can click on a country, state, or county to zoom into it. You have to be at a certain zoom level to select a county, so you may need to manually zoom into the large states before counties are clickable.


Things still to be done:

* Add more data sources (BLS, FEMA, etc.). I tried adding in BLS, but it doesn't allow API access via a browser (because it is not set up for CORS), so a workaround is needed, like going through another server.
* Fix the legend - I changed the code to use a logarithmic ramping, but to change the legend itself, I'd need to change the leaflet.js code. The logarithmic ramping was needed so that county populations that range from in the low hundreds to the millions could be assigned a range of colors, instead of a linear ramping, which would have made almost all counties the same color. This is so we can display a big range of 85 to 10 million sanely. Legend min and max are wrong, but not too hard to fix, but tooltip is also wrong; can we intercept this before it is displayed and reverse the ln(value) we did earlier?
* Add in markers or popups when hovering over a county to show the name and value. For example, put labels on counties when zoomed in 8 or more AND highlighted, or if zoomed in 10 or more and highlighted or not.
* Add in district borders; some data comes in districts, not counties.

To run this:

* Open Chrome
* Copy this project to a local directory.
* In your terminal window set to that local directory, do:
   $ npm start
* Chrome will display the app at localhost:3000.
* Select a data source, data type, year, and hit the 'Go!' button to show the results. If there is no data for that combination, a red error message will appear to the right of the 'Clear' button. Usually it says 'Error: Not Found'.
