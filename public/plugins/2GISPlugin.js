﻿(function($){

var publicInterface = {
    pluginName: 'API 2GIS',
    beforeViewer: function(params, map)
    {
        if (!map) return;
        var gis = map.addObject();
        gis.setVisible(false);
        gis.setTiles(function(x, y, z)
        {
            var size = Math.pow(2, z - 1);
            return window.location.protocol + "//tile2.maps.2gis.com/tiles?x="  + (x+ size) + "&y=" + (size - y - 1) + "&z=" + z + "&v=4";
        }, 1);
        gis.bringToBottom();
        gis.setCopyright("<a href='" + window.location.protocol + "//help.2gis.ru/api-rules/#kart'>&copy; ООО «ДубльГИС»</a>");
        gis.setAsBaseLayer("2GIS");
    }
}

window.gmxCore && window.gmxCore.addModule('2GISPlugin', publicInterface);

})(jQuery);
