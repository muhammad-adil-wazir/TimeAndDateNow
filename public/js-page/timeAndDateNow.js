///////////////////Attribute////////////////////////


// var _pages = window.location.href.toLocaleLowerCase().split('/');
// var _currentPage = _pages[_pages.length - 1];
//-------------------------------------------------------------------

setInterval(updateTime, 1000);
setInterval(loadAnalogclock, 100);
//setInterval(function(){ $(".carousel-control-next").click();},5000);
//----------------------------Function---------------------------------------
function ready(error, world, names) {
    if (error) throw error;
    var countries1 = topojson.feature(world, world.objects.countries).features;

    var countries = countries1.filter(function (d) {
        return names.some(function (n) {
            if (d.id == n.id) return d.name = n.name;
        })
    });

    svg.selectAll("path")
        .data(countries)
        .enter()
        .append("path")
        .attr("stroke", "white")
        .attr("stroke-width", .2)
        .attr("fill", "#154360")
        .attr("d", path)
        .on("mouseover", function (d, i) {
            //d3.select(this).attr("fill","grey").attr("stroke-width",2);
            var _timeZones = getTimeByCountry(d.name);            
            tooltip.classed("hidden", false).html(d.name + _timeZones);
           // showTooltipofMap(d.name);
        })
        .on("mousemove", function (d) {
            var _timeZones = getTimeByCountry(d.name);     
            tooltip.classed("hidden", false)
                .style("top", ((d3.event.offsetY + 50)) + "px")
                .style("left", (d3.event.offsetX + 50) + "px")
                .html(d.name + _timeZones);
        })
        .on("mouseout", function (d, i) {
            //d3.select(this).attr("fill","white").attr("stroke-width",1);
            tooltip.classed("hidden", true);
        });
    readCountriesAndZoneList(); 
    loadTimeZone();
    loadDates();
    loadAnalogclock();
    loadMainCitiesTime();
    highlightTimeZone();
    loadSunTiming();
    realignMap();
    
    $('#citiesSlider').multislider({
       // interval: 50000000
    });
    
    //$('#citiesSlider').multislider('pause');
};

//-------------------------------------------------------------------------
function showDefaultTooltipofMap(countryName) {
    var _timeZones = getTimeByCountry(countryName); 
    var _mapOffSet = $('.timezone-map').offset();
    var _pathOffSet = $('.timezone-map path[fill="grey"').offset();
    tooltip.classed("hidden", false)
        .style("top", (_pathOffSet.top -_mapOffSet.top - 70) + "px")
        .style("left", (_pathOffSet.left) + "px")
        .html(countryName + _timeZones);
}
function getTimeByCountry(country) {
    var _times = '';
    var _timesArray = new Array();
    for (const index of indexs) {
        var keys = Object.keys(countries[index]);
        for (const key of keys) {
            if (countries[index][key].name.toLowerCase() == country.toLowerCase()) {
                for (var k = 0; k < countries[index][key].zones.length; k++) {
                    var _currentDateTime = new Date().toLocaleString("en-US", { timeZone: countries[index][key].zones[k] }).split(',');
                    if (_timesArray.indexOf(_currentDateTime[1]) == -1) {
                        _times += '\n' + countries[index][key].zones[k] + ' : ' + _currentDateTime[1];
                        _timesArray.push(_currentDateTime[1]);
                    }
                }
            }
        }
    }
    return _times;
}

function getFullDate(objToday) {
    var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
        dayOfWeek = weekday[objToday.getDay()],
        domEnder = function () { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
        dayOfMonth = (objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
        months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
        curMonth = months[objToday.getMonth()],
        curYear = objToday.getFullYear(),
        curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
        curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
        curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
        curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
        //var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " +
        return dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
}

Date.prototype.getWeekOfTheMonth = function () {
    var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDay) / 7);
}

Date.prototype.getWeekOfTheYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function getDayOfTheYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function loadDates() {
    _todayDateAsPerTimeZone = new Date(new Date().toLocaleString("en-US", { timeZone: timeZonee }));
    $('#currentDate').text(getFullDate(_todayDateAsPerTimeZone));
    $('#currentWeekOfMonth').text(_todayDateAsPerTimeZone.getWeekOfTheMonth());
    $('#currentWeekOfYear').text(_todayDateAsPerTimeZone.getWeekOfTheYear());
    $('#currentDayOfYear').text(getDayOfTheYear());
    //$('#currentDay').text(' ' +  _currentDayOfTheWeek + ' , Week of The Month : ' + _currentWeekOfTheMonth + ' , Week of The Year : ' + _currentWeekOfTheYear);
    $('#currentIslamicDateAr').text(new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' }).format(Date.now()));
    $('#currentIslamicDateEn').text(new Intl.DateTimeFormat('en-SA-u-ca-islamic', { day: 'numeric', month: 'long', weekday: 'long', year: 'numeric' }).format(Date.now()));
    m = moment(new Intl.DateTimeFormat('en-SA-u-ca-islamic').format(_todayDateAsPerTimeZone), 'iM/iD/iYYYY'); // Parse a Hijri date.
    //m.format('iYYYY/iM/iD [is] YYYY/M/D'); // 1410/8/28 is 1990/3/25
    var year =  m.iYear(); // 1410
    var month = m.iMonth(); // 7
    var date = m.iDate(); // 28
    var dayofyear = m.iDayOfYear(); // 236
    var week = m.iWeek(); // 35
    var daysInTheMonth = m.iDaysInMonth(); // 1410
    var weekofyear = m.iWeekYear(); // 1410
    
   // $('#currentWeekOfMonthAr').text(weekofMonth);
    $('#currentDaysInTheMonthAr').text(daysInTheMonth);
    $('#currentWeekOfYearAr').text(weekofyear);

    $('#currentDayOfYearAr').text(dayofyear);
}
// Analog Clock 
function loadAnalogclock() {
    if (_currentPage == 'timeAndDateNow.html') {
        //_dateTime = (typeof myVar !== 'undefined') ? _dateTime : new Date();
        //debugger;
        var _dateTime = new Date(new Date().toLocaleString("en-US", { timeZone: timeZonee }));
    var weekday = new Array(7),
        d = _dateTime,
        h = d.getHours(),
        m = d.getMinutes(),
        s = d.getSeconds(),
        date = d.getDate(),
        month = d.getMonth() + 1,
        year = d.getFullYear(),
             
        hDeg = h * 30 + m * (360/720),
        mDeg = m * 6 + s * (360/3600),
        sDeg = s * 6,
        
        hEl = document.querySelector('.hour-hand'),
        mEl = document.querySelector('.minute-hand'),
        sEl = document.querySelector('.second-hand'),
        dateEl = document.querySelector('.date-oclock'),
        dayEl = document.querySelector('.day-oclock');
  
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
    
        var day = weekday[d.getDay()];
    
    if(month < 10) {
      month = "0" + month;
    }
    
    hEl.style.transform = "rotate("+hDeg+"deg)";
    mEl.style.transform = "rotate("+mDeg+"deg)";
    sEl.style.transform = "rotate("+sDeg+"deg)";
    dateEl.innerHTML = date+"/"+month+"/"+year;
    dayEl.innerHTML = day;
    }
}

//MainCities
function loadMainCitiesTime() {
    for (var i = 0; i < _mainCities.length; i++) {
        var _time = new Date().toLocaleString("en-US", { timeZone: _mainCities[i].timezone }).split(',');
        //var _mainCity= '<div class="carousel-item col-12 col-sm-6 col-md-4 col-lg-3 '+(i==0 ? 'active' : '' )+'" onclick="updateMainDataByMainCityId('+ i +')">        <div class="card bg-dark text-white"><img class="card-img" src="/public/images/Cluster/'+ _mainCities[i].flag+'.jpg" alt="Pic City"><div class="card-img-overlay"><i class="ui-phonecountry-dropdown-item-flag ui-flag ui-flag_'+ _mainCities[i].flag+'" title="sb" id="sb"></i> <h1 class="card-title"><b>'+_mainCities[i].city+'</b></h1><h2 class="card-text"><b>'+_mainCities[i].country+'</b></h2><h2>'+_time+'</h2> </div></div> </div>' ;
        //$('#body-carousel').append(_mainCity);
        var _mainCity = '<div class="item"  onclick="updateMainDataByMainCityId(' + i + ')">        <div class="card bg-dark text-white"><img class="card-img" src="/public/images/Cluster/' + _mainCities[i].flag + '.jpg" alt="City Picture"><div class="card-img-overlay"><i class="ui-phonecountry-dropdown-item-flag ui-flag ui-flag_' + _mainCities[i].flag + '" title="sb" id="sb"></i> <h2 class="card-title margin-0"><b class="bg-light-black">' + _mainCities[i].city + '</b></h2><h3 class="card-text margin-0"><b class="bg-light-black">' + _mainCities[i].country + '</b></h3><h6><span class="bg-light-black">' + _time + '</span></h6> </div></div> </div>';
        $('.MS-content').append(_mainCity);
    }
}

function highlightTimeZone() {    
    countries = JSON.parse(window.localStorage.getItem('countries'));
    indexs = Object.keys(countries);
    currentTimeZoneCountries = new Array();
    for (const index of indexs) {
        var keys = Object.keys(countries[index]);
        for (const key of keys) {
            for (var k = 0; k < countries[index][key].zones.length; k++) {
                if (countries[index][key].zones[k].toLowerCase() == timeZonee.toLowerCase()) {
                    //country = timeZonee.split('/')[1];
                    if(!currentTimeZoneCountries.includes(countries[index][key].name))
                    currentTimeZoneCountries.push(countries[index][key].name);
                }
            }
        }
    }
    var currentTimeZoneCountriesString = '';
    for (let i = 0; i < currentTimeZoneCountries.length; i++) {
        currentTimeZoneCountriesString += '<h2 class=" text-center">' + (i + 1) + ' : ' + currentTimeZoneCountries[i] + '</h2>';
    }
    $('svg g path').attr("fill", "#154360");
    $('svg g path').each(function () {
        if (currentTimeZoneCountries.indexOf($(this)[0].__data__.name) > -1) {
            $(this).attr("fill", "grey").attr("stroke-width", 2);
        }
    });
    $('#currentTimeZoneCountries').empty().html(currentTimeZoneCountriesString);
    showDefaultTooltipofMap(currentTimeZoneCountries[0]);
}

function getLatLongByTimeZone(timeZone) {
    if(zones.length == 0){
        zones = JSON.parse(JSON.parse(window.localStorage.getItem('zones')));
    }
    var zoneindexs = Object.keys(zones);
    for (const index of zoneindexs) {
        if (zones[index].name.toLowerCase() == timeZone.toLowerCase()) {
            return zones[index];
        }
    }
}

/* Sun timing-start*/
function loadSunTiming() {
    var _zone = getLatLongByTimeZone(timeZonee);
    var zone = SunCalc.getTimes(/*Date*/ new Date(), /*Number*/ _zone.lat, /*Number*/ _zone.long, /*Number (default=0)*/ 0);
    $('#sunRiseTime').text(zone.sunrise.toLocaleTimeString());
    $('#sunSetTime').text(zone.sunset.toLocaleTimeString());
}

function updateMainDataByMainCityId(IdMainCity){
    //Step 1 change timeZone Heder Name.
    timeZonee  = _mainCities[IdMainCity].timezone;
    changeTimezone(timeZonee);
}
function changeTimezone(timezone) {
    loadTimeZone();
    //Step 2 Change load sun Timing
    loadSunTiming();
    loadDates();
    scrollToTop();
    highlightTimeZone();
    
}
function updateTime() {
    if (_currentPage == 'timeAndDateNow.html') {
        var _currentDateTime = new Date().toLocaleString("en-US", { timeZone: timeZonee }).split(',');
        _currentDateTime[1] = (_currentDateTime[1].replace(' ','').split(':')[0].length >1) ?_currentDateTime[1] : _currentDateTime[1].replace(' ','0') ;
        document.getElementById('currentTime').innerText = _currentDateTime[1];
    }
}
function showMap() {
    d3.queue()
        .defer(d3.json, "/public/json/world-110m.v1.json")
        .defer(d3.csv, "/public/javascripts/world-country-names.csv")
        .await(ready);
}
function onSearchChange() {
    if ($('#drpTopMenuSearchBox').val() != undefined && $('#drpTopMenuSearchBox').val() != '') {
        timeZonee = $('#drpTopMenuSearchBox').val()[0];
        changeTimezone(timeZonee);
    }
    $('#btnSearch').removeClass('clr-black').addClass('clr-white');
    $('#drpTopMenuSearchBox').val(null);
    $('.select2 ul li.select2-selection__choice').remove();
    $('.select2').animate({ opacity: '0' }, 'slow');
}

var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = 1400 - margin.left - margin.right;
var height = 700 - margin.top - margin.bottom;
var projection = d3.geoNaturalEarth1()
    .center([0, 15])
    .rotate([-9, 0])
    .scale([1300 / (2 * Math.PI)])
    .translate([450, 300]);
    var path = d3.geoPath()
    .projection(projection);
    var svg = d3.select("svg")
    .append("g")
    //.attr("width", '1400px')
    //.attr("height", height);
    var tooltip = d3.select("div.tooltip");
showMap();
