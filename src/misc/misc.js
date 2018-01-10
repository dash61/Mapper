// Custom reducer master switching function.
// This will determine which custom reducer below to use.
function customReducer (oldArray)
{
    let firstRow = oldArray[0]; // firstRow is itself an array
    let firstRowCols = firstRow.length;
    let numDataRows = 0;
    let numStateRows = 0;
    let numCountyRows = 0;
    let numSubCountyRows = 0;

    for (let i=0; i<firstRowCols; i++)
    {
        if (firstRow[i][0] ==="B" || firstRow[i][0] ==="D")
        {
            numDataRows++;
        }
        else if (firstRow[i] === "state")
        {
            numStateRows++;
        }
        else if (firstRow[i] === "county")
        {
            numCountyRows++;
        }
        else
        {
            numSubCountyRows++;
        }
    }
    console.log(`customReducer - dataRows=${numDataRows}, states=${numStateRows}, counties=${numCountyRows}`);

    if (numDataRows === 1 && numStateRows === 1 && numCountyRows === 1 && numSubCountyRows === 0)
    {
        return oldArray.slice(1);
    }
    else if (numDataRows === 2 && numStateRows === 1 && numCountyRows === 1 && numSubCountyRows === 0)
    {
        return customReducer2DataSets(oldArray);
    }
    else if (numDataRows === 3 && numStateRows === 1 && numCountyRows === 1 && numSubCountyRows === 0)
    {
        return customReducer3DataSets(oldArray);
    }
    else if (numDataRows === 1 && numStateRows === 1 && numCountyRows === 1 && numSubCountyRows === 1)
    {
        return customReducerCounty(oldArray);
    }
    return oldArray; // fallback
}


// Custom reducer function.
// Given an array of an array of strings, where one column represents numbers
// that you want to accumulate (sum up) over a number of rows, this function
// will create a new array from those accumulated values, along with the old
// row data as well.
/* Example data:
0: ["B01003_001E", "state", "county", "tract"] <-- ignore this row
1: ["1948", "01", "001", "020100"] <-- new state/county combo; start accumulation
2: ["2156", "01", "001", "020200"]
3: ["2968", "01", "001", "020300"]
4: ["4423", "01", "001", "020400"]
5: ["10763", "01", "001", "020500"]
6: ["3851", "01", "001", "020600"]
7: ["2761", "01", "001", "020700"]
8: ["3187", "01", "001", "020801"]
9: ["10915", "01", "001", "020802"]
10: ["5668", "01", "001", "020900"]
11: ["3286", "01", "001", "021000"]
12: ["3295", "01", "001", "021100"] <-- accumulate from row 1 thru this row 12
13: ["3829", "01", "003", "010100"] <-- new state/county combo; restart accumulation
14: ["2869", "01", "003", "010200"]
15: ["7455", "01", "003", "010300"]
16: ["4537", "01", "003", "010400"]
...
*/
function customReducerCounty (oldArray)
{
    // play with action.data here:
    let newArray = [];
    let lastState = "xx";
    let lastCounty = "yy";
    let accum = 0;
    let newIteration = true;

    for (let i=1; i<oldArray.length; i++) // skip 0th elem, which is column labels
    {
        if (oldArray[i][1] !== lastState || oldArray[i][2] !== lastCounty)
        {
            newIteration = true;
            lastState = oldArray[i][1];
            lastCounty = oldArray[i][2];
        }

        if (newIteration)
        {
            // write out last iteration's results to newArray
            if (accum > 0)
            {
                newArray.push([accum.toString(), oldArray[i-1][1], oldArray[i-1][2], oldArray[i-1][3]]);
            }
            accum = +oldArray[i][0]; // convert to number
            newIteration = false;
        }
        else
        {
            accum += +oldArray[i][0]; // convert to number                    
        }
        // If we've processed the last row, we won't be looping around to find a new
        // iteration, therefore we won't hit the newArray.push above.
        if (i === oldArray.length-1)
        {
            newArray.push([accum.toString(), oldArray[i-1][1], oldArray[i-1][2], oldArray[i-1][3]]);
        }
    }
    //console.log("customReducerCounty - newArray=", newArray);
    return newArray;
}

// Custom reducer function.
// Given an array of an array of strings, where 2 columns represents numbers
// that you want to accumulate (sum up) over a number of rows, this function
// will create a new array from those accumulated values, along with the old
// row data as well.
/* Example data:
[["B02001_004E","B02001_006E","state","county"],
["169","212","01","001"], <-- sum 169+212, output array has: ["381","01","001"]
["1038","2645","01","003"],
["25","570","01","005"],
["80","9","01","007"],
...
*/
function customReducer2DataSets (oldArray)
{
    // play with action.data here:
    let newArray = [];
    let accum = 0;

    for (let i=1; i<oldArray.length; i++) // skip 0th elem, which is column labels
    {
        accum = +oldArray[i][0] + +oldArray[i][1];
        newArray.push([accum.toString(), oldArray[i][2], oldArray[i][3]]);
    }
    console.log("customReducer2DataSets - newArray=", newArray);
    return newArray;
}

// Custom reducer function.
// Given an array of an array of strings, where 3 columns represents numbers
// that you want to accumulate (sum up) over a number of rows, this function
// will create a new array from those accumulated values, along with the old
// row data as well.
/* Example data:
[["B02001_004E","B02001_006E","B02001_007E","state","county"],
["169","0","212","01","001"], <-- sum 169+0+212, output array has: ["381","01","001"]
["1038","4","2645","01","003"],
["25","0","570","01","005"],
["80","0","9","01","007"],
...
*/
function customReducer3DataSets (oldArray)
{
    // play with action.data here:
    let newArray = [];
    let accum = 0;

    for (let i=1; i<oldArray.length; i++) // skip 0th elem, which is column labels
    {
        accum = +oldArray[i][0] + +oldArray[i][1] + +oldArray[i][2];
        newArray.push([accum.toString(), oldArray[i][3], oldArray[i][4]]);
    }
    console.log("customReducer3DataSets - newArray=", newArray);
    return newArray;
}

// Given an array of an array of strings, where one column represents numbers
// that you want to get the range on, this function will check that column
// and return an array of the min and max numeric values found (it converts
// the strings to numbers just to check them).
function getNumericRangeOfArray(arr, indexToCheck)
{
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    window.console.log("getNumericRangeOfArray - input=", arr, ", indexToCheck=", indexToCheck);

    for (let i=0; i<arr.length; i++)
    {
        min = Math.min(min, +arr[i][indexToCheck]);
        max = Math.max(max, +arr[i][indexToCheck]);
    }
    return [min, max];
}

/* Given an array like 
0: ["1948", "01", "001", "020100"],
1: ["2156", "01", "002", "020200"],
2: ["2968", "01", "003", "020300"],
3: ["4423", "01", "004", "020400"],
4: ["10763", "01", "005", "020500"],
...
Turn this into an array like:
[   {
        "FIPS": "01001", <-- columns 2&3 combined
        "data": 1948,    <-- column 1 value
        "": null,
    },
    {
        "FIPS": "01002",
        "data": 2156,
        "": null,
    },
    {
        "FIPS": "01003",
        "data": 2968,
        "": null,
    }
]
*/
function reformatData(arr, useLog)
{
    let output = [];

    for (let i=0; i<arr.length; i++)
    {
        let value = (useLog ? Math.log(+arr[i][0]) : +arr[i][0]);
        let obj = {};
        obj["FIPS"] = arr[i][1] + arr[i][2];
        obj["Legend"] = (value === 0 ? 1 : value);
        obj[""] = null;
        output.push(obj); 
    }
    console.log("reformatData - newArray=", output);
    return output;
}

function isEmpty1(a) {
    return (Object.keys(a).length === 0)
}

function isEmpty2(a) {
    for (let x in a) { return false; }
    return true;
}

function isEmpty3(a) {
    for (let x in a) { if (a.hasOwnProperty(x))  return false; }
    return true;
}

function isEmpty4(a) {
    return ('{}' === JSON.stringify(a))
}

export { customReducer, getNumericRangeOfArray, reformatData, isEmpty1 };



