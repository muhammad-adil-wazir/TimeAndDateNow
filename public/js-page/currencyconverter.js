/////////////// Currency Converter Page - Start ////////////////////////////////
//Gloable Attribute
var currencyCountries = []; 

//Initial Data 
InitCurrencyConverter();
getAllCountries();

//Functions
function InitCurrencyConverter() {
    $('.first-currency-detail, .second-currency-detail').addClass('hidden');       
}

function formatStateDDL (state) {
    if (!state.id) { return state.text; }
    var $state = $(
      '<span ><i class="mr-3 ui-phonecountry-dropdown-item-flag ui-flag ui-flag_' +
        state.text.replace(')',' ').toLowerCase().split('(')[1] +'"/>' +
         state.text +'</span>'
   );
   return $state;
  };

function getAllCountries(){   
    try {
        $.ajax({
            url: '/public/json/countryCurrencies.json',
            dataType: 'json',
            async: false,
            data: {},
            success: function(data) {
            
                $.each(data, function (key, entry) {                                     
               //Step 1 Get AllCountry Lookup data
                $('#drpFromCurrency, #drpToCurrency ').append( '<option value="'+entry.currencyId+ '">'+entry.currencyName + '(' + entry.id+ ')'+ ' </option>'
                ); currencyCountries.push(entry);
              });
            }
          });

    $("#drpFromCurrency,#drpToCurrency").select2({ templateResult: formatStateDDL });
    }
    catch (e) {
        console.log("Parse error: ", e);
    }       
} 

function getCurrencyByID(currencyID) {
        var _currencyCountry = {};
        try {
            _currencyCountry = currencyCountries.filter(cc => cc.currencyId == currencyID)[0];
        }
        catch (e) {
            console.log("Parse error: ", e);
        }
        return _currencyCountry;
}

function convertCurrency() {
        const apiKey = '74956a2b653d3c6ba2b3';
        //Step 1 Get data , amount - from currency and to 
    var _amount = $('#txtAmount').val();
    var _fromCurrency = encodeURIComponent($('#drpFromCurrency').val());
    var _toCurrency = encodeURIComponent($('#drpToCurrency').val());

    //Step 2 Set data (From - To)
    var query = _fromCurrency + '_' + _toCurrency;
    var url = 'https://free.currconv.com/api/v7/convert?q='+ query + '&compact=ultra&apiKey=' + apiKey;
            
    $.get(url, function (response) { 
        var data = response[Object.keys(response)[0]];

        var _convertedAmount = Math.round((data * _amount) * 100) / 100;
        $('#rate-from').html('Conversion Rate <span class="result-currenct">' +_amount + ' ' + _fromCurrency + ' = ' + _convertedAmount + ' ' + _toCurrency +'</span>');
        $('#todays-rate-from').html('Conversion Rate Today <span class="result-currenct">' + '1 ' + _fromCurrency + ' = ' + data + ' ' + _toCurrency);
    });

    //Step 3 Set Data (T - From )
    var query = _toCurrency + '_' + _fromCurrency;
    var url = 'https://free.currconv.com/api/v7/convert?q='+ query + '&compact=ultra&apiKey=' + apiKey;
            
    $.get(url, function (response) { 
        var data = response[Object.keys(response)[0]];

        var _convertedAmount = Math.round((data * _amount) * 100) / 100;
        $('#rate-to').html('Conversion Rate <span class="result-currenct">' +_amount + ' ' + _toCurrency  + ' = ' + _convertedAmount + ' ' + _fromCurrency +'</span>');
        $('#todays-rate-to').html('Conversion Rate Today <span class="result-currenct">' + '1 ' +  _toCurrency + ' = ' + data + ' ' + _fromCurrency );
    });
    $('.spinner-border').addClass('hidden');
}

$('#txtAmount').keyup(function() { showCurrencyDetail(); });

function showCurrencyDetail() {

    $('.spinner-border,.col-right-details').removeClass('hidden');
    
    //Get Data From Currency
    var _currencyID = $('#drpFromCurrency option:selected')[0].value;
    var currency = getCurrencyByID(_currencyID);
    var _title ='<i class="ui-phonecountry-dropdown-item-flag ui-flag ui-flag_'+currency.id.toLowerCase()+'" title="Flag"></i>   '+currency.currencyId+' - '+currency.currencyName+'';

    $('#title-from').html(_title);
    $('#country-from').html('Country <b>'+currency.name+'</b>');
    $('#short-from').html('Short From <b>'+currency.alpha3+'</b>');
    $('#symbol-from').html(' Symbol  <b>'+currency.currencySymbol+'</b>');

    //Get Data To Currency
    var _currencyID = $('#drpToCurrency option:selected')[0].value;
    var currency = getCurrencyByID(_currencyID);
    var _title ='<i class="ui-phonecountry-dropdown-item-flag ui-flag ui-flag_'+currency.id.toLowerCase()+'" title="Flag"></i>   '+currency.currencyId+' - '+currency.currencyName+'';

    $('#title-to').html(_title);
    $('#country-to').html('Country <b>'+currency.name+'</b>');
    $('#short-to').html('Short From <b>'+currency.alpha3+'</b>');
    $('#symbol-to').html(' Symbol  <b>'+currency.currencySymbol+'</b>');

    //Get Convert (From-To) and (To-From) 
    convertCurrency();
}
/////////////// Currency Converter Page - End ////////////////////////////////