module.exports = function (options) {
    const _baseUrl = window.serverBase || document.location.href.replace(/^(https?:).+/, "$1") + '//maps.kosmosnimki.ru/',
        _aisServices = _baseUrl + "Plugins/AIS/",
        _serverScript = _baseUrl + 'VectorLayer/Search.ashx';
    const { aisLastPoint:_aisLastPoint, 
        screenSearchLayer:_screenSearchLayer, 
        aisLayerID:_aisLayerID, 
        historyLayer:_historyLayer 
    } = options;

    return {
        baseUrl: _baseUrl,
        aisServices: _aisServices,
        getBorder: function () {
            var lmap = nsGmx.leafletMap;
            var dFeatures = lmap.gmxDrawing.getFeatures();
            if (dFeatures.length) { return dFeatures[dFeatures.length - 1].toGeoJSON(); }
            var latLngBounds = lmap.getBounds(),
                sw = latLngBounds.getSouthWest(),
                ne = latLngBounds.getNorthEast(),
                min = { x: sw.lng, y: sw.lat },
                max = { x: ne.lng, y: ne.lat },
                minX = min.x,
                maxX = max.x,
                geo = { type: 'Polygon', coordinates: [[[minX, min.y], [minX, max.y], [maxX, max.y], [maxX, min.y], [minX, min.y]]] },
                w = (maxX - minX) / 2;

            if (w >= 180) {
                geo = { type: 'Polygon', coordinates: [[[-180, min.y], [-180, max.y], [180, max.y], [180, min.y], [-180, min.y]]] };
            }
            else if (maxX > 180 || minX < -180) {
                var center = ((maxX + minX) / 2) % 360;
                if (center > 180) { center -= 360; }
                else if (center < -180) { center += 360; }
                minX = center - w; maxX = center + w;
                if (minX < -180) {
                    geo = {
                        type: 'MultiPolygon', coordinates: [
                            [[[-180, min.y], [-180, max.y], [maxX, max.y], [maxX, min.y], [-180, min.y]]],
                            [[[minX + 360, min.y], [minX + 360, max.y], [180, max.y], [180, min.y], [minX + 360, min.y]]]
                        ]
                    };
                } else if (maxX > 180) {
                    geo = {
                        type: 'MultiPolygon', coordinates: [
                            [[[minX, min.y], [minX, max.y], [180, max.y], [180, min.y], [minX, min.y]]],
                            [[[-180, min.y], [-180, max.y], [maxX - 360, max.y], [maxX - 360, min.y], [-180, min.y]]]
                        ]
                    };
                }
            }
            return geo;
        },

        formatTime: function (d, local) {
            var temp = new Date(d)
            if (!local)
                temp.setMinutes(temp.getMinutes() + temp.getTimezoneOffset())
            return temp.toLocaleTimeString();
        },
        formatDate: function (d, local) {
            var temp = new Date(d)
            if (!local)
                temp.setMinutes(temp.getMinutes() + temp.getTimezoneOffset())
            return temp.toLocaleDateString();
        },
        formatDateTime: function (d, local) {
            if (d.isNaN)
                return "";
            var temp = new Date(d)
            if (!local)
                temp.setMinutes(temp.getMinutes() + temp.getTimezoneOffset())
            return temp.toLocaleString().replace(/,/, "");
        },

        formatDate2: function (d, local) {
            var dd, m, y, h, mm;
            if (local) {
                dd = ("0" + d.getDate()).slice(-2);
                m = ("0" + (d.getMonth() + 1)).slice(-2);
                y = d.getFullYear();
                h = ("0" + d.getHours()).slice(-2);
                mm = ("0" + d.getMinutes()).slice(-2);
                return dd + "." + m + "." + y + " " + h + ":" + mm +
                    " (" + ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2) + " UTC)";
            }
            else {
                dd = ("0" + d.getUTCDate()).slice(-2);
                m = ("0" + (d.getUTCMonth() + 1)).slice(-2);
                y = d.getUTCFullYear();
                h = ("0" + d.getUTCHours()).slice(-2);
                mm = ("0" + d.getUTCMinutes()).slice(-2);
                var
                    ldd = ("0" + d.getDate()).slice(-2),
                    lm = ("0" + (d.getMonth() + 1)).slice(-2),
                    ly = d.getFullYear(),
                    lh = ("0" + d.getHours()).slice(-2),
                    lmm = ("0" + d.getMinutes()).slice(-2),
                    offset = -d.getTimezoneOffset() / 60;
                return dd + "." + m + "." + y + " <span class='utc'>" + h + ":" + mm + " UTC</span> (" + lh + ":" + lmm + ")"
                //return dd+"."+m+"."+y+" "+h+":"+mm+" UTC <br>"+
                //"<span class='small'>("+ldd+"."+lm+"."+ly+" "+lh+":"+lmm+" UTC"+(offset>0?"+":"")+offset+")</span>";
            }
        },
        placeVesselTypeIcon: function(vessel){
            switch (vessel.vessel_type.toLowerCase()) {
                case "cargo":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Ccargo-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
                case "tanker":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Ctanker-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
                case "fishing":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Cfishing-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
                case "passenger":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Cpassenger-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;                
                case "hsc":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Chighspeed-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
                case "pleasure craft":
                case "sailing":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Cpleasure-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
                case "unknown": 
                case "reserved": 
                case "other":
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Cother-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
                default:
                    vessel.icon = "//maps.kosmosnimki.ru/GetImage.ashx?usr=haibrahmanov%40scanex.ru&img=AIS%5Cspecialcraft-L-100-" +
                        (vessel.sog != 0 ? "move" : "stand") + ".svg"
                    break;
            }
        },
        searchString: function (searchString, isfuzzy, callback) {
            //console.log("http://kosmosnimki.ru/demo/lloyds/api/v1/Ship/Search/"+searchString)
            //L.gmxUtil.sendCrossDomainPostRequest("http://kosmosnimki.ru/demo/lloyds/api/v1/Ship/Search/"+searchString, request, callback);
        }
    };
};