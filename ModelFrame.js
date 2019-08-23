//Define the applet that created the frame
let Originator;

//Define Objects for scrollbar control
let V1Bar, V2Bar, V3Bar, DxBar, NBar, NDataBar;

//Define Objects for Radio buttons//PROBABLY DONT NEED
let sourcetype = new CheckboxGroup();
let  hammer = new Checkbox("Hammer");
let  shotgun = new Checkbox("Shotgun");
let  dynamite = new Checkbox("Dynamite");
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
let V1BarMax = (int)((V1Max - V1Min) / dV1 + 2.1); //Maximum Scroll Bar Value
let V2Min = 300.0; //meters
let V2Max = 2500.0;
let dV2 = 50.0; //Increment in Spacing allowed
let V2BarMin = 1; //Minimum Scroll Bar Value
let V2BarMax = (int)((V2Max - V2Min) / dV2 + 2.1); //Maximum Scroll Bar Value
let V3Min = 300.0; //meters
let V3Max = 2500.0;
let dV3 = 50.0; //Increment in Spacing allowed
let V3BarMin = 1; //Minimum Scroll Bar Value
let V3BarMax = (int)((V3Max - V3Min) / dV3 + 2.1); //Maximum Scroll Bar Value
let NMin = 12; //number of geophones in spread
let NMax = 144;
let dN = 12; //Increment in Spacing allowed
let NBarMin = 1; //Minimum Scroll Bar Value
let NBarMax = (int)((NMax - NMin) / dN + 2.1); //Maximum Scroll Bar Value
let DxMin = 0.5; //Station Spacing in meters
let DxMax = 20.0;
let dDx = 0.5; //Increment in Spacing allowed
let DxBarMin = 1; //Minimum Scroll Bar Value
let DxBarMax = (int)((DxMax - DxMin) / dDx + 2.1); //Maximum Scroll Bar Value
let NDataMin = 1; //Minimum number of sources to stack
let NDataMax = 20;
let dNData = 1;
let NDataBarMin = 1; //Minimum Scroll Bar Value
let NDataBarMax = (int)((NDataMax - NDataMin) / dNData + 2.1);


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
let xpts= new int[4]; //Array for polygon points
let ypts= new int[4]; //Array for polygon points

//Now define the absolute coordinates of each of the four corners of
//the plotting area. Coordinates start at the earths surface
let ulcorx = (int)((framex - xsectx) / 2.0);
let ulcory = (int)(25 + surfacey);
let urcory = ulcory;
let urcorx = ulcorx + xsectx;
let llcorx = ulcorx;
let llcory = ulcory + xsecty - surfacey;
let lrcorx = urcorx;
let lrcory = llcory;


//Define values for manipulating frame images and scrollbars
let LastY1, LastX1; //Layer 1 parameters
let LastY2, LastX2; //Layer 2 parameters
let LastYs, LastXs; //Source parameters
let LastYr, LastXr; //Receiver paramters



// Range Sliders
let dxf_slider = document.getElementById("station_spacing");
let rho_slider = document.getElementById("Susceptability");
let n_of_obs_slider = document.getElementById("nOfObservations");
let std_dev_slider = document.getElementById("stdDev");
let dike_trend_slider = document.getElementById("dike_trend");
let inclination_slider = document.getElementById("incline_trend");
let LengthBar_slider = document.getElementById("profile_length");

//radio buttons
let hammer_radio = document.getElementById("hammer");
let shotgun_radio = document.getElementById("shotgun");
let dynamite_radio = document.getElementById("dynamite");







// Trigger events for the range sliders, each time the user moves the slider
// (e.g. Station Spacing) the corresponding function below will fire.

dxf_slider.oninput = function()
{
    textOutputChange(this.value);
    dxf = dxfFormat(this.value, true);
    frameChanged();
    // alert("hello")
};

function dxf_LeftButton()
{
    dxf_slider.value--;
    dxf = dxfFormat(dxf_slider.value, true);
    textOutputChange(dxf_slider.value);
    frameChanged();
}

function dxf_RightButton()
{
    dxf_slider.value++;
    dxf = dxfFormat(dxf_slider.value, true);
    textOutputChange(dxf_slider.value);
    frameChanged();
}

rho_slider.oninput = function ()
{

    textOutputChange(dxf_slider.value, this.value);
    rhof = rhoFormat(this.value, true);
    frameChanged();
};
function rho_LeftButton()
{

    rho_slider.value--;
    rhof = rhoFormat(rho_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value);
    frameChanged();
}
function rho_RightButton()
{
    rho_slider.value++;
    rhof = rhoFormat(rho_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value);
    frameChanged();
}


n_of_obs_slider.oninput = function ()
{
    textOutputChange(dxf_slider.value, rho_slider.value, this.value);
    ndataf = this.value;
    frameChanged();
};
function n_of_obs_LeftButton()
{
    n_of_obs_slider.value--;
    ndataf = n_of_obs_slider.value;
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value);
    frameChanged();
}
function n_of_obs_RightButton()
{
    n_of_obs_slider.value++;
    ndataf = n_of_obs_slider.value;
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value);
    frameChanged();
}

std_dev_slider.oninput = function ()
{

    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value,
        this.value);
    stdf = stdFormat(this.value, true);
    frameChanged();
};
function std_LeftButton()
{
    std_dev_slider.value--;
    stdf = stdFormat(std_dev_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value);
    frameChanged();
}
function std_RightButton()
{
    std_dev_slider.value++;
    stdf = stdFormat(std_dev_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value);
    frameChanged();
}

dike_trend_slider.oninput = function ()
{
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value,
        this.value);
    dktf = dktFormat(this.value, true);
    frameChanged();
};
function dkt_LeftButton()
{
    dike_trend_slider.value--;
    dktf = dktFormat(dike_trend_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value);
    frameChanged();
}
function dkt_RightButton()
{
    dike_trend_slider.value++;
    dktf = dktFormat(dike_trend_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value);
    frameChanged();
}

inclination_slider.oninput = function () {
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value,
        this.value)
    incf = incFormat(this.value, true);
    frameChanged();
};

function inc_LeftButton()
{
    inclination_slider.value--;
    incf = incFormat(inclination_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value);
    frameChanged();
}

function inc_RightButton()
{
    inclination_slider.value++;
    incf = incFormat(inclination_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value);
    frameChanged();
}

LengthBar_slider.oninput = function () {
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value,inclination_slider.value,
        this.value)
    lengthf = lenFormat(this.value, true);
    frameChanged();
};

function len_LeftButton()
{
    LengthBar_slider.value--;
    lengthf = lenFormat(LengthBar_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value, LengthBar_slider.value);
    frameChanged();
}

function len_RightButton()
{
    LengthBar_slider.value++;
    lengthf = lenFormat(LengthBar_slider.value, true);
    textOutputChange(dxf_slider.value, rho_slider.value, n_of_obs_slider.value, std_dev_slider.value, dike_trend_slider.value, inclination_slider.value, LengthBar_slider.value);
    frameChanged();
}

// If the Boolean value "number_val" is set to true, then the following format
// functions will return float values instead of a string.
function dxfFormat(val, number_val=false)
{
    if(number_val)
        return ((val-1)*dDx+DxMin);
    return ((val-1)*dDx+DxMin).toFixed(2);
}

function rhoFormat(val, number_val=false)
{
    if(number_val)
        return ((val-1)*dRho+RhoMin);
    return ((val-1)*dRho+RhoMin).toFixed(4);
}

function stdFormat(val, number_val=false)
{
    if(number_val)
        return (((val-1)*dStd+StdMin));
    return (((val-1)*dStd+StdMin)).toFixed(3);
}

function dktFormat(val, number_val=false)
{
    if(number_val)
        return ((val-1)*dDkt+DktMin);
    return ((val-1)*dDkt+DktMin).toFixed(1);
}

function incFormat(val, number_val=false)
{
    if(number_val)
        return((val-1)*dInc+IncMin);
    return((val-1)*dInc+IncMin).toFixed(2);
}
function lenFormat(val, number_val=false)
{
    if(number_val)
        return((val-1)*dLength+LengthMin);
    return((val-1)*dLength+LengthMin).toFixed(2);
}

// This function clears the space where the unit text is, and redraws it.
function textOutputChange(dxf_v = dxf_slider.value, rho_v = rho_slider.value,
                          n_of_obs_v = n_of_obs_slider.value, std_v = std_dev_slider.value,
                          dkt_v = dike_trend_slider.value, inc_v = inclination_slider.value,
                          len_v = LengthBar_slider.value)
{
    // alert("textOutputChange")
    ctx.clearRect(X_OFFSET, label_list_y_loc-10, 130, 70);
    ctx.fillStyle = "#00DD00";
    ctx.rect( X_OFFSET, label_list_y_loc-10, 130, 70);
    ctx.fill();
    labels();
    displaySliderValues(dxf_v, rho_v, n_of_obs_v, std_v, dkt_v, inc_v, len_v);
}

//Set slide-bars
function setSlideBars() {
    // alert("setSlideBars")
    let s_value;

    //Set Station Spacing
    s_value = Math.trunc((dxf - DxMin) * (DxBarMax - DxBarMin) /
        (DxMax - DxMin) + DxBarMin + 0.5);
    dxf_slider.value = s_value;
    dxf_slider.min = DxBarMin;
    dxf_slider.max = DxBarMax;
    // alert(s_value);
    // //Set Susceptability
    s_value = Math.trunc((rhof - RhoMin) * (RhoBarMax - RhoBarMin) /
        (RhoMax - RhoMin) + RhoBarMin + 0.5);
    rho_slider.value = s_value;
    rho_slider.min = RhoBarMin;
    rho_slider.max = RhoBarMax;
    // alert(s_value);
    //Set Number of Observations, N:
    s_value = Math.trunc((ndataf-NMin) * (NBarMax - NBarMin) /
        (NMax - NMin) + NBarMin + 0.5);
    n_of_obs_slider.value = s_value;
    n_of_obs_slider.min = NBarMin;
    n_of_obs_slider.max = NBarMax;
    // alert(s_value);
    // // Set Standard Deviation
    s_value = Math.trunc((stdf-StdMin) * (StdBarMax - StdBarMin) /
        (StdMax - StdMin) + StdBarMin + 0.5);
    std_dev_slider.value = s_value;
    std_dev_slider.min = StdBarMin;
    std_dev_slider.max = StdBarMax;
    // alert(s_value);
    // // Set Dike Trend
    s_value = Math.trunc((dktf-DktMin) * (DktBarMax - DktBarMin) /
        (DktMax - DktMin) + DktBarMin + 0.5);
    dike_trend_slider.value = s_value;
    dike_trend_slider.min = DktBarMin;
    dike_trend_slider.max = DktBarMax;

    //Set Inclination
    s_value = Math.trunc((incf-IncMin) * (IncBarMax - IncBarMin) /
        (IncMax - IncMin) + IncBarMin + 0.5);
    inclination_slider.value = s_value;
    inclination_slider.min = IncBarMin;
    inclination_slider.max = IncBarMax;


    s_value = Math.trunc((lengthf-LengthMin) * (LengthBarMax - LengthBarMin) /
        (LengthMax - LengthMin) + LengthBarMin + 0.5);
    LengthBar_slider.value = s_value;
    LengthBar_slider.min = LengthBarMin;
    LengthBar_slider.max = LengthBarMax;
}

function setValues(dx, rho, std, nobs,  dkt, inc, len)
{

    dxf = dx;
    rhof = rho;
    stdf = std;
    ndataf = nobs;
    dktf = dkt;
    incf = inc;
    lengthf = len;

    // reset range sliders
    //Set Station Spacing
    s_value = Math.trunc((dxf - DxMin) * (DxBarMax - DxBarMin) /
        (DxMax - DxMin) + DxBarMin + 0.5);
    dxf_slider.value = s_value;


    // //Set Density Contrast
    s_value =  Math.trunc((rhof - RhoMin) * (RhoBarMax - RhoBarMin) /
        (RhoMax - RhoMin) + RhoBarMin + 0.5);
    rho_slider.value = s_value;

    //Set Number of Observations, N:
    s_value = Math.trunc((ndataf-NMin) * (NBarMax - NBarMin) /
        (NMax - NMin) + NBarMin + 0.5);
    n_of_obs_slider.value = s_value;
    //
    // Set Standard Deviation
    s_value = Math.trunc((stdf-StdMin) * (StdBarMax - StdBarMin) /
        (StdMax - StdMin) + StdBarMin + 0.5);
    std_dev_slider.value = s_value;

    // Set Dike Trend
    s_value = Math.trunc((dktf-DktMin) * (DktBarMax - DktBarMin) /
        (DktMax - DktMin) + DktBarMin + 0.5);
    dike_trend_slider.value = s_value;

    //Set Incline of Main Field
    s_value = Math.trunc((incf-IncMin) * (IncBarMax - IncBarMin) /
        (IncMax - IncMin) + IncBarMin + 0.5);
    inclination_slider.value = s_value;

    //Set Length
    s_value = Math.trunc((lengthf - LengthMin) * (LengthBarMax - LengthBarMin) /
        (LengthMax - LengthMin) + LengthBarMin + 0.5);
    LengthBar_slider.value = s_value;

}

function frameChanged()
{
    dx = dxf;
    k = rhof;
    dkt = dktf;
    ndata = ndataf;
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
