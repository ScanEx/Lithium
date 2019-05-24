﻿import nsGmx from './nsGmx.js';
import {
	_table, _tbody, _tr, _td, _t,
	_textarea,
	_div, _span, makeButton,
	_ul, _li,
	_checkbox, _input, _a, _br,
	showDialog
} from './utilities.js';

(function(_){

var BaseLayersControl = function(container, blm) {
	var lang = _translationsHash.getLanguage();

	$(container).append(
		'<table class="group-editor-blm-table">' +
			'<tr>' +
				'<td class="group-editor-blm-title">' + _gtxt('Доступные подложки') + '</td>' +
				'<td class="group-editor-blm-title">' + _gtxt('Подложки карты') + '</td>' +
			'</tr><tr>' +
				'<td class="group-editor-blm-available"></td>' +
				'<td class="group-editor-blm-map"></td>' +
			'</tr>' +
		'</table>'
	);

	var availContainer = $('<ul class="group-editor-blm-ul"></ul>').appendTo($('.group-editor-blm-available', container));
	var mapContainer = $('<ul class="group-editor-blm-ul"></ul>').appendTo($('.group-editor-blm-map', container));

	var constructItem = function(id, title) {
		if (title) {
			return $('<li class="group-editor-blm-item">' + title + '</li>').data('baseLayerID', id);
		} else {
			return $('<li class="group-editor-blm-item group-editor-blm-missing-item">' + id + '</li>').data('baseLayerID', id);
		}
	}

	var activeIDs = blm.getActiveIDs();

	blm.getAll().forEach(function(baseLayer) {
		if (activeIDs.indexOf(baseLayer.id) === -1) {
			var item = constructItem(baseLayer.id, baseLayer.options[lang]);
			availContainer.append(item);
		}
	})

	activeIDs.forEach(function(id) {
		var baseLayer = blm.get(id);
		mapContainer.append(constructItem(id, baseLayer && baseLayer.options[lang]));
	});

	var updateBaseLayers = function() {
		var activeIDs = [];
		mapContainer.children('li').each(function(index, elem) {
			activeIDs.push($(elem).data('baseLayerID'));
		})
		blm.setActiveIDs(activeIDs);
	}

	mapContainer.sortable({
		connectWith: '.group-editor-blm-available > ul',
		stop: updateBaseLayers
	});
	availContainer.sortable({
		connectWith: '.group-editor-blm-map > ul',
		stop: updateBaseLayers
	});
}

var GroupVisibilityPropertiesModel = Backbone.Model.extend({
	defaults: {
		isChildRadio: false,
		isVisibilityControl: false,
		isExpanded: false
	}
})

//возвращает массив описания элементов таблицы для использования в mapHelper.createPropertiesTable
//model {GroupVisibilityPropertiesModel} - ассоциированные параметры видимости
//showVisibilityCheckbox {bool} - добавлять ли возможность скрывать чекбокс видимости или нет
var GroupVisibilityPropertiesView = function( model, showVisibilityCheckbox, showExpanded )
{
	var _model = model;
	var boxSwitch = _checkbox(!_model.get('isChildRadio'), 'checkbox'),
		radioSwitch = _checkbox(_model.get('isChildRadio'), 'radio');
	var showCheckbox = _checkbox(_model.get('isVisibilityControl'), 'checkbox');
	var isExpanded = _checkbox(_model.get('isExpanded'), 'checkbox');

	showCheckbox.onclick = function()
	{
		_model.set('isVisibilityControl', this.checked );
	}

	isExpanded.onclick = function()
	{
		_model.set('isExpanded', this.checked );
	}

	boxSwitch.onclick = function()
	{
		this.checked = true;
		radioSwitch.checked = !this.checked;

		_model.set('isChildRadio', !this.checked);
	}

	radioSwitch.onclick = function()
	{
		this.checked = true;
		boxSwitch.checked = !this.checked;

		_model.set('isChildRadio', this.checked );
	}

	var ret = [{name: _gtxt("Вид вложенных элементов"), field: 'list', elem: _div([boxSwitch, radioSwitch])}];

	if (showVisibilityCheckbox)
		ret.push({name: _gtxt("Показывать чекбокс видимости"), elem: _div([showCheckbox])});

	if (showExpanded)
		ret.push({name: _gtxt("Разворачивать автоматически"), elem: _div([isExpanded])});

	return ret;
}

/** Показывает диалог добавления новой подгруппы
  @param div {HTMLNode} - куда добавлять новую подгруппу (группа или карта)
  @param layersTree {layersTree} - дерево главной карты
*/
var addSubGroup = function(div, layersTree)
{
	var ul = window._abstractTree.getChildsUl(div.parentNode),
		newIndex;

	if (!ul)
		newIndex = 0;
	else
		newIndex = ul.childNodes.length + 1;

	var groupVisibilityProperties = new GroupVisibilityPropertiesModel();
	var groupVisibilityPropertiesControls = new GroupVisibilityPropertiesView( groupVisibilityProperties, true, true );

	var elemProperties = (div.gmxProperties.content) ? div.gmxProperties.content.properties : div.gmxProperties.properties,
		newName = elemProperties.title,
		inputIndex = _input(null,[['attr','value', newName + ' ' + newIndex],['dir','className','inputStyle'],['css','width','140px']]),
		create = makeButton(_gtxt('Создать')),
		pos = nsGmx.Utils.getDialogPos(div, true, 100),
		createSubGroup = function()
		{
			if (inputIndex.value == '')
				return;

			var parentProperties = div.gmxProperties,
				newGroupProperties = {
					type:'group',
					content:{
						properties:{
							title:inputIndex.value,
							list: groupVisibilityProperties.get('isChildRadio'),
							visible: true,
							ShowCheckbox: groupVisibilityProperties.get('isVisibilityControl'),
							expanded: groupVisibilityProperties.get('isExpanded'),
							initExpand: groupVisibilityProperties.get('isExpanded'),
							GroupID: nsGmx.Utils.generateUniqueID()
						}, children:[]
					}
				},
				li = window._layersTree.getChildsList(newGroupProperties, parentProperties, false, div.getAttribute('MapID') ? true : window._layersTree.getLayerVisibility($(div).find('input[type="checkbox"]')[0]));

			_queryMapLayers.addDraggable(li)

			_queryMapLayers.addDroppable(li);

			_queryMapLayers.addSwappable(li);

			layersTree.addTreeElem(div, 0, newGroupProperties);

			var childsUl = window._abstractTree.getChildsUl(div.parentNode);

			if (childsUl)
			{
				window._abstractTree.addNode(div.parentNode, li);

				window._layersTree.updateListType(li, true);

				if (!childsUl.loaded)
					li.removeNode(true)
			}
			else
			{
				window._abstractTree.addNode(div.parentNode, li);

				window._layersTree.updateListType(li, true);
			}

			$(dialogDiv).dialog('destroy');
			dialogDiv.removeNode(true);

			_mapHelper.updateUnloadEvent(true);
		};

	create.onclick = createSubGroup;

	$(inputIndex).on('keyup', function(e)
	{
		if (this.value == '')
			$(this).addClass('error');
		else
			$(this).removeClass('error');

		if (e.keyCode === 13)
		{
			createSubGroup();

			return false;
		}

		return true;
	});

	create.style.marginTop = '5px';

	var parentDiv = _div([inputIndex, _br(), create],[['css','textAlign','center']]);
	var trs = [{name: _gtxt("Имя группы"), elem: inputIndex}].concat(groupVisibilityPropertiesControls);

	var trsControls = _mapHelper.createPropertiesTable(trs, elemProperties, {leftWidth: 100});
	var propsTable = _div([_table([_tbody(trsControls)],[['dir','className','propertiesTable']])]);
	_(parentDiv, [propsTable, _br(), create]);

	var dialogDiv = showDialog(_gtxt("Введите имя группы"), parentDiv, 270, 220, pos.left, pos.top);
}

var createGroupEditorProperties = function(div, isMap, mainLayersTree)
{
	var elemProperties = (isMap) ? div.gmxProperties.properties : div.gmxProperties.content.properties;

	var rawTree = mainLayersTree.treeModel.getRawTree();

	var title = _input(null,[['attr','value',typeof elemProperties.title != 'undefined' ? elemProperties.title : ''],['dir','className','inputStyle'],['css','width','206px']])

	var visibilityProperties = new GroupVisibilityPropertiesModel({
		isChildRadio: elemProperties.list,
		isVisibilityControl: typeof elemProperties.ShowCheckbox === 'undefined' ? false : elemProperties.ShowCheckbox,
		isExpanded: typeof elemProperties.initExpand === 'undefined' ? false : elemProperties.initExpand
	});
	var visibilityPropertiesView = GroupVisibilityPropertiesView(visibilityProperties, !isMap, !isMap);
	visibilityProperties.on('change', function()
	{
		elemProperties.list = visibilityProperties.get('isChildRadio');
		elemProperties.ShowCheckbox = visibilityProperties.get('isVisibilityControl');
		elemProperties.expanded = elemProperties.initExpand = visibilityProperties.get('isExpanded');

		window._layersTree.treeModel.updateNodeVisibility(mainLayersTree.findTreeElem(div).elem, null);

		var curBox = div.firstChild;
		if (!elemProperties.ShowCheckbox)
		{
			curBox.checked = true;
			curBox.style.display = 'none';
			curBox.isDummyCheckbox = true;
		}
		else
		{
			curBox.style.display = 'block';
			delete curBox.isDummyCheckbox;
		}

		if (isMap) {
			rawTree.properties = div.gmxProperties.properties;
		} else {
			mainLayersTree.findTreeElem(div).elem.content.properties = div.gmxProperties.content.properties;
		}

		var ul = window._abstractTree.getChildsUl(div.parentNode);

		$(ul).children('li').each(function()
		{
			window._layersTree.updateListType(this, true);
		})
	});

	title.onkeyup = function()
	{
		if (title.value == '')
		{
			$(title).addClass('error');

			return;
		}
		else
			$(title).removeClass('error');

		var span = $(div).find(".groupLayer")[0];

		$(span).empty();

		_(span, [_t(title.value)]);

		if (isMap)
		{
			$('.mainmap-title').text(title.value);

			div.gmxProperties.properties.title = title.value;

			rawTree.properties = div.gmxProperties.properties;
		}
		else
		{
			div.gmxProperties.content.properties.title = title.value;

			mainLayersTree.findTreeElem(div).elem.content.properties = div.gmxProperties.content.properties;
		}

		return true;
	}

	var addProperties = function(shownProperties)
	{
		return _mapHelper.createPropertiesTable(shownProperties, elemProperties, {leftWidth: 100});
	};

	if (isMap)
	{
		var useAPI = _checkbox(elemProperties.UseKosmosnimkiAPI, 'checkbox'),
			useOSM = _checkbox(elemProperties.UseOpenStreetMap, 'checkbox'),
			defLang = $('<span class="defaultMapLangContainer">' +
							'<label><input type="radio" name="defLang" value="rus">rus</label>' +
							'<label><input type="radio" name="defLang" value="eng">eng</label>' +
						'</span>')[0],
			distUnit = $('<span class="defaultMapLangContainer">' +
							'<label><input type="radio" name="distUnit" value="auto">' + _gtxt('units.auto') + '</label>' +
							'<label><input type="radio" name="distUnit" value="m">' + _gtxt('units.m') + '</label>' +
							'<label><input type="radio" name="distUnit" value="km">' + _gtxt('units.km') + '</label>' +
							'<label><input type="radio" name="distUnit" value="nm">' + _gtxt('units.nm') + '</label>' +
						'</span>')[0],
			squareUnit = $('<span class="defaultMapLangContainer">' +
							'<label><input type="radio" name="squareUnit" value="auto">' + _gtxt('units.auto') + '</label>' +
							'<label><input type="radio" name="squareUnit" value="m2">' + _gtxt('units.m2') + '</label>' +
							'<label><input type="radio" name="squareUnit" value="ha">' + _gtxt('units.ha') + '</label>' +
							'<label><input type="radio" name="squareUnit" value="km2">' + _gtxt('units.km2') + '</label>' +
						'</span>')[0],
		   coordinatesFormat = $('<span class="defaultMapLangContainer">' +
							'<label><input type="radio" name="coordinatesFormat" value="0">' + _gtxt('coords.dd') + '</label>' +
							'<label><input type="radio" name="coordinatesFormat" value="1">' + _gtxt('coords.dms') + '</label>' +
						'</span>')[0],
			maxPopupCount = $('<span class="maxPopupCountContainer">' +
							'<input type="number" min="1" class="inputStyle inputShortWidth">' +
						   '</input>' +
						   '</span>')[0],
			layerOrder = $('<select class="selectStyle">' +
							'<option value="Native">' + _gtxt('layerOrder.native') + '</label>' +
							'<option value="VectorOnTop">' + _gtxt('layerOrder.vectorOnTop') + '</label>' +
						   '</select>')[0],
			downloadVectors = _checkbox(elemProperties.CanDownloadVectors, 'checkbox'),
			downloadRasters = _checkbox(elemProperties.CanDownloadRasters, 'checkbox'),
			// WMSLink = _a([_t(_gtxt('ссылка'))], [['attr', 'href', window.serverBase + 'TileService.ashx?map=' + elemProperties.name]]),
			WMSLinks = $(Handlebars.compile(
				'<div>' +
					'<ul>' +
						'{{#each this.services}}' +
						'<li>' +
							'{{this.upper}}: {{this.url}}rest/ver1/service/{{this.name}}?map={{this.mapName}}{{#if this.site}}&apikey=[APIKEY_VALUE]{{/if}}' +
						'</li>' +
						'<br>' +
						'{{/each}}' +
					'</ul>' +
				'</div>'
			)({
				services: [{
						site: window.mapsSite,
						url: window.serverBase,
						mapName: elemProperties.MapID,
						name: 'wms',
						upper: 'WMS'
					}, {
						site: window.mapsSite,
						url: window.serverBase,
						mapName: elemProperties.MapID,
						name: 'wfs',
						upper: 'WFS'
					}]
			}))[0],
			WMSAccess = _checkbox(elemProperties.WMSAccess, 'checkbox'),
			defLat = _input(null,[['attr','placeholder', _gtxt("placeholder degrees")], ['attr','value',elemProperties.DefaultLat !== null ? elemProperties.DefaultLat : ''],['dir','className','inputStyle'],['css','width','62px']]),
			defLong = _input(null,[['attr','placeholder', _gtxt("placeholder degrees")], ['attr','value',elemProperties.DefaultLong !== null ? elemProperties.DefaultLong : ''],['dir','className','inputStyle'],['css','width','62px']]),
			defPermalink = _input(null,[['attr','value',elemProperties.ViewUrl != null ? elemProperties.ViewUrl : ''],['dir','className','inputStyle'],['css','width','206px']]),
			defZoom = _input(null,[['attr','placeholder', _gtxt("placeholder zoom")], ['attr','value',elemProperties.DefaultZoom != null ? elemProperties.DefaultZoom : ''],['dir','className','inputStyle'],['css','width','60px']]),
			onLoad = _textarea(null,[['dir','className','inputStyle group-editor-onload']]),
			copyright =  _input(null,[['attr','value',elemProperties.Copyright != null ? elemProperties.Copyright : ''],['dir','className','inputStyle'],['css','width','206px']]),
			minViewX =   _input(null,[['attr','placeholder', _gtxt("placeholder degrees")], ['attr','value',elemProperties.MinViewX != null && elemProperties.MinViewX != 0 ? elemProperties.MinViewX : ''],['dir','className','inputStyle'],['css','width','62px']]),
			minViewY =   _input(null,[['attr','placeholder', _gtxt("placeholder degrees")], ['attr','value',elemProperties.MinViewY != null && elemProperties.MinViewY != 0 ? elemProperties.MinViewY : ''],['dir','className','inputStyle'],['css','width','62px']]),
			maxViewX =   _input(null,[['attr','placeholder', _gtxt("placeholder degrees")], ['attr','value',elemProperties.MaxViewX != null && elemProperties.MaxViewX != 0 ? elemProperties.MaxViewX : ''],['dir','className','inputStyle'],['css','width','62px']]),
			maxViewY =   _input(null,[['attr','placeholder', _gtxt("placeholder degrees")], ['attr','value',elemProperties.MaxViewY != null && elemProperties.MaxViewY != 0 ? elemProperties.MaxViewY : ''],['dir','className','inputStyle'],['css','width','62px']]),
			minZoom =    _input(null,[['attr','placeholder', _gtxt("placeholder minZoom")], ['attr','value',elemProperties.MinZoom != null ? elemProperties.MinZoom : ''],['dir','className','inputStyle'],['css','width','62px']]),
			maxZoom =    _input(null,[['attr','placeholder', _gtxt("placeholder maxZoom")], ['attr','value',elemProperties.MaxZoom != null ? elemProperties.MaxZoom : ''],['dir','className','inputStyle'],['css','width','62px']]);

		onLoad.value = nsGmx.mappletLoader.get();

		useAPI.onclick = function()
		{
			div.gmxProperties.properties.UseKosmosnimkiAPI = this.checked;

			rawTree.properties = div.gmxProperties.properties;
		}

		$([useAPI, useOSM]).addClass('propertiesTable-checkbox');

		$('input[value=' + elemProperties.DefaultLanguage + ']', defLang).attr('checked', 'checked');
		$('input[value=' + elemProperties.DistanceUnit + ']', distUnit).attr('checked', 'checked');
		$('input[value=' + elemProperties.SquareUnit + ']', squareUnit).attr('checked', 'checked');
		$('input[value=' + elemProperties.coordinatesFormat + ']', coordinatesFormat).attr('checked', 'checked');
		$('input', maxPopupCount).val(elemProperties.maxPopupContent);
		$('option[value=' + (elemProperties.LayerOrder || 'Native') + ']', layerOrder).attr('selected', 'selected');

		$('input', defLang).change(function()
		{
			div.gmxProperties.properties.DefaultLanguage = this.value;
			rawTree.properties = div.gmxProperties.properties;
		})

		$('input', distUnit).change(function()
		{
			div.gmxProperties.properties.DistanceUnit = this.value;
			rawTree.properties = div.gmxProperties.properties;
			nsGmx.leafletMap.options.distanceUnit = this.value;
		})

		$('input', squareUnit).change(function()
		{
			div.gmxProperties.properties.SquareUnit = this.value;
			rawTree.properties = div.gmxProperties.properties;
			nsGmx.leafletMap.options.squareUnit = this.value;
		})

		$('input', coordinatesFormat).change(function()
		{
			var num = Number(this.value),
				locationControl = nsGmx.leafletMap.gmxControlsManager.get('location');

			if (locationControl) {
				locationControl.setCoordinatesFormat(num);
			}
			nsGmx.leafletMap.options.coordinatesFormat = num;
			div.gmxProperties.properties.coordinatesFormat = num;
		})
		$('input', maxPopupCount).change(function()
		{
			if (Number(this.value) > 0) {
				div.gmxProperties.properties.maxPopupContent = this.value;
				rawTree.properties = div.gmxProperties.properties;
				nsGmx.leafletMap.options.maxPopupCount = this.value;
			}
		})

		$(layerOrder).change(function()
		{
			div.gmxProperties.properties.LayerOrder = this.value;
			rawTree.properties = div.gmxProperties.properties;
		})

		useOSM.onclick = function()
		{
			div.gmxProperties.properties.UseOpenStreetMap = this.checked;

			rawTree.properties = div.gmxProperties.properties;
		}
		downloadVectors.onclick = function()
		{
			div.gmxProperties.properties.CanDownloadVectors = this.checked;

			rawTree.properties = div.gmxProperties.properties;
		}
		downloadRasters.onclick = function()
		{
			div.gmxProperties.properties.CanDownloadRasters = this.checked;

			rawTree.properties = div.gmxProperties.properties;
		}

		WMSAccess.onclick = function()
		{
			div.gmxProperties.properties.WMSAccess = this.checked;

			rawTree.properties = div.gmxProperties.properties;

			$(WMSLinks).toggle(this.checked);
		}

		defLat.onkeyup = function()
		{
			div.gmxProperties.properties.DefaultLat = (this.value === '' || isNaN(Number(this.value))) ? null : Number(this.value);
			rawTree.properties = div.gmxProperties.properties;
			return true;
		}

		defLong.onkeyup = function()
		{
			div.gmxProperties.properties.DefaultLong = (this.value === '' || isNaN(Number(this.value))) ? null : Number(this.value);
			rawTree.properties = div.gmxProperties.properties;
			return true;
		}

		defPermalink.onkeyup = function()
		{
			div.gmxProperties.properties.ViewUrl = this.value;

			rawTree.properties = div.gmxProperties.properties;

			return true;
		}

		defZoom.onkeyup = function()
		{
			div.gmxProperties.properties.DefaultZoom = (this.value === '' || isNaN(Number(this.value))) ? null : Number(this.value);
			rawTree.properties = div.gmxProperties.properties;
			return true;
		}

		onLoad.onkeyup = function()
		{
			nsGmx.mappletLoader.set(this.value);

			return true;
		}

		copyright.onkeyup = function()
		{
			div.gmxProperties.properties.Copyright = this.value;

			rawTree.properties = div.gmxProperties.properties;

			return true;
		}

		minViewX.onkeyup = function()
		{
			if (!isNaN(Number(this.value)))
			{
				div.gmxProperties.properties.MinViewX = Number(this.value);

				rawTree.properties = div.gmxProperties.properties;
			}

			return true;
		}

		minViewY.onkeyup = function()
		{
			if (!isNaN(Number(this.value)))
			{
				div.gmxProperties.properties.MinViewY = Number(this.value);

				rawTree.properties = div.gmxProperties.properties;
			}

			return true;
		}

		maxViewX.onkeyup = function()
		{
			if (!isNaN(Number(this.value)))
			{
				div.gmxProperties.properties.MaxViewX = Number(this.value);

				rawTree.properties = div.gmxProperties.properties;
			}

			return true;
		}

		maxViewY.onkeyup = function()
		{
			if (!isNaN(Number(this.value)))
			{
				div.gmxProperties.properties.MaxViewY = Number(this.value);

				rawTree.properties = div.gmxProperties.properties;
			}

			return true;
		}

		minZoom.onkeyup = function()
		{
			if (!isNaN(Number(this.value)))
			{
				div.gmxProperties.properties.MinZoom = Number(this.value) || null;

				rawTree.properties = div.gmxProperties.properties;
			}

			return true;
		}

		maxZoom.onkeyup = function()
		{
			if (!isNaN(Number(this.value)))
			{
				div.gmxProperties.properties.MaxZoom = Number(this.value) || null;

				rawTree.properties = div.gmxProperties.properties;
			}

			return true;
		}

		WMSAccess.style.verticalAlign = "middle";
		$(WMSLinks).toggle(elemProperties.WMSAccess);

		var shownCommonProperties = [
										{name: _gtxt("Имя"), field: 'title', elem: title},
										{name: _gtxt("ID"), field: 'name'},
										{name: _gtxt("Копирайт"), field: 'Copyright', elem: copyright}
									]
									.concat(
										[{name: _gtxt("Использовать KosmosnimkiAPI"), elem: useAPI},
										{name: _gtxt("Язык по умолчанию"), elem: defLang},
										{name: _gtxt("Единицы длины"), elem: distUnit},
										{name: _gtxt("Единицы площади"), elem: squareUnit},
										{name: _gtxt("Формат координат"), elem: coordinatesFormat},
										{name: _gtxt("Количество информационных окошек"), elem: maxPopupCount},
										{name: _gtxt("layerOrder.title"), elem: layerOrder},
										{name: _gtxt("Ссылка (permalink)"), elem: defPermalink}]
									),
			shownPolicyProperties = [
										{name: _gtxt("Разрешить скачивание"), elem: _table([_tbody([_tr([_td([_t(_gtxt('Векторных слоев'))],[['css','width','100px'],['css','height','20px'],['css','paddingLeft','3px']]), _td([downloadVectors])]),
																									_tr([_td([_t(_gtxt('Растровых слоев'))],[['css','width','100px'],['css','height','20px'],['css','paddingLeft','3px']]), _td([downloadRasters])])])])},
										{name: _gtxt("WMS доступ"), elem: _div([WMSAccess/*, WMSLinks*/])}
									],
			shownViewProperties = [
				{
					name: _gtxt("Начальная позиция"),
					elem: _table([_tbody([_tr([
									_td([_span([_t(_gtxt('Широта'))],[['css','marginLeft','3px']]), _br(), defLat],[['css','width','70px']]),
									_td([_span([_t(_gtxt('Долгота'))],[['css','marginLeft','3px']]), _br(), defLong],[['css','width','70px']]),
									_td([_span([_t(_gtxt('Зум'))],[['css','marginLeft','3px']]), _br(), defZoom],[['css','width','68px']])
								])])],[['css', 'borderCollapse', 'collapse']])
				}, {
					name: _gtxt("Зум"),
					elem: _table([_tbody([_tr([
									_td([_span([_t(_gtxt('Мин'))],[['css','marginLeft','3px']]), _br(), minZoom],[['css','width','70px']]),
									_td([_span([_t(_gtxt('Макс'))],[['css','marginLeft','3px']]), _br(), maxZoom],[['css','width','70px'], ['css','rowspan','2']])
								])])],[['css', 'borderCollapse', 'collapse']])
				}, {
					name: _gtxt("Граница обрезки"),
					elem:_table([_tbody([
								_tr([
									_td([_span(null, [['css','marginLeft','3px']]), _br()],[['css','width','73px']]),
									_td([_span([_t(_gtxt('Широта'))],[['css','marginLeft','3px']])],[['css','width','70px']]),
									_td([_span([_t(_gtxt('Долгота'))],[['css','marginLeft','3px']])],[['css','width','68px']])]),
								_tr([
									_td([_span([_t(_gtxt('Мин'))],[['css','marginLeft','3px']])]),
									_td([minViewY]),
									_td([minViewX])]),
								_tr([
									_td([_span([_t(_gtxt('Макс'))],[['css','marginLeft','3px']])]),
									_td([maxViewY]),
									_td([maxViewX])])
							])],[['css', 'borderCollapse', 'collapse']])
				}];

		var id = 'mapProperties' + String(Math.random()).substring(2, 12),
			tabMenu = _div([_ul([_li([_a([_t(_gtxt("Общие"))],[['attr','href','#common' + id]])]),
								 _li([_a([_t(_gtxt("Подложки"))],[['attr','href','#baselayers' + id]])]),
								 _li([_a([_t(_gtxt("Доступ"))],[['attr','href','#policy' + id]])]),
								 _li([_a([_t(_gtxt("Поиск"))],[['attr','href','#search' + id]])]),
								 _li([_a([_t(_gtxt("Окно карты"))],[['attr','href','#view' + id]])]),
								 _li([_a([_t(_gtxt("Загрузка"))],[['attr','href','#onload' + id]])]),
								 _li([_a([_t(_gtxt("Плагины"))],[['attr','href','#plugins' + id]])])])]),
			divCommon     = _div(null,[['attr','id','common' + id],['css','width','320px']]),
			divBaseLayers = _div(null,[['attr','id','baselayers' + id],['dir','className','group-editor-tab-container'],['css','overflowY','auto']]),
			divPolicy     = _div(null,[['attr','id','policy' + id],['css','width','320px']]),
			divSearch     = _div(null,[['attr','id','search' + id],['dir','className','group-editor-tab-container']]),
			divView       = _div(null,[['attr','id','view' + id],['css','width','320px']]),
			divOnload     = _div(null,[['attr','id','onload' + id],['dir','className','group-editor-tab-container']]),
			divPlugins    = _div(null,[['attr','id','plugins' + id],['dir','className','group-editor-tab-container']]);

		_(tabMenu, [divCommon, divBaseLayers, divPolicy, divSearch, divView, divOnload, divPlugins]);

		new BaseLayersControl(divBaseLayers, nsGmx.leafletMap.gmxBaseLayersManager);

		_(divCommon, [_table([_tbody(addProperties(shownCommonProperties))],[['css','width','100%'], ['dir','className','propertiesTable']])]);
		_(divPolicy, [_table([_tbody(addProperties(shownPolicyProperties))],[['css','width','100%'], ['dir','className','propertiesTable']]), WMSLinks]);
		_(divView,   [_table([_tbody(addProperties(shownViewProperties))],  [['css','width','100%'], ['dir','className','propertiesTable']])]);
		_(divOnload, [onLoad]);

		var pluginsEditor = nsGmx.createPluginsEditor(divPlugins, _mapHelper.mapPlugins);

		var mapLayersTree = new window.layersTree({
			showVisibilityCheckbox: false,
			allowActive: false,
			allowDblClick: false,
			showStyle: false,
			visibilityFunc: function(props, isVisible) {
				var origTreeNode = mainLayersTree.treeModel.findElem('LayerID', props.LayerID).elem;
				origTreeNode.content.properties.AllowSearch = isVisible;
			}
		});

		//формируем новое дерево - без не-векторных слоёв и пустых папок,
		//в котором видимость слоя отражает возможность его скачивания
		var searchRawTree = mainLayersTree.treeModel.cloneRawTree(function(node) {
			if (node.type === 'layer') {
				var props = node.content.properties;
				if (props.type !== 'Vector') {
					return null;
				}

				props.visible = !!props.AllowSearch;

				return node;
			}

			if (node.type === 'group') {
				var children = node.content.children;
				if (!children.length) {
					return null;
				}

				var isVisible = false;
				for (var i = 0; i < children.length; i++) {
					isVisible = isVisible || children[i].content.properties.visible;
				}

				node.content.properties.visible = isVisible;
				return node;
			}
		});

		var mapLayersDOM = mapLayersTree.drawTree(searchRawTree, 2);
		$('<div class="group-editor-search-title"/>').text(_gtxt('Выберите слои для поиска по атрибутам')).appendTo(divSearch);
		$(mapLayersDOM).treeview().appendTo(divSearch);

		tabMenu.updateFunc = function() {
			var props = div.gmxProperties.properties;
			props.UseKosmosnimkiAPI = useAPI.checked;
			props.UseOpenStreetMap = useOSM.checked;
			props.CanDownloadVectors = downloadVectors.checked;
			props.CanDownloadRasters = downloadRasters.checked;
			props.WMSAccess = WMSAccess.checked;

			props.DefaultLat = (isNaN(Number(defLat.value)) || defLat.value === '') ? null : Number(defLat.value);
			props.DefaultLong = (isNaN(Number(defLong.value)) || defLong.value === '') ? null : Number(defLong.value);

			props.ViewUrl = defPermalink.checked;

			props.DefaultZoom = (isNaN(Number(defZoom.value)) || defZoom.value === '') ? null : Number(defZoom.value);

			props.onLoad = onLoad.value;
			props.Copyright = copyright.value;

			props.MinViewX = isNaN(Number(minViewX.value)) ? null : Number(minViewX.value);
			props.MinViewY = isNaN(Number(minViewY.value)) ? null : Number(minViewY.value);
			props.MaxViewX = isNaN(Number(maxViewX.value)) ? null : Number(maxViewX.value);
			props.MaxViewY = isNaN(Number(maxViewY.value)) ? null : Number(maxViewY.value);
			props.MaxZoom  = isNaN(Number(maxZoom.value))  ? null : (Number(maxZoom.value) || null);
			props.MinZoom  = isNaN(Number(minZoom.value))  ? null : (Number(minZoom.value) || null);

			rawTree.properties = props;

			pluginsEditor.update();
		}

		tabMenu.closeFunc = function() {
			pluginsEditor.closeParamsDialogs();
		}

		return tabMenu;
	}
	else
	{
		var shownProperties = [
			{name: _gtxt("Имя"), field: 'title', elem: title},
			{name: _gtxt("ID"), field: 'GroupID'}
		].concat(visibilityPropertiesView);

		return _div([_table([_tbody(addProperties(shownProperties))],[['css','width','100%']])],[['css','width','320px'], ['dir','className','propertiesTable']]);
	}
}

var _groupEditorsHash = {};

/** Создаёт диалог редактирование свойств группы. Есть проверка на создание дублирующих диалогов
 @param div {HTMLHNode} - элемент дерева, соответствующий редактируемой группе
*/
var createGroupEditor = function(div)
{
	var elemProperties = div.gmxProperties.content.properties

	if (_groupEditorsHash[elemProperties.GroupID])
		return;

	var pos = nsGmx.Utils.getDialogPos(div, true, 140),
		closeFunc = function()
		{
			delete _groupEditorsHash[elemProperties.GroupID];

			return false;
		};

	var canvas = createGroupEditorProperties(div, false, window._layersTree);
	showDialog(_gtxt('Группа [value0]', elemProperties.title), canvas, 340, 230, pos.left, pos.top, null, closeFunc);
	_groupEditorsHash[elemProperties.GroupID] = true;

	canvas.parentNode.style.width = canvas.clientWidth + 'px';
}

window._mapEditorsHash = {};

/** Создаёт диалог редактирование свойств группы. Есть проверка на создание дублирующих диалогов
 @param div {HTMLHNode} - элемент дерева, соответствующий редактируемой карте
*/
var createMapEditor = function(div, activePage)
{
	var elemProperties = div.gmxProperties.properties;

	if (window._mapEditorsHash[elemProperties.MapID])
		return;

	var pos = nsGmx.Utils.getDialogPos(div, true, 530),
		closeFunc = function()
		{
			delete window._mapEditorsHash[elemProperties.MapID];
			canvas.updateFunc();
			canvas.closeFunc();
			return false;
		};

	var canvas = createGroupEditorProperties(div, true, window._layersTree);
	showDialog(_gtxt('Карта [value0]', elemProperties.title), canvas, 450, 410, pos.left, pos.top, null, closeFunc);
	window._mapEditorsHash[elemProperties.MapID] = {
		update: canvas.updateFunc
	};

	$(canvas).tabs({active: activePage || 0});

	canvas.parentNode.style.width = canvas.clientWidth + 'px';
}

window.gmxCore.addModule('GroupEditor', {
	addSubGroup: addSubGroup,
	createGroupEditor: createGroupEditor,
	createMapEditor: createMapEditor
})

})(nsGmx.Utils._);
