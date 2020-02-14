import nsGmx from './nsGmx.js';
import View from 'scanex-wmfs-view';
import 'scanex-wmfs-view/dist/scanex-wmfs-view.css';
import {leftMenu} from './menu.js';

const menu = new leftMenu();
let view;

function remove () {
    if (view) {
        view.$destroy();
    }
}

function addTo () {
    menu.createWorkCanvas('wmfs', remove, {});
    const el = document.querySelector('#left_wmfs').querySelector('.workCanvas');
    view = new View({
        target: el,
        props: {
            map: nsGmx.leafletMap
        }
    });       
}

export default addTo;