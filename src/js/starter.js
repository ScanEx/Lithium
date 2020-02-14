﻿import '../css/scroll.css';
import '../css/print.css';
import '../css/search.css';
import '../css/menu.css';
import '../css/buttons.css';
import '../css/treeview.css';
import '../css/drawing.css';
import '../css/layerstylesmenu.css';
import '../css/swich-slider.css';
import '../css/adapter.css';
import '../css/sidebar.css';
import '../css/leafletGmx.css';

import nsGmx from './nsGmx.js';

import './lang_ru.js';
import './lang_en.js';
import {leftMenu, _menuUp} from './menu.js';
import './gmxcore.js';
import {translationsHash} from './translations.js';
import './VirtualLayerManager.js';
import './PluginsManager.js';
import {mapHelp, _mapHelper} from './mapHelper.js';
import './AuthManager.js';
import {
    addParseResponseHook,
    _,
    _div,
    createCookie,
    readCookie,
    eraseCookie,
    getWindowHeight,
    getWindowWidth,
    removeDialog,
    showDialog,
    showErrorMessage
} from './utilities.js';
import './userObjects.js';
import './HeaderWidget/HeaderWidget.js'
import './LanguageWidget/languageWidget.js';
import './GmxIconLayers/gmxIconLayers.js';
import './CommonCalendarWidget/CommonCalendarWidget.js';
import './mapLayers.js';
import './AuthWidget/AuthWidget.js';
import './AuthWidget.js';
import './version.js';
import {DrawingObjectGeomixer} from './drawingObjects.js';
import IconSidebarWidget from './IconSidebarControl/src/IconSidebarWidget.js';
import './contextMenuController.js';
import './LayersTree.js';
import './SearchLogic/SearchLogic.js';
import './SearchLogic/SearchProviders.js';
import {drawingObjects} from './queryLoadShp.js';
import {loadServerData} from './loadServerData.js';
import addServiceTo from './wmfs.js';
import './HeaderLinksControl.js';
import './TransparencySliderWidget/TransparencySliderWidget.js';
import 'leaflet-ext-search/dist/main.css';
import {SearchControl} from 'leaflet-ext-search';
import './gmxLayers2/gmxLayers2.js';
import 'gmx-plugin-media';
import './EditObjectControl/EditObjectControl.js';
import _queryTabs from './queryTabs.js';
import './ProfilePlugin/ProfilePlugin.js';
import './LayerProperties.js';
import './LayerEditor.js';
import nsMapCommon from './mapCommon.js';
import './AttributeValuesProviders.js';
import {_queryLoadShp} from './queryLoadShp.js';
import './colorpicker/js/colorpicker.js';
import './GridPlugin/GridPlugin.js';
import './MapExport/MapExport.js';
import './BufferZones/BufferZones.js';
import './IndexGrid/IndexGrid.js';
import './PhotoLayer/PhotoLayer.js';
import './UserGroupWidget/UserGroupWidget.js';
import './Leaflet.Dialog/Leaflet.Dialog.js';

//Тут кратко описываются разные внешние классы для системы генерации документации

/** ГеоМиксер активно использует {@link http://jquery.com/|jQuery}
 * @namespace jQuery
 */

/** Официальная документация: {@link http://api.jquery.com/category/deferred-object/|jQuery Deferred}
 * @name Deferred
 * @memberOf jQuery
 */


/** Библиотека для формализации понятия модели и представления: {@link http://backbonejs.org/|Backbone}
 * @namespace Backbone
 */

/** Официальная документация: {@link http://backbonejs.org/#Model| Backbone Model}
 * @name Model
 * @memberOf Backbone
 */


/**
    Основное пространство имён ГеоМиксера
    @namespace
*/
nsGmx.widgets = nsGmx.widgets || {};

// var gmxJSHost = window.gmxJSHost || '';

if (!window.mapHostName && window.gmxJSHost) {
    window.mapHostName = /https?:\/\/(.*)\/api\//.exec(window.gmxJSHost)[1];
}

var _mapHostName; //откуда грузить API
var protocol = window.location.protocol;

if (window.mapHostName) {
    _mapHostName = protocol + '//' + window.mapHostName + '/api/';
} else {
    var curUri = L.gmxUtil.parseUri(window.location.href);
    _mapHostName = protocol + '//' + curUri.host + curUri.directory;
}

var _serverBase = window.serverBase || new RegExp('(.*)/[^/]*/').exec(_mapHostName)[1] + '/';

// //подставляет к локальному имени файла хост (window.gmxJSHost) и, опционально, рандомное поле для сброса кэша (window.gmxDropBrowserCache)
// var _getFileName = function(localName) {
//     return gmxJSHost + localName + (window.gmxDropBrowserCache ? '?' + Math.random() : '');
// }

nsGmx.initGeoMixer = function() {

    var oSearchLeftMenu = new leftMenu();
    window.searchLogic = new nsGmx.SearchLogic();

    //для синхронизации меню и тулбара при включении/выключении сетки координат
    nsGmx.gridManager = {
        state: false,
        gridControl: null,
        options: null,
        menu: null,

        setState: function(state) {
            var isActive = state.isActive,
                options = state.options;

            if (this.state == isActive) {
                return;
            }

            //lazy instantantion
            this.gridControl = this.gridControl || new L.GmxGrid();
            nsGmx.leafletMap[isActive ? 'addLayer' : 'removeLayer'](this.gridControl);
            if (options) {
                this.restoreOptions(options);
            }
            this.state = isActive;
            nsGmx.leafletMap.gmxControlIconManager.get('gridTool').setActive(isActive);
            _menuUp.checkItem('mapGrid', isActive);
            _mapHelper.gridView = isActive; //можно удалить?

            if (this.state) {
                this.configureGrid();
            }
            else if (this.menu) {
                this.menu.Unload();
            }            
        },

        saveOptions: function() {
            this.options = this.gridControl.options;
        },

        restoreOptions: function(options) {
            this.gridControl.setUnits(options.units);
            if (options.customStep) {
                this.gridControl.setStep(options.customStep.x, options.customStep.y);
            }
            this.gridControl.setColor(options.color);
            this.gridControl.setTitleFormat(options.titleFormat);
        },

        configureGrid: function() {
            var _this = this;
            window.gmxCore.loadModule('GridPlugin'
            // , 'src/GridPlugin.js'
            ).then(function(def) {
                _this.menu = new def.ConfigureGridMenu(nsGmx.gridManager);
                _this.menu.Load();
            });
        }
    }

    var createMenuNew = function() {
        //формирует описание элемента меню для включения/выключения плагина
        var getPluginToMenuBinding = function(pluginName, menuItemName, menuTitle) {
            var plugin = nsGmx.pluginsManager.getPluginByName(pluginName);

            if (!plugin) {
                return null;
            }

            var sel = function() {
                nsGmx.pluginsManager.setUsePlugin(pluginName, true);
                nsGmx.pluginsManager.done(function() {
                    var paramsClone = $.extend(true, {}, plugin.params);
                    plugin.body.afterViewer && plugin.body.afterViewer(paramsClone, nsGmx.leafletMap);
                    _mapHelper.mapPlugins.addPlugin(pluginName, plugin.params);
                })
            }

            var unsel = function() {
                nsGmx.pluginsManager.setUsePlugin(pluginName, false);
                nsGmx.pluginsManager.done(function() {
                    _mapHelper.mapPlugins.remove(pluginName);
                    plugin.body.unload && plugin.body.unload();
                })
            }

            return {
                id: menuItemName,
                title: menuTitle,
                onsel: sel,
                onunsel: unsel,
                checked: plugin.isUsed()
            }
        }

        var isMapEditor = _queryMapLayers.currentMapRights() === 'edit',
            isLogined = nsGmx.AuthManager.isLogin();

        _menuUp.submenus = [];

        _menuUp.addItem({
            id: 'mapsMenu',
            title: _gtxt('Карта'),
            childs: [].concat(
                isLogined ? [{ id: 'mapList', title: _gtxt('Открыть'), func: function() { _queryMapLayers.getMaps() } }] : [], [{
                        id: 'mapCreate',
                        title: _gtxt('Создать'),
                        func: function() {
                            _queryMapLayers.createMapDialog(_gtxt('Создать карту'), _gtxt('Создать'), _queryMapLayers.createMap)
                        }
                    },
                    { id: 'mapSave', title: _gtxt('Сохранить'), func: _queryMapLayers.saveMap },
                    {
                        id: 'mapSaveAs',
                        title: _gtxt('Сохранить как'),
                        func: function() {
                            _queryMapLayers.createMapDialog(_gtxt('Сохранить карту как'), _gtxt('Сохранить'), _queryMapLayers.saveMapAs)
                        },
                        delimiter: true
                    },
                    {
                        id: 'export',
                        title: _gtxt('Экспорт'),
                        func: function() {
                            mapExportMenu();
                        },
                        disabled: !isLogined
                    },
                    { id: 'shareMenu', title: _gtxt('Поделиться'), func: function() { _mapHelper.showPermalink() } },
                    // {id: 'codeMap',      title: _gtxt('Код для вставки'),   func: function(){_mapHelper.createAPIMapDialog()}, disabled: true},
                    {
                        id: 'mapTabsNew',
                        title: _gtxt('Добавить закладку'),
                        func: function() {
                            mapHelp.tabs.load('mapTabs');
                            _queryTabs.add();
                        }
                    },
                    { id: 'printMap', title: _gtxt('Печать'), func: function() { _mapHelper.print() }, delimiter: true },
                    {
                        id: 'mapProperties',
                        title: _gtxt('Свойства'),
                        func: function() {
                            var div = $(_layersTree._treeCanvas).find('div[MapID]')[0];
                            nsGmx.createMapEditor(div);
                        },
                        disabled: !isMapEditor
                    },
                    {
                        id: 'createGroup',
                        title: _gtxt('Добавить подгруппу'),
                        func: function() {
                            var div = $(_layersTree._treeCanvas).find('div[MapID]')[0];
                            nsGmx.addSubGroup(div, _layersTree);
                        },
                        disabled: !isMapEditor
                    },
                    {
                        id: 'mapSecurity',
                        title: _gtxt('Права доступа'),
                        func: function() {
                            var securityDialog = new nsGmx.mapSecurity(),
                                props = _layersTree.treeModel.getMapProperties();
                            securityDialog.getRights(props.MapID, props.title);
                        },
                        disabled: !isMapEditor
                    }
                ]
            )
        });

        _menuUp.addItem({
            id: 'dataMenu',
            title: _gtxt('Данные'),
            childs: [
                { id: 'layerList', title: _gtxt('Открыть слой'), func: function() { _queryMapLayers.getLayers() }, disabled: !isMapEditor },
                {
                    id: 'createLayer',
                    title: _gtxt('Создать слой'),
                    childs: [
                        { id: 'createRasterLayer', title: _gtxt('Растровый'), func: _mapHelper.createNewLayer.bind(_mapHelper, 'Raster'), disabled: !isMapEditor },
                        { id: 'createVectorLayer', title: _gtxt('Векторный'), func: _mapHelper.createNewLayer.bind(_mapHelper, 'Vector'), disabled: !isMapEditor },
                        { id: 'createMultiLayer', title: _gtxt('Мультислой'), func: _mapHelper.createNewLayer.bind(_mapHelper, 'Multi'), disabled: !isMapEditor },
                        { id:'createVirtualLayer', title: 'Виртуальный', func: function() {

                            window.gmxCore.loadModule('LayerEditor').then(function() {
                                nsGmx.LayerEditor.addInitHook(function(layerEditor, layerProperties, params) {
                                    if (layerProperties.get('Type') !== 'Virtual') {
                                        return;
                                    }

                                    $(layerEditor).on('premodify', function() {
                                        layerProperties.set('ContentID', ui.find('.vlayer-contentid').val());
                                    });

                                    var template = Handlebars.compile('<div type="vlayer-container">' +
                                        '<span class="vlayer-label">Тип слоя</span>' +
                                        '<input class="vlayer-contentid inputStyle" value="{{ContentID}}">' +
                                    '</div>');

                                    var ui = $(template({ContentID: layerProperties.get('ContentID')}));

                                    params.additionalUI = params.additionalUI || {};
                                    params.additionalUI.main = params.additionalUI.advanced || [];
                                    params.additionalUI.main.push(ui);
                                });

                                var parent = _div(null, [['attr','id','newVirtualLayer'], ['css', 'height', '100%']]),
                                    properties = {Title:'', Description: '', Date: ''};

                                var dialogDiv = showDialog('Создать виртуальный слой', parent, 340, 340, false, false);

                                nsGmx.createLayerEditor(false, 'Virtual', parent, properties, {
                                    doneCallback: function() {
                                        removeDialog(dialogDiv);
                                    }
                                });
                            });

                            }, disabled: !isMapEditor
                        }
                    ],
                    disabled: !isMapEditor
                },
                {
                    id: 'baseLayers',
                    title: _gtxt('Базовые слои'),
                    func: function() {
                        var div = $(_layersTree._treeCanvas).find('div[MapID]')[0];
                        nsGmx.createMapEditor(div, 1);
                    },
                    delimiter: true,
                    disabled: !isMapEditor
                },
                { id: 'loadFile', title: _gtxt('Загрузить объекты'), func: drawingObjects.loadShp.load, delimiter: true },
                { id: 'loadPhotos', title: _gtxt('Загрузить фотографии'), func: function() { PhotoLayerDialog() }, delimiter: true, disabled: !isMapEditor },
                { id: 'wms', title: _gtxt('Подключить WMS'), func: loadServerData.WMS.load },
                { id: 'wfs', title: _gtxt('Подключить WFS'), func: loadServerData.WFS.load },
                { id: 'wmfs', title: _gtxt('Подключить WFS/WMS'), func: addServiceTo },
            ]
        });

        _menuUp.addItem({
            id: 'viewMenu',
            title: _gtxt('Вид'),
            childs: [
                { id: 'externalMaps', title: _gtxt('Дополнительные карты'), func: mapHelp.externalMaps.load },
                { id: 'mapTabs', title: _gtxt('Закладки'), func: mapHelp.tabs.load },
                { id: 'DrawingObjects', title: _gtxt('Объекты'), func: window.oDrawingObjectGeomixer.Load }
                // {id:'searchView',     title: _gtxt('Результаты поиска'),    func: oSearchControl.Load}
            ]
        });

        _menuUp.addItem({
            id: 'instrumentsMenu',
            title: _gtxt('Инструменты'),
            childs: [{
                    id: 'mapGrid',
                    title: _gtxt('Координатная сетка'),
                    onsel: nsGmx.gridManager.setState.bind(nsGmx.gridManager, { isActive: true }),
                    onunsel: nsGmx.gridManager.setState.bind(nsGmx.gridManager, { isActive: false }),
                    checked: _mapHelper.gridView
                },
                {
                    id: 'mapIndexGrid',
                    title: _gtxt('Индексная сетка'),
                    func: function() {
                        indexGridMenu();
                    }
                },
                {
                    id: 'buffer',
                    title: _gtxt('Создание буферных зон'),
                    func: function() {
                        BufferZonesMenu();
                    },
                    disabled: !isLogined
                },
                { id: 'shift', title: _gtxt('Ручная привязка растров'), func: function() {}, disabled: true },
                { id: 'crowdsourcing', title: _gtxt('Краудсорсинг данных'), func: function() {}, disabled: true },
                { id: 'geocoding', title: _gtxt('Пакетный геокодинг'), func: function() {}, disabled: true },
                { id: 'directions', title: _gtxt('Маршруты'), func: function() {}, disabled: true }
            ]
        });


        function fillPluginsMenu() {
            var plugins = window.menuPlugins || [];

            // для локальной версии Геомиксера покажем плагины кадастра и Викимапии
            if (!window.menuPlugins) {
                if (nsGmx.pluginsManager.getPluginByName('Cadastre')) {
                    plugins.push({ pluginName: 'Cadastre', menuItemName: 'cadastre', menuTitle: 'Кадастр Росреестра' });
                }
            }

            if (plugins.length) {
                var childs = [];
                for (var p = 0; p < plugins.length; p++) {
                    childs.push(
                        getPluginToMenuBinding(
                            plugins[p].pluginName,
                            plugins[p].menuItemName,
                            window._gtxt(plugins[p].menuTitle)
                        )
                    )
                }

                _menuUp.addItem({ id: 'pluginsMenu', title: _gtxt('Сервисы'), childs: childs });
            }
        }
        fillPluginsMenu();

        _menuUp.addItem({
            id: 'helpMenu',
            title: _gtxt('Справка'),
            childs: nsGmx.gmxMap.properties.MapID !== '31RJS' ? [
                { id: 'about', title: _gtxt('О проекте'), func: _mapHelper.version },
            ].concat(window.mapsSite ? [{
                    id: 'usage',
                    title: _gtxt('Руководство пользователя'),
                    func: function() {
                        window.open('http://geomixer.ru/index.php/docs/', '_blank');
                    }
                },
                {
                    id: 'api',
                    title: _gtxt('GeoMixer API'),
                    func: function() {
                        window.open('https://geomixer.ru/docs/dev-manual/rest-api/get-started/', '_blank');
                    }
                },
                {
                    id: 'pluginsUsage',
                    title: _gtxt('Использование плагинов'),
                    func: function() {
                        window.open('http://geomixer.ru/index.php/docs/manual/plugins', '_blank');
                    }
                }
            ] : []) : [{
                    id: 'usage',
                    title: _gtxt('Руководство'),
                    func: function() {
                        window.open(window.location.protocol + '//kosmosnimki.ru/downloads/%D1%86%D1%81%D0%BC%D1%81.pdf', '_blank');
                    }
                }]
        });
    }

    var createToolbar = function() {
        var lmap = nsGmx.leafletMap;

        var SliderControl = L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: function() {
                var sliderContainer = $('<div class="gmx-slider-control"></div>');
                this._widget = new nsGmx.TransparencySliderWidget(sliderContainer);

                $(this._widget).on('slide slidechange', function(event, ui) {
                    _queryMapLayers.applyOpacityToRasterLayers(ui.value * 100, _queryMapLayers.buildedTree);
                })

                return sliderContainer[0];
            },
            onRemove: function() {},
            isCollapsed: function() { return this._widget.isCollapsed(); }
        });
        var sliderControl = new SliderControl();
        lmap.addControl(sliderControl);

        //пополняем тулбар
        var uploadFileIcon = L.control.gmxIcon({
            id: 'uploadFile',
            title: _gtxt('Загрузить объекты')
        }).on('click', drawingObjects.loadShp.load.bind(drawingObjects.loadShp));

        lmap.gmxControlIconManager.get('drawing').addIcon(uploadFileIcon);

        // выпадающие группы иконок наезжают на слайдер прозрачности.
        // Эта ф-ция разруливает этот конфликт, скрывая слайдер в нужный момент
        var resolveToolConflict = function(iconGroup) {
            iconGroup
                .on('collapse', function() {
                    $('.gmx-slider-control').removeClass('invisible');
                }).on('expand', function() {
                    sliderControl.isCollapsed() || $('.gmx-slider-control').addClass('invisible');
                });
        }

        if (_queryMapLayers.currentMapRights() === 'edit') {

            let saveMapIcon = L.control.gmxIcon({
                    id: 'saveMap',
                    title: _gtxt('Сохранить карту'),
                    addBefore: 'drawing'
                });
            saveMapIcon.addTo(lmap);
            saveMapIcon.on('click', _queryMapLayers.saveMap.bind(_queryMapLayers));

            //группа создания слоёв
            let createVectorLayerIcon = L.control.gmxIcon({
                id: 'createVectorLayer',
                title: _gtxt('Создать векторный слой'),
                addBefore: 'drawing'
            });
            createVectorLayerIcon.on('click', function() {
                _mapHelper.createNewLayer('Vector');
                createVectorLayerIcon.setActive(true);
                createRasterLayerIcon.setActive(false);
            });

            var createRasterLayerIcon = L.control.gmxIcon({
                id: 'createRasterLayer',
                title: _gtxt('Создать растровый слой'),
                addBefore: 'drawing'
            });
            createRasterLayerIcon.on('click', function() {
                _mapHelper.createNewLayer('Raster');
                createRasterLayerIcon.setActive(true);
                createVectorLayerIcon.setActive(false);
            });

            var createLayerIconGroup = L.control.gmxIconGroup({
                id: 'createLayer',
                isSortable: true,
                //isCollapsible: false,
                items: [createVectorLayerIcon, createRasterLayerIcon],
                addBefore: 'drawing'
            });
            createLayerIconGroup.addTo(lmap);

            var bookmarkIcon = L.control.gmxIcon({
                id: 'bookmark',
                title: _gtxt('Добавить закладку'),
                addBefore: 'drawing'
            });
            bookmarkIcon.on('click', function() {
                mapHelp.tabs.load('mapTabs');
                _queryTabs.add();
            });
            bookmarkIcon.addTo(lmap);

            resolveToolConflict(createLayerIconGroup);
        } else {
            resolveToolConflict(lmap.gmxControlIconManager.get('drawing'));
        }

        var printIcon = L.control.gmxIcon({
            id: 'gmxprint',
            title: _gtxt('Печать'),
            addBefore: 'drawing'
        });
        printIcon.addTo(lmap);
        printIcon.on('click', _mapHelper.print.bind(_mapHelper));

        var permalinkIcon = L.control.gmxIcon({
            id: 'permalink',
            title: _gtxt('Ссылка на карту'),
            addBefore: 'drawing'
        });
        permalinkIcon.addTo(lmap);
        permalinkIcon.on('click', _mapHelper.showPermalink.bind(_mapHelper));

        if (window.mapsSite) {
            var shareIconControl = new nsGmx.ShareIconControl({
                className: 'shareIcon',
                id: 'share',
                text: 'Share',
                style: {
                    width: 'auto'
                },
                togglable: true,
                permalinkManager: {
                    save: function() {
                        return $.when(
                            _mapHelper.createPermalink(),
                            nsMapCommon.generateWinniePermalink()
                        )
                    }
                },
                permalinkUrlTemplate: '{{href}}?permalink={{permalinkId}}',
                embeddedUrlTemplate: window.location.protocol + '//winnie.kosmosnimki.ru/2.0/?config={{winnieId}}',
                winnieUrlTemplate: window.location.protocol + '//winnie.kosmosnimki.ru/2.0/?config={{winnieId}}&edit=1',
                previewUrlTemplate: 'iframePreview.html?width={{width}}&height={{height}}&permalinkUrl={{{embeddedUrl}}}'
            });
            lmap.addControl(shareIconControl);
        }

        var gridIcon = L.control.gmxIcon({
                id: 'gridTool',
                title: _gtxt('Координатная сетка'),
                togglable: true,
                addBefore: 'drawing'
            });
        gridIcon.addTo(lmap);
        gridIcon.on('click', function() {
            var state = { isActive: gridIcon.options.isActive };
            nsGmx.gridManager.setState(state);
        });

        _mapHelper.customParamsManager.addProvider({
            name: 'GridManager',
            loadState: function(state) {
                nsGmx.gridManager.setState(state);
            },
            saveState: function() {
                return {
                    version: '1.0.0',
                    isActive: gridIcon.options.isActive,
                    options: nsGmx.gridManager.options
                }
            }
        });

        lmap.addControl(L.control.gmxIcon({
            id: 'boxzoom-dashed-rounded',
            toggle: true,
            addBefore: 'drawing',
            title: 'Увеличение',
            onAdd: function(control) {
                var map = control._map,
                    _onMouseDown = map.boxZoom._onMouseDown;
                map.boxZoom._onMouseDown = function(e) {
                    _onMouseDown.call(map.boxZoom, {
                        clientX: e.clientX,
                        clientY: e.clientY,
                        which: 1,
                        shiftKey: true
                    });
                };
                map.on('boxzoomend', function() {
                    map.dragging.enable();
                    map.boxZoom.removeHooks();
                    control.setActive(false);
                });
            },
            stateChange: function(control) {
                var map = control._map;
                if (control.options.isActive) {
                    map.dragging.disable();
                    map.boxZoom.addHooks();
                } else {
                    map.dragging.enable();
                    map.boxZoom.removeHooks();
                }
            }
        }));

        /**
         * seachParams
         */

            var osmProvider = new nsGmx.searchProviders.Osm2DataProvider({
                showOnMap: true,
                serverBase: '//maps.kosmosnimki.ru',
                limit: 10
            });

            var searchProviders = [];
            searchProviders.push(osmProvider);

            osmProvider.addEventListener('fetch', function (e) {
                window.searchLogic.showResult(e.detail);
            })

        window.searchControl = new SearchControl({
            id: 'searchcontrol',
            placeHolder: 'Поиск по векторным слоям и адресной базе',
            position: 'topright',
            limit: 10,
            retrieveManyOnEnter: true,
            providers: searchProviders,
            style: {
                editable: false,
                map: true,
                pointStyle: {
                    size: 8,
                    weight: 1,
                    opacity: 1,
                    color: '#00008B'
                },
                lineStyle: {
                    fill: false,
                    weight: 3,
                    opacity: 1,
                    color: '#008B8B'
                }
            }
        });

        window.searchLogic.searchControl = window.searchControl;

        lmap.addControl(window.searchControl);
        lmap.gmxControlsManager.add(window.searchControl);
        // shitty trick
        // 'cause Aryunov doesn't use controls id
        window.searchControl._container._id = 'searchcontrol';

        var searchContainer = window.searchControl._widget._container;
        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
            .on(searchContainer, 'mousemove', stop)
            .on(searchContainer, 'touchstart', stop)
            .on(searchContainer, 'mousedown', stop)
            .on(searchContainer, 'dblclick', stop)
            .on(searchContainer, 'contextmenu', stop)
            .on(searchContainer, 'click', stop);

        var gmxLayers = new L.control.gmxLayers2(null, null, {
            title: window._gtxt('Панель оверлеев'),
            collapsed: true,
            togglable: true,
            addBefore: 'searchcontrol',
            direction: '',
            placeHolder: window._gtxt("оверлеи отсутствуют")

        });

        lmap.addControl(gmxLayers);
        lmap.gmxControlsManager.add(gmxLayers);
    }

    var createDefaultMenu = function() {
        _menuUp.submenus = [];

        _menuUp.addItem({
            id: 'mapsMenu',
            title: _gtxt('Карта'),
            childs: [
                { id: 'mapCreate', title: _gtxt('Создать'), func: function() { _queryMapLayers.createMapDialog(_gtxt('Создать карту'), _gtxt('Создать'), _queryMapLayers.createMap) } },
                { id: 'mapList', title: _gtxt('Открыть'), func: function() { _queryMapLayers.getMaps() } }
            ]
        });

        _menuUp.addItem({
            id: 'helpMenu',
            title: _gtxt('Справка'),
            childs: [
                { id: 'usage', title: _gtxt('Использование'), onsel: mapHelp.mapHelp.load, onunsel: mapHelp.mapHelp.unload },
                { id: 'serviceHelp', title: _gtxt('Сервисы'), onsel: mapHelp.serviceHelp.load, onunsel: mapHelp.serviceHelp.unload },
                { id: 'about', title: _gtxt('О проекте'), func: _mapHelper.version }
            ]
        });
    }

    var parseURLParams = function() {
        var q = window.location.search,
            kvp = (q.length > 1) ? q.substring(1).split('&') : [];

        for (var i = 0; i < kvp.length; i++) {
            kvp[i] = kvp[i].split('=');
        }

        var params = {},
            givenMapName = false;

        for (var j = 0; j < kvp.length; j++) {
            if (kvp[j].length == 1) {
                if (!givenMapName)
                    givenMapName = decodeURIComponent(kvp[j][0]);
            } else {
                params[kvp[j][0]] = kvp[j][1];
            }
        }

        return { params: params, givenMapName: givenMapName };
    }

    $(function() {

        var virtualLayerManager = new nsGmx.VirtualLayerManager();
        L.gmx.addLayerClassLoader(virtualLayerManager.loader);

        $('body').on('keyup', function(event) {
            if ((event.target === document.body || $(event.target).hasClass('leaflet-container')) && event.keyCode === 79) {
                _queryMapLayers.getMaps();
                return false;
            }
        })

        var languageFromSettings = translationsHash.getLanguageFromCookies() || window.defaultLang;
        window.language = languageFromSettings || 'rus';

        window.shownTitle = window.pageTitle || _gtxt('ScanEx Web Geomixer - просмотр карты');
        document.title = window.shownTitle;

        window.serverBase = _serverBase;

        addParseResponseHook('*', function(response) {
            if (response.Warning) {
                //мы дожидаемся загрузки дерева слоёв, чтобы не добавлять notification widget слишком рано (до инициализации карты в контейнере)
                _queryMapLayers.loadDeferred.then(function() {
                    nsGmx.widgets.notifications.stopAction(null, 'warning', response.Warning, 0);
                });
            }
        })

        var customErrorTemplate = Handlebars.compile('<div class="CustomErrorText">{{description}}</div>'),
            commonErrorTemplate = Handlebars.compile(
                '<div class="CommonErrorText"><table class="CommonErrorTable">' +
                '<tr><td>{{message}}</td></tr>' +
                '<tr class="StacktraceContainer"><td class="StacktraceContainer">{{#if stacktrace}}<textarea class="inputStyle error StacktraceErrorText">{{stacktrace}}</textarea>{{/if}}</td></tr>' +
                '</table></div>'
            );

        //при каждой ошибке от сервера будем показывать диалог с ошибкой и стектрейсом.
        addParseResponseHook('error', function(response, customErrorDescriptions) {
            let errInfo = response.ErrorInfo;

            if (errInfo.ErrorMessage && !(errInfo.ErrorMessage in _mapHelper.customErrorsHash)) {
                if (customErrorDescriptions && errInfo.ExceptionType in customErrorDescriptions) {
                    let canvas = $(customErrorTemplate({
                        description: customErrorDescriptions[errInfo.ExceptionType]
                    }));
                    showDialog(_gtxt('Ошибка!'), canvas[0], 220, 100);
                } else {
                    let stackTrace = response.ErrorInfo.ExceptionType && response.ErrorInfo.StackTrace;
                    let canvas = $(commonErrorTemplate({
                        message: errInfo.ErrorMessage,
                        stacktrace: stackTrace
                    }));
                    showDialog(_gtxt('Ошибка сервера'), canvas[0], 220, 170, false, false);
                    return false;
                }
            }
        })

        _translationsHash.addErrorHandler(function(text) {
            showErrorMessage('Не найдено тектовое описание для "' + text + '"');
        })

        nsGmx.pluginsManager = new(window.gmxCore.getModule('PluginsManager').PluginsManager)();

        //будем сохранять в пермалинке все активные плагины
        _mapHelper.customParamsManager.addProvider({
            name: 'PluginManager',
            loadState: function(state) {
                for (var p in state.usage) {
                    var plugin = nsGmx.pluginsManager.getPluginByName(p);

                    plugin && plugin.setUsage(state.usage[p] ? 'used' : 'notused');
                }
            },
            saveState: function() {
                var usage = {};
                nsGmx.pluginsManager.forEachPlugin(function(plugin) {
                    if (plugin.pluginName) {
                        usage[plugin.pluginName] = plugin.isUsed();
                    }
                })

                return {
                    version: '1.0.0',
                    usage: usage
                }
            }
        });

        //сейчас подгружаются все глобальные плагины + все плагины карт, у которых нет имени в конфиге
        nsGmx.pluginsManager.done(function() {
            nsGmx.AuthManager.checkUserInfo(function() {
                nsGmx.pluginsManager.beforeMap();

                var parsedURL = parseURLParams();

                parseReferences(parsedURL.params, parsedURL.givenMapName);

            }, function() {
                //TODO: обработка ошибок
            })
        })
    });

    function parseReferences(params, givenMapName) {
        window.documentHref = window.location.href.split('?')[0];

        if (params['permalink']) {
            eraseCookie('TinyReference');
            createCookie('TinyReference', params['permalink']);

            if (location.search.indexOf('debug=1') === -1) {
                window.location.replace(window.documentHref + (givenMapName ? ('?' + givenMapName) : ''));
            } else {
                var tinyRef = readCookie('TinyReference');
                _mapHelper.restoreTinyReference(tinyRef, function(obj) {
                    if (obj.mapName) {
                        window.globalMapName = obj.mapName;
                    }
                    loadMap(obj);
                });
            }
            return;
        }

        var defaultState = { isFullScreen: params['fullscreen'] == 'true' || params['fullscreen'] == 'false' ? params['fullscreen'] : 'false' };

        if ('x' in params && 'y' in params && 'z' in params &&
            !isNaN(Number(params.x)) && !isNaN(Number(params.y)) && !isNaN(Number(params.z)))
            defaultState.position = { x: Number(params.x), y: Number(params.y), z: Number(params.z) }

        if ('mx' in params && 'my' in params &&
            !isNaN(Number(params.mx)) && !isNaN(Number(params.my)))
            defaultState.marker = { mx: Number(params.mx), my: Number(params.my), mt: 'mt' in params ? params.mt : false }

        if ('mode' in params)
            defaultState.mode = params.mode;

        if ('dt' in params) {
            defaultState.dt = params.dt;
        }

        window.defaultMapID = typeof window.defaultMapID !== 'undefined' ? window.defaultMapID : 'DefaultMap';

        var mapName = window.defaultMapID && !givenMapName ? window.defaultMapID : givenMapName;

        window.globalMapName = mapName;

        if (!window.globalMapName) {
            // нужно прописать дефолтную карту в конфиге
            alert(_gtxt('$$phrase$$_1'))

            return;
        } else {
            checkUserInfo(defaultState);
        }
    }

    function checkUserInfo(defaultState) {
        var tinyRef = readCookie('TinyReference');

        if (tinyRef) {
            eraseCookie('TinyReference');
            _mapHelper.restoreTinyReference(tinyRef, function(obj) {
                if (obj.mapName) {
                    window.globalMapName = obj.mapName;
                }
                loadMap(obj);
            }, function() {
                loadMap(defaultState); //если пермалинк какой-то не такой, просто открываем дефолтное состояние
            });

            var tempPermalink = readCookie('TempPermalink');

            if (tempPermalink && tempPermalink == tinyRef) {
                nsGmx.Utils.TinyReference.remove(tempPermalink);
                eraseCookie('TempPermalink');
            }
        } else {
            loadMap(defaultState);
        }
    }


    window.layersShown = true;

    window.resizeAll = function() {
        if (window.printMode) {
            return;
        }

        var top = 0,
            bottom = 0,
            right = 0,
            left,
            headerHeight = $('#header').outerHeight(),
            mainDiv = $('#flash')[0];

        if (window.exportMode) {
            left = 0;
        }
        else if (window.iconSidebarWidget)  {
            left = window.iconSidebarWidget.getWidth();
        }
        else {
            left = window.layersShown ? 400 : 40;
        }
        
        mainDiv.style.left = left + 'px';
        mainDiv.style.top = top + 'px';
        mainDiv.style.width = getWindowWidth() - left - right + 'px';
        mainDiv.style.height = getWindowHeight() - top - headerHeight - bottom + 'px';

        nsGmx.leafletMap && nsGmx.leafletMap.invalidateSize();

        if (window.layersShown) {
            $('#leftMenu').show();

            var mapNameHeight = $('.mainmap-title').outerHeight();

            var baseHeight = getWindowHeight() - top - bottom - headerHeight;

            $('#leftMenu')[0].style.height = baseHeight + 'px';

            var leftContentContainer = $('#leftContent')[0];
            if (leftContentContainer) {
                leftContentContainer.style.top = ($('#leftPanelHeader')[0].offsetHeight + mapNameHeight) + 'px';
                leftContentContainer.style.height = baseHeight -
                    $('#leftPanelHeader')[0].offsetHeight -
                    $('#leftPanelFooter')[0].offsetHeight -
                    mapNameHeight + 'px';
            }
        } else {
            $('#leftMenu').hide();
        }
    }

    var editUIInited = false;
    var initEditUI = function() {
        if (editUIInited) {
            return;
        }

        var isEditableLayer = function(layer) {
            var props = layer.getGmxProperties(),
                layerRights = _queryMapLayers.layerRights(props.name);

            return props.type === 'Vector' &&
                (layerRights === 'edit' || layerRights === 'editrows');
        }

        var hasEditableLayer = false;
        for (var iL = 0; iL < nsGmx.gmxMap.layers.length; iL++)
            if (isEditableLayer(nsGmx.gmxMap.layers[iL])) {
                hasEditableLayer = true;
                break;
            }

        if (!hasEditableLayer) return;

        //добавляем пункт меню к нарисованным объектам
        nsGmx.ContextMenuController.addContextMenuElem({
            title: _gtxt('EditObject.drawingMenuTitle'),
            isVisible: function() {
                var active = $(_queryMapLayers.treeCanvas).find('.active');

                //должен быть векторный слой
                if (!active[0] || !active[0].parentNode.getAttribute('LayerID') ||
                    !active[0].parentNode.gmxProperties.content.properties.type === 'Vector') {
                    return false;
                }

                //TODO: проверить тип геометрии

                var layer = nsGmx.gmxMap.layersByID[active[0].parentNode.gmxProperties.content.properties.name];

                //слой поддерживает редактирование и у нас есть права на это
                return isEditableLayer(layer);
            },
            clickCallback: function(context) {
                var active = $(_queryMapLayers.treeCanvas).find('.active');
                var layerName = active[0].parentNode.gmxProperties.content.properties.name;
                new nsGmx.EditObjectControl(layerName, null, { drawingObject: context.obj });
            }
        }, 'DrawingObject');

        //добавляем пункт меню ко всем слоям
        nsGmx.ContextMenuController.addContextMenuElem({
            title: _gtxt('EditObject.menuTitle'),
            isVisible: function(context) {
                var layer = nsGmx.gmxMap.layersByID[context.elem.name];
                return !context.layerManagerFlag && isEditableLayer(layer);
            },
            clickCallback: function(context) {
                new nsGmx.EditObjectControl(context.elem.name);
            }
        }, 'Layer');

        //добавляем тул в тублар карты
        var listeners = {};
        // var pluginPath = window.gmxCore.getModulePath('EditObjectPlugin');

        var editIcon = L.control.gmxIcon({
            id: 'editTool',
            title: _gtxt('Редактировать'),
            togglable: true,
            addBefore: 'gmxprint'
        }).addTo(nsGmx.leafletMap);

        editIcon.on('statechange', function() {
            if (editIcon.options.isActive) {

                var clickHandler = function(event) {
                    let layer = event.target,
                        props = layer.getGmxProperties(),
                        id = event.gmx.properties[props.identityField];

                    layer.bringToTopItem(id);
                    new nsGmx.EditObjectControl(props.name, id, { event: event });
                    return true; // TODO: как oтключить дальнейшую обработку события
                }

                for (let iL = 0; iL < nsGmx.gmxMap.layers.length; iL++) {
                    let layer = nsGmx.gmxMap.layers[iL],
                        props = layer.getGmxProperties();

                    if (layer.disableFlip && layer.disablePopup) {
                        layer.disableFlip();
                        layer.disablePopup();
                    }

                    listeners[props.name] = clickHandler.bind(null); //bind чтобы были разные ф-ции
                    if (layer instanceof L.gmx.VectorLayer) {
                        layer.on('click', listeners[props.name]);
                    }
                }
            } else {
                for (let layerName in listeners) {
                    // let pt = listeners[layerName];
                    let layer = nsGmx.gmxMap.layersByID[layerName];
                    if (layer && layer instanceof L.gmx.VectorLayer) {
                        layer.off('click', listeners[layerName]);
                        if (layer.getGmxProperties().type !== 'Virtual') {
                            layer.enableFlip();
                            layer.enablePopup();
                        }
                    }
                }
                listeners = {};
            }
        });

        editUIInited = true;
    }

    function initAuthWidget() {
        var registrationCallback = function() {
            window.gmxCore.loadModule('ProfilePlugin').then(function(AccountModule) {
                AccountModule.showRegistrationForm(function() {
                    window.location.reload();
                });
            })
        };

        var nativeAuthWidget = new nsGmx.GeoMixerAuthWidget($('<div/>')[0], nsGmx.AuthManager, function() {
            _mapHelper.reloadMap();
        }, { registrationCallback: registrationCallback });

        // прокси между nsGmx.AuthManager редактора и AuthManager'а из общей библиотеки
        var authManagerProxy = {
            getUserInfo: function() {
                var def = $.Deferred();
                nsGmx.AuthManager.checkUserInfo(function() {
                    var auth = nsGmx.AuthManager;
                    def.resolve({
                        Status: 'ok',
                        Result: {
                            Login: auth.getLogin(),
                            Nickname: auth.getNickname(),
                            FullName: auth.getFullname()
                        }
                    });
                })
                return def;
            },

            login: function() {
                nativeAuthWidget.showLoginDialog();
            },

            logout: function() {
                var def = $.Deferred();
                nsGmx.AuthManager.logout(function() {
                    def.resolve({ Status: 'ok', Result: {} });
                    _mapHelper.reloadMap();
                });
                return def;
            },
            getNative: function() {
                return nativeAuthWidget;
            }
        };

        nsGmx.widgets.authWidget = new nsGmx.AuthWidget({
            authManager: authManagerProxy,
            showAccountLink: !!window.mapsSite,
            accountLink: null,
            showMapLink: !!window.mapsSite,
            changePassword: !window.mapsSite,
            isAdmin: nsGmx.AuthManager.isRole(nsGmx.ROLE_ADMIN),
            callbacks: {
                'authWidget-usergroupMenuItem': showUserList
            }
        });

        var authPlaceholder = nsGmx.widgets.header.getAuthPlaceholder();
        nsGmx.widgets.authWidget.appendTo(authPlaceholder);

        authPlaceholder.on('click', '#AuthWidgetAccountLink', function() {
            window.gmxCore.loadModule('ProfilePlugin').then(function(AccountModule) {
                AccountModule.showProfile();
            })
        });

        //ugly hack
        nsGmx.widgets.authWidget.showLoginDialog = nativeAuthWidget.showLoginDialog.bind(nativeAuthWidget);
    }


    function loadMap(state) {
        //при переходе на новое API мы изменили место хранения мапплетов карты
        //раньше мапплеты хранились в свойстве onLoad карты
        //теперь - внутри клиентских данных (UserData)

        nsGmx.mappletLoader = {
            _script: '',

            //UserObjectsManager interface
            collect: function() {
                return this._script;
            },
            load: function(data) {
                this._script = data;
            },

            //self public interface
            execute: function() {
                // if (this._script) {
                //     var evalStr = '(' + this._script + ')';
                //     try {
                //         eval(evalStr)();
                //     } catch (e) {
                //         console.error(e);
                //     }
                // }
            },
            get: function() {
                return this._script;
            },
            set: function(data) {
                this._script = data;
            }
        }
        nsGmx.userObjectsManager.addDataCollector('mapplet_v2', nsGmx.mappletLoader);

        window.layersShown = (state.isFullScreen == 'false');

        if (state.language) {
            window.language = state.language;
            translationsHash.updateLanguageCookies(window.language);
        }

        window.onresize = window.resizeAll;
        window.resizeAll();

        L.Icon.Default.imagePath = (window.gmxJSHost || '') + 'img';
        var iconUrl = L.Icon.Default.imagePath + '/flag_blau1.png';

        if (L.version !== '0.7.7') {
            L.Icon.Default = L.Icon.Default.extend({
                _getIconUrl: function (name) {
                    return L.Icon.prototype._getIconUrl.call(this, name);
                }
            });
        }

        L.Marker = L.Marker.extend({
            options: {
                icon: new L.Icon.Default({
                    iconUrl: iconUrl,
                    iconSize: [36, 41],
                    iconAnchor: [7, 37],
                    popupAnchor: [3, -25],
                    shadowUrl: iconUrl,
                    shadowSize: [0, 0],
                    shadowAnchor: [0, 0],
                    iconRetinaUrl: L.Icon.Default.imagePath + '/marker-icon.png'
                })
            }
        });

        L.marker = function (latlng, options) {
            return new L.Marker(latlng, options);
        }

        var hostName = L.gmxUtil.normalizeHostname(window.serverBase),
            apiKey = window.mapsSite ? window.apiKey : null; //передаём apiKey только если не локальная версия ГеоМиксера

        //мы явно получаем описание карты, но пока что не начинаем создание слоёв
        //это нужно, чтобы получить список плагинов и загрузить их до того, как начнутся создаваться слои
        var skipTiles = (window.mapOptions ? window.mapOptions.skipTiles : '') || window.gmxSkipTiles || '';
        var srs = window.mapOptions ? window.mapOptions.srs : '';

        if (!srs) { var arr = location.href.match(/[?&][cs]rs=(\d+)/); if (arr) { srs = arr[1]; } }

        var isGeneralized = window.mapOptions && 'isGeneralized' in window.mapOptions ? window.mapOptions.isGeneralized : true;    

        L.gmx.gmxMapManager.loadMapProperties({
            srs: srs,
            serverHost: hostName,
            apiKey: apiKey,
            mapName: window.globalMapName,
            skipTiles: skipTiles,
            isGeneralized: isGeneralized
        }).then(function(mapInfo) {
            var userObjects = state.userObjects || (mapInfo && mapInfo.properties.UserData);
            userObjects && nsGmx.userObjectsManager.setData(JSON.parse(userObjects));

            //в самом начале загружаем только данные о плагинах карты.
            //Остальные данные будем загружать чуть позже после частичной инициализации вьюера
            //О да, формат хранения данных о плагинах часто менялся!
            //Поддерживаются все предыдущие форматы из-за старых версий клиента и сложности обновления базы данных
            nsGmx.userObjectsManager.load('mapPlugins');
            nsGmx.userObjectsManager.load('mapPlugins_v2');
            nsGmx.userObjectsManager.load('mapPlugins_v3');

            //вызываем сразу после загрузки списка плагинов ГеоМиксера,
            //так как в state может содержаться информация о включённых плагинах
            if (state.customParamsCollection) {
                _mapHelper.customParamsManager.loadParams(state.customParamsCollection);
            }

            //после загрузки списка плагинов карты начали загружаться не глобальные плагины,
            //у которых имя плагина было прописано в конфиге. Ждём их загрузки.
            nsGmx.pluginsManager.done(function() {
                nsGmx.pluginsManager.preloadMap();
                L.gmx.loadMap(window.globalMapName, {
                    srs: srs,
                    skipTiles: skipTiles,
                    hostName: window.serverBase,
                    apiKey: apiKey,
                    setZIndex: true,
                    isGeneralized: isGeneralized
                }).then(processGmxMap.bind(null, state));
            })
        }, function(resp) {
            initHeader();
            initAuthWidget();

            _menuUp.defaultHash = 'usage';

            _menuUp.createMenu = function() {
                createDefaultMenu();
                nsGmx.pluginsManager.addMenuItems(_menuUp);
            };

            _menuUp.go(nsGmx.widgets.header.getMenuPlaceholder()[0]);

            $('#left_usage').hide();

            _menuUp.checkView();

            var str = resp && resp.ErrorInfo && resp.ErrorInfo.ErrorMessage ? resp.ErrorInfo.ErrorMessage : 'У вас нет прав на просмотр данной карты';
            nsGmx.widgets.notifications.stopAction(null, 'failure', _gtxt(str) || str, 0);

            window.onresize = window.resizeAll;
            window.resizeAll();

            state.originalReference && createCookie('TinyReference', state.originalReference);

            nsGmx.widgets.authWidget.showLoginDialog();
        });
    }

    //создаём подложки в BaseLayerManager по описанию из config.js
    function initDefaultBaseLayers() {

        var lang = L.gmxLocale.getLanguage(),
            iconPrefix = 'img/baseLayers/',
            blm = nsGmx.leafletMap.gmxBaseLayersManager,
            zIndexOffset = 2000000,
            defaultMapID = window.baseMap.defaultMapID,
            promises = [],
            defaultHostName;

        if (window.baseMap.defaultHostName) {
            defaultHostName = window.baseMap.defaultHostName === '/' ? _serverBase : window.baseMap.defaultHostName;
        } else {
            defaultHostName = 'maps.kosmosnimki.ru';
        }

        if (window.baseMap.baseLayers) {
            let baseLayers = window.baseMap.baseLayers,
                bl;

            // проставляем дефолтным слоям свойства, зависящие от путей, языка, zIndex
            for (let i = 0; i < baseLayers.length; i++) {
                bl = baseLayers[i];
                // у Спутника в конфиге нет иконки и копирайта
                if (bl.id === 'sputnik') {
                    bl.icon = iconPrefix + 'basemap_sputnik_ru.png';
                    bl.layers[0].attribution = '<a href="http://maps.sputnik.ru">Спутник</a> © ' + (lang === 'rus' ? 'Ростелеком' : 'Rostelecom') + ' | © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
                }
                // у ОСМ в конфиге нет иконки и урл
                if (bl.id === 'OSM') {
                    bl.icon = iconPrefix + 'basemap_osm_' + (lang === 'rus' ? 'ru' : 'eng') + '.png';
                    bl.layers[0].urlTemplate = 'http://{s}.tile.osm.kosmosnimki.ru/kosmo' + (lang === 'rus' ? '' : '-en') + '/{z}/{x}/{y}.png';
                }
                // у гибрида в конфиге нет урл
                if (bl.id === 'OSMHybrid') {
                    bl.layers[0].urlTemplate = 'http://{s}.tile.osm.kosmosnimki.ru/kosmohyb' + (lang === 'rus' ? '' : '-en') + '/{z}/{x}/{y}.png';
                    // bl.layers[0].setZIndex(zIndexOffset);
                }
                // у спутника нет иконки
                if (bl.id === 'satellite') {
                    bl.icon = iconPrefix + 'basemap_satellite.png';
                }
            }

            for (let i = 0; i < baseLayers.length; i++) {
                let bl = baseLayers[i];
                if (bl.layers && bl.layers.length) {
                    let l = bl.layers;
                    for (let j = 0; j < l.length; j++) {
                        if (l[j].urlTemplate) {
                            // заменяем в подложках с айди описания слоев на L.tileLayers
                            l[j] = L.tileLayer(l[j].urlTemplate, l[j]);
                        } else {
                            // let currentTl = bl,
                            let layerID = l[j].layerID,
                                hostName = l[j].hostName || defaultHostName,
                                mapID = l[j].mapID || defaultMapID,
                                skipTiles = (window.mapOptions ? window.mapOptions.skipTiles : '') || window.gmxSkipTiles || '',
                                srs = window.mapOptions ? window.mapOptions.srs : '',
                                isGeneralized = window.mapOptions && 'isGeneralized' in window.mapOptions ? window.mapOptions.isGeneralized : true;

                            if (!srs) { let arr = location.href.match(/[?&][cs]rs=(\d+)/); if (arr) { srs = arr[1]; } }
                            // resolve promise -> заменяем в подложках с айди описания слоев на gmxLayers
                            var promise = L.gmx.loadLayer(mapID, layerID, {
                                hostName: hostName,
                                srs: srs,
                                isGeneralized: isGeneralized,
                                skipTiles: skipTiles
                            }).then(function(layer) {
                                var id = layer.getGmxProperties().name;
                                for (let k = 0; k < baseLayers.length; k++) {
                                    let bl = baseLayers[k];

                                    if (bl.layers && bl.layers.length) {
                                        var l = bl.layers;

                                        for (var m = 0; m < l.length; m++) {
                                            if (l[m].layerID && l[m].layerID === id) {
                                                l[m] = layer;
                                            }
                                        }
                                    }
                                }
                            });

                            promises.push(promise);
                        }
                    }
                }
            }
        }
        return L.gmx.Deferred.all.apply(null, promises).then(function() {
            if (window.baseMap.baseLayers) {
                var layers = window.baseMap.baseLayers,
                    layersToLoad = {};

                layers.forEach(function(bl) {
                    layersToLoad[bl.id] = bl;
                });

                // добавим в гибрид снимок
                if (layersToLoad.satellite && layersToLoad.OSMHybrid) {
                    layersToLoad.OSMHybrid.layers[0].setZIndex(zIndexOffset);
                    layersToLoad.OSMHybrid.layers.push(layersToLoad.satellite.layers[0]);
                }

                _.each(layersToLoad, function(l, name) {
                    blm.add(name, l);
                });
            }
        });
    }

    function showUserList() {
        window.gmxCore.loadModule('UserGroupWidget').then(function(module) {
            var canvas = $('<div/>');
            new module.UserGroupListWidget(canvas);
            canvas.dialog({
                width: 400,
                height: 400,
                title: _gtxt('Управление группами пользователей')
            });
        });
    }

    // Инициализации шапки. Будем оттягивать с инициализацией до последнего момента, так как при инициализации
    // требуется знать текущий язык, а он становится известен только после загрузки карты
    function initHeader() {
        // var rightLinks = [];

        nsGmx.widgets.header = new nsGmx.HeaderWidget({
            logo: (window.gmxViewerUI && window.gmxViewerUI.logoImage) || 'img/geomixer_transpar_small.svg'
        });

        nsGmx.widgets.header.appendTo($('.header'));
    }

    function processGmxMap(state, gmxMap) {
        var DEFAULT_VECTOR_LAYER_ZINDEXOFFSET = 2000000;
        var defCenter = [55.7574, 37.5952],
            mapProps = gmxMap.properties,
            defZoom = mapProps.DefaultZoom || 5,
            data = gmxMap.rawTree;

        if (mapProps.DefaultLat && mapProps.DefaultLong) {
            defCenter = [mapProps.DefaultLat, mapProps.DefaultLong];
        } else {
            //подсчитаем общий extend всех видимых слоёв
            var visBounds = L.latLngBounds([]);

            for (var l = 0; l < gmxMap.layers.length; l++) {
                var layer = gmxMap.layers[l];

                if (layer.getGmxProperties().visible && layer.getBounds) {
                    visBounds.extend(layer.getBounds());
                }
            }

            if (visBounds.isValid()) {
                //вычислям центр и максимальный zoom по bounds (map.fitBounds() использовать не можем, так как ещё нет карты)
                var proj = L.Projection.Mercator;
                var mercBounds = L.bounds([proj.project(visBounds.getNorthWest()), proj.project(visBounds.getSouthEast())]);
                var ws = 2 * proj.project(L.latLng(0, 180)).x,
                    screenSize = [$('#flash').width(), $('#flash').height()];

                var zoomX = Math.log(ws * screenSize[0] / (mercBounds.max.x - mercBounds.min.x)) / Math.log(2) - 8;
                var zoomY = Math.log(ws * screenSize[1] / (mercBounds.max.y - mercBounds.min.y)) / Math.log(2) - 8;

                defZoom = Math.floor(Math.min(zoomX, zoomY, 17));
                defCenter = proj.unproject(mercBounds.getCenter());
            }
        }

        //если информации о языке нет ни в куках ни в config.js, то используем данные о языке из карты
        if (!translationsHash.getLanguageFromCookies() && !window.defaultLang && data) {
            window.language = data.properties.DefaultLanguage;
        }

        initHeader();

        if (!window.gmxViewerUI || !window.gmxViewerUI.hideLanguage) {
            var langContainer = nsGmx.widgets.header.getLanguagePlaceholder();
            nsGmx.widgets.languageWidget = new nsGmx.LanguageWidget();
            nsGmx.widgets.languageWidget.appendTo(langContainer);
        }
        var mapOptions = L.extend(window.mapOptions ? window.mapOptions : {}, {
            contextmenu: true,
            // если есть пермалинк, центрируем и зумируем карту сразу по его параметрам
            center: state.position ? [state.position.y, state.position.x] : defCenter,
            zoom: state.position ? state.position.z : defZoom,
            // boxZoom: false,
            zoomControl: false,
            attributionControl: false,
            trackResize: true,
            fadeAnimation: !window.gmxPhantom, // отключение fadeAnimation при запуске тестов
            zoomAnimation: !window.gmxPhantom, // отключение zoomAnimation при запуске тестов
            distanceUnit: mapProps.DistanceUnit,
            squareUnit: mapProps.SquareUnit,
            minZoom: mapProps.MinZoom || undefined,
            maxZoom: mapProps.MaxZoom || undefined,
            maxPopupCount: mapProps.maxPopupContent
        });

        var lmap = new L.Map($('#flash')[0], mapOptions);
        if(window.syncParams) {
            L.gmx.gmxMapManager.setSyncParams(window.syncParams);
        }        

        // update layers zIndexes
        var currentZoom = lmap.getZoom(),
            layerOrder = gmxMap.rawTree.properties.LayerOrder;

        updateZIndexes();

        lmap.on('zoomend', function() {
            currentZoom = lmap.getZoom();
            updateZIndexes();
        })

        //clip polygons
        if (mapProps.MinViewX && mapProps.MinViewY && mapProps.MaxViewX && mapProps.MaxViewY) {
            lmap.on('layeradd', function(e) {
                if (e.layer.addClipPolygon) {
                    _mapHelper.clipLayer(e.layer, mapProps);
                }
            })
        }

        // bind clusters to photoLayers
        for (let l = 0; l < gmxMap.layers.length; l++) {
            let layer = gmxMap.layers[l],
                props = layer.getGmxProperties();

            if (props.IsPhotoLayer) {
                layer.bindClusters({
                    iconCreateFunction: function(cluster) {
                        var photoClusterIcon = L.divIcon({
                            html: '<img src="' + (window.serverBase ? window.serverBase + _mapHelper.defaultPhotoIconStyles.point.marker.image : _mapHelper.defaultPhotoIconStyles.point.marker.image) + '" class="photo-icon"/><div class="marker-cluster-photo">' + cluster.getChildCount() + '</div>',
                            className: 'photo-div-icon',
                            iconSize: [14, 12],
                            iconAnchor: [0, 0]
                        });
                        return photoClusterIcon;
                    },
                    maxClusterRadius: 40,
                    spiderfyOnMaxZoom: true,
                    spiderfyZoom: 14,
                    spiderfyDistanceMultiplier: 1.2,
                    disableClusteringAtZoom: 19,
                    maxZoom: 19
                });
            }
        }
        lmap.contextmenu.insertItem({
            text: _gtxt('Поставить маркер'),
            callback: function(event) {
                lmap.gmxDrawing.addGeoJSON({ type: 'Point', coordinates: [event.latlng.lng, event.latlng.lat] });
            }
        })

        lmap.contextmenu.insertItem({
            text: _gtxt('Центрировать'),
            callback: function(event) {
                lmap.setView(event.latlng);
            }
        });

        function updateZIndexes() {
            for (var l = 0; l < gmxMap.layers.length; l++) {
                var layer = gmxMap.layers[l],
                    props = layer.getGmxProperties();

                switch (layerOrder) {
                    case 'VectorOnTop':
                        if (props.type === 'Vector' && layer.setZIndexOffset) {                            
                            let rcMinZoom,
                                quickLookMinZoom,
                                defaultMinZoom = 6;

                            if (props.IsRasterCatalog || (props.Quicklook && props.Quicklook !== 'null')) {
                                rcMinZoom = props.IsRasterCatalog ? props.RCMinZoomForRasters : null;
                                quickLookMinZoom = (props.Quicklook && nsGmx.Utils.isJSON(props.Quicklook)) ? JSON.parse(props.Quicklook).minZoom : null;

                                if (props.IsRasterCatalog && !props.Quicklook) {
                                    let minZoom = nsGmx.Utils.checkForNumber(rcMinZoom) ? rcMinZoom : defaultMinZoom;
                                } else if (!props.IsRasterCatalog && props.Quicklook) {
                                    let minZoom = nsGmx.Utils.checkForNumber(quickLookMinZoom) ? quickLookMinZoom : defaultMinZoom;
                                } else if (props.IsRasterCatalog && props.Quicklook) {
                                    rcMinZoom = nsGmx.Utils.checkForNumber(rcMinZoom) ? rcMinZoom : defaultMinZoom;
                                    quickLookMinZoom = nsGmx.Utils.checkForNumber(quickLookMinZoom) ? quickLookMinZoom : defaultMinZoom;                                    
                                }
                                layer.setZIndexOffset(currentZoom < rcMinZoom ? DEFAULT_VECTOR_LAYER_ZINDEXOFFSET : 0);
                            } else {
                                layer.setZIndexOffset(DEFAULT_VECTOR_LAYER_ZINDEXOFFSET);
                            }
                        }
                        break;
                }
            }
        }

        // Begin: запоминание текущей позиции карты
        function saveMapPosition(key) {
            window.localStorage.setItem('lastMapPosiotion_' + key, JSON.stringify({ zoom: lmap.getZoom(), center: lmap.getCenter() }));
        }

        function getMapPosition(key) {
            return JSON.parse(localStorage.getItem('lastMapPosiotion_' + key));
        }
        lmap.on('boxzoomstart', function() { saveMapPosition('z'); });
        L.DomEvent.on(document, 'keydown', function(ev) {
            var key = ev.key;
            if (lmap.gmxMouseDown === 1) {
                var pos = getMapPosition(key);
                if (pos && (key === 'z' || Number(key) >= 0)) {
                    lmap.setView(pos.center, pos.zoom);
                }
            } else if (lmap.gmxMouseDown > 1) {
                if (Number(key) >= 0) {
                    saveMapPosition(key);
                }
            }

        }, lmap);
        // End: запоминание текущей позиции карты

        lmap.gmxControlsManager.init(window.controlsOptions);
        // lmap.addControl(new L.Control.gmxLayers(lmap.gmxBaseLayersManager, {
        //     // position: 'topleft',
        //     collapsed: true,
        //     hideBaseLayers: true
        // }));

        nsGmx.leafletMap = lmap;

        var loc = nsGmx.leafletMap.gmxControlsManager.get('location');

        loc.setCoordinatesFormat(gmxMap.properties.coordinatesFormat);

        loc.on('coordinatesformatchange', function(ev) {
            nsGmx.leafletMap.options.coordinatesFormat = ev.coordinatesFormat;
        });

        var baseLayerDef = 'baseMap' in window ? initDefaultBaseLayers() : lmap.gmxBaseLayersManager.initDefaults({ hostName: window.mapHostName, apiKey: window.apiKey, srs: lmap.options.srs, skipTiles: lmap.options.skipTiles, isGeneralized: lmap.options.isGeneralized });

        baseLayerDef.then(function() {

            nsGmx.gmxMap = gmxMap;
            window.gmxAPI.layersByID = gmxMap.layersByID; // слои по layerID

            var mapProp = gmxMap.rawTree.properties || {}
            var baseLayers = mapProp.BaseLayers ? JSON.parse(mapProp.BaseLayers) : [window.language === 'eng' ? 'mapbox' : 'sputnik', 'OSMHybrid', 'satellite'];

            lmap.gmxBaseLayersManager.setActiveIDs(baseLayers);

            var baseLayersControl = new L.Control.GmxIconLayers(lmap.gmxBaseLayersManager, { id: 'iconLayers' });                
            lmap.gmxControlsManager.add(baseLayersControl);

            lmap.addControl(baseLayersControl);

            nsGmx.widgets.commonCalendar = new nsGmx.CommonCalendarWidget();

            // добавление временных слоев в commonCalendar
            // добавление происходит безопасно, в клон объекта со списком слоев
            var initTemporalLayers = function(layers) {
                layers = layers || nsGmx.gmxMap.layers;

                var attrs = nsGmx.widgets.commonCalendar.model.toJSON(),
                    showCalendar = undefined,
                    dateInterval,
                    dateBegin,
                    dateEnd;

                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i],
                        props = layer.getGmxProperties(),
                        // isVisible = props.visible,
                        isTemporalLayer = (layer instanceof L.gmx.VectorLayer && props.Temporal) || (props.type === 'Virtual' && layer.setDateInterval);
                    if (isTemporalLayer) {
                        // показываем виджет календаря, если в карте есть хоть один мультивременной слой
                        showCalendar = true;

                        dateInterval = layer.getDateInterval ? layer.getDateInterval() : new nsGmx.DateInterval();

                        if (dateInterval.beginDate && dateInterval.endDate) {
                            dateBegin = dateInterval.beginDate;
                            dateEnd = dateInterval.endDate;
                        } else {
                            dateInterval = new nsGmx.DateInterval();
                            dateBegin = dateInterval.get('dateBegin');
                            dateEnd = dateInterval.get('dateEnd');
                        }

                        if (!(props.name in attrs.unbindedTemporalLayers)) {
                            nsGmx.widgets.commonCalendar.bindLayer(props.name);

                            layer.setDateInterval(dateBegin, dateEnd);

                            if (props.LayerID in attrs.dailyFiltersHash) {
                                nsGmx.widgets.commonCalendar.applyDailyFilter([layer]);
                            }

                        }
                        //подписка на изменение dateInterval
                        if (layer.getDateInterval) {
                            layer.on('dateIntervalChanged', nsGmx.widgets.commonCalendar.onDateIntervalChanged, nsGmx.widgets.commonCalendar);
                        }
                    }
                }

                nsGmx.widgets.commonCalendar.updateVisibleTemporalLayers(nsGmx.gmxMap.layers);

                if (showCalendar && !attrs.isAppended) {
                    nsGmx.widgets.commonCalendar.show();
                }
            }

            // привяжем изменение активной ноды к календарю
            $(_layersTree).on('activeNodeChange', function(e, p) {
                var layerID = $(p).attr('layerid');
                    // calendar = nsGmx.widgets.commonCalendar.model.get('calendar'),
                    // synchronyzed = nsGmx.widgets.commonCalendar.model.get('synchronyzed');

                lmap.fireEvent('layersTree.activeNodeChange', { layerID: layerID });
            });

            $(_layersTree).on('layerVisibilityChange', function(event, elem) {
                let props = elem.content.properties,
                    attrs = nsGmx.widgets.commonCalendar.model.toJSON(),
                    visible = props.visible,
                    layerID = props.LayerID,
                    // calendar = attrs.calendar,
                    currentLayer = attrs.currentLayer,
                    synchronyzed = attrs.synchronyzed;

                if (synchronyzed) {
                    return;
                }
                else if (layerID) {
                    let layer = nsGmx.gmxMap.layersByID[layerID],
                        props = layer.getGmxProperties(),
                        isTemporalLayer = (layer instanceof L.gmx.VectorLayer && props.Temporal) || (props.type === 'Virtual' && layer.getDateInterval),
                        visibleTemporalLayers,
                        index;

                    if (isTemporalLayer) {
                        if (visible) {
                            if (currentLayer) {
                                return;
                            } else {
                                let dateInterval = layer.getDateInterval();
                                if (dateInterval.beginDate && dateInterval.endDate) {
                                    nsGmx.widgets.commonCalendar.setDateInterval(dateInterval.beginDate, dateInterval.endDate, layer);
                                }
                            }
                        }
                        else if (currentLayer) {
                            if (layerID !== currentLayer) {
                                return;
                            }
                            else {
                                visibleTemporalLayers = getLayersListWithTarget(nsGmx.gmxMap.layers, layer);
                                index = visibleTemporalLayers.indexOf(layer);

                                if (visibleTemporalLayers.length === 1) {
                                    nsGmx.widgets.commonCalendar.model.set('currentLayer', null);
                                }
                                else if (index === 0) {
                                    let targetLayer = visibleTemporalLayers[index + 1],
                                        // targetLayerID = targetLayer.getGmxProperties().LayerID,
                                        dateInterval = targetLayer.getDateInterval();

                                    nsGmx.widgets.commonCalendar.setDateInterval(dateInterval.beginDate, dateInterval.endDate, targetLayer);
                                    // nsGmx.widgets.commonCalendar.model.set('currentLayer', targetLayerID)
                                } else {
                                    let targetLayer = visibleTemporalLayers[index - 1],
                                        // targetLayerID = targetLayer.getGmxProperties().LayerID,
                                        dateInterval = targetLayer.getDateInterval();

                                    nsGmx.widgets.commonCalendar.setDateInterval(dateInterval.beginDate, dateInterval.endDate, targetLayer);
                                    // nsGmx.widgets.commonCalendar.model.set('currentLayer', targetLayerID)
                                }
                            }
                        }
                        else {
                            return;
                        }                        
                    }
                }
                
                nsGmx.widgets.commonCalendar.updateVisibleTemporalLayers(nsGmx.gmxMap.layers);

                function getLayersListWithTarget(layers, targetLayer) {
                    let visibleTemporalLayers = [];
                    for (let i = 0; i < layers.length; i++) {
                        let layer = layers[i],
                            props = layer.getGmxProperties && layer.getGmxProperties(),
                            isTemporalLayer,
                            isVisible;

                        if (props) {
                            isTemporalLayer = (layer instanceof L.gmx.VectorLayer && props.Temporal) || (props.type === 'Virtual' && layer.getDateInterval);
                            isVisible = props.visible;

                            if (isTemporalLayer && isVisible || layer === targetLayer) {
                                visibleTemporalLayers.push(layer);
                            }
                        }
                    }
                    return visibleTemporalLayers;
                }
            });

            $(_layersTree).on('styleVisibilityChange', function(event, styleVisibilityProps) {
                let it = nsGmx.gmxMap.layersByID[styleVisibilityProps.elem.name],
                    styles = it.getStyles(),
                    st = styles[styleVisibilityProps.styleIndex];

                let div = $(_queryMapLayers.buildedTree).find("div[LayerID='" + styleVisibilityProps.elem.LayerID + "']")[0],
                    elemProperties = div.gmxProperties.content.properties,
                    treeStyles = window.newStyles ?  elemProperties.gmxStyles.styles : elemProperties.styles,
                    treeSt = treeStyles[styleVisibilityProps.styleIndex];

                if (typeof treeSt._MinZoom === 'undefined') {
                    treeSt._MinZoom = treeSt.MinZoom;
                }

                if (styleVisibilityProps.show) {
                    treeSt.MinZoom = treeSt._MinZoom;
                    st.MinZoom = treeSt._MinZoom;
                    treeSt.disabled = false;
                } else {
                    treeSt.disabled = true;
                }
                st.disabled = treeSt.disabled;

                it.setStyles(styles);
            });

            _mapHelper.customParamsManager.addProvider({
                name: 'commonCalendar',
                loadState: function(state) {
                    if (!('version' in state)) {
                        let tmpDateInterval = new nsGmx.DateInterval({
                            dateBegin: new Date(state.dateBegin),
                            dateEnd: new Date(state.dateEnd)
                        });
                        nsGmx.widgets.commonCalendar.getDateInterval().loadState(tmpDateInterval.saveState());
                    } else if (state.version === '1.0.0') {
                        nsGmx.widgets.commonCalendar.model.set('synchronyzed', typeof(state.synchronyzed) !== 'undefined' ? state.synchronyzed : true);
                        nsGmx.widgets.commonCalendar.model.set('currentLayer', typeof(state.currentLayer) !== 'undefined' ? state.currentLayer : null);
                        nsGmx.widgets.commonCalendar.getDateInterval().loadState(state.dateInterval);
                        nsGmx.widgets.commonCalendar.model.set('dailyFilter', typeof(state.dailyFilter) !== 'undefined' ? state.dailyFilter : true);
                    } else {
                        throw 'Unknown params version';
                    }
                },
                saveState: function() {
                    return {
                        version: '1.0.0',
                        dateInterval: nsGmx.widgets.commonCalendar.getDateInterval().saveState(),
                        currentLayer: nsGmx.widgets.commonCalendar.model.get('currentLayer'),
                        synchronyzed: nsGmx.widgets.commonCalendar.model.get('synchronyzed'),
                        dailyFilter: nsGmx.widgets.commonCalendar.model.get('dailyFilter')
                    };
                }
            });

            $('#flash').bind('dragover', function() {
                return false;
            });

            $('#flash').bind('drop', function(e) {
                if (!e.originalEvent.dataTransfer) {
                    return;
                }

                _queryLoadShp.loadAndShowFiles(e.originalEvent.dataTransfer.files);

                return false;
            })

            if (state.dt) {
                try {
                    let dateLocal = $.datepicker.parseDate('dd.mm.yy', state.dt);
                    let dateBegin = nsGmx.CalendarWidget.fromUTC(dateLocal);
                    let dateEnd = new Date(dateBegin.valueOf() + 24 * 3600 * 1000);
                    let dateInterval = nsGmx.widgets.commonCalendar.getDateInterval();
                    dateInterval.set({
                        dateBegin: dateBegin,
                        dateEnd: dateEnd
                    });
                } catch (e) {
                    console.log(e);
                }
            }

            nsGmx.pluginsManager.beforeViewer();

            //для каждого ответа сервера об отсутствии авторизации (Status == 'auth') сообщаем об этом пользователю или предлагаем залогиниться
            addParseResponseHook('auth', function() {
                if (nsGmx.AuthManager.isLogin()) {
                    showErrorMessage(_gtxt('Недостаточно прав для совершения операции'), true);
                } else {
                    nsGmx.widgets.authWidget.showLoginDialog();
                }

                return false;
            });

            initAuthWidget();

            //инициализация контролов пользовательских объектов
            //соответствующий модуль уже загружен
            // let oDrawingObjectsModule = window.gmxCore.getModule('DrawingObjects');
            window.oDrawingObjectGeomixer = new DrawingObjectGeomixer();
            window.oDrawingObjectGeomixer.Init(nsGmx.leafletMap, nsGmx.gmxMap);

            //для всех слоёв должно выполняться следующее условие: если хотя бы одна групп-предков невидима, то слой тоже невидим.
            (function fixVisibilityConstrains(o) {
                // o.content.properties.visible = o.content.properties.visible;

                if (o.type === 'group') {
                    let a = o.content.children;

                    let isAnyVisibleChild = false;

                    for (let k = a.length - 1; k >= 0; k--) {
                        let childrenVisibility = fixVisibilityConstrains(a[k]);
                        isAnyVisibleChild = isAnyVisibleChild || childrenVisibility;
                    }

                    // если внутри группы есть включенные слои, группа тоже включается
                    // если же ни одного включенного слоя нет, то группа выключается
                    o.content.properties.visible = isAnyVisibleChild ? true : false;
                }
                return o.content.properties.visible;
            })({ type: 'group', content: { children: data.children, properties: { visible: true } } });

            window.oldTree = JSON.parse(JSON.stringify(data));

            window.defaultLayersVisibility = {};

            for (let k = 0; k < gmxMap.layers.length; k++) {
                let props = gmxMap.layers[k].getGmxProperties();
                window.defaultLayersVisibility[props.name] = props.visible;
            }

            //основная карта всегда загружена с того-же сайта, что и серверные скрипты
            data.properties.hostName = window.serverBase.slice(7).slice(0, -1);

            //DEPRICATED. Do not use it!
            _mapHelper.mapProperties = data.properties;

            //DEPRICATED. Do not use it!
            _mapHelper.mapTree = data;

            if (window.copyright && typeof window.copyright === 'string') {
                lmap.gmxControlsManager.get('copyright').setMapCopyright(window.copyright);
            }

            let condition = false,
                mapStyles = false,
                LayersTreePermalinkParams = false;

            if (state.condition) {
                condition = state.condition;
            }

            if (state.mapStyles) {
                mapStyles = state.mapStyles;
            }
            if (state.LayersTreePermalinkParams) {
                LayersTreePermalinkParams = state.LayersTreePermalinkParams;
            }

            /**
             *
             * SIDEBAR
             *
             */

            window.iconSidebarWidget = new IconSidebarWidget(document.getElementById('leftMenu'), {
                collapsedWidth: 40,
                extendedWidth: 400,
                position: 'left'
            });

            window.iconSidebarWidget.addEventListener('opened', window.resizeAll);
            window.iconSidebarWidget.addEventListener('closed', window.resizeAll);

            window.createTabFunction = function(options) {
                return function(state) {
                    var el = document.createElement("div"),
                        tabEl = document.createElement("div"),
                        href = '#' + options.icon.toLowerCase(),
                        symbol = document.querySelector(href);
                    $(el).addClass("tab-icon");

                    if (symbol) $(symbol).addClass("sidebar-icon");

                    tabEl.innerHTML = '<svg role="img" class="svgIcon">\
                    <use xlink:href="' + href + '" href="' + href + '"></use>\
                    </svg>';

                    el.appendChild(tabEl);

                    options.hint && el.setAttribute("title", options.hint);
                    $(tabEl).addClass(options.icon);
                    if (state === "active") {
                        $(tabEl).addClass(options.active);
                        $(el).addClass("tab-icon-active");
                        if (symbol) $(symbol).addClass("sidebar-active-icon");
                    } else {
                        if (symbol && $(symbol).hasClass("sidebar-active-icon")) {
                            $(symbol).removeClass("sidebar-active-icon");
                        }
                        $(tabEl).addClass(options.inactive);
                    }
                    return el;
                };
            };

            // init tab
            window.iconSidebarWidget._activeTabId = "layers-tree";

            var leftMainContainer = nsGmx.layersTreePane = window.iconSidebarWidget.setPane(
                "layers-tree", {
                    createTab: window.createTabFunction({
                        icon: "s-tree",
                        active: "sidebar-icon-active",
                        inactive: "sidebar-icon-inactive",
                        hint: _gtxt("Слои")
                    })
                }
            );

                leftMainContainer.innerHTML =
                '<div class="leftMenu">' +
                    '<div class="mainmap-title">' + data.properties.title + '</div>' +
                    '<div id="leftPanelHeader" class="leftPanelHeader"></div>' +
                    '<div id="leftContent" class="leftContent">' +
                        '<div id="leftContentInner" class="leftContentInner"></div>' +
                    '</div>' +
                    '<div id="leftPanelFooter" class="leftPanelFooter"></div>' +
                '</div>';

            window.iconSidebarWidget.open("layers-tree");

            // $('.leftContent').mCustomScrollbar();

                // function handleSidebarResize (e) {
                //     var sidebarWidth = window.iconSidebarWidget.getWidth(),
                //         lmap = nsGmx.leafletMap,
                //         newBottomLeft,
                //         newBounds;
                //     var c = lmap.getContainer();

                //     var pBounds = lmap.getPixelBounds(),
                //         bl = pBounds.getBottomLeft(),
                //         tr = pBounds.getTopRight(),
                //         blll = L.latLng(lmap.unproject(bl)),
                //         trll = L.latLng(lmap.unproject(tr));

                //     if (e.type === 'sidebar:opened') {
                //         newBottomLeft = L.point(bl.x + sidebarWidth, bl.y);
                //     } else {
                //         newBottomLeft = L.point(bl.x - sidebarWidth, bl.y);

                //     }
                //     newBounds = L.latLngBounds(L.latLng(lmap.unproject(newBottomLeft)), trll);
                // }

                /**
                 *
                 * SIDEBAR END
                 *
                 */


            _queryMapLayers.addLayers(data, condition, mapStyles, LayersTreePermalinkParams);

            // переписать на вкладку с деревом
            var headerDiv = $('.mainmap-title');

            // special for steppe Project
            if (data.properties.MapID === '0786A7383DF74C3484C55AFC3580412D') {
                $(headerDiv).toggle();
            }

            nsGmx.ContextMenuController.bindMenuToElem(headerDiv[0], 'Map', function() {
                    return _queryMapLayers.currentMapRights() == 'edit';
                },
                function() {
                    return {
                        div: $(_layersTree._treeCanvas).find('div[MapID]')[0],
                        tree: _layersTree
                    }
                }
            );

            // _menuUp.defaultHash = 'layers';
            window.mapLayers.mapLayers.load();

            //создаём тулбар
            // var iconContainer = _div(null, [
            //     ['css', 'borderLeft', '1px solid #216b9c']
            // ]);

            // var searchContainer = nsGmx.widgets.header.getSearchPlaceholder()[0];

            window.searchLogic.init({
                oMenu: oSearchLeftMenu
            });

            //инициализация контролов поиска (модуль уже загружен)
            // var oSearchModule = window.gmxCore.getModule('search');
            // window.oSearchControl = new oSearchModule.SearchGeomixer();

            // if (document.getElementById('searchCanvas')) {
            // window.oSearchControl.Init({
            //     Menu: oSearchLeftMenu,
            //     ContainerInput: searchContainer,
            //     ServerBase: window.serverBase,
            //     layersSearchFlag: true,
            //     Map: lmap,
            //     gmxMap: gmxMap
            // });

            _menuUp.createMenu = function() {
                createMenuNew();
            };

            _menuUp.go(nsGmx.widgets.header.getMenuPlaceholder()[0]);

            var headerLinks = nsGmx.addHeaderLinks();

            if (headerLinks.length) {
                _menuUp.addItem({ id: 'linksMenu', title: _gtxt('Ссылки'), childs: headerLinks });
            }

            // Загружаем все пользовательские данные
            nsGmx.userObjectsManager.load();

            // выставляет правильные z-indexes слоям-вьюхам
            _layersTree.updateZIndexes();

            //выполняем мапплет карты нового формата
            nsGmx.mappletLoader.execute();

            //динамически добавляем пункты в меню. DEPRICATED.
            nsGmx.pluginsManager.addMenuItems(_menuUp);

            _mapHelper.gridView = false;

            var updateLeftPanelVis = function() {
                // $('.leftCollapser-icon')
                //     .toggleClass('leftCollapser-right', !layersShown)
                //     .toggleClass('leftCollapser-left', !!layersShown);
                window.resizeAll();
            }

            // $('#leftCollapser').click(function() {
            //     layersShown = !layersShown;
            //     updateLeftPanelVis();
            // });
            updateLeftPanelVis();

            createToolbar();


            var controls = lmap.gmxControlsManager.getAll();

            for (var key in controls) {
                var ctrl = controls[key],
                    cntr = ctrl.getContainer();
                cntr.addEventListener('click', function (e) {
                    _menuUp.hideOnClick(e);
                });
            }

            if (state.mode) {
                lmap.gmxBaseLayersManager.setCurrentID(lmap.gmxBaseLayersManager.getIDByAlias(state.mode) || state.mode);
            } else if (baseLayers.length && !lmap.gmxBaseLayersManager.getCurrentID()) {
                lmap.gmxBaseLayersManager.setCurrentID(baseLayers[0]);
            }

            if (state.drawings) {
                lmap.gmxDrawing.loadState(state.drawings);
            } else if (state.drawnObjects) {
                state.drawnObjects.forEach(function(objInfo) {
                    //старый формат - число, новый - строка
                    var lineStyle = {};

                    if (objInfo.color) {
                        lineStyle.color = typeof objInfo.color === 'number' ? '#' + L.gmxUtil.dec2hex(objInfo.color) : objInfo.color;
                    }

                    if (objInfo.thickness) { lineStyle.weight = objInfo.thickness }
                    if (objInfo.opacity) { lineStyle.opacity = objInfo.opacity / 100 }

                    var featureOptions = $.extend(true, {}, objInfo.properties, {
                        lineStyle: lineStyle
                    });

                    var drawingFeature = lmap.gmxDrawing.addGeoJSON(L.gmxUtil.geometryToGeoJSON(objInfo.geometry), featureOptions)[0];

                    if (objInfo.isBalloonVisible) {
                        drawingFeature.openPopup();
                    }
                });
            } else if (state.marker) {
                nsGmx.leafletMap.gmxDrawing.addGeoJSON({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [state.marker.mx, state.marker.my] },
                    properties: { title: state.marker.mt }
                });
            }

            if (state.openPopups) {
                for (let l in state.openPopups) {
                    let layer = nsGmx.gmxMap.layersByID[l];
                    if (layer && layer.addPopup) {
                        state.openPopups[l].forEach(layer.addPopup.bind(layer));
                    }
                }
            }

            _menuUp.checkView();

            if (nsGmx.AuthManager.isLogin()) {
                _queryMapLayers.addUserActions();
            }

            if (state.dateIntervals) {
                for (let lid in gmxMap.layersByID) {
                    if (lid in state.dateIntervals) {
                        let l = gmxMap.layersByID[lid],
                            beginDate = new Date(state.dateIntervals[lid].beginDate),
                            endDate = new Date(state.dateIntervals[lid].endDate);

                        l.setDateInterval(beginDate, endDate);
                    }
                }
            }

            if (state.filters) {
                for (let key in state.filters) {
                    let l = nsGmx.gmxMap.layersByID[key],
                        filtersArr = state.filters[key];

                    for (let i = 0; i < filtersArr.length; i++) {
                        if ('filterById' in filtersArr[i]) {
                            let filteredId = filtersArr[i]['filterById'];

                            l.addLayerFilter(function(it) { return it.id === filteredId });
                        }
                    }
                }
            }

            initEditUI();
            initTemporalLayers();

            gmxMap.addLayersToMap(lmap);

            nsGmx.leafletMap.on('layeradd', function(event) {
                var layer = event.layer;

                if (layer.getGmxProperties) {
                    // var layerProps = layer.getGmxProperties();

                    initEditUI();
                    initTemporalLayers([layer]);

                }
            });
            // if (mapProp.MapID !== 'ATTBP') {
            nsGmx.gmxMap.on('onRemoveLayer', function(event) {
                var layer = event.layer;
                if (!layer.getGmxProperties()) {
                    return;
                }
                var props = layer.getGmxProperties(),
                    isTemporalLayer = (layer instanceof L.gmx.VectorLayer && props.Temporal) || (props.type === 'Virtual' && layer.getDateInterval);

                if (isTemporalLayer && !(props.name in nsGmx.widgets.commonCalendar._unbindedTemporalLayers)) {
                    nsGmx.widgets.commonCalendar.unbindLayer(props.name);
                    nsGmx.widgets.commonCalendar.updateTemporalLayers();
                    delete nsGmx.widgets.commonCalendar._unbindedTemporalLayers[props.name];
                }
            });

            // special for steppe project
            if (nsGmx.gmxMap.properties.MapID === '0786A7383DF74C3484C55AFC3580412D') {
                nsGmx.widgets.commonCalendar.show();
            }
            nsGmx.pluginsManager.afterViewer();

            // обработка специальных параметров плагинов
            nsGmx.pluginsManager.forEachPlugin(function (plugin) {
                if (plugin.moduleName === "gmxTimeLine" && nsGmx.timeLineControl) {
                    var treeLayers = $(window._layersTree);
                    nsGmx.timeLineControl
                        .on('layerRemove', function(e) {
                            treeLayers.triggerHandler('layerTimelineRemove', e);
                        })
                        .on('layerAdd', function(e) {
                            treeLayers.triggerHandler('layerTimelineAdd', e);
                        })
                        .saveState().dataSources.forEach(function(it) {
                            treeLayers.triggerHandler('layerTimelineAdd', {type: 'layerAdd', layerID: it.layerID});
                        });
                }
            });

            // экспорт карты

            if (state.exportMode) {
                _mapHelper.exportMap(state);
            }
        });
    }

    function mapExportMenu() {
        window.gmxCore.loadModule('MapExport'
        // , 'src/MapExport/MapExport.js'
        ).then(function(def) {
            var menu = new def.MapExportMenu();
            menu.Load();
        });
    }

    function BufferZonesMenu() {
        window.gmxCore.loadModule('BufferZones'
        // , 'src/BufferZones/BufferZones.js'
        ).then(function(def) {
            var menu = new def.BufferZonesMenu();
            menu.Load();
        });
    }

    function indexGridMenu() {
        window.gmxCore.loadModule('IndexGrid'
        // , 'src/IndexGrid/IndexGrid.js'
        ).then(function(def) {
            var menu = new def.IndexGridMenu();
            menu.Load();
        });
    }

    function PhotoLayerDialog() {
        window.gmxCore.loadModule('PhotoLayer'
        // , 'src/PhotoLayer/PhotoLayer.js'
        ).then(function(def) {
            var dialog = new def.PhotoLayer();
            dialog.Load();
        });
    }

    function promptFunction(title, value) {
        var ui = $(Handlebars.compile(
            '<div class="gmx-prompt-canvas">' +
            '<input class="inputStyle gmx-prompt-input" value="{{value}}">' +
            '</div>')({ value: value }));

        ui.find('input').on('keydown', function(e) {
            // var evt = e || window.event;
            if (e.which === 13) {
                var coord = L.gmxUtil.parseCoordinates(this.value);
                nsGmx.leafletMap.panTo(coord);
                return false;
            }
        })

        showDialog(title, ui[0], 300, 80, false, false);
    }

    window.prompt = promptFunction;

};

tinyMCE.init({
    mode : "none",
    theme : "advanced",
    plugins: 'fullscreen',
    language: 'ru',
    convert_urls: false,
    theme_advanced_buttons1: 'bold,italic,underline,|,justifyleft,justifycenter,justifyright,|,link,unlink,fullscreen,code',
    theme_advanced_buttons2: '',
    theme_advanced_buttons3: '',
    theme_advanced_statusbar_location: 'none',
    theme_advanced_toolbar_location: 'bottom',
    theme_advanced_toolbar_align: 'center'
});

nsGmx.initGeoMixer();