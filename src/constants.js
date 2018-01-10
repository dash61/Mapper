export const PICK_DATA_SOURCE = 'PICK_DATA_SOURCE';
export const PICK_DATA_SOURCE2 = 'PICK_DATA_SOURCE2';
export const PICK_YEAR = 'PICK_YEAR';
export const CLEAR_DATA = 'CLEAR_DATA';                   // don't show overlay data anymore

export const LOAD_LAYER_DATA = 'LOAD_LAYER_DATA';
export const TURN_LAYER_ON = 'TURN_LAYER_ON';
export const TURN_LAYER_OFF = 'TURN_LAYER_OFF';
export const REQUEST_REMOTE_DATA = 'REQUEST_REMOTE_DATA';
export const ERROR_REMOTE_DATA = 'ERROR_REMOTE_DATA';
export const RECEIVE_REMOTE_DATA = 'RECEIVE_REMOTE_DATA';
export const LOAD_DATA_FROM_CACHE = 'LOAD_DATA_FROM_CACHE';

export const DATA_SRC_CENSUS = 'census';
export const DATA_SRC_BLS = 'bls';
export const DATA_SRC_FEMA = 'fema';
export const DATA_SRC_USGS = 'usgs';
export const DATA_SRC_MISC = 'unknown';

export const DATA_SRC2_TOTALPOP = 'totalpop';
export const DATA_SRC2_POPWHITE = 'popwhite';
export const DATA_SRC2_POPBLK = 'popblk';
export const DATA_SRC2_POPASIA = 'popasia';
export const DATA_SRC2_POPHISP = 'pophisp';
export const DATA_SRC2_POPOTHER = 'popother';
export const DATA_SRC2_POPMALE = 'popmale';
export const DATA_SRC2_POPFEM = 'popfem';
export const DATA_SRC2_POPLESSHI = 'poplesshi';
export const DATA_SRC2_POPHI = 'pophi';
export const DATA_SRC2_POPLESSCOLL = 'poplesscoll';
export const DATA_SRC2_POPBACH = 'popbach';
export const DATA_SRC2_POPSCH = 'popsch';
export const DATA_SRC2_POPCOLL = 'popcoll';

export const DATA_SRC_BLS_EMPLOYMENT = 'blsemployment';


// Enum to hold the type of geographic data:
export const geoType = {
    COUNTY: 1,
    STATE: 2,
    COUNTRY: 3,
    TERRITORY: 4,  // ie, owned by another country
    TRACT: 5,
    DISTRICT: 6,
    TOWNSHIP: 7,
    CITY: 8,
    REGION: 9,
    SUBREGION: 10
};

/*
for bls, see https://www.bls.gov/developers/api_python.htm#python2
     for python code sample
series id info at: https://www.bls.gov/help/hlpforma.htm#SM

Basically, you post a block of data of what you want, and you get back the data (in python):
    headers = {'Content-type': 'application/json'}
    data = json.dumps({"seriesid": ['CUUR0000SA0','SUUR0000SA0'],"startyear":"2011", "endyear":"2014"})
    p = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=data, headers=headers)
    json_data = json.loads(p.text)
    for series in json_data['Results']['series']:


census: spatially, data is defined by a FIPS code, or lat/long pair.
        temporally, data is defined by a reference year.
uses TigerWeb REST API.
I downloaded census.data.json (my name) from https://api.census.gov/data.json,
and this is a big resource (in json) of all their data, given by:

c_vintage: 2013,      // year
c_dataset: [ "acs5"], // data set
plus URLs to geography data, variables, tags, etc, in the form:
"c_geographyLink": "https://api.census.gov/data/2013/acs5/geography.json",
"title": "2009-2013 American Community Survey 5-Year Estimates",

I also downloaded "api-guide.pdf", the "Census Data API User Guide", v1.5.
It shows how to build the URL.

"variables" are the units of the data - like births, deaths, pop density, etc.
The name may be meaningful, or an acronym, or an alphanum designation - B02001_001E.
Some are required for a given data set.

You can filter with predicates like "&for=state:*" (meaning all states). 

I also downloaded the geoservices-rest-spec.pdf (v1.0), from esri.
TigerWeb uses this. This doesn't seem specific to the govt, just a generic spec
for map services. Better for those creating a server for such stuff.
See - https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb
(not sure what this is other than the structure of all the data they have)
See also - https://tigerweb.geo.census.gov/tigerwebmain/TIGERweb_restmapservice.html

See this page - https://bl.ocks.org/mbostock/2522624ada2c1f9e0fafb75cca09442b
This has the example of using D3 and curling census data to fill in the US Map:

# The state FIPS codes.
STATES="01 02 04 05 06 08 09 10 11 12 13 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 44 45 46 47 48 49 50 51 53 54 55 56"
loop thru the STATE codes to grab each json file, also fill in YEAR:
http://api.census.gov/data/${YEAR}/acs5?get=B01003_001E&for=tract:*&in=state:${STATE}&key=${CENSUS_KEY}








*/