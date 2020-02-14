 window.gmxVersion = {
		 "jsPath": {
			"//www.kosmosnimki.ru/lib/geomixer_1.3/geomixer-src.js": 1508146119421
		 },
		 "cssPath": {
			 "//www.kosmosnimki.ru/lib/geomixer_1.3/geomixer.css": 1508146119421
		 }
 };
// var defaultMapID = 'DefaultMap';
// var mapHostName = false;
// var apiKey = '33959EF7AFB4FB92EEC2E7B73AE8458B';
window.serverBase = 'https://maps.kosmosnimki.ru/'; // Адрес для выполнения серверных запросов
// var copyright = false;
// var pagetitle = false;
// var usecatalog = true;
// var gmxAPIdebugLevel = 0;	// Уровень отладки (по умолчанию =0 - без сбора отладочной информации, 9 - alert при ошибках, 11 - не перехватывать ошибки)

//var mapsSite = true;
//var apikeySendHosts = false;
//var apikeyRequestHost = false;
window.useInternalSearch = true;   // использовать поиск только по внутренним слоям

window.syncParams = {};

/**
 * baseMap - объект для задания базовых подложек вручную
 *
 * примеры подлжек лежат по адресу http://maps.kosmosnimki.ru/api/baseLayersTemplate.js
 *
 * структура объекта
 * var baseMap = {
 *	    defaultHostName: '/',					// хост по умолчанию
 *		defaultMapID: '',						// id карты по умолчанию
 *
 *		baseLayers: [ 							// массив базовых подложек
 *			{									// пример базовой подложки
 *				id: '',							// id базовой подложки (обязательный параметр)
 *           	rus: '',						// русское наименование
 *             	eng: '',						// английское наименование
 *				icon: 'path/to/icon',			// путь к иконке подложки
 *
 *				layers: [						// массив слоев, входящих в базовую подложку
 *
 * 					// слои Leaflet-Geomixer - для загрузки которых нужен хост и карта
 * 					{
 * 						hostName: '',			// хост, если не указан - хост по умолчанию
 *						mapID: '',				// карта, если не указана - карта по умолчанию
 *                     	layerID: ''				// id слоя
 * 					},
 *
 * 					// слои L.tileLayer - для загрузки которых нужен urlTemplate
 * 					{
 * 						urlTemplate: ''			// url, по которому грузится базовая подложка
 * 					}
 *				]
 *		 }
 *	  ]
 * }
 */

// var baseMap = {};

// настройки карты
// var mapOptions = {
	// maxPopupCount: 10
// }

// настройки контролов
// var controlsOptions = {
	// gmxDrawing: {items: ['Rectangle', 'Polyline', 'Point', 'Polygon']},
	// gmxLocation: {scaleFormat: 'text'},
	// gmxCopyright: {cursorPosition: true}
	// ,
	// gmxHide: {isActive: false}
	//gmxLogo: null
//};

// var headerLinks = false; //устарело: используйте gmxViewerUI.headerLinks

// var gmxViewerUI = {
	// hideLogin    : false, // скрыть информацию о пользователе (вход/выход, имя пользователя)
	// hideLanguages: false, // скрыть переключалку языков
	// headerLinks  : false,  // показать ссылки в шапке
	// hideLogo     : false // не показывать лого в шапке
	//logoImage  : "img/geomixer_transpar.png" //какую картинку показывать в качестве лого
// }

// var gmxJSHost = 'http://maps.kosmosnimki.ru/api/';

// var gmxDropBrowserCache = true;
// var gmxGeoCodeShpDownload = true;

window.gmxPlugins = [
	{ pluginName: 'gmxForest_dev3', file: 'http://maps3.kosmosnimki.ru/plugins/external/gmxForest_dev3/public/addGmxPlugin.js', module: 'gmxForest_dev3', mapPlugin: true, isPublic: true },
	{ pluginName: 'Weather View', file: 'plugins/WeatherView/scanex-weather-view.js', module: 'WeatherView', mapPlugin: true, isPublic: true },
        { pluginName: 'gmxPluginOuth2', file: 'plugins/external/GmxPluginOAuth2/addGmxPlugin.js', module: 'gmxPluginOuth2', mapPlugin: true, isPublic: true },
];