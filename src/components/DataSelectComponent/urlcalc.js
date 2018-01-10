import { DATA_SRC_CENSUS,
         DATA_SRC_BLS,
         DATA_SRC_MISC,
         DATA_SRC2_TOTALPOP,
         DATA_SRC2_POPWHITE,
         DATA_SRC2_POPBLK,
         DATA_SRC2_POPASIA,
         DATA_SRC2_POPHISP,
         DATA_SRC2_POPOTHER,
         DATA_SRC2_POPMALE,
         DATA_SRC2_POPFEM,
         DATA_SRC2_POPLESSHI,
         DATA_SRC2_POPHI,
         DATA_SRC2_POPLESSCOLL,
         DATA_SRC2_POPBACH,
         DATA_SRC2_POPSCH,
         DATA_SRC2_POPCOLL,
         DATA_SRC_BLS_EMPLOYMENT,
       } from '../../constants';



const DATA_SRC_BLS_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/';
const DATA_SRC_MISC_URL = 'http://catalog.data.gov/api/3/';

// The state FIPS codes.
const STATES="01 02 04 05 06 08 09 10 11 12 13 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 44 45 46 47 48 49 50 51 53 54 55 56";

function figureOutURL (year, dataSrc, dataSrc2)
{
    console.log("figureOutURL - passed year=", year, ", and data src=", dataSrc, ", and data src2=", dataSrc2);
    let statesArray = STATES.split(' ');
    let finalURL = '';
    let finalParams = {};

    switch (dataSrc)
    {
        case DATA_SRC_CENSUS:// old: for=tract:*&in=state:01&key=...
             {
                const DATA_SRC_CENSUS_URL = 'https:/api.census.gov/data/'; // add 2010.json, eg
                const CENSUS_KEY1='0474938e8255c78f1fa2c4afedde8005421dfb10';
                let middle = '';

                switch (dataSrc2)
                {
                    case DATA_SRC2_TOTALPOP:
                         middle = "/acs5?get=B01003_001E&for=county:*";
                         break;

                    case DATA_SRC2_POPWHITE:
                         middle = "/acs5?get=B02001_002E&for=county:*";
                         break;

                    case DATA_SRC2_POPBLK:
                         middle = "/acs5?get=B02001_003E&for=county:*";
                         break;

                    case DATA_SRC2_POPASIA:
                         middle = "/acs5?get=B02001_005E&for=county:*";
                         break;

                    case DATA_SRC2_POPHISP:
                         middle = "/acs5?get=B03003_003E&for=county:*";
                         break;

                    case DATA_SRC2_POPOTHER:
                         middle = "/acs5?get=B02001_004E,B02001_006E,B02001_007E&for=county:*";
                         break;

                    case DATA_SRC2_POPMALE:
                         middle = "/acs5?get=B01001_002E&for=county:*";
                         break;

                    case DATA_SRC2_POPFEM:
                         middle = "/acs5?get=B01001_026E&for=county:*";
                         break;

                    case DATA_SRC2_POPLESSHI:
                         middle = "/acs5?get=B23006_002E&for=county:*";
                         break;

                    case DATA_SRC2_POPHI:
                         middle = "/acs5?get=B23006_009E&for=county:*";
                         break;

                    case DATA_SRC2_POPLESSCOLL:
                         middle = "/acs5?get=B23006_016E&for=county:*";
                         break;

                    case DATA_SRC2_POPBACH:
                         middle = "/acs5?get=B23006_023E&for=county:*";
                         break;

                    case DATA_SRC2_POPSCH:
                         middle = "/acs/acs1/profile?get=DP02_0052E&for=county:*";
                         break;

                    case DATA_SRC2_POPCOLL:
                         middle = "/acs/acs1/profile?get=DP02_0057E&for=county:*";
                         break;

                    default:
                         break;

                }
                // https://api.census.gov/data/2016/acs/acs1/profile?get=DP02_0001E&for=county:*&key=
             //finalURL = DATA_SRC_CENSUS_URL + year.toString() + "/acs5?get=B01003_001E&for=tract:*&in=state:01&key=" + CENSUS_KEY;
             finalURL = DATA_SRC_CENSUS_URL + year.toString() + middle + '&key=' + CENSUS_KEY1;
//                "/acs5?get=B01003_001E&for=county:*&key=" + CENSUS_KEY;
//                "/acs5?get=B01003_001E&for=tract:*&in=state:01&key=" + CENSUS_KEY;
             }
             break;

        case DATA_SRC_BLS:
             console.log("figureOutURL - got to bls datasrc");
             const DATA_SRC_BLS_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/'; //?registrationkey=';
             const CENSUS_KEY2='f0a6af7e463a40618638b1384b8579ae'; // YOU HAVE TO RE-REGISTER ONCE A YEAR!!! GO TO https://data.bls.gov/registrationEngine/.
             finalURL = DATA_SRC_BLS_URL;
             // LAST REGISTRATION WAS 12/22/2017.

/* Doesn't work:
https://api.bls.gov/publicAPI/v2/timeseries/data/?registrationkey=f0a6af7e463a40618638b1384b8579ae&seriesid=SAS0800000000001&startyear=2015&endyear=2015
https://api.bls.gov/publicAPI/v2/timeseries/data/?registrationkey=f0a6af7e463a40618638b1384b8579ae&catalog=true&startyear=2010&endyear=2014&calculations=true%20&annualaverage=true

https://api.bls.gov/publicAPI/v2/timeseries/data/?&seriesid=SAS0800000000001&startyear=2015&endyear=2015&annualaverage=true&registrationkey=f0a6af7e463a40618638b1384b8579ae

python examples:
data = json.dumps({"seriesid": ['CUUR0000SA0','SUUR0000SA0'],"startyear":"2011", "endyear":"2014"})
p = requests.post('https://api.bls.gov/publicAPI/v2/timeseries/data/', data=data, headers=headers)
*/

             switch (dataSrc2)
             {
                case DATA_SRC2_TOTALPOP:
                     const yearEnd = +year + 1;
                     finalParams = {"seriesid": ['CUUR0000SA0','SUUR0000SA0'],
                                    "startyear": year.toString(),
                                    "endyear": yearEnd.toString()};//,
                                    //"registrationkey": CENSUS_KEY2};
                     break;

                default:
                     break;
             }
             break;

        case DATA_SRC_MISC:
             console.log("figureOutURL - got to unknown datasrc");
             break;

        default:
             console.log("figureOutURL - got to default datasrc");
             break;
    }
    console.log("figureOutURL - url =", finalURL);
    console.log("figureOutURL - params =", finalParams);

    return [finalURL, finalParams];
}


export default figureOutURL;

/*
census  acs5 year
        

acs5 data variables:
B01003_001E - Population
B02001_002E - Population - white only
B02001_003E - Population - black only
B02001_005E - Population - asian only
B02001_008E - Population - only biracials
B02001_004E,6E,7E - Population - all others
B03003_003E - Population - hispanic/latino only
B01001_002E - Population - males
B01001_026E - Population - females
B23006_002E - Population - less than high school graduate
B23006_009E - Population - high school graduate
B23006_016E - Population - some college or assoc. degree
B23006_023E - Population - bachelors degree or higher
B27001_001E - Population - health insurance coverage - only gives all people (with and w/o coverage); need to use subgroups

fmt of data rtnd
----------------
/acs5?get=B01003_001E&for=county:*
[["B01003_001E","state","county"], (here we don't want to aggregate state data)
["55221","01","001"],
["195121","01","003"],
...
/acs5?get=B01003_001E&tract:*&in=state:01
[["B01003_001E","state","county","tract"], (here we do want to aggregate tract data)
["1948","01","001","020100"],              (until I get tract geom)
["2156","01","001","020200"],
...


Data Profile URLs - doesn't appear to return data for all counties
-----------------
DP02_0001E - "Total Households" - households by type
DP02_0002E - "Total Family Households" - households by type - total households
DP02_0010E - "Total Non-Family Households" - households by type - total households
DP02_0015E - "Average Household Size" - households by type
DP02_0016E - "Average Family Size" - households by type
DP02_0052E - "School Enrollment" - pop 3yrs and older
DP02_0057E - "College Enrollment" - pop 3yrs and older
DP02_0064E - "Has Bachelors Degree" - pop 3yrs and older
DP02_0066E - "Has High School Degree" - pop 3yrs and older


https://api.census.gov/data/2016/acs/acs1/profile?get=DP02_0001E&for=county:*&key=
[["DP02_0001E","state","county"],
["76779","01","003"],
["43972","01","015"],
["30299","01","043"],
...

*/















