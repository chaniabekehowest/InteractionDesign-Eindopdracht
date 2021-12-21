//TODO: title filter (207)
//7 srm 40
//24 mouse
//67 3xample
//185 penguin
const randomBeerApi = "https://api.punkapi.com/v2/beers/random";
let data = {};
let srmColor = '#FFFFFF';

const COLOR_MAP = {
    0: '#FFFFFF',
    1: '#FFE699', 2: '#FFD878',
    3: '#FFCA5A', 4: '#FFBF42',
    5: '#FBB123', 6: '#F8A600',
    7: '#F39C00', 8: '#EA8F00',
    9: '#E58500', 10: '#DE7C00',
    11: '#D77200', 12: '#CF6900',
    13: '#CB6200 ', 14: '#C35900',
    15: '#BB5100', 16: '#B54C00',
    17: '#B04500', 18: '#A63E00',
    19: '#A13700', 20: '#9B3200',
    21: '#952D00', 22: '#8E2900',
    23: '#882300', 24: '#821E00',
    25: '#7B1A00', 26: '#771900',
    27: '#701400', 28: '#6A0E00',
    29: '#660D00', 30: '#5E0B00',
    31: '#5A0A02', 32: '#600903',
    33: '#520907', 34: '#4C0505',
    35: '#470606', 36: '#440607',
    37: '#3F0708', 38: '#3B0607',
    39: '#3A070B', 40: '#36080A',
    'max': '#030403'
};

const getRandomBeerData = () => {
    data = {};
   fetch(randomBeerApi)
    .then(response => response.json())
    .then(data => ParseJSONDataToObject(data));
};

const ParseJSONDataToObject = (json) => {
    data = Object.values(json)[0];
    console.log(data);
    fillInHtml();
    getSrmColor();
    drawChart();
 };

 const filterText = (text) => {
    text = text.replace(/\((.*?)\)/, "");
    text = text.replace(/\<(.*?)\>/, "");
    return text;
   
 }
 
 const fillInHtml = () => {
     if( data.image_url != null){
        document.getElementsByClassName('c-image')[0].src = data.image_url;
     }
    document.getElementsByClassName('c-tagline')[0].innerText = data.tagline.toUpperCase();
    document.getElementsByClassName('c-title')[0].innerText = filterText(data.name);
    document.getElementsByClassName('c-description')[0].innerText = data.description;
    document.getElementsByClassName('c-first-brewed-value')[0].innerText = data.first_brewed;
    document.getElementsByClassName('c-constributed-by-value')[0].innerText = filterText(data.contributed_by);
    document.getElementsByClassName('c-alcohol-by-volume-value')[0].innerText = data.abv + "%";
    document.getElementsByClassName('c-ph-value')[0].innerText = data.ph;
 };

 const getSrmColor = () =>{
    let color = Math.floor(data.srm);
	srmColor = color && color > 40 ? COLOR_MAP.max : COLOR_MAP[color];
 };

 const drawChart = () => {
    let ctx = document.getElementById("js-graph").getContext('2d');
    
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: data.name,
                data: [{
                    x: data.ibu == null? 0 : data.ibu,
                    y: data.srm == null? 0 : data.srm
                }],
                borderColor: 'white',
				backgroundColor: 'black',
				pointBackgroundColor: srmColor,
				lineTension: 0.3,
				borderWidth: 1,
				pointRadius: 10,
            }]
        },
        options: {
            defaultFontColor: (Chart.defaults.global.defaultFontColor = '#808495'),
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
					ticks: {
						min: 0,
						max: data.ibu >= 60? data.ibu : 60,
						},
                    scaleLabel:{
                        display: true,
                        labelString: "Bitterness (IBU)"
                    }
                }],
                yAxes: [{
					ticks: {
						min: 0,
						max: data.srm >= 40? data.srm : 40,
					},
                    scaleLabel:{
                        display: true,
                        labelString: "Color (SRM)"
                    }
				}]
            }
        }
    });
 };

 


document.addEventListener('DOMContentLoaded', function() {
	console.log('Script loaded!');
    let icon = document.querySelector('ion-icon');
    let likeValue = document.getElementById("js-like-value");
    icon.onclick = function(){
         icon.classList.toggle('active');
         let number = Number(likeValue.innerText);
         if(icon.classList.contains('active')){
            number = number + 1;
         }else{
             number = number - 1;
         }
       
        likeValue.innerText = number;
    }

    let refreshBtnMobile = document.getElementsByClassName("js-refresh-mobile")[0];
    refreshBtnMobile.onclick = function(){
        icon.classList.remove('active');
        likeValue.innerText = 22;
        getRandomBeerData();
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    let refreshBtn = document.getElementsByClassName("js-refresh")[0];
    refreshBtn.onclick = function(){
        icon.classList.remove('active');
        likeValue.innerText = 22;
        getRandomBeerData();
    }

    getRandomBeerData();

});