﻿//Плагин для добавления таймлайна для просмотра данных мультивременных слоёв.
(function ($){

_translationsHash.addtext("rus", {timeline: {
    modesTextTitle: "Показывать объекты",
    modesTextTimeline: "на таймлайне",
    modesTextMap: "на карте",
    contextMemuTitle: "Добавить к таймлайну",
    mapMode: {
        none: "все",
        screen: "на экране",
        center: "над центром"
    },
    timelineMode: {
        none: "все",
        range: "по датам",
        selected: "выделенные"
    }
}});

_translationsHash.addtext("eng", {timeline: {
    modesTextTitle: "Show objects",
    modesTextTimeline: "at timeline",
    modesTextMap: "on map",
    contextMemuTitle: "Add to timeline",
    mapMode: {
        none: "all",
        screen: "at screen",
        center: "at center"
    },
    timelineMode: {
        none: "all",
        range: "by dates",
        selected: "selected"
    }
}});

var TimelineData = Backbone.Model.extend({
    defaults: {
        allItems: false,        //все ли данные уже загружены
        items: {},              //{layerName1: {id1 : {...}, ...}, layerName2:...}
        userFilters: [],        //function({obj, bounds}, mapCenter, mapExtent) -> bool
        range: {
            start: null,        //Date
            end: null           //Date
        },
        selection: {},          //{layerName1: [{id, date}, {id, date}, ...], layerName2:...}
        layers: [],             //[{name: ..., dateFunction: ..., filterFunction: ...}, ...]
        timelineMode: 'center', //center, screen, none
        mapMode: 'selected'     //selected, range, none
    },

    bindLayer: function(layer, options) {
        options = options || {};
        var layerName = options.layerName || layer.getGmxProperties().name || L.stamp(layer);

        //если уже есть такой слой, ничего не делаем
        if (_.pluck(this.attributes.layers, 'name').indexOf(layerName) !== -1) {
            return this;
        }

        var newLayerInfo = {
            layer: layer,
            name: layerName,
            dateFunction: options.dateFunction || TimelineData._defaultDateFunction,
            filterFunction: options.filterFunction || TimelineData._defaultFilterFunction,
            selectFunction: options.selectFunction || TimelineData._defaultSelectFunction,
            trackVisibility: 'trackVisibility' in options ? !!options.trackVisibility : true,
            observerFilters: options.observerFilters
        }
        this.trigger('preBindLayer', newLayerInfo);

        this.set('layers', this.attributes.layers.concat(newLayerInfo));
        this.trigger('bindLayer', newLayerInfo);

        return this;
    },

    unbindLayer: function(layer) {
        var layerInfos = this.attributes.layers;
        for (var l = 0; l < layerInfos.length; l++) {
            var layerInfo = layerInfos[l];
            if (layerInfo.layer === layer) {
                var newLayersInfo = layerInfos.slice(0);
                newLayersInfo.splice(l, 1);
                this.set('layers', newLayersInfo);
                this.trigger('unbindLayer', layerInfo);
                return this;
            }
        }
        return this;
    },

    getLayerInfo: function(layer) {
        return _.findWhere(this.attributes.layers, {layer: layer});
    },

    addFilter: function(filterFunc) {
        var filters = this.attributes.userFilters.slice(0);
        filters.push(filterFunc);
        this.set('userFilters', filters);
    }
}, {
    _defaultDateFunction: function(layer, obj) {
        var props = layer.getGmxProperties(),
            index = layer._gmx.tileAttributeIndexes[props.TemporalColumnName];

        return new Date(obj.properties[index]*1000);
    },

    _defaultSelectFunction: function(layer, layerSelection) {
        if (layerSelection) {
            var minValue = Number.POSITIVE_INFINITY,
                maxValue = Number.NEGATIVE_INFINITY;

            var ids = {};

            layerSelection.forEach(function(s) {
                minValue = Math.min(minValue, s.date);
                maxValue = Math.max(maxValue, s.date);
                ids[s.id] = true;
            });

            //верхняя граница интервала не включается в интервал, поэтому добавляем к ней миллисекунду
            layer.setDateInterval(new Date(minValue), new Date(maxValue + 1));

            layer.setFilter(function(elem) {
                return elem.id in ids;
            });
        } else {
            layer.setDateInterval();
        }
    },

    _defaultFilterFunction: function(layer, startDate, endDate) {
        layer.setDateInterval(startDate, endDate);
        layer.removeFilter();
    }
});

var MapController = function(data) {
    var updateFunctions = {
        none: function(layers) {
            (layers || data.get('layers')).forEach(function(layerInfo) {
                var layer = layerInfo.layer,
                    props = layer.getGmxProperties(),
                    dateBegin = new Date(nsGmx.Utils.convertToServer('date', props.DateBegin)*1000),
                    dateEnd = new Date(nsGmx.Utils.convertToServer('date', props.DateEnd)*1000 + 24*3600*1000);

                layer.setDateInterval(dateBegin, dateEnd);
                layer.removeFilter();
            });
        },

        selected: function(layers) {
            var selection = data.get('selection');

            (layers || data.get('layers')).forEach(function(layerInfo) {
                layerInfo.selectFunction(layerInfo.layer, selection[layerInfo.name]);
            })
        },

        range: function(layers) {
            var range = data.get('range');
            (layers || data.get('layers')).forEach(function(layerInfo) {
                layerInfo.filterFunction(layerInfo.layer, range.start, range.end);
            })
        }
    }

    data.on('change:range', function() {
        if (data.get('mapMode') === 'range') {
            updateFunctions['range']();
        }
    })

    data.on('change:selection', function() {
        if (data.get('mapMode') === 'selected') {
            updateFunctions['selected']();
        }
    })

    data.on('change:mapMode', function() {
        updateFunctions[data.get('mapMode')]();
    })

    //вклчючим фильтрацию для этого снимка до того, как он будет добавлен в список слоёв таймлайна
    data.on('preBindLayer', function(layerInfo) {
        updateFunctions[data.get('mapMode')]([layerInfo]);
    })
}

var TimelineController = function (data, map, options) {
    options = $.extend({
        showModeControl: true,
        showSelectionControl: true,
        showCalendar: true,
        position: 'topright',
        hideWithoutActiveLayers: false
    }, options);

    var _projFunc;
    if (!map.options.srs) {
        _projFunc = L.Projection.Mercator;
    } else if (map.options.srs == 3857) {
        _projFunc = L.CRS.EPSG3857;
    }

    function isPointInPoly(poly, pt) {
        var l = poly.length;
        poly[0][0] == poly[l - 1][0] && poly[0][1] == poly[l - 1][1] && l--;
        for (var c = false, i = -1, j = l - 1; ++i < l; j = i)
            ((poly[i][1] <= pt.y && pt.y < poly[j][1]) || (poly[j][1] <= pt.y && pt.y < poly[i][1]))
                && (pt.x < (poly[j][0] - poly[i][0]) * (pt.y - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
                && (c = !c);
        return c;
    }

    var timelineOptions = {
        style: "line",
        start: new Date(2010, 0, 1),
        end: new Date(),
        width: "100%",
        height: "85px",
        style: "line"
    };

    var timeline = null,
        countSpan = null,
        container = $('<div/>', { 'class': 'timeline-container' }),
        footerContainer = $('<div/>', { 'class': 'timeline-footer' }),
        headerContainer = $('<div/>', { 'class': 'timeline-header' }),
        _this = this;

    container.on('mousedown', function (event) {
        event.stopPropagation();
    })

    container.on('mousewheel', function (event) {
        event.stopPropagation();
    })

    var updateControlsVisibility;

    var layerObservers = {};

    var getObserversBbox = function () {
        if (data.get('timelineMode') === 'center') {
            return L.latLngBounds([map.getCenter()]);
            // return L.gmxUtil.bounds([[center.lng, center.lat]]);
        } else if (data.get('timelineMode') === 'screen') {
            return map.getBounds();
        }

        return null;
    }

    var updateTimelineVisibility = function () {
        if (options.hideWithoutActiveLayers) {
            for (var i in layerObservers) {
                if (layerObservers[i].isActive()) {
                    container.show();
                    return;
                }
            }
            container.hide();
        }
    }

    function joinPolygons(objs) {
        var polygonObjects = [];
        for (var i = 0; i < objs.length; i++) {
            var geom = objs[i];
            if (geom.type == 'POLYGON') {
                polygonObjects.push(geom.coordinates);
            }
            else if (geom.type == 'MULTIPOLYGON') {
                for (var iC = 0; iC < geom.coordinates.length; iC++)
                    polygonObjects.push(geom.coordinates[iC]);
            }
        }

        if (polygonObjects.length > 1)
            return { type: "MULTIPOLYGON", coordinates: polygonObjects }
        else if (polygonObjects.length == 1) {
            return { type: "POLYGON", coordinates: polygonObjects[0] }
        }
        else
            return null;
    };

    var modeFilters = {
        none: function () { return true; },
        center: function (item, mapCenter, mapExtent, layer) {
            var geom = item.geom = item.geom || joinPolygons(layer._gmx.dataManager.getItemGeometries(item.obj.id)),
                c = geom.coordinates,
                intersects = false;

            if (geom.type == "POLYGON") {
                intersects = isPointInPoly(c[0], mapCenter);
            }
            else {
                for (var r = 0; r < c.length; r++) {
                    intersects = intersects || isPointInPoly(c[r][0], mapCenter);
                }
            }

            return intersects;
        },
        screen: function (item, mapCenter, mapExtent) {
            return item.bounds.intersects(mapExtent);
        }
    }

    var deleteLayerItemsFromTimeline = function (layerName) {
        var index = 0;
        while (index < timeline.items.length) {
            var itemData = timeline.getData()[index].userdata;
            if (itemData.layerName === layerName) {
                timeline.deleteItem(index, true);
            } else {
                index++;
            }
        }
        timeline.render();
    }

    var sortSelectionFunction = function (a, b) {
        return a.row < b.row ? -1 : 1;
    }

    var updateCalendarSelection = function () {
        var modelSelection = data.get('selection'),
            curSelection = timeline.getSelection().slice(0),
            timelineData = timeline.getData(),
            modelSelectionHash = {},
            newSelection = [];

        for (var l in modelSelection) {
            var byID = {};
            for (var k = 0; k < modelSelection[l].length; k++) {
                byID[modelSelection[l][k].id] = true;
            }
            modelSelectionHash[l] = byID;
        };

        for (var k = 0; k < timelineData.length; k++) {
            var userdata = timelineData[k].userdata;

            if (userdata.layerName in modelSelectionHash && userdata.objID in modelSelectionHash[userdata.layerName]) {
                newSelection.push({ row: k });
            }
        }

        timeline.setSelection(newSelection, true);
    }

    var updateLayerItems = function (layerInfo) {
        var layerName = layerInfo.name,
            layer = layerInfo.layer,
            props = layer.getGmxProperties(),
            temporalIndex = layer._gmx.tileAttributeIndexes[props.TemporalColumnName],
            identityField = props.identityField;

        var elemsToAdd = [];
        // var center = map.getCenter();
        var mapCenter = _projFunc.project(map.getCenter());
        var mapBounds = map.getBounds();
        var nw = _projFunc.project(mapBounds.getNorthWest());
        var se = _projFunc.project(mapBounds.getSouthEast());
        var mapExtend = L.gmxUtil.bounds([[nw.x, nw.y], [se.x, se.y]]);
        var items = data.get('items');
        var filters = data.get('userFilters').slice(0);

        filters.unshift(modeFilters[data.get('timelineMode')]);

        if (!layer._map && layerInfo.trackVisibility) {
            layerObservers[layerName].deactivate();
            deleteLayerItemsFromTimeline(layerName);

            for (var id in items[layerName]) {
                delete items[layerName][id].timelineItem;
            }

            updateTimelineVisibility();
            return;
        } else {
            layerObservers[layerName].activate();
            updateTimelineVisibility();
        }

        var deletedCount = 0;
        for (var i in items[layerName]) {
            var item = items[layerName][i],
                obj = item.obj;

            var showItem = !item.needToRemove;

            if (!item.needToRemove) {
                for (var f = 0; f < filters.length; f++) {
                    if (!filters[f](item, mapCenter, mapExtend, layer)) {
                        showItem = false;
                        break;
                    }
                }
            }

            if (!item.timelineItem && showItem) {
                var date = layerInfo.dateFunction(layer, obj),
                    content;

                if (props.NameObject) {
                    content = gmxAPI.applyTemplate(props.NameObject, obj.properties);
                }
                else {
                    content = nsGmx.Utils.convertFromServer('date', obj.properties[temporalIndex]);
                }

                elemsToAdd.push({
                    start: date,
                    content: content,
                    userdata: { objID: obj.id, layerName: layerName }
                });
            }
            else if (item.timelineItem && !showItem) {
                for (var index = 0; index < timeline.items.length; index++) {
                    var itemData = timeline.getData()[index].userdata;
                    if (itemData.objID == i && itemData.layerName === layerName) {
                        timeline.deleteItem(index, true);
                        delete item.timelineItem;
                        deletedCount++;
                        break;
                    }
                }
            }

            if (item.needToRemove) {
                delete items[layerName][i];
            }
        }

        if (elemsToAdd.length) {
            timeline.addItems(elemsToAdd);
            $.each(elemsToAdd, function (i, elem) {
                items[layerName][elem.userdata.objID].timelineItem = timeline.items[timeline.items.length - elemsToAdd.length + i];
            });
            updateCalendarSelection();
        } else if (deletedCount > 0) {
            timeline.render();
        }
    }

    var updateCount = function () {
        if (!timeline) return;
        var count = 0;
        var range = timeline.getVisibleChartRange();

        $.each(timeline.getData(), function (i, item) {
            item.start >= range.start && item.start <= range.end && count++;
        })

        countSpan && countSpan.text('(' + count + ')');
    }

    var updateCalendarRange;

    var updateItems = function () {
        data.get('layers').forEach(updateLayerItems);
        updateCount();
    };

    var fireSelectionEvent = function () {
        var selectedItems = [];
        var items = data.get('items');

        var selectedIds = {};

        $.each(timeline.getSelection(), function (i, selection) {
            var item = timeline.getData()[selection.row],
                userdata = item.userdata,
                layerName = userdata.layerName;

            selectedIds[layerName] = selectedIds[layerName] || [];
            selectedIds[layerName].push({ id: userdata.objID, date: item.start });
        })

        data.set('selection', selectedIds);
    }

    var findNextByTime = function (itemIndex, step) {
        var sortedItems = $.map(timeline.items, function (item, i) {
            return { index: i, date: item.start.valueOf() };
        }).sort(function (a, b) {
            return a.date - b.date || a.index - b.index;
        });

        var res = null;
        $.each(sortedItems, function (i, item) {
            if (item.index === itemIndex)
                res = sortedItems[i + step] ? sortedItems[i + step].index : null;
        })

        return res;
    }

    this.getTimeline = function () {
        return timeline;
    }

    this.shiftActiveItem = function (step) {
        var curSelection = timeline.getSelection();
        if (curSelection.length > 0) {
            var newIndex = findNextByTime(curSelection[0].row, step);

            if (newIndex !== null) {
                curSelection[0].row = newIndex;
                timeline.setSelection(curSelection);
            }
        }

        fireSelectionEvent();
    }

    this.update = function () {
        var bounds = getObserversBbox();
        for (var layerName in layerObservers) {
            var o = layerObservers[layerName];
            o.setBounds(bounds);
        }
    };

    this.setDateInterval = function (startDate, endDate) {
        var bounds = getObserversBbox();
        for (var layerName in layerObservers) {
            var o = layerObservers[layerName];
            o.setDateInterval(startDate, endDate);
            o.setBounds(bounds);
        }
    };

    var createTimelineLazy = function () {
        if (timeline) return;

        var LeafletTimelineControl = L.Control.extend({
            onAdd: function () {
                return this.options.timelineContainer;
            },
            onRemove: function () { }
        });

        //nsGmx.leafletMap.addControl(new LeafletTimelineControl({ position: options.position, timelineContainer: container[0] }));
        map.addControl(new LeafletTimelineControl({ position: options.position, timelineContainer: container[0] }));

        //Ugly hack: мы перемещаем контейнер таймлайна наверх соответствующего контейнера контролов leaflet
        container.parent().prepend(container);

        timeline = new links.Timeline(container[0]);
        timeline.addItemType('line', links.Timeline.ItemLine);

        var modelRange = data.get('range');
        if (modelRange.start && modelRange.end) {
            timelineOptions.start = modelRange.start;
            timelineOptions.end = modelRange.end;
        }

        timeline.draw([], timelineOptions);

        //подписываемся на событие reflow, которое возникает 
        //при обновлении элеменов на таймлайне
        links.events.addListener(timeline, 'reflow', function () {
            $(_this).trigger('reflow');
        });

        links.events.addListener(timeline, 'select', fireSelectionEvent);

        links.Timeline.addEventListener(timeline.dom.content, 'dblclick', function (elem) {
            if (timeline.eventParams.itemIndex !== undefined) {
                var items = data.get('items');
                var userdata = timeline.getData()[timeline.eventParams.itemIndex].userdata;
                var b = items[userdata.layerName][userdata.objID].bounds;

                var min = _projFunc.unproject(b.min);
                var max = _projFunc.unproject(b.max);

                map.fitBounds(L.latLngBounds([min, max]));
            }
        });

        var prevDiv = makeImageButton("img/prev.png", "img/prev_a.png");
        _title(prevDiv, _gtxt("Предыдущий слой"));
        prevDiv.onclick = function () {
            _this.shiftActiveItem(-1);
        }
        $(prevDiv).addClass('timeline-shift-icon');

        var nextDiv = makeImageButton("img/next.png", "img/next_a.png");
        _title(nextDiv, _gtxt("Следующий слой"));

        nextDiv.onclick = function () {
            _this.shiftActiveItem(1);
        }
        $(nextDiv).addClass('timeline-shift-icon');

        // container.keypress(function(event) {
        // console.log(event);
        // if (event.keyCode === 37) { //влево
        // shiftActiveItem(-1);
        // } else if (event.keyCode === 39) { //вправо
        // shiftActiveItem(1);
        // }
        // })

        var timelineModeSelect = $('<select/>').addClass('selectStyle')
            .append($('<option/>').val('none').text(_gtxt('timeline.mapMode.none')))
            .append($('<option/>').val('screen').text(_gtxt('timeline.mapMode.screen')))
            .append($('<option/>').val('center').text(_gtxt('timeline.mapMode.center')));

        timelineModeSelect.change(function () {
            data.set('timelineMode', $(':selected', this).val());
        })

        var updateTimelineModeSelect = function () {
            var mode = data.get('timelineMode');
            $('option', timelineModeSelect).each(function (i, option) {
                this.value === mode ? $(this).attr('selected', true) : $(this).removeAttr('selected');
            })
        }

        data.on('change:timelineMode', updateTimelineModeSelect);
        updateTimelineModeSelect();

        var mapModeSelect = $('<select/>').addClass('selectStyle')
            .append($('<option/>').val('selected').text(_gtxt('timeline.timelineMode.selected')))
            .append($('<option/>').val('range').text(_gtxt('timeline.timelineMode.range')))
            .append($('<option/>').val('none').text(_gtxt('timeline.timelineMode.none')));

        var updateMapModeSelect = function () {
            var mode = data.get('mapMode');
            $('option', mapModeSelect).each(function (i, option) {
                this.value === mode ? $(this).attr('selected', true) : $(this).removeAttr('selected');
            })
        }

        data.on('change:mapMode', updateMapModeSelect);
        updateMapModeSelect();

        mapModeSelect.change(function () {
            data.set('mapMode', $(':selected', this).val());
        })

        fromUTC = function (date) {
            if (!date) return null;
            var timeOffset = date.getTimezoneOffset() * 60 * 1000;
            return new Date(date.valueOf() - timeOffset);
        };

        toUTC = function (date) {
            if (!date) return null;
            var timeOffset = date.getTimezoneOffset() * 60 * 1000;
            return new Date(date.valueOf() + timeOffset);
        };
        var dateInterval = new nsGmx.DateInterval();

        updateCalendarRange = function () {
            if (!timeline) return;
            var range = timeline.getVisibleChartRange();

            //TODO: не использовать UTC даты в таймлайне (нужна поддержка отображения UTC).
            var trueStart = fromUTC(range.start);
            var trueEnd = fromUTC(range.end);

            dateInterval.set({
                dateBegin: trueStart,
                dateEnd: trueEnd,
            });

            data.set('range', range);
            updateCount();
        };

        links.events.addListener(timeline, 'rangechanged', updateCalendarRange);
        updateCalendarRange();

        dateInterval.on('change', function () {
            data.set('range', {
                start: dateInterval.get('dateBegin'),
                end: dateInterval.get('dateEnd')
            });
        });

        $(headerContainer).prependTo(container);

        countSpan = $('<span/>', { 'class': 'count-container' });

        var controlsContainer = $('<div/>').addClass('timeline-controls').append(
            $('<div/>').addClass('timeline-mode-control').append(
                $('<span/>').text(_gtxt('timeline.modesTextTitle') + ': ' + _gtxt('timeline.modesTextTimeline')), timelineModeSelect, countSpan,
                $('<span></span>').text(_gtxt('timeline.modesTextMap')).css('margin-left', '10px'), mapModeSelect
            ),
            prevDiv, nextDiv//,
            //calendarContainer
        ).appendTo(container);

        updateControlsVisibility = function () {
            $('.timeline-mode-control', controlsContainer).toggle(options.showModeControl);
            $([prevDiv, nextDiv]).toggle(options.showSelectionControl);
        }
        updateControlsVisibility();

        $(footerContainer).appendTo(container);
    }

    data.on('change:userFilters change:items', updateItems);

    map.on('moveend', function () {
        var bounds = getObserversBbox();
        for (var layerName in layerObservers) {
            layerObservers[layerName].setBounds(bounds);
        }
    });

    data.on('change:timelineMode', function () {
        var bounds = getObserversBbox();
        for (var layerName in layerObservers) {
            layerObservers[layerName].setBounds(bounds);
        }
    });

    data.on('bindLayer', function (layerInfo) {
        var layerName = layerInfo.name,
            layer = layerInfo.layer,
            props = layer.getGmxProperties(),
            dateBegin = new Date(nsGmx.Utils.convertToServer('date', props.DateBegin) * 1000),
            dateEnd = new Date(nsGmx.Utils.convertToServer('date', props.DateEnd) * 1000 + 24 * 3600 * 1000);

        createTimelineLazy();

        var items = data.get('items');
        items[layerName] = items[layerName] || {};

        var f = layerInfo.observerFilters;
        var filters = [];

        if (f) {
            for (var kk = 0; kk < f.length; kk++) {
                var fkk = f[kk];
                if (typeof fkk === "string") {
                    filters.push(fkk);
                } else if (fkk instanceof Function) {
                    (function (funk, ckk) {
                        var n = 'timelineFilter_' + layerName + "_" + ckk;
                        layer._gmx.dataManager.addFilter(n, function (item) {
                            if (funk(item))
                                return item.properties;
                            return null;
                        });
                        filters.push(n);
                    })(fkk, kk);
                }
            }
        }

        filters = filters.length ? filters : null;

        layerObservers[layerName] = layer.addObserver({
            'callback': function (observerData) {
                //если мы загрузили все объекты, то нас не особо волнует, попали они на экран или нет...
                if (data.get('allItems')) {
                    return;
                }

                var items = data.get('items'),
                    addedObjs = observerData.added,
                    removedObjs = observerData.removed;

                if (removedObjs) {
                    for (var i = 0; i < removedObjs.length; i++) {
                        var id = removedObjs[i].id;

                        if (items[layerName][id]) {
                            //пометим для удаления (тут удалять не хочется, чтобы все модификации происходили в одном месте)
                            items[layerName][id].needToRemove = true;
                        }
                    }
                }

                if (addedObjs) {
                    for (var i = 0; i < addedObjs.length; i++) {
                        var obj = addedObjs[i];
                        var id = obj.id;

                        items[layerName][id] = items[layerName][id] || {};
                        items[layerName][id].obj = obj;
                        items[layerName][id].bounds = obj.item.bounds;

                        //геометрию объекта нужно пересчитывать, так как мы получили какой-то новый кусок этого объекта
                        delete items[layerName][id].geom;

                        //обработка ситуации, когда за одно изменение удалился и добавился кусок одного из объектов векторного слоя
                        delete items[layerName][id].needToRemove;
                    }
                }

                data.trigger('change change:items');
            },
            'filters': filters,
            'bounds': getObserversBbox(),
            'dateInterval': [dateBegin, dateEnd],
            'active': !!layer._map || !layerInfo.trackVisibility,
            'ftc': layer.options.ftc,
            'srs': layer.options.srs,
            'layerID': layerName,
            'needBbox': true
        });

        updateTimelineVisibility();
    });

    map.on('layeradd layerremove', function (event) {
        var layerInfo = data.getLayerInfo(event.layer);
        if (layerInfo && layerInfo.trackVisibility) {
            updateLayerItems(layerInfo);
        }
    }, this);

    data.on('unbindLayer', function (layerInfo) {
        var layerName = layerInfo.name;
        layerInfo.layer.removeObserver(layerObservers[layerName]);
        delete layerObservers[layerName];
        deleteLayerItemsFromTimeline(layerName);
        var items = data.get('items');
        delete items[layerName];
        updateTimelineVisibility();
    });

    data.on('change:range', function () {
        if (!timeline) return;
        var currRange = timeline.getVisibleChartRange();
        var newRange = data.get('range');

        if (currRange.start.valueOf() !== newRange.start.valueOf() || currRange.end.valueOf() !== newRange.end.valueOf()) {
            timeline.setVisibleChartRange(toUTC(newRange.start), toUTC(newRange.end));
            updateCalendarRange && updateCalendarRange();
        }
    })

    this.toggle = function (isVisible) {
        container.toggle(isVisible);
    }

    this.getFooterContainer = function () {
        return footerContainer;
    }

    this.getHeaderContainer = function () {
        return headerContainer;
    }

    this.getContainer = function () {
        return container;
    }

    this.setOptions = function (newOptions) {
        options = $.extend(options, newOptions);
        updateControlsVisibility && updateControlsVisibility();
    }
}

/** @callback nsGmx.TimelineControl.FilterFunction
 *  @param {Object} elem Информация об объекте растрового слоя
 *  @param {gmxAPI.MapObject} elem.obj Непосредственно объект растрового слоя
 *  @param {gmxAPI.Bounds} elem.bounds Bbox объекта растрового слоя
 *  @param {Object} mapCenter центр карты (поля x и y)
 *  @param {gmxAPI.Bounds} mapExtent Bbox видимого экстента карты
 *  @return {Boolean} Показывать ли данный объект на таймлайне
*/

/** Контрол для показа объектов мультивременных слоёв на тамймлайне
 * @class
 * @memberOf nsGmx
 * @param {L.Map} map Текущая Leaflet карта
*/
var TimelineControl = function(map, options) {
    var data = new TimelineData();
    this.data = data;

    var mapController = new MapController(data);
    var timelineController = new TimelineController(data, map, options);

    /** Добавить векторный мультивременной слой на таймлайн
     * @param {L.gmx.VectorLayer} layer Мультивременной векторный слой
     * @param {Object} options Дополнительные опции
     * @param {function(layer, object): Date} options.dateFunction Пользовательская ф-ция указания даты для объекта слоя. По описанию объекта возвращает его дату
     * @param {function(layer, startDate, endDate)} options.filterFunction Пользовательская ф-ция для фильтрации слоя по временному интервалу
              Ф-ция должна сама установить фильтры на слое или сделать другие нужные действия над слоем
     * @param {Boolean} [options.trackVisibility = true] Нужно ли удалять с таймлайна объекты слоя если слой удалят с карты
     */
    this.bindLayer = function(layer, options) {
        data.bindLayer(layer, options);
    }

    /** Удалить ранее добавленный векторный мультивременной слой с таймлайна
     * @param {L.gmx.VectorLayer} layer Мультивременной векторный слой
     */
    this.unbindLayer = function(layer) {
        data.unbindLayer(layer);
    }

    /** Возвращает ссылку на timelineController
     * @return {Object}
     */
    this.getTimelineController = function () {
        return timelineController;
    }

    /** Установить режим отображения данных на таймлайне
     * @param {String} newMode Новый режим: center, screen или none
    */
    this.setTimelineMode = function(newMode) {
        data.set('timelineMode', newMode);
    }

    /** Установить режим отображения данных на карте
     * @param {String} newMode Новый режим: selected, range, none
    */
    this.setMapMode = function(newMode) {
        data.set('mapMode', newMode);
    }

    /** Установить временной интервал таймлайна
     * @param {Date} start Начальная дата
     * @param {Date} end Конечная дата
    */
    this.setVisibleRange = function(start, end) {
        data.set('range', {start: start, end: end});
    }

    /** Установить видимость всего таймлайна
     * @param {Boolean} isVisible Показывать ли таймлайн или нет
    */
    this.toggleVisibility = function(isVisible) {
        timelineController.toggle(isVisible);
    }

    /** Добавить пользовательскую ф-цию фильтрации объектов на таймлайне.
     *  На вход ф-ции передаётся информация об объекте и состоянии карты. Ф-ция возвращает признак того, показывать ли объект на таймлайне или нет.
     * @param {nsGmx.TimelineControl.FilterFunction} filterFunc Ф-ция фильтрации
    */
    this.addFilter = function(filterFunc) {
        data.addFilter(filterFunc);
    }

    /** Перепроверить видимость объеков на таймлайне
     */
    this.updateFilters = function() {
        data.trigger('change:userFilters');
    }

    /** Получить контейнер для встраивания дополнительных контролов в подвал таймлайна
     * @return {HTMLElem}
     */
    this.getFooterContainer = function() {
        return timelineController.getFooterContainer();
    }

    /** Получить контейнер для встраивания дополнительных контролов в шапку таймлайна
    * @return {HTMLElem}
    */
    this.getHeaderContainer = function () {
        return timelineController.getHeaderContainer();
    }

    /** Получить контейнер для встраивания дополнительных контролов для всего таймлайна
     * @return {HTMLElem}
     */
    this.getContainer = function () {
        return timelineController.getContainer();
    }

    /** Задать видимость контролов таймлайна
     * @param {Object} visInfo Видимость контролов
     * @param {Boolean} [visInfo.showModeControl=true] Установить видимость контрола переключения режимов отображения информации
     * @param {Boolean} [visInfo.showSelectionControl=true] Установить видимость контрола переключения активного снимка
     * @param {Boolean} [visInfo.showCalendar=true] Установить видимость календаря на таймлайне
     */
    this.setControlsVisibility = function(visInfo) {
        timelineController.setOptions(visInfo);
    }

    /** Активизировать следующий/предыдущий снимок на таймлайне
     * @param {Number} step Смещение нового активного снимка на таймлайне относительно текущего активного.
     * 1 - следующий, -1 - предыдущий и т.п.
     */
    this.shiftActiveItem = function(step) {
        timelineController.shiftActiveItem(step);
    }
};

nsGmx.TimelineControl = TimelineControl;

var publicInterface = {
    pluginName: 'Timeline Rasters',
    beforeViewer: function(params, map) {
        if (!map) return;

        nsGmx.timelineControl = new TimelineControl(map, {hideWithoutActiveLayers: true});

        _mapHelper.customParamsManager.addProvider({
            name: 'Timeline',
            loadState: function(state)
            {
                var data = nsGmx.timelineControl.data;

                var attributes = {
                    range: {
                        start: state.dateStart ? new Date(state.dateStart) : null,
                        end:   state.dateEnd ? new Date(state.dateEnd) : null
                    },
                    timelineMode: state.timelineMode,
                    mapMode:      state.mapMode
                };

                if ('selection' in state) {
                    for (var layerName in state.selection) {
                        state.selection[layerName].forEach(function(item) {
                            item.date = new Date(item.date)
                        })
                    }
                    attributes.selection = state.selection;
                }

                data.set(attributes);

                if ('layers' in state) {
                    state.layers.forEach(function(layerName) {
                        if (layerName in nsGmx.gmxMap.layersByID) {
                            nsGmx.timelineControl.bindLayer(nsGmx.gmxMap.layersByID[layerName]);
                        }
                    });
                }
            },
            saveState: function()
            {
                var data = nsGmx.timelineControl.data,
                    range = data.get('range'),
                    selection = data.get('selection');

                //сохраняем дату как число
                for (var layerName in selection) {
                    selection[layerName] = selection[layerName].map(function(item) {
                        return {
                            date: item.date.valueOf(),
                            id: item.id
                        }
                    })
                }

                return {
                    version: '1.1.0',
                    dateStart:    range.start ? range.start.valueOf() : null,
                    dateEnd:      range.end ? range.end.valueOf() : null,
                    timelineMode: data.get('timelineMode'),
                    mapMode:      data.get('mapMode'),
                    layers:       _.pluck(data.get('layers'), 'name'), //layer ids
                    selection:    selection
                }
            }
        });
    },
    afterViewer: function(params, map){
        if (!map) return;

        nsGmx.ContextMenuController.addContextMenuElem({
            title: function() { return _gtxt("timeline.contextMemuTitle"); },
            isVisible: function(context)
            {
                return !context.layerManagerFlag &&
                        context.elem.type == "Vector" &&
                        context.elem.Temporal &&
                        context.elem.GeometryType !== 'point';
            },
            clickCallback: function(context)
            {
                nsGmx.timelineControl.bindLayer(nsGmx.gmxMap.layersByID[context.elem.name]);
            }
        }, 'Layer');
    },
    TimelineData: TimelineData
}

gmxCore.addModule("TimelineRCPlugin", publicInterface, {
    css: 'TimelineRCPlugin.css',
    init: function(module, path)
    {
        var def = $.Deferred();
        gmxCore.loadScriptWithCheck([
            {
                check: function(){ return window.links; },
                script: path + 'timeline/timeline.js',
                css: path + 'timeline/timeline.css'
            }
        ]).done(function()
        {
            gmxCore.loadScriptWithCheck([
            {
                check: function(){ return window.links.ItemLine; },
                script: path + 'timeline/LineItem.js'
            }]).done(function()
            {
                def.resolve();
            })
        });

        return def;
    }
});

})(jQuery)
