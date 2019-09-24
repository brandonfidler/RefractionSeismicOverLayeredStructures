//Establish variables for generating applet graphics
//Define width and height of Applet Draw Area
const C_WIDTH = 500;
const C_HEIGHT = 500;
const X_OFFSET = 100;

let gap = 20; //horizontal spacing between data points in pixels
 let apwidth = 24 * 21 + 150;
 let apheight = 500;

//Define width and height of plotting area
 let gwidth = apwidth - 150;
 let gheight = apheight - 150;

//Now define the absolute coordinates of each of the four corners of
//the plotting area
 let ulcorx =  (apwidth - gwidth) / 2.0;
 let ulcory =  (apheight - gheight) / 2.0;
 let urcory = ulcory;
 let urcorx = ulcorx + gwidth;
 let llcorx = ulcorx;
 let llcory = ulcory + gheight;
 let lrcorx = urcorx;
 let lrcory = llcory;

//Define static variables for model and survey parameters

 let snx = 24; //saved number of receivers in spread - this is used
//to see if user has changed number of recievers
//if so - then the plot size must be changed
 let source; //type of source

//Define values used for generating plots
 let  xmin, xmax; //minimum and maximum receiver spacing
 let  tmin, tmax; //minimum and maximum times
 let  xscale, tscale; //plot scales
 let layer; //Variable set by GetTMin used to identify
//the type of arrival returned by GetTMin

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



//For each trace construct a time series and plot the
//trace in the appropriate place. First define an array
//to hold each time series. The length of this array
//will be the same as the height of the seismogram
//plotting array in pixels. So, given this compute the
//time interval between each point.
let  y = [gheight]; //Stick seismogram
let  s = [gheight]; //Source pulse
let  f = [2 * gheight - 1]; //output seismogram of which only seisheight will be displayed

//Define off screen images and graphics used to draw into.
//Three images are defined - one for times, one for wiggle plots
//and one for variable area plots
// Image offScreenTImage, offScreenWImage, offScreenVImage;
// Graphics ostg, oswg, osvg;
let plottraces = false; //display seismograms on plot
let plotva = false; //display variable area or wiggle seismograms
let chanimagsize = false; //Image size has changed variable if this is true
//update method clears plot area

//Define Image used for offscreen drawing of the entire draw area to avoid flicker
let Image, offScreenImage;

//Static variables used by the Gaussian Random number generator
let  iset = 0;
let  gset;

//Variable to keep track of number of prints generated
 let pnum = 0;

//Establish for model and design Frame
let ModelFrame, MyModelFrame;

const canvas = document.querySelector('.gtCanvas');
const width_canvas = document.querySelector('.gtRadSample');
const ctx = canvas.getContext('2d');
const r_ctx = width_canvas.getContext('2d');

plottraces = document.getElementById('PSeisms');


function paint() {

    // Plot Cross section
    plotXSection();
    // Plot Gravity Data
    plotData();
    // Draw Axes
    drawAxes();
}

function drawAxes()
{
    let run = false;
    let xint;
    ctx.font = "12px Arial";

    ctx.beginPath();
    ctx.strokeStyle = "#000000";

    //do x axis first
    drawLine(ulcorx, ulcory, urcorx, urcory);
    for (xint = xmin; xint <= xmax; xint += (xmax - xmin) / 5.0)
    {
        drawLine( XLoc(xint), ulcory, XLoc(xint), ulcory - 5);
        ctx.fillText((xint), XLoc(xint) - 7, ulcory - 8);
    }
    ctx.fillText("Distance (m)", apwidth / 2 - 30 , 25);


    drawLine(10 + urcorx, urcory, 10 + lrcorx, lrcory);
    for (xint = ymin; xint <= ymax; xint += Math.abs(ymax - ymin) / 5.0)
    {
        drawLine(10 + urcorx, YLoc(xint), 5 + urcorx, YLoc(xint));
        ctx.fillText(xint.toFixed(1), 18 + urcorx, YLoc(xint)+5);
    }
    ctx.fillText("Field Strength (nT)", lrcorx - 40, lrcory + 20);

    drawLine(20 + urcorx, pheight, 20 + urcorx, apheight);
    for (xint = 0; xint < dmax; xint +=dmax / 5.0)
    {
        run = true;
        drawLine(20+urcorx, Math.trunc(pheight+xint*dscale),
            15 +urcorx, Math.trunc(pheight + xint * dscale));//dscale is in setScale()
        ctx.fillText(xint.toFixed(1), 28+urcorx, Math.trunc(pheight+xint*dscale) +5);
    }

    ctx.fillText("Depth (m)", urcorx - 45, apheight - 10);
    ctx.closePath();
    ctx.stroke()
}

function drawLine(x1, y1, x2, y2)
{
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}



function setScales()
{

    let x, temp;
    ymax = -1000.0;
    ymin = 1000.0;

    for (x = xmin; x <=xmax; x += dx)
    {
        temp = getFieldStrength(x);
        if (temp < ymin) {
            ymin = temp * 1.1;
        }
        if (temp > ymax) {
            ymax = temp * 1.1;
        }
    }

    xscale = gwidth / (xmax-xmin);
    yscale = gheight / (ymax - ymin);
    dscale = (apheight - pheight) / dmax;
}
//Compute plot bounds. Minimum time is always set to zero. Maximum time is the time of the
//latest arrival + 10% or 100.0 ms, which ever is greater.
function GetScales() {

    xmin = recx;
    xmax = recx + (nx - 1) * dx;
    //xscale = gwidth/(xmax-xmin);
    xscale = (gwidth - gap) / (xmax - xmin);

    tmin = 0.0;
    tmax = -100000.0;
    //Loop through receiver locations and get times
    let x, time;
    for (x = xmin; x <= xmax; x += dx) {
        let time = GetTMin(x);
        if (time > tmax)
            tmax = time;
    }
    tmax *= 1.1;
    if (tmax < 100.0)
        tmax = 100.0;

    tscale = gheight / (tmax - tmin);
}


//Compute minimum travel-time for a given receiver location
function GetTMin(x) {
    //Variables to hold times
    let direct, ref1, ref2;

    //Compute layer dips
    let rb1 = -1.0 * Math.atan(m1);
    let rb2 = -1.0 * Math.atan(m2);

    //Compute some constants we'll need
    let offset = Math.abs(sourcex - x);
    let h1 = m1 * sourcex + b1; //layer depth under source
    let l1depth = m1 * x + b1; //layer depth under receiver
    let h2 = m2 * sourcex + b2;
    let l2depth = m2 * x + b2;

    //first compute direct arrival
    direct = offset / v1 * 1000.0; //time in msec

    //Now compute refraction off of bottom of first layer
    if (v2 > v1)//we can get a refraction off of this layer
    {
        let ic = Math.asin(v1 / v2);
        ref1 = (offset * Math.cos(rb1) / v2 + h1 * Math.cos(ic) / v1 +
            l1depth * Math.cos(ic) / v1) * 1000.0;
    } else //No refraction off of this layer set time to -999.0
    {
        ref1 = -999.0;
    }

    //Now compute refraction off of bottom of second layer
    if (v3 > v2)//we can get a refraction off of this layer
    {
        let ic = Math.asin(v2 / v3);
        let alpha = ic - (rb2 - rb1);
        let beta = ic - (rb1 - rb2);
        let i1s = Math.asin(v1 / v2 * Math.sin(alpha));
        let i1r = Math.asin(v1 / v2 * Math.sin(beta));
        let rv = offset * Math.cos(rb1) * Math.cos(rb2 - rb1);
        ref2 = (rv / v3 + h1 * Math.cos(i1s) / v1 +
            h2 * Math.cos(ic) / v2 +
            l1depth * Math.cos(i1r) / v1 +
            l2depth * Math.cos(ic) / v2) * 1000.0;
    } else //No refraction off of this layer - set time to -999.0
    {
        ref2 = -999.0;
    }

    //Return minimum time that isn't negative
    let time = direct;
    layer = 1;
    if (ref1 < time && ref1 > 0.0) {
        time = ref1;
        layer = 2;
    }
    if (ref2 < time && ref2 > 0.0) {
        time = ref2;
        layer = 3;
    }

    return time;
}

//return pixel value give log of a distance
function XLoc(x) {
    return Math.trunc((( (x - xmin) * xscale + llcorx + gap / 2)));
}

//return pixel value give of travel time
function YLoc(y) {
    return Math.trunc((((tmax - y) * tscale + ulcory)));
}



//Generate a random numbers that are from a normal Gaussian
//distribution. The supplied Gaussian generator didn't seem
//to work on my platform
function myGaussian() {
    let fac, r, v1, v2;

    if (iset === 0) {
        do {
            v1 = 2.0 * Math.random() - 1.0;
            v2 = 2.0 * Math.random() - 1.0;
            r = v1 * v1 + v2 * v2;
        } while (r >= 1.0)
            ;
        fac = Math.sqrt(-2.0 * Math.log(r) / r);
        gset = v1 * fac;
        iset = 1;
        return v2 * fac;
    } else {
        iset = 0;
        return gset;
    }
}

//This method is invoked when parameters from the frame have
//been changed. This simply queries the frame object for the
//latest parameters, recompute seismic values, and repaints
//the applet
function frameChanged() {
    //Get Parameters
    GetParameters();

    //Re-establish plot scales
    GetScales();

    //Build images of output desired. If user requests an
    //image with seismograms, build both types so that we
    //can switch back and forth quickly
    if (plottraces === false)
        MakePlots(ostg, 't');
    else {
        MakePlots(oswg, 'w');
        MakePlots(osvg, 'v');
    }

    //Repaint applet (This will automatically recompute fields)
    repaint();
}

//This method generates the appropriate plot. It can generate
//a plot of arrival times only (type -> 't'), arrival times plus
//wiggle traces(type -> 'w') or arrival times plus variable area
//traces (type -> 'v')

function MakePlots(g, type) {
    //Get Font information so that we can center text when needed
    let font = oswg.getFont();
    let fontm = getFontMetrics(font);
    let fheight = fontm.getHeight();
    let fwidth;

    //Generate plot - First put in some background colors
    setColor(Color.white);
    fillRect(0, 0, apwidth, apheight);

    //Put in background color
    setColor(Sky);
    fillRect(ulcorx, ulcory, gwidth, gheight);
    setColor(Color.black);
    drawRect(ulcorx, ulcory, gwidth, gheight);

    //Now put on plot headings
    fwidth = fontm.stringWidth("Travel Time versus"+ "Receiver Location");
    drawString("Travel Time versus"+ " Receiver Location",
        (ulcorx + urcorx) / 2 - fwidth / 2, ulcory - 35);

    fwidth = fontm.stringWidth("Direct Arrival");
    setColor(Color.red);
    fillRect((ulcorx + urcorx) / 2 - fwidth - 50, ulcory - 25, 10, 2);
    drawString("Direct Arrival",
        (ulcorx + urcorx) / 2 - fwidth - 40, ulcory - 17);

    fwidth = fontm.stringWidth("Head Wave: First Layer");
    setColor(Color.magenta);
    fillRect((ulcorx + urcorx) / 2 - fwidth / 2 - 10, ulcory - 12,
        10, 2);
    drawString("Head Wave: First Layer",
        (ulcorx + urcorx) / 2 - fwidth / 2, ulcory - 4);

    setColor(Color.blue);
    fillRect((ulcorx + urcorx) / 2 + 40, ulcory - 25, 10, 2);
    drawString("Head Wave: Second Layer",
        (ulcorx + urcorx) / 2 + 50, ulcory - 17);

    //Put tick marks around plotting area
    //First the distance tick marks
    //Determin tick mark and label spacing
    let inc;
    inc = 1.0;
    if (xmax - xmin > 1000.0)
        inc = 100.0;
    else if (xmax - xmin > 100.0)
        inc = 50.0;
    else if (xmax - xmin > 50.0)
        inc = 10.0;
    else if (xmax - xmin > 10.0)
        inc = 5.0;

    //Plot information
    let d;
    let xp, yp, dlab;
    setColor(Color.black);
    for (d = Math.ceil(xmin); d <= xmax; d += inc) {
        xp = XLoc(d);
        dlab = d;
        drawLine(xp, llcory, xp, llcory - 5);

        fwidth = fontm.stringWidth(""+dlab);
        drawString(""+dlab, xp - fwidth / 2, llcory + 15);
        drawLine(xp, ulcory, xp, ulcory + 5);
    }
    fwidth = fontm.stringWidth("Receiver Location (m)");
    drawString("Receiver Location (m)",
        (ulcorx + urcorx) / 2 - fwidth / 2, llcory + 30);

    //Determine increment at which time scale should be plotted.
    inc = 1.0;
    let t;
    let tlab;
    if (tmax > 1000.0)
        inc = 100.0;
    else if (tmax > 100.0)
        inc = 50.0;
    else if (tmax > 50.0)
        inc = 10.0;
    else if (tmax > 10.0)
        inc = 5.0;

    //Plot time scale
    for (t = tmin; t <= tmax; t += inc) {
        yp = YLoc(t);
        drawLine(ulcorx, yp, ulcorx + 5, yp);

        tlab = t;
        fwidth = fontm.stringWidth(""+tlab);
        drawString(""+tlab, ulcorx - fwidth - 5, yp + fheight / 3);
        drawLine(urcorx, yp, urcorx - 5, yp);
    }
    fwidth = fontm.stringWidth("Time");
    drawString("Time",ulcorx / 2 - fwidth / 2 - 10,
        (ulcory + llcory) / 2 - fheight / 2 - 2);
    fwidth = fontm.stringWidth("(ms)");
    drawString("(ms)",ulcorx / 2 - fwidth / 2 - 10,
        (ulcory + llcory) / 2 + fheight / 2 + 2);

    //Generate wiggle traces or variable area traces and
    //add them to the plot.
    let x, time, amp;
    if (type === 'w') {
        for (x = xmin; x <= xmax; x += dx) {
            time = GetTMin(x);
            xp = XLoc(x);
            amp = GetAmp(x);
            DrawTrace(xp, time, amp, 'w',g);
        }
    }
    if (type === 'v') {
        for (x = xmin; x <= xmax; x += dx) {
            time = GetTMin(x);
            xp = XLoc(x);
            amp = GetAmp(x);
            DrawTrace(xp, time, amp, 'v',g);
        }
    }

    //Finally, Plot first arrival times
    for (x = xmin; x <= xmax; x += dx) {
        time = GetTMin(x);
        xp = XLoc(x);
        yp = YLoc(time);

        //Set Point color depending on layer from which arrival
        //originated
        setColor(Color.red);
        if (layer === 2)
            setColor(Color.magenta);
        if (layer === 3)
            setColor(Color.blue);

        //Check to make sure data is within plot bounds
        if (time >= tmin && time <= tmax)
            fillRect(xp - 5, yp - 1, 10, 2);
    }

    return;
}


function myGaussian() {
    let fac, r, v1, v2;

    if (iset === 0) {
        do {
            v1 = 2.0 * Math.random() - 1.0;
            v2 = 2.0 * Math.random() - 1.0;
            r = v1 * v1 + v2 * v2;
        } while (r >= 1.0)
            ;
        fac = Math.sqrt(-2.0 * Math.log(r) / r);
        gset = v1 * fac;
        iset = 1;
        return v2 * fac;
    } else {
        iset = 0;
        return gset;
    }
}


//This method is invoked when parameters from the frame have
//been changed. This simply queries the frame object for the
//latest parameters, recompute seismic values, and repaints
//the applet
function frameChanged() {
    //Get Parameters
    GetParameters();

    //Re-establish plot scales
    GetScales();

    //Build images of output desired. If user requests an
    //image with seismograms, build both types so that we
    //can switch back and forth quickly
    if (plottraces === false)
        MakePlots(ostg, 't');
    else {
        MakePlots(oswg, 'w');
        MakePlots(osvg, 'v');
    }

    //Repaint applet (This will automatically recompute fields)
    repaint();

    return;
}


function MakePlots(g, type) {
    //Get Font information so that we can center text when needed
    let font = oswg.getFont();
    let fontm = getFontMetrics(font);
    let fheight = fontm.getHeight();
    let fwidth;

    //Generate plot - First put in some background colors
    setColor(Color.white);
    fillRect(0, 0, apwidth, apheight);

    //Put in background color
    setColor(Sky);
    fillRect(ulcorx, ulcory, gwidth, gheight);
    setColor(Color.black);
    drawRect(ulcorx, ulcory, gwidth, gheight);

    //Now put on plot headings
    fwidth = fontm.stringWidth("Travel Time versus"+ "Receiver Location");
    drawString("Travel Time versus"+ " Receiver Location",
        (ulcorx + urcorx) / 2 - fwidth / 2, ulcory - 35);

    fwidth = fontm.stringWidth("Direct Arrival");
    setColor(Color.red);
    fillRect((ulcorx + urcorx) / 2 - fwidth - 50, ulcory - 25, 10, 2);
    drawString("Direct Arrival",
        (ulcorx + urcorx) / 2 - fwidth - 40, ulcory - 17);

    fwidth = fontm.stringWidth("Head Wave: First Layer");
    setColor(Color.magenta);
    fillRect((ulcorx + urcorx) / 2 - fwidth / 2 - 10, ulcory - 12,
        10, 2);
    drawString("Head Wave: First Layer",
        (ulcorx + urcorx) / 2 - fwidth / 2, ulcory - 4);

    setColor(Color.blue);
    fillRect((ulcorx + urcorx) / 2 + 40, ulcory - 25, 10, 2);
    drawString("Head Wave: Second Layer",
        (ulcorx + urcorx) / 2 + 50, ulcory - 17);

    //Put tick marks around plotting area
    //First the distance tick marks
    //Determin tick mark and label spacing
    let inc;
    inc = 1.0;
    if (xmax - xmin > 1000.0)
        inc = 100.0;
    else if (xmax - xmin > 100.0)
        inc = 50.0;
    else if (xmax - xmin > 50.0)
        inc = 10.0;
    else if (xmax - xmin > 10.0)
        inc = 5.0;

    //Plot information
    let d;
    let xp, yp, dlab;
    setColor(Color.black);
    for (d = Math.ceil(xmin); d <= xmax; d += inc) {
        xp = XLoc(d);
        dlab = d;
        drawLine(xp, llcory, xp, llcory - 5);

        fwidth = fontm.stringWidth(""+dlab);
        drawString(""+dlab, xp - fwidth / 2, llcory + 15);
        drawLine(xp, ulcory, xp, ulcory + 5);
    }
    fwidth = fontm.stringWidth("Receiver Location (m)");
    drawString("Receiver Location (m)",
        (ulcorx + urcorx) / 2 - fwidth / 2, llcory + 30);

    //Determine increment at which time scale should be plotted.
    inc = 1.0;
    let t;
    let tlab;
    if (tmax > 1000.0)
        inc = 100.0;
    else if (tmax > 100.0)
        inc = 50.0;
    else if (tmax > 50.0)
        inc = 10.0;
    else if (tmax > 10.0)
        inc = 5.0;

    //Plot time scale
    for (t = tmin; t <= tmax; t += inc) {
        yp = YLoc(t);
        drawLine(ulcorx, yp, ulcorx + 5, yp);

        tlab = t;
        fwidth = fontm.stringWidth(""+tlab);
        drawString(""+tlab, ulcorx - fwidth - 5, yp + fheight / 3);
        drawLine(urcorx, yp, urcorx - 5, yp);
    }
    fwidth = fontm.stringWidth("Time");
    drawString("Time",ulcorx / 2 - fwidth / 2 - 10,
        (ulcory + llcory) / 2 - fheight / 2 - 2);
    fwidth = fontm.stringWidth("(ms)");
    drawString("(ms)",ulcorx / 2 - fwidth / 2 - 10,
        (ulcory + llcory) / 2 + fheight / 2 + 2);

    //Generate wiggle traces or variable area traces and
    //add them to the plot.
    let x, time, amp;
    if (type === 'w') {
        for (x = xmin; x <= xmax; x += dx) {
            time = GetTMin(x);
            xp = XLoc(x);
            amp = GetAmp(x);
            DrawTrace(xp, time, amp, 'w',g);
        }
    }
    if (type === 'v') {
        for (x = xmin; x <= xmax; x += dx) {
            time = GetTMin(x);
            xp = XLoc(x);
            amp = GetAmp(x);
            DrawTrace(xp, time, amp, 'v',g);
        }
    }

    //Finally, Plot first arrival times
    for (x = xmin; x <= xmax; x += dx) {
        time = GetTMin(x);
        xp = XLoc(x);
        yp = YLoc(time);

        //Set Point color depending on layer from which arrival
        //originated
        setColor(Color.red);
        if (layer === 2)
            setColor(Color.magenta);
        if (layer === 3)
            setColor(Color.blue);

        //Check to make sure data is within plot bounds
        if (time >= tmin && time <= tmax)
            fillRect(xp - 5, yp - 1, 10, 2);
    }

    return;
}

function GetAmp(xloc) {
    let amp, offset;

    offset = Math.abs(sourcex - xloc);
    amp = 1.0 / (Math.sqrt(offset) + 1.0);

    return amp;
}

function DrawTrace(xbase, at, amp, ptype) {
    //Compute time interval between each point.
    let dt = (tmax - tmin) / gheight; //Sample interval - Time between each pixel

    //Get maximum amplitude in data set and compute a preliminary trace
    //scaling factor
    let maxamp = 1.0; //Assume Ensemble max amplitude
    let ppera = (gap / 2) * 0.9 / maxamp; //Ensemble trace scaling
    let scale; //This will be based on Individual trace max amplitude

    //Define some variables
     let j, k, index;

    //Initialize traces
    for (j = 0; j < gheight; j++)
        y[j] = 0;
    for (j = 0; j < 2 * gheight - 1; j++)
        f[j] = 0;

    //Determine array index corresponding to first arrival
    index = (at / dt);

    //Add noise - Note there are magic numbers here
    //The variable s1 controls the level of background noise
    //The variable s2 controls noise added to background after the time
    //of an arrival. High values for these mean lower noise levels

    let s1 = 175.0;
    let s2 = 8.0;
    if (source === 'b') {
        s1 = 130.0;
    }
    if (source === 'h') {
        s1 = 38 * Math.sqrt(ndata);
    }

    //First put in background noise
    for (j = 0; j < gheight; j++)
        y[j] = myGaussian() * maxamp * ppera / s1;
    //Now put in post signal noise
    for (j = index; j < gheight; j++)
        y[j] += myGaussian() * amp * ppera / s2;

    //Set amplitude at the correct arrival
    y[index] = amp * ppera;

    //Convolve stick seismogram constructed above with a source wavelet
    //the width of the source wavelet depends on the source type selected by
    //the user

    //Q is the quality factor of the
    //wavelet. I'm actually using the first derivative of a noncausally
    //attenuated delta function as the wavelet. Because the wavelet is not
    //causal, we'll add an offset to the resulting wavelet so that it
    //comes in later than it should. Thereby appearing more causal.

    let Q = 150.0;
    let toff = 0.008; //time offset to apply to wavelet
    if (source === 'h') {
        toff = 0.012;
        Q = 100.0;
    }
    if (source === 'b') {
        toff = 0.009;
        Q = 125.0;
    }


    amp = 0.0;
    let time, denom;
    for (time = -0.05, j = 0; time <= 0.05; time += dt / 1000.0, j++) {
        if (j < gheight) {
            denom = 1.0 / (4 * Q * Q) +
                (time - toff) * (time - toff);
            s[j] = (-(time - toff)) / (Q * denom * denom);
            if (s[j] < 0.0)
                s[j] *= 0.75; //Make backswing smaller than initial swing
            if (amp < Math.abs(s[j]))
                amp = Math.abs(s[j]);
        }
    }
    index = j - 1;

    //Scale source response
    for (j = 0; j < gheight; j++)
        s[j] /= amp;

    //Convolve with stick seismogram
    for (j = 0; j < gheight; j++) {
        for (k = 0; k < index; k++) {
            f[j + k] = f[j + k] + y[j] * s[k];
        }
    }

    //Rescale traces to uniform amplitudes (i.e. Trace scaling)
    amp = 0.0;
    for (j = 0; j < gheight + index - 1; j++)
        if (amp < Math.abs(f[j]))
            amp = Math.abs(f[j]);
    scale = (gap / 2) * 0.9 / amp;
    for (j = 0; j < gheight + index - 1; j++)
        f[j] *= scale;

    //Draw Trace. Note the convolution done above has shifted the traces down
    //by half the length of the source wavelet. That is t=0 on the source wavelet
    //is in the middle of the wavelet. So we'll plot the final trace from
    //index/2 to seisheight-1 + index/2. The time associated with index/2 is 0
    let yloc;
    for (j = 0; j < gheight; j++) {
        yloc = llcory - j;
        k = j + index / 2;
        if (ptype === 'w')
            drawLine(xbase +  f[k], yloc,
        xbase + f[k + 1], yloc - 1);
    else if (f[k] >= 0. && f[k + 1] >= 0.)
            drawLine(xbase, yloc, xbase +  f[k], yloc);
    else
        drawLine(xbase +  f[k], yloc,
        xbase +  f[k + 1], yloc - 1);
    }


    return;
}

//Method called via Javascript to change seismogram plot from
//variable area to wiggle and vica versa
function TraceTypeAction() {
    if (plotva === false)
        plotva = true;
    else
        plotva = false;

    repaint();

    return;
}

//Override update method with one that avoids flicker
function update() {
    //If the image size has changed, white out the background. Do this to get rid of
    //any old images that are not in the new plot area, but doing this all the time
    //introduces the flicker this routine is suppose to avoid
    if (chanimagsize === true) {
        setColor(Color.white);
        fillRect(0, 0, 3030, apheight);
        chanimagsize = false;
    }


    paint(offScreenImage.getGraphics());
    drawImage(offScreenImage, 0, 0, null);

    return;
}



function SetImages(width, height) {
    //Null current images
    let offScreenTImage = null;
    let offScreenWImage = null;
    let offScreenVImage = null;
    let offScreenImage = null;
    let ostg = null;
    let osvg = null;
    let oswg = null;

    //Set up offscreen images. These will be set to a default size and then
    //resized if necessary
    offScreenTImage = createImage(width, height);
    ostg = offScreenTImage.getGraphics();
    offScreenWImage = createImage(width, height);
    oswg = offScreenWImage.getGraphics();
    offScreenVImage = createImage(width, height);
    osvg = offScreenVImage.getGraphics();

    //Set up anti flicker image
    offScreenImage = createImage(width, height);

    //Since width and/or height of image has changed rebuild class variables
    //dependent on height and width
    apwidth = width;
    apheight = height;
    gwidth = apwidth - 150;
    gheight = apheight - 150;
    ulcorx = ((apwidth - gwidth) / 2.0);
    ulcory = ((apheight - gheight) / 2.0);
    urcory = ulcory;
    urcorx = ulcorx + gwidth;
    llcorx = ulcorx;
    llcory = ulcory + gheight;
    lrcorx = urcorx;
    lrcory = llcory;

    chanimagsize = true;

    return;
}

function createPrint() {
    try {
        //Get the PrinterJob Object
        let pjob = getPrinterJob();
        //Get default page format and allow user to change
        let format = pageDialog(defaultPage());
        //Tell the PrinterJob what to print
        setPrintable(this, format);
        //Ask the user to confirm and then start printing
        if (printDialog()) {
            pnum ++;
            pjob.print();
        }

    } catch (pe) {
        println("Printer Error: " + pe);
    }

    return;
}

//Implement print method from Printable interface needed to print job
function print(g, format, pagenum) {
    //PrintJob will keep trying to print pages until we tell it to stop. We will
    //print only one page
    if (pagenum > 0)
        return NO_SUCH_PAGE;

    //Convert graphics to graphics 2D for translation purposes
    Graphics2D = (Graphics2D);

    //Center plot on page
    translate(getImageableWidth() / 2 - this.getWidth() / 2,
        getImageableHeight() / 2 - this.getHeight() / 2);

    //Repaint component into graphic
    this.paint();

    //Draw a boarder around the image and label print
    setColor(Color.black);
    drawRect(0, 0, this.getWidth(), this.getHeight());
    drawString("Print number: " + pnum, 0, -2);

    return Printable.PAGE_EXISTS;
}