const BaseView = require('./BaseView.js');
const MyFleetView = function (model, tools){
    _tools = tools;
    BaseView.call(this, model);
    this.topOffset = 160;
    this.frame = $(Handlebars.compile('<div class="ais_view myfleet_view">' +
    '<table class="instruments">'+
    '<tr><td>'+
    '<label class="sync-switch switch"><input type="checkbox">'+
    '<div class="sync-switch-slider switch-slider round"></div></label>' +
    '<span class="sync-switch-slider-description">{{i "AISSearch2.myFleetOnly"}}</span>'+
    '</td>' +
    '</table>'+    
    '<table class="results">'+
    '<td><input type="checkbox" checked></td>' +
    '<td class="count"></td>' +
    '<td><div class="refresh clicable"><div>' + this.gifLoader + '</div></div></td></tr>' +
    '</table>'+
    '<div class="ais_vessels">'+
    '<div class="ais_vessel">' +
    '<table border=0><tr>' +
    '<td><input type="checkbox" checked></td>' +
    '<td><div class="position">vessel_name</div><div>mmsi: mmsi imo: imo</div></td>' +
    '<td></td>' +  
    '<td><span class="date">ts_pos_utc</span></td>'+
    //'<td><div class="info" vessel="aisjson this" title="i AISSearch2.info">' +
    //'<img src="plugins/AIS/AISSearch/svg/info.svg"><div></td>' +
    '</tr></table>' +
    '</div>' +      
    '</div>' +
    '</div>')());
    this.container = this.frame.find('.ais_vessels'); 
    this.frame.find('.results input[type="checkbox"]').on("click", ((e)=>{
        this.frame.find('.ais_vessel input[type="checkbox"]').each((i, elm)=>{
            elm.checked = e.target.checked;
        }) 
        _hideOnMap.call(this);
    }).bind(this)); 
    this.frame.find('.instruments .switch input[type="checkbox"]').on("click", ((e)=>{
        _tools.displayingMyFleet = null;
        if (e.currentTarget.checked && this.model.data.vessels) {
            let myfleet = this.model.data.vessels.map(v => v.mmsi);
            if (myfleet.length > 0)
                _tools.displayingMyFleet = myfleet;
        }
        _tools.hideAllOnMap();
    }).bind(this)); 

    this.tableTemplate = '{{#each vessels}}' +
    '<div class="ais_vessel">' +
    '<table border=0><tr>' +
    '<td><input type="checkbox" checked></td>' +
    '<td><div class="position">{{vessel_name}}</div><div>mmsi: {{mmsi}} imo: {{imo}}</div></td>' +
    '<td><img src="{{icon}}" class="course rotateimg{{icon_rot}}">' +
    '<div class="info" vessel="{{aisjson this}}" title="{{i "AISSearch2.info"}}">' +
    '<img src="plugins/AIS/AISSearch/svg/info.svg"></div>' + 
    '</td>' +  
    '<td>' +
    '<div class="ais_info_dialog_close-button exclude" title="{{i "AISSearch2.vesselExclude"}}"></div>' +
    '<span class="date">{{dt_pos_utc}}</span></td>'+
    '</tr></table>' +
    '</div>' +
    '{{/each}}' +
    '{{#each msg}}<div class="msg">{{txt}}</div>{{/each}}';
};

MyFleetView.prototype = Object.create(BaseView.prototype);

MyFleetView.prototype.inProgress = function (state) {
    let progress = this.frame.find('.refresh div');
    if (state)
        progress.show();
    else
        progress.hide();
};

let _clean = function(){  
    if (this.frame.find('.ais_vessel')[0])
        this.frame.find('.ais_vessel input[type="checkbox"]').off('click');
    let count = this.model.data && this.model.data.vessels ? this.model.data.vessels.length : 0;
    this.frame.find('.count').text(_gtxt('AISSearch2.found') + count);
},
_tools,
_hideOnMap = function(){
    _tools.filtered = [];
    let selectAll = this.frame.find('.results input[type="checkbox"]'),
        selectOne = this.frame.find('.ais_vessel input[type="checkbox"]');
    for (let i = 0; i < selectOne.length; i++)
        if (!selectOne[i].checked) {
            _tools.filtered.push(this.model.data.vessels[i].mmsi);
            selectAll[0].checked = false;
        }
    if (_tools.filtered.length == 0)
        selectAll[0].checked = true;

    _tools.hideOnMap();    
};

MyFleetView.prototype.repaint = function () {
    _clean.call(this);  
    BaseView.prototype.repaint.apply(this, arguments);
    
    _tools.filtered = _filteredState.map(mmsi=>mmsi);
    //_displayngState && (_tools.displayingMyFleet = _displayngState.map(v=>v));
    if (_displayngState)
        _tools.displayingMyFleet = this.model.data.vessels.map(v=>v.mmsi)

    if (_tools.displayingMyFleet)
        this.frame.find('.instruments .switch input[type="checkbox"]')[0].checked = true;
    this.frame.find('.results input[type="checkbox"]')[0].checked = !_tools.filtered.length; 
    _tools.hideAllOnMap();

    this.frame.find('.ais_vessel input[type="checkbox"]').each(((i, elm)=>{
        let mmsi = this.model.data.vessels[i].mmsi;
        elm.checked = _tools.filtered.indexOf(mmsi)<0;
        $(elm).on('click', (e) => {
            e.stopPropagation();
            _hideOnMap.call(this);
        });
    }).bind(this));
    this.frame.find('.ais_vessel .exclude').each(((i, elm)=>{
        let view = this;
        $(elm).on('click', (e) => {
            e.stopPropagation();
            $(elm).off('click');
            let vessel = view.model.data.vessels[i];
            view.prepare(vessel);
            let dlg = $('.ui-dialog:contains("' + vessel.mmsi + '")');
            if (dlg[0]){ 
                dlg.find('.button.addremove').click();
            }
            else{
                view.model.changeFilter(vessel).then(function () {
                    if (view.isActive)
                        view.show();
                })
            }
        })
    }).bind(this));

};

let _filteredState = [], _displayngState;

MyFleetView.prototype.prepare = function (vessel) {
    if (this.isActive){
        _filteredState = _tools.filtered.filter(mmsi=>mmsi!=vessel.mmsi);
        _displayngState = _tools.displayingMyFleet ? _tools.displayingMyFleet.filter(mmsi=>mmsi!=vessel.mmsi) : null;   
        if (_displayngState && _displayngState.length==0)
            _displayngState = null;
    }
}

MyFleetView.prototype.hide = function () {
    if (this.isActive){
        _filteredState = _tools.filtered.map(v=>v);
        _displayngState = _tools.displayingMyFleet ? _tools.displayingMyFleet.map(v=>v) : null;

        _tools.filtered = [];   
        _tools.displayingMyFleet = null;
        _tools.hideAllOnMap();
    }
    BaseView.prototype.hide.apply(this, arguments);
}
// MyFleetView.prototype.show = function () {
//     BaseView.prototype.show.apply(this, arguments); 
// }
module.exports = MyFleetView;