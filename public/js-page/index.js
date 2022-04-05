/////////////// Common - Start ////////////////////////////////
var indexs = new Array();
var timeZonee = Intl.DateTimeFormat().resolvedOptions().timeZone;
var _mainCities = [
    { 'city': 'New York', 'country': 'US of America', 'timezone': 'America/New_York', 'flag': 'us' },
    { 'city': 'Berlin', 'country': 'Germany', 'timezone': 'Europe/Berlin', 'flag': 'de' },
    { 'city': 'London', 'country': 'Britain (UK)', 'timezone': 'Europe/London', 'flag': 'gb' },
    { 'city': 'Paris', 'country': 'France', 'timezone': 'Europe/Paris', 'flag': 'pm' },
    { 'city': 'Tokyo', 'country': 'Japan', 'timezone': 'Asia/Tokyo', 'flag': 'jp' },
    { 'city': 'Hong Kong', 'country': 'Hong Kong', 'timezone': 'Asia/Hong_Kong', 'flag': 'hk' },
    { 'city': 'Singapore', 'country': 'Singapore', 'timezone': 'Asia/Singapore', 'flag': 'sg' },
    { 'city': 'Beijing', 'country': 'China', 'timezone': 'Asia/Shanghai', 'flag': 'cn' },
    { 'city': 'Sydney', 'country': 'Australia', 'timezone': 'Australia/Sydney', 'flag': 'au' },
    { 'city': 'Toronto', 'country': 'Canada', 'timezone': 'America/Toronto', 'flag': 'ca' },
];
var countries = [];
var zones = [];
var stringZones = {};
var currentTimeZoneCountries = [];
//--------------Start Get And set Location  Storage
function readCountriesAndZoneList() {
    try {
        $.getJSON('/public/json/countries.json', function (data) {
            //Step 1 Get Location Storage Data
            countries = data.countries;
            zones = data.zones;
            stringZones = JSON.stringify(zones);
            //Step 2 Save Data    
            setLocationStorage(countries, stringZones);
            loadTopMenuSearchBox(zones);
        });
    }
    catch (e) {
        console.log("Parse error: ", e);
    }
}
function setLocationStorage(countries, zones) {
    if (window.localStorage.getItem('countries') == null) {
        window.localStorage.setItem('countries', JSON.stringify(countries));
        window.localStorage.setItem('zones', JSON.stringify(zones));
        getLocationStorage();
    }
}
function getLocationStorage() {
    if (countries.length == 0) {
        countries = JSON.parse(window.localStorage.getItem('countries'));
        zones = JSON.parse(JSON.parse(window.localStorage.getItem('zones')));
    }
}
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function loadTimeZone() {
    var _fullTimeZoneName = new Date().toLocaleString("en-US", { timeZoneName: 'long', timeZone: timeZonee }).split(' ');
    var _shortTimeZoneName = new Date().toLocaleString("en-US", { timeZoneName: 'short' }).split(' ');
    _fullTimeZoneName.splice(0, 3);
    var _timezoneName = timeZonee + ' , ' + _fullTimeZoneName.toString().replace(',', ' ').replace(',', ' ') + ' (' + _shortTimeZoneName[_shortTimeZoneName.length - 1] + ')';
    document.getElementById('timeZone').innerText = _timezoneName;
}
////////////////End ////////////////////////////////

var _currentPage ='timeAndDateNow.html';

$(function () {
//Start Page
$('.cd-main-content').load('views/timeAndDateNow.html');

$('#Year').text(new Date().getFullYear());

//Load Menu
    $('.change-page').on('click', function (e) {
        e.preventDefault();
        var page = $(this).attr('href');
        _currentPage =  page.replace('views/','');
        $('.cd-main-content').load(page);
        scrollToTop();
    });
});     


//--------------Menu - Start -----------------------

jQuery(document).ready(function () {
    if ($('.cd-stretchy-nav').length > 0) {
        var stretchyNavs = $('.cd-stretchy-nav');
        stretchyNavs.each(function () {
            var stretchyNav = $(this),
                stretchyNavTrigger = stretchyNav.find('.cd-nav-trigger');
            stretchyNavTrigger.on('click', function (event) {
                event.preventDefault();
                stretchyNav.toggleClass('nav-is-visible');
            });
        });
        $(document).on('click', function (event) {
            (!$(event.target).is('.cd-nav-trigger') && !$(event.target).is('.cd-nav-trigger span')) && stretchyNavs.removeClass('nav-is-visible');
        });
    }
});

//--------------Menu - End --------------------------
//----------------Start JS Menu Responsive-navbar-active-animation-----------
function orientationchange(){
    var tabsNewAnim = $('#navbarSupportedContent');
    var selectorNewAnim = $('#navbarSupportedContent').find('li').length;
    var activeItemNewAnim = tabsNewAnim.find('.active');
    var activeWidthNewAnimHeight = activeItemNewAnim.innerHeight();
    var activeWidthNewAnimWidth = activeItemNewAnim.innerWidth();
    var itemPosNewAnimTop = activeItemNewAnim.position();
    var itemPosNewAnimLeft = activeItemNewAnim.position();
    $(".hori-selector").css({
      "top":itemPosNewAnimTop.top + "px", 
      "left":itemPosNewAnimLeft.left + "px",
      "height": activeWidthNewAnimHeight + "px",
      "width": activeWidthNewAnimWidth + "px"
    });
    $("#navbarSupportedContent .navbar-nav").on("click", "li", function (e) {
        activateMenuItem($(this).attr('id'));
    });
    realignMap();
   
}
function activateMenuItem(id) {
    var elm = $('#' + id);
    $('#navbarSupportedContent ul li').removeClass("active");
    $(elm).addClass('active');
    var activeWidthNewAnimHeight = $(elm).innerHeight();
    var activeWidthNewAnimWidth = $(elm).innerWidth();
    var itemPosNewAnimTop = $(elm).position();
    var itemPosNewAnimLeft = $(elm).position();
    $(".hori-selector").css({
        "top": itemPosNewAnimTop.top + "px",
        "left": itemPosNewAnimLeft.left + "px",
        "height": activeWidthNewAnimHeight + "px",
        "width": activeWidthNewAnimWidth + "px"
    });
}
function realignMap() {
    if (window.outerWidth < 950) {
        if ($('.timezone-map path[fill="grey"').offset() != undefined) {
            $('.timezone-map-wrapper').scrollLeft($('.timezone-map path[fill="grey"').offset().left + 200);
        }
    }
}
$(document).ready(function () {
    setTimeout(function () { orientationchange(); },500);
      //$(".select2-search__field").css({ width: 0 });
    $('#btnSearch').click(function () {
        $('#btnSearch').removeClass('clr-white').addClass('clr-black');
        $('.select2').animate({ opacity: '1' }, 'slow');
    });

    //getLocationStorage();
    //loadTopMenuSearchBox();
    //$('body').click(function (e) {
    //    if (e.target.id != 'iSearch' && e.target.id != 'btnSearch') {
    //        onSearchChange();
    //    }
    //});
  });
  $(window).on('resize', function(){
      setTimeout(function () { orientationchange(); }, 500);
  });
  $(".navbar-toggler").click(function(){
      setTimeout(function () { orientationchange(); });
  });
//----------------end JS Menu Responsive-navbar-active-animation-----------

//---------------------Search bar in the top menu - start -----------------------

function loadTopMenuSearchBox() {
    //if ($('#drpTopMenuSearchBox').hasClass("select2-hidden-accessible") == false) {
    // Select2 has not been initialized
    //var _listItemsForSearchBox = new Array();
    //Object.keys(zones).forEach(function (data) {
    //    _listItemsForSearchBox.push({ id: data, text: data });
    //});
    var _listItemsForSearchBox = '';
    Object.keys(zones).forEach(function (data) {
        _listItemsForSearchBox += '<option value="' + data + '">' + data + '</option>';
    });
    if ($('#drpTopMenuSearchBox').hasClass("select2-hidden-accessible")) {
        $("#drpTopMenuSearchBox").select2('destroy');
        $("#navbarSupportedContent span.select2").remove();
        //$("navbarSupportedContent span.select2-hidden-accessible").remove();
        //navbarSupportedContent
    }
    else {
        $("#drpTopMenuSearchBox").append(_listItemsForSearchBox);
    }
        $("#drpTopMenuSearchBox").select2({
            //matcher: matchStart
           // data: _listItemsForSearchBox,
            placeholder: 'Type your timezone name',
            allowClear: false,
            minimumResultsForSearch: 5,
        }); 
   // }
   
}

function matchStart(params, data) {
    // If there are no search terms, return all of the data
    if ($.trim(params.term) === '') {
        return data;
    }

    // Skip if there is no 'children' property
    if (typeof data.children === 'undefined') {
        return null;
    }

    // `data.children` contains the actual options that we are matching against
    var filteredChildren = [];
    $.each(data.children, function (idx, child) {
        if (child.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
            filteredChildren.push(child);
        }
    });

    // If we matched any of the timezone group's children, then set the matched children on the group
    // and return the group object
    if (filteredChildren.length) {
        var modifiedData = $.extend({}, data, true);
        modifiedData.children = filteredChildren;

        // You can return modified objects from here
        // This includes matching the `children` how you want in nested data sets
        return modifiedData;
    }

    // Return `null` if the term should not be displayed
    return null;
}

//$(".js-example-matcher-start").select2({
//    matcher: matchStart
//}); 

//---------------------Search bar in the top menu - End -----------------------