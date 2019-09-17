//Define the applet that created the frame
let Originator;

//Define Objects for scrollbar control
let V1Bar, V2Bar, V3Bar, DxBar, NBar, NDataBar;

//Define Objects for Radio buttons//PROBABLY DONT NEED
// let sourcetype = new CheckboxGroup();
// let  hammer = new Checkbox("Hammer");
// let  shotgun = new Checkbox("Shotgun");
// let  dynamite = new Checkbox("Dynamite");
let stype = 'd'; //character string to identify currently
//active source type h=hammer, s=shotgun
//d=dynamite

//Define Object for a seismogram plotting button and a test variable
let PSeisms;
let plottraces = true; //Initially display traces

//Define Object for Printing Button and Plot Type Button
let Print, PType;

//Plot type label
let PTypeLabel;

//Define Objects for scrollbar labels
let V1Label, V2Label, V3Label, DxLabel, NLabel, NDataLabel;

// //Define variables to hold custom colors
// let Sky = #00FFFF;
// let L1c = new Color(.43f, .75f, .54f);
// let L2c = new Color(.49f, .75f, .50f);
// let L3c = new Color(.64f, .55f, .46f);

//Now define minimum and maximum values in user space
//and corresponding maximums and minimums for the scroll bars
//that must be integers
let V1Min = 300.0; // meters/s
let V1Max = 2500.0;
let dV1 = 50.0; //Increment in Spacing allowed
let V1BarMin = 1; //Minimum Scroll Bar Value
let V1BarMax = ((V1Max - V1Min) / dV1 + 2.1); //Maximum Scroll Bar Value
let V2Min = 300.0; //meters
let V2Max = 2500.0;
let dV2 = 50.0; //Increment in Spacing allowed
let V2BarMin = 1; //Minimum Scroll Bar Value
let V2BarMax = ((V2Max - V2Min) / dV2 + 2.1); //Maximum Scroll Bar Value
let V3Min = 300.0; //meters
let V3Max = 2500.0;
let dV3 = 50.0; //Increment in Spacing allowed
let V3BarMin = 1; //Minimum Scroll Bar Value
let V3BarMax = ((V3Max - V3Min) / dV3 + 2.1); //Maximum Scroll Bar Value
let NMin = 12; //number of geophones in spread
let NMax = 144;
let dN = 12; //Increment in Spacing allowed
let NBarMin = 1; //Minimum Scroll Bar Value
let NBarMax = ((NMax - NMin) / dN + 2.1); //Maximum Scroll Bar Value
let DxMin = 0.5; //Station Spacing in meters
let DxMax = 20.0;
let dDx = 0.5; //Increment in Spacing allowed
let DxBarMin = 1; //Minimum Scroll Bar Value
let DxBarMax = ((DxMax - DxMin) / dDx + 2.1); //Maximum Scroll Bar Value
let NDataMin = 1; //Minimum number of sources to stack
let NDataMax = 20;
let dNData = 1;
let NDataBarMin = 1; //Minimum Scroll Bar Value
let NDataBarMax = ((NDataMax - NDataMin) / dNData + 2.1);


//Define Variables used to some initial values
let v1 = 500.0;
let v2 = 1200.0;
let v3 = 2000.0;
let m1 = 0.0; //slope of bottom of top layer
let b1 = 5.0; //depth intercept of bottom of top layer
let m2 = 0.0; //slope of bottom of middle layer
let b2 = 10.0; //depth intercept of bottom of middle layer
let sourcex = 200.0; //Source location
let dsourcex = 0.5; //Allow source movements of this
let recx = 201.0; //Minimum receiver location
let drecx = 0.5; //Allow receiver movements of this
let dx = 3.0; //receiver spacing
let nx = 24; //number of receivers
let ndata = 1; //number of sources to stack
let svalue; //Variable used to construct scrollbars

//Define values for drawing figures in frame
let framex = 600; //frame sizes
let framey = 350;
let xsectx = 500; //size of xsection part of frame
let xsecty = 225;
let surfacey = 50; //y location of surface of the earth
let DepthMax = 20.0; //Maximum xsection depth (m)
let WidthMax = 500.0; //Width of plot area in meters
let MinThickness = 0.25;
let xscale = xsectx / WidthMax;
let yscale = (xsecty - surfacey) / DepthMax;
let xpts= new [4]; //Array for polygon points
let ypts= new [4]; //Array for polygon points

//Now define the absolute coordinates of each of the four corners of
//the plotting area. Coordinates start at the earths surface
let ulcorx = ((framex - xsectx) / 2.0);
let ulcory = (25 + surfacey);
let urcory = ulcory;
let urcorx = ulcorx + xsectx;
let llcorx = ulcorx;
let llcory = ulcory + xsecty - surfacey;
let lrcorx = urcorx;
let lrcory = llcory;

let s_value;	//variable used to collect scrollbar info
let s_size;   //variable to hold scroller size

//Define values for manipulating frame images and scrollbars
let LastY1, LastX1; //Layer 1 parameters
let LastY2, LastX2; //Layer 2 parameters
let LastYs, LastXs; //Source parameters
let LastYr, LastXr; //Receiver paramters

// Range Sliders
let VelocityTop_slider = document.getElementById("VelocityTop");
let VelocityMiddle_slider = document.getElementById("VelocityMiddle");
let VelocityBottom_slider = document.getElementById("VelocityBottom");
let SourceStack_slider = document.getElementById("SourceStack"); // # of Geophones
let dx_slider = document.getElementById("Spacing");
let NumOfGeophones_slider = document.getElementById("NumOfGeophones");
let LengthProfile_slider = document.getElementById("LengthProfile");

//radio buttons
let hammer_radio = document.getElementById("hammer");
let shotgun_radio = document.getElementById("shotgun");
let dynamite_radio = document.getElementById("dynamite");




function displaySliderValues(v1_v = VelocityTop_slider.value, v2_v = VelocityMiddle_slider.value,
                             v3_v = VelocityBottom_slider.value, n_v = SourceStack_slider.value,
                             ndata_v = NumOfGeophones_slider.value, dx_v = dx_slider.value)
{
    document.getElementById("depth_val").innerHTML = ((-depth2top).toFixed(1)+" m");
    document.getElementById("width_val").innerHTML = (width.toFixed(1)+" m");
    r_ctx.fillText((-depth2top).toFixed(1)+" m", 42, 12);
    r_ctx.fillText(width.toFixed(1)+" m", 42, 24);
    document.getElementById("contrast_val").innerHTML = (v1Format(v1_v));
    document.getElementById("station_spacing_val").innerHTML = (v2Format(v2_v)+" m");
    document.getElementById("num_of_obs_value").innerHTML = ndata_v.toString();
    document.getElementById("std_val").innerHTML = ((v3Format(v3_v)*100).toFixed(1)+" NT");
    document.getElementById("dike_trend_value").innerHTML = (dxFormat(dx_v)+ " degrees");
    document.getElementById("incline_value").innerHTML = (nFormat(n_v)+ " degrees");
}


// Trigger events for the range sliders, each time the user moves the slider
// (e.g. Station Spacing) the corresponding function below will fire.

VelocityTop_slider.oninput = function()
{
    textOutputChange(this.value);
    v1 = v1Format(this.value, true);
    frameChanged();
};

function v1_LeftButton()
{
    VelocityTop_slider.value--;
    v1 = dxFormat(VelocityTop_slider.value, true);
    textOutputChange(VelocityTop_slider.value);
    frameChanged();
}

function v1_RightButton()
{
    VelocityTop_slider.value++;
    v1 = dxFormat(VelocityTop_slider.value, true);
    textOutputChange(VelocityTop_slider.value);
    frameChanged();
}

VelocityMiddle_slider.oninput = function ()
{
    textOutputChange(VelocityTop_slider.value, this.value);
    v2 = v2Format(this.value, true);
    frameChanged();
};

function v2_LeftButton()
{

    VelocityMiddle_slider.value--;
    v2 = v2Format(VelocityMiddle_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value);
    frameChanged();
}
function v2_RightButton()
{
    VelocityMiddle_slider.value++;
    v2 = v2Format(VelocityMiddle_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value);
    frameChanged();
}


VelocityBottom_slider.oninput = function ()
{
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, this.value);
    v3 = v3Format(this.value,true);
    frameChanged();
};
function v3_LeftButton()
{
    VelocityBottom_slider.value--;
    v3 = VelocityBottom_slider.value;
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value);
    frameChanged();
}
function v3_RightButton()
{
    VelocityBottom_slider.value++;
    v3 = VelocityBottom_slider.value;
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value);
    frameChanged();
}

dx_slider.oninput = function()
{
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value,
        this.value);
    dx = dxFormat(this.value, true);
    frameChanged();
    // alert("hello")
};

function dx_LeftButton()
{
    dx_slider.value--;
    dx = dxFormat(dx_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value);
    frameChanged();
}

function dx_RightButton()
{
    dx_slider.value++;
    dx = dxFormat(dx_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value);
    frameChanged();
}

NumOfGeophones_slider.oninput = function ()
{
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value,
        this.value);
    nx = nFormat(this.value, true);
    frameChanged();
};
function N_LeftButton()
{
    NumOfGeophones_slider.value--;
    nx = nFormat(NumOfGeophones_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value, NumOfGeophones_slider.value);
    frameChanged();
}
function N_RightButton()
{
    NumOfGeophones_slider.value++;
    nx = nFormat(NumOfGeophones_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value, NumOfGeophones_slider.value);
    frameChanged();
}

SourceStack_slider.oninput = function () {
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value, NumOfGeophones_slider.value,
        this.value);
    ndata = nDataFormat(this.value, true);
    frameChanged();
};

function ndata_LeftButton()
{
    SourceStack_slider.value--;
    ndata = nDataFormat(SourceStack_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value, NumOfGeophones_slider.value, SourceStack_slider.value);
    frameChanged();
}

function ndata_RightButton()
{
    SourceStack_slider.value++;
    ndata = nDataFormat(SourceStack_slider.value, true);
    textOutputChange(VelocityTop_slider.value, VelocityMiddle_slider.value, VelocityBottom_slider.value, dx_slider.value, NumOfGeophones_slider.value, SourceStack_slider.value);
    frameChanged();
}


// If the Boolean value "number_val" is set to true, then the following format
// functions will return float values instead of a string.
function v1Format(val, number_val=false) //done
{
    if(number_val)
        return ((val-1)*dV1+V1Min);
    return ((val-1)*dV1+V1Min).toFixed(2);
}

function v2Format(val, number_val=false) //done
{
    if(number_val)
        return ((val-1)*dV2+V2Min);
    return ((val-1)*dV2+V2Min).toFixed(4);
}

function v3Format(val, number_val=false) //done
{
    if(number_val)
        return (((val-1)*dV3+V3Min));
    return (((val-1)*dV3+V3Min)).toFixed(3);
}

function dxFormat(val, number_val=false) //done
{
    if(number_val)
        return ((val-1)*dDx+DxMin);
    return ((val-1)*dDx+DxMin).toFixed(2);
}

function nFormat(val, number_val=false) //done
{
    if(number_val)
        return ((val-1)*dN+NMin);
    return ((val-1)*dN+NMin).toFixed(1);
}

function nDataFormat(val, number_val=false) //done
{
    if(number_val)
        return((val-1)*dNData+NDataMin);
    return((val-1)*dNData+NDataMin).toFixed(2);
}

// This function clears the space where the unit text is, and redraws it.
function textOutputChange(v1_v = VelocityTop_slider.value, v2_v = VelocityMiddle_slider.value,
                          v3_v = VelocityBottom_slider.value, n_v = dx_slider.value,
                          ndata_v = NumOfGeophones_slider.value, dx_v = SourceStack_slider.value)
{
    // alert("textOutputChange")
    ctx.clearRect(X_OFFSET, label_list_y_loc-10, 130, 70);
    ctx.fillStyle = "#00DD00";
    ctx.rect( X_OFFSET, label_list_y_loc-10, 130, 70);
    ctx.fill();
    labels();
    displaySliderValues(v1_v, v2_v, v3_v, n_v, ndata_v, dx_v, len_v);
}

//Set slide-bars
function setSlideBars() {
    // alert("setSlideBars")
    let s_value;

    //Set Station Spacing
    s_value = Math.trunc((v1 - V1Min) * (V1BarMax - V1BarMin) /
        (V1Max - V1Min) + V1BarMin + 0.5);
    VelocityTop_slider.value = s_value;
    VelocityTop_slider.min = V1BarMin;
    VelocityTop_slider.max = V1BarMax;
    // alert(s_value);
    // //Set Susceptability
    s_value = Math.trunc((v2 - V2Min) * (V2BarMax - V2BarMin) /
        (V2Max - V2Min) + V2BarMin + 0.5);
    VelocityMiddle_slider.value = s_value;
    VelocityMiddle_slider.min = V2BarMin;
    VelocityMiddle_slider.max = V2BarMax;
    // alert(s_value);
    //Set Number of Observations, N:
    s_value = Math.trunc((v3-V3Min) * (V3BarMax - V3BarMin) /
        (V3Max - V3Min) + V3BarMin + 0.5);
    VelocityBottom_slider.value = s_value;
    VelocityBottom_slider.min = V3BarMin;
    VelocityBottom_slider.max = V3BarMax;
    // alert(s_value);
    // // Set Standard Deviation
    s_value = Math.trunc((dx-DxMin) * (DxBarMax - DxBarMin) /
        (DxMax - DxMin) + DxBarMin + 0.5);
    dx_slider.value = s_value;
    dx_slider.min = DxBarMin;
    dx_slider.max = DxBarMax;
    // alert(s_value);
    // // Set Dike Trend
    s_value = Math.trunc((nx-NMin) * (NBarMax - NBarMin) /
        (NMax - NMin) + NBarMin + 0.5);
    NumOfGeophones_slider.value = s_value;
    NumOfGeophones_slider.min = NBarMin;
    NumOfGeophones_slider.max = NBarMax;

    //Set Inclination
    s_value = Math.trunc((ndata-NDataMin) * (NDataBarMax - NDataBarMin) /
        (NDataMax - NDataMin) + NDataBarMin + 0.5);
    SourceStack_slider.value = s_value;
    SourceStack_slider.min = NDataBarMin;
    SourceStack_slider.max = NDataBarMax;

}

function setValues(v1, v2, v3, dx, N, ndata)
{

    dx = dx;
    v2 = rho;
    stdf = std;
    v3 = nobs;
    dktf = dkt;
    incf = inc;
    lengthf = len;

    // reset range sliders
    //Set Station Spacing
    s_value = Math.trunc((v1 - V1Min) * (V1BarMax - V1BarMin) /
        (V1Max - V1Min) + V1BarMin + 0.5);
    VelocityTop_slider.value = s_value;


    // //Set Density Contrast
    s_value =  Math.trunc((v2 - V2Min) * (V2BarMax - V2BarMin) /
        (V2Max - V2Min) + V2BarMin + 0.5);
    VelocityMiddle_slider.value = s_value;

    //Set Number of Observations, N:
    s_value = Math.trunc((v3-V3Min) * (V3Max - V3Min) /
        (V3Max - V3Min) + V3Min + 0.5);
    VelocityBottom_slider.value = s_value;
    //
    // Set Standard Deviation
    s_value = Math.trunc((dx - DxMin) * (DxBarMax - DxBarMin) /
        (DxMax - DxMin) + DxBarMin + 0.5);
    dx_slider.value = s_value;

    // Set Dike Trend
    s_value = Math.trunc((nx-NMin) * (NBarMax - NBarMin) /
        (NMax - NMin) + NBarMin + 0.5);
    NumOfGeophones_slider.value = s_value;

    //Set Incline of Main Field
    s_value = Math.trunc((ndata-NDataMin) * (NDataBarMax - NDataBarMin) /
        (NDataMax - NDataMin) + NDataBarMin + 0.5);
    SourceStack_slider.value = s_value;

}

function frameChanged()
{
    dx = dx;
    k = v2;
    dkt = dktf;
    ndata = v3;
    inc = incf;
    std = stdf;
    let len = lengthf;
    xmin = -1.0 * len / 2.0;
    xmax = xmin + len;
    xscale = gwidth / (xmax - xmin);

    ctx.clearRect(0,0, canvas.width, canvas.height);
    r_ctx.clearRect(0,0, width_canvas.width, width_canvas.height);
    r_ctx.backgroundColor = "#e9e9e9";
    paint();
    displaySliderValues();
}


// function getVals(){
//     // Get slider values
//     var parent = this.parentNode;
//     var slides = parent.getElementsByTagName("input");
//     var slide1 = parseFloat( slides[0].value );
//     var slide2 = parseFloat( slides[1].value );
//     // Neither slider will clip the other, so make sure we determine which is larger
//     if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }
//
//     var displayElement = parent.getElementsByClassName("rangeValues")[0];
//     displayElement.innerHTML = slide1 + " - " + slide2;
// }
//
// window.onload = function(){
//     // Initialize Sliders
//     var sliderSections = document.getElementsByClassName("range-slider");
//     for( var x = 0; x < sliderSections.length; x++ ){
//         var sliders = sliderSections[x].getElementsByTagName("input");
//         for( var y = 0; y < sliders.length; y++ ){
//             if( sliders[y].type ==="range" ){
//                 sliders[y].oninput = getVals;
//                 // Manually trigger event first time to display values
//                 sliders[y].oninput();
//             }
//         }
//     }
// }