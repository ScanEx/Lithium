(function () {
    'use strict';

	window.nsGmx = window.nsGmx || {};

    var publicInterface = {
        pluginName: 'gmxPluginOuth2',
        params: {},
		map: null,		// текущая карта
        path: '',		// папка плагина
		locale: window.language === 'eng' ? 'en' : 'ru',

        afterViewer: function (params, map) {
			publicInterface.params = params;
			publicInterface.map = map || nsGmx.leafletMap;

			map.gmxControlsManager.setSvgSprites('//maps.kosmosnimki.ru/api/plugins/forestproject/icons/sprite.svg');
			map.gmxControlsManager.setSvgSprites('//www.kosmosnimki.ru/lib/geomixer_1.3/img/svg-symbols2.svg');
			publicInterface.load();
		},
        load: function() {
			var prefix = publicInterface.path + publicInterface.pluginName;
			var loadArr = [
				prefix + '.js',
				prefix + '.css',
				// publicInterface.path + 'ext/bootstrap.min.css',
				publicInterface.path + 'global.css'
			];
			var css = (new URLSearchParams(location.search)).getAll('css');
			if (css.length) {
				loadArr.push(css[0]);
			}
			Promise.all(loadArr.map(function(href) {
				return L.gmxUtil.requestLink(href);
			})).then(function() {
			
				var iconSidebar =  window.iconSidebarWidget,
					createTabFunction = window.createTabFunction;
				if (iconSidebar) {
					var menuId = 'forestView',
						node = null,
						treePane = iconSidebar.setPane(menuId, { createTab: createTabFunction({
								icon: 's-forest-plugin',
								hint: 'Legend'
							})
						}),
						toggle = function(flag) {
							//var flag = e.id === menuId;
							// console.log('toggle', flag); // true
							if (flag) {
								if (!node) {
									node = L.DomUtil.create('div', 'gmxDomRFViewCont');
									var hworld = new gmxDomRF.App({
										target: node,
										data: {
											// meta: true,		// фильтровать списки слоев по Meta
											templ: publicInterface.params.templ || '',
											num_points: publicInterface.params.num_points === 'false' ? false : true,
											stateSave: Number(publicInterface.params.stateSave) || 0,
											format: Number(publicInterface.params.format || 2),
											map: publicInterface.map,
											gmxMap: nsGmx.gmxMap
										}
									});
								}
								treePane.appendChild(node);
							} else if (node && node.parentNode) {
								node.parentNode.removeChild(node);
							}
						};
					// iconSidebar.on('opened', toggle.bind(this));
					// iconSidebar.on('closed', toggle.bind(this));
					// iconSidebar.on('closing', toggle.bind(this));
						
					iconSidebar.addEventListener('opened', function(e) {
						if (e.detail.id === menuId) { toggle(true); }
					}.bind(this));
					iconSidebar.addEventListener('closed', function(e) {
						toggle();
					}.bind(this));
					iconSidebar.addEventListener('closing', function(e) {
						toggle();
					}.bind(this));
				}
			}.bind(this));
		},
        unload: function() {
            var lmap = window.nsGmx.leafletMap,
                gmxControlsManager = lmap.gmxControlsManager,
                control = gmxControlsManager.get(publicInterface.pluginName);

			gmxControlsManager.remove(control);
		}
    };

    var pluginName = publicInterface.pluginName;
	if (window.gmxCore) {
		publicInterface.path = gmxCore.getModulePath(pluginName);
        window.gmxCore.addModule(pluginName, publicInterface, {
			require: ['LayerProperties']
		});
	} else {
		window.nsGmx[pluginName] = publicInterface;
	}
})();
