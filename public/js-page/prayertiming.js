///////////// Namaz Timing Page - Start ////////////////////////////////
var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

//Initial Data
getCountriesList();
loadMonths(); 
loadYears();
loadTimeZone(timeZonee);
loadNamazTimings();

//Functions
function loadMonths(){
    var _currentMonth = new Date().getMonth();

    try {
        //Get Months Lookup data
        $.each(months, function (key, entry) { 
        $('#Months').append($('<option '+((entry == months[_currentMonth]) ? 'selected' : '' ) +'></option>') .attr('value', entry).text(entry)); });
    }
    catch (e) {
        console.log("Parse error: ", e);
    } 
}

function loadYears(){
    var _currentYear = new Date().getFullYear();
    try {
        //Get Years Lookup data
        for(var i=1980 ;i<=2080;i++ ){
            $('#Years').append($('<option ' + ((_currentYear == i) ? 'selected' : '') + '></option>').attr('value', i).text(i));
        }
    }
    catch (e) {
        console.log("Parse error: ", e);
    } 
}

function getDayOfTheWeek(date) {
    //var a = new Date();
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    return weekdays[date.getDay()];
}

function getCountriesList(){
    try {
        //Step 1 Get countries Lookup data
        $.each(zones, function (key, entry) {    
        $('#countries').append($('<option></option>')
            .attr('value', entry[Object.keys(entry)[0]]).text(entry[Object.keys(entry)[0]]));
        });
    }
    catch (e) {
        console.log("Parse error: ", e);
    } 
}

function getLatLongByTimeZone(timeZone) {
    var zoneindexs = Object.keys(zones);
    for (const index of zoneindexs) {
        if (zones[index].name.toLowerCase() == timeZone.toLowerCase()) {
            return zones[index];
        }
    }
}

function loadNamazTimings() {
    getLocationStorage();
    var _latLong = getLatLongByTimeZone(timeZonee);
    var sel = document.getElementById('countries');
    var fragment = document.createDocumentFragment();
    
    indexs = Object.keys(countries);
    var _zones = new Array();
    for (const index of indexs) {
        var keys = Object.keys(countries[index]);
        for (const key of keys) {
            for (var k = 0; k < countries[index][key].zones.length; k++) {
                    var opt = document.createElement('option');
                for (var i = 0; i < countries[index][key].zones.length; i++) {
                    //var _zones = countries[index][key].name + ' - ' + countries[index][key].zones[i];
                    var _zone = countries[index][key].zones[i];
                    if (_zones.indexOf(_zone) == -1) {
                        _zones.push(_zone);
                        opt.innerHTML = _zone;
                        opt.value = countries[index][key].timezone;
                        if (countries[index][key].zones[i] == timeZonee) {
                            opt.selected = true;
                        }
                        fragment.appendChild(opt);
                        }
                }
            }
        }
    }
    sel.appendChild(fragment);
    //if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(loadNamazTableForToday);
    //    navigator.geolocation.getCurrentPosition(loadNamazTableForMonth);
    //}
    loadNamazTableForToday(_latLong.lat, _latLong.long);
    loadNamazTableForMonth(_latLong.lat, _latLong.long);
}

function loadNamazTableForToday( lat , long) {
    //step check if current postion or by countries choose DDL
    //var _lat = (position != null) ?position.coords.latitude : lat;
    //var _long = (position != null) ?position.coords.longitude : long;

    prayTimes.setMethod('Karachi');
    var date = new Date(new Date().toLocaleString("en-US", { timeZone: timeZonee }));
    //var date = new Date(); // today
    var times = prayTimes.getTimes(date, [lat, long]);
    var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];    
    document.getElementById('selectedTodayNamazTiming').innerText = 'Namaz Timing Today ( ' + getFullDate(date) + ' )';
    
    var html = '';

    //Step 1 Get current hour
   // var time = new Date();
    var _time = date.toLocaleString('en-US', { hour: 'numeric', hour12: false })
    var _times=[];

    //Step 2 find near hour now 
     for (var i in list) {
         _times[i]=times[list[i].toLowerCase()];
    }   
    var _nearhour = _times.reduce(function(prev, curr) {
        return (Math.abs( curr.split(':')[0] - _time) < Math.abs(prev.split(':')[0] - _time) ? curr.split(':')[0] : prev.split(':')[0]);
        });

    //Step 3 Set View by id and set active desgin of near time
    for (var i in list) {
       html +='<div class="prayerTiles ' + ((times[list[i].toLowerCase()].split(':')[0]== _nearhour) ? 'prayer-active' : '')
       +' slick-slide"><h3>' + list[i] + '</h3><h2><b>' + times[list[i].toLowerCase()] + '</b></h2></div>';
   }  
    document.getElementById('tblNamazTimeToday').innerHTML = html;
}

function loadNamazTableForMonth(lat , long , month , year) {

    //step check if current postion or by countries choose DDL
    //var _lat = (position != null) ?position.coords.latitude : lat;
    //var _long = (position != null) ?position.coords.longitude : long;
    prayTimes.setMethod('MWL');
    _todayDate = new Date(new Date().toLocaleString("en-US", { timeZone: timeZonee }));
    var _currentMonth = (month !=null) ? month : _todayDate.getMonth() ;
    var _currentYear = (year != null) ? year : _todayDate.getFullYear();
    if (isNaN(_currentMonth)) {
        _currentMonth = months.indexOf(_currentMonth);
    }
    var _currentDay = _todayDate.getDate();
    document.getElementById('selectedMonthNamazTiming').innerText = 'Namaz Timing for ' + months[_currentMonth] + ', ' + _currentYear;
    var _totalDays = new Date(_currentYear, (_currentMonth + 1), 0).getDate();
    //var date = new Date(); // today

    var list = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    var html = '<table id="timetable">';
    //html += '<tr><th colspan="2">' + getFullDate(new Date()) + '</th></tr>';
    html += '<tr class="d-flex text-center " style="Background-color:#FAEBD7;">';
    html += '<th class="col-2"><b>Gregorian Year</b></th>';
    html += '<th class="col-7"><b>Prayers time</b></th>';
    html += '<th class="col-3"><b>Hijri Year</b></th>';
    html += '</tr>';
    html += '<tr class="d-flex">';
    html += '<td class="col-1 bold">' + months[_currentMonth] + '</td>';
    html += '<td class="col-1 bold">Day</td>';
    for (var i in list) {
        html += '<td class="col-1 bold">' + list[i] + '</td>';
    }
    html += '<td class="col-1 bold">Hijri</td>';
    html += '<td class="col-1 bold">Month</td>';
    html += '<td class="col-1 bold">Year</td>';
    html += '</tr>';
    for (var i = 1; i <= _totalDays; i++) {
        var _date = new Date(_currentYear, _currentMonth,i);
        var times = prayTimes.getTimes(_date, [lat, long]);
        var _islamicDay = new Intl.DateTimeFormat('en-SA-u-ca-islamic', { day: 'numeric', }).format(_date);
        var _islamicMonth = new Intl.DateTimeFormat('en-SA-u-ca-islamic', { month: 'long' }).format(_date);
        var _islamicYear = new Intl.DateTimeFormat('en-SA-u-ca-islamic', { year: 'numeric' }).format(_date);
                
        html += '<tr class="d-flex  '+((_currentDay ===i )?'tr-active': '' )+' ">';
        html += '<td class="col-1">' + i + '</td>';
        html += '<td class="col-1">' + getDayOfTheWeek(_date) + '</td>';
              
        for (var k in list) {
            html += '<td class="col-1">' + times[list[k].toLowerCase()] + '</td>';
        }
        html += '<td class="col-1">' + _islamicDay + '</td>';
        html += '<td class="col-1">' + _islamicMonth + '</td>';
        html += '<td class="col-1">' + _islamicYear + '</td>';
        html += '</tr>';
    }
    html += '</table>';

    document.getElementById('tblNamazTimeForMonth').innerHTML = html;
}

function loadNamazTblForChoose() {
    //Step 1 Get Year and month choose
    var _Months = months.indexOf($("#Months :selected").text());
    var _Years = $("#Years :selected").text();
    var _postion = getLatLongByTimeZone(timeZonee);

    //Step 2 Call function to append data In table.
    loadNamazTableForMonth(_postion.lat , _postion.long , _Months , _Years );
}

function showTimeZone() {
    //Step 1 Get data choose
    timeZonee = $("#countries :selected").text();

    //Step 2 Set Title 
    loadTimeZone();

    //Step 3 Get data by countries
    var _postion = getLatLongByTimeZone(timeZonee);

    //Step 4 Change namaz time by countries
    loadNamazTableForToday( _postion.lat, _postion.long);
    var date = new Date(new Date().toLocaleString("en-US", { timeZone: timeZonee }));
    loadNamazTableForMonth( _postion.lat, _postion.long, months[date.getMonth()], date.getFullYear());
}
/////////////// Namaz Timing Page - End ////////////////////////////////