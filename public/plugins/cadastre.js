﻿// Необходимо подключить JS-библиотеки: jquery, jquery.getcss, utilities.js, gmxCore.js

$.getCSS((window.gmxJSHost || "") + "plugins/cadastre.css");

/** 
* @namespace Cadastre
* @description Загружает кадастровые данные
*/
(function($){

/** Конструктор
 @memberOf Cadastre
 @class Слой кадастровых данных
 @param oContainer Объект, в котором находится контрол (div) - обязательный
 @param sCadastreHost Сайт, с которого требуется брать кадастровые данные
 @param oMap Карта для отрисовки результатов
 @param oMap Контейнер карты, используется для получения размеров картинки в пикселах*/
var Cadastre = function(oContainer, sCadastreHost, oMap, oMapDiv){
	var	div = _div(null, [['dir', 'className', 'cadastreLeftMenuContainer']]);
	
	var cbDivision, rbNo, rbCostLayer, rbCostByAreaLayer, rbUseType, rbCategory;
	var oDivisionLayer, oCostLayer, oCostByAreaLayer, oUseTypeLayer, oCategoryLayer;
	var oLegend;
	var arrUpdating = [];
	var arrNeedUpdate = [];

	var fnRefreshMap = function(){
		oLegend.style.display = (rbNo.checked)?('none'):('');
		var oExtend = oMap.getVisibleExtent();
		var sQuery = "&bbox="+merc_x(oExtend.minX)+"%2C"+merc_y(oExtend.minY)+"%2C"+merc_x(oExtend.maxX)+"%2C"+merc_y(oExtend.maxY)+"&bboxSR=3395&imageSR=3395&size=" + oMapDiv.clientWidth + "%2C" + oMapDiv.clientHeight + "&f=image";
		if (cbDivision.checked){
			var sUrl = sCadastreHost + "/Cadastre/MapServer/export?dpi=96&transparent=true&format=png32" + sQuery;
			oDivisionLayer.setImageExtent({url:sUrl, extent: oExtend, noCache: true});
		}
		if (rbCostLayer.checked){
			var sUrl = sCadastreHost + "/Thematic/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A1%2C5" + sQuery;
			oCostLayer.setImageExtent({url:sUrl, extent: oExtend, noCache: true});
			oLegend.innerHTML = sCostLegend; 
		} 
		if (rbCostByAreaLayer.checked){
			var sUrl = sCadastreHost + "/Thematic/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A0%2C6" + sQuery;
			oCostByAreaLayer.setImageExtent({url:sUrl, extent: oExtend, noCache: true});
			oLegend.innerHTML = sCostByAreaLegend; 
		}
		if (rbUseType.checked){
			var sUrl = sCadastreHost + "/Thematic/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A2" + sQuery;
			oUseTypeLayer.setImageExtent({url:sUrl, extent: oExtend, noCache: true});
			oLegend.innerHTML = sUseTypeLegend;
		}
		if (rbCategory.checked){
			var sUrl = sCadastreHost + "/Thematic/MapServer/export?dpi=96&transparent=true&format=png32&layers=show%3A3%2C4" + sQuery;
			oCategoryLayer.setImageExtent({url:sUrl, extent: oExtend, noCache: true});
			oLegend.innerHTML = sCategoryLegend; 
		}

		oDivisionLayer.setVisible(cbDivision.checked);
		oCostLayer.setVisible(rbCostLayer.checked);
		oCostByAreaLayer.setVisible(rbCostByAreaLayer.checked);
		oUseTypeLayer.setVisible(rbUseType.checked);
		oCategoryLayer.setVisible(rbCategory.checked);
	}

	var trs = [];		
	cbDivision = _checkbox(false, 'checkbox');
	cbDivision.onclick = fnRefreshMap;
	trs.push(_tr([_td([cbDivision]), _td([_span([_t("Кадастровое деление")],[['dir', 'className', 'cadastreLeftMenuLabel']])])], [['dir', 'className', 'cadastreLeftMenuRow']]));
	
	rbNo = _radio([['attr', 'name', 'Zones'], ['attr', 'checked', 'true']]);
	rbNo.onclick = fnRefreshMap;
	trs.push(_tr([_td([rbNo]), _td([_span([_t("Нет тематической карты")],[['dir', 'className', 'cadastreLeftMenuLabel']])])], [['dir', 'className', 'cadastreLeftMenuRow']]));
	rbCostLayer = _radio([['attr', 'name', 'Zones']]);
	rbCostLayer.onclick = fnRefreshMap;
	trs.push(_tr([_td([rbCostLayer]), _td([_span([_t("Кадастровая стоимость")],[['dir', 'className', 'cadastreLeftMenuLabel']])])], [['dir', 'className', 'cadastreLeftMenuRow']]));
	rbCostByAreaLayer = _radio([['attr', 'name', 'Zones']]);
	rbCostByAreaLayer.onclick = fnRefreshMap;
	trs.push(_tr([_td([rbCostByAreaLayer]), _td([_span([_t("Кадастровая стоимость за метр")],[['dir', 'className', 'cadastreLeftMenuLabel']])])], [['dir', 'className', 'cadastreLeftMenuRow']]));
	rbUseType = _radio([['attr', 'name', 'Zones']]);
	rbUseType.onclick = fnRefreshMap;
	trs.push(_tr([_td([rbUseType]), _td([_span([_t("Виды разрешенного использования")],[['dir', 'className', 'cadastreLeftMenuLabel']])])], [['dir', 'className', 'cadastreLeftMenuRow']]));
	rbCategory = _radio([['attr', 'name', 'Zones']]);
	rbCategory.onclick = fnRefreshMap;
	trs.push(_tr([_td([rbCategory]), _td([_span([_t("Категории земель")],[['dir', 'className', 'cadastreLeftMenuLabel']])])], [['dir', 'className', 'cadastreLeftMenuRow']]));
	
	oLegend = _div();
	_(div, [_table([_tbody(trs)]), oLegend]);
	
	this._mapObject = oMap.addObject();
	this._mapObject.setCopyright('<a href="http://rosreestr.ru">© Росреестр</a>')
	oCostLayer = this._mapObject.addObject();
	oCostByAreaLayer = this._mapObject.addObject();
	oUseTypeLayer = this._mapObject.addObject();
	oCategoryLayer = this._mapObject.addObject();
	oDivisionLayer = this._mapObject.addObject();
	
	var iListenerID = -1;
	this.enableLayer = function(layerName){
		if(layerName == 'Division'){
			cbDivision.checked = true;
		}else if(layerName == 'Cost'){
			rbCostLayer.checked = true;
		}else if(layerName == 'CostByArea'){
			rbCostByAreaLayer.checked = true;
		}else if(layerName == 'UseType'){
			rbUseType.checked = true;
		}else if(layerName == 'Category'){
			rbCategory.checked = true;
		} 
		fnRefreshMap();
	}
	
	/** Загружает слой */
	this.load = function(){
		oDivisionLayer.setVisible(cbDivision.checked);
		oCostLayer.setVisible(rbCostLayer.checked);
		oCostByAreaLayer.setVisible(rbCostByAreaLayer.checked);
		oUseTypeLayer.setVisible(rbUseType.checked);
		oCategoryLayer.setVisible(rbCategory.checked);
		iListenerID = oMap.addListener("onMoveEnd", fnRefreshMap);
		
		_(oContainer, [div]);
		fnRefreshMap();
	}
	/** Выгружает слой */
	this.unload = function(){
		oMap.removeListener("onMoveEnd", iListenerID);
		oDivisionLayer.setVisible(false);
		oCostLayer.setVisible(false);
		oCostByAreaLayer.setVisible(false);
		oUseTypeLayer.setVisible(false);
		oCategoryLayer.setVisible(false);
		$(oContainer).empty();
		bVisible = false;
	}
}

var oCadastre;
var oCadastreLeftMenu = new leftMenu();
var sCadastreHost = false;

var unloadCadastre = function(){
	if(oCadastre != null) oCadastre.unload();
}

var loadCadastre = function(){
	var alreadyLoaded = oCadastreLeftMenu.createWorkCanvas("cadastre", unloadCadastre);
	if (!alreadyLoaded){
		oCadastre = new Cadastre( oCadastreLeftMenu.workCanvas, sCadastreHost, globalFlashMap, document.getElementById("flash"));
	}
	oCadastre.load();
	return oCadastre;
}

var addMenuItems = function(upMenu){
	return [{item: {id:'cadastre', title:_gtxt('Кадастровые данные'),onsel:loadCadastre, onunsel:unloadCadastre},
			parentID: 'loadServerData'}];
}

var afterViewer = function(params){
	if (params && params.CadastreHost) {
		sCadastreHost = params.CadastreHost;
	}else{
		sCadastreHost = "http://maps.rosreestr.ru/arcgis/rest/services/CadastreNew/";
	}
}

var publicInterface = {
    pluginName: 'Cadastre',
	Cadastre: Cadastre,
	LoadCadastre: loadCadastre,
	afterViewer: afterViewer,
	addMenuItems: addMenuItems
}

gmxCore.addModule("cadastre", publicInterface);


var sCostLegend = '<table cellspacing="0" cellpadding="0"><tbody><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9fUA9usA9+EAPCcsfQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>до 3 млн руб.</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9bgA9rEA96kAxLzpJgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>3 - 15 млн. руб.</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9XsA9ngA93UA+R2pSwAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>15 - 30 млн. руб.</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9T0A9kAA90IAF7kxUgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>30 - 100 млн.руб.</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9QAA9hIA9yQAeAUndAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>свыше 100 млн. руб.</span></td></tr></tbody></table';

var sCostByAreaLegend = '<table cellspacing="0" cellpadding="0" style="width: 203px;"><tbody><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9fUA9usA9+EAPCcsfQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><table width="95%"><tbody><tr><td align="">до 100 руб за кв. м</td></tr></tbody></table></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9bgA9rEA96kAxLzpJgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><table width="95%"><tbody><tr><td align="">от 101 до 1000 руб. за кв. м</td></tr></tbody></table></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9XsA9ngA93UA+R2pSwAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><table width="95%"><tbody><tr><td align="">от 1001 до 5000 руб. за кв. м</td></tr></tbody></table></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9T0A9kAA90IAF7kxUgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><table width="95%"><tbody><tr><td align="">от 5001 до 50000 руб. за кв. м</td></tr></tbody></table></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY9QAA9hIA9yQAeAUndAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><table width="95%"><tbody><tr><td align="">более 500000 руб. за кв. м</td></tr></tbody></table></td></tr></tbody></table>';

var sUseTypeLegend = '<table cellspacing="0" cellpadding="0"><tbody><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/wAA/xIA/yQAxDetmgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли с более чем одним видом использования</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/9if/+Kn/+ywWIVZzQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли жилой застройки</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/8Jy/8t6/9N/nGNq1QAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли под жилыми домами многоэтажной и повышенной этажности застройки</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/50A/6MA/6kA0zjLGAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли под домами индивидуальной жилой застройкой</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY5pkA6ZMA7I4A5xrHhAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Незанятые земли, отведенные под жилую застройку</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/+ms//S1//++G44kQgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли общественно-деловой застройки</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/+ln//Ru//90X3D6BQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли гаражей и автостоянок</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/+kA//QA//8AnfC9ewAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли под объектами торговли, общественного питания, бытового обслуживания, автозаправочными и газонаполнительными станциями, предприятиями автосервиса</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY5uYA6d0A7NMAeryBiQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли учреждений и организаций народного образования, земли под объектами здравоохранения и социального обеспечения физической культуры и спорта, культуры и искусства, религиозными объектами</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYqKgAtKIAvZwAgfbyuQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под административно-управленческими и общественными объектами, земли предприятий, организаций, учреждений финансирования, кредитования, страхования и пенсионного обеспечения</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYdHQAinEAnW4AzJWFTAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под зданиями (строениями) рекреации</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY5pkA6ZMA7I4A5xrHhAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под объектами промышленности</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYqG8AtGwAvWoA5VasFgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли общего пользования (геонимы в поселениях)</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY4eHh5NjX58/MBsJpUwAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под объектами транспорта, связи, инженерных коммуникаций</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYzc3N0sXD2Ly5WqFGdQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Под объектами железнодорожного транспорта</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYs7OzvKyqxaWhGy20FAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Под объектами автомобильного транспорта</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYnZ2dqpiWtpKN7dt9hwAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Под объектами морского, внутреннего водного транспорта</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYgoKClX98pnt2xUDwLQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Под объектами воздушного транспорта</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYZ2dngmZjl2RdEF9uXAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Под объектами иного транспорта, связи, инженерных коммуникаций</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY0/++2fS13emsMMNQhAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли сельскохозяйственного использования</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYo/90sPRuu+lnNk+fNAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под крестьянскими (фермерскими) хозяйствами</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYVf8AdvQAjukAJrp/BQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под предприятиями, занимающимися сельскохозяйственным производством</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYTeYAcd0AitMAoSK+BAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под садоводческими объединениями и индивидуальными садоводами</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYN6gAZqIAhJwA4JYcbQAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под огородническими объединениями и индивидуальными огородниками</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYJHQAYHEAf24Ao374EAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под дачными объединениями</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYtdefvs6XxsWPI51NXAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под личными подсобными хозяйствами</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYpfV7set1u+FuPSy7WwAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под служебными наделами</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYiM5mmsZhqb1bRGITZwAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли оленьих пастбищ</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYW4hFeoVCkYA9J56HwAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Для других сельскохозяйственных целей</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYTXQAcXEAim4AKDuv6gAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под лесами в поселениях (в том числе городскими лесами), под древесно-кустарниковой растительностью, не входящей в лесной фонд (в том числе лесопарками, парками, скверами, бульварами)</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYAMX/WL3ze7Xn/71NNgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли, занятые водными объектами, земли водоохранных зон водных объектов, а также земли, выделяемые для установления полос отвода и зон охраны водозаборов, гидротехнических сооружений и иных водохозяйственных сооружений, объектов.</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAAC1QTFRF/v///vTz2dra5tva2c3L/sO7/rSqlJSUqJaU/6KUlH58lF9Y/3ZYAAAAeyQA0xTD0AAAAA90Uk5TAP//////////////////5Y2epgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAHdJREFUKJGd0ksOgCAQA9DhIyAi9z+uiTYyZVjRVZMXFg0jspmjLZJealdwX2pBib19FPA8ZxR/R5Az4h2RFiEiIWLRNImiWQYZ+akakQIqRnLlyUoyT9bCk0mIWDRNomiWQUZ+ikYkgHrEv5eKEnAAaXU2p2zmAUZoBsjYet62AAAAAElFTkSuQmCC"></td><td><span>Земли, не вовлеченные в градостроительную или иную деятельность (земли &ndash; резерв)</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYlUu6pE2ysU2ogM8VNAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под военными и иными режимными объектами</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZYx00zzk0w008r5GEnuAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли под объектами иного специального назначения</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/+nn//Tz////4iZzJgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Неопределено</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v///sO7/rSq/6KU/3ZY/+nn//Tz////4iZzJgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Значение отсутствует</span></td></tr></tbody></table>'

var sCategoryLegend = '<table cellspacing="0" cellpadding="0"><tbody><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZYAG//TWzza2rnJL3s7wAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли водного фонда</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZYtGokuWkkvWYfu6YNWgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли запаса</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZYVf8AbvQAgekA3+ZdMgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли лесного фонда</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZYJHQAVnEAcW4AZkbUVgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли особо охраняемых территорий и объектов</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZY+Z0A/KMA/6kAOzMlwAAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли поселений (земли населенных пунктов)</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZYdE0AhU0Akk8AWdadagAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZY6Oms6PS16f++yNID5wAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFlY2DMDKApFiY8cAbKNSw00KdwJgwpZsmMlNhABUegvpjanC7gAAAABJRU5ErkJggg=="></td><td><span>Земли сельскохозяйственного назначения</span></td></tr><tr><td class=cadastreLegendImageColumn><img class=cadastreLegendImage border="0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAAXNSR0IB2cksfwAAABhQTFRF/v//8MO77bSq6qKU5HZYs7OzuKyqvaWhx9sqFgAAAAh0Uk5TAP/////////VylQyAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAALklEQVQokWNgIBMwsmABTGApFnY2DMDOApFiY8UAbKNSw00KdwJgwpZsmMlNhADmvglpoglhjgAAAABJRU5ErkJggg=="></td><td><span>Категория не установлена</span></td></tr></tbody></table>';

})(jQuery)