function parseLinearRing (linearRing) {
    const {children} = linearRing;
    return children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:coordinates':
                a = a.concat (parseCoordinates(e));                
                break;
            default:
                break;
        }
        return a;
    }, []);
}

function parseBoundary (outerBoundary) {
    const {children} = outerBoundary;
    return children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:LinearRing':
                a = a.concat (parseLinearRing(e));
                break;
            default:
                break;
        }
        return a;
    }, []);
}

function parsePolygon (polygon) {
    const {children} = polygon;
    const coordinates = children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:outerBoundaryIs':
                a.push (parseBoundary(e));
                break;
            case 'gml:innerBoundaryIs':
                a.push (parseBoundary(e));
                break;
            default:
                break;
        }
        return a;
    }, []);
    return {type: 'Polygon', coordinates};
}

function parsePolygonMember (polygon) {
    const {children} = polygon;
    return children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:Polygon':
                a.push (parsePolygon(e).coordinates);
                break;            
            default:
                break;
        }
        return a;
    }, []);    
}

function parseMultiPolygon (multiPolygon) {
    const {children} = multiPolygon;
    const coordinates = children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:polygonMember':
                a.push (parsePolygonMember(e));
                break;
            default:
                break;
        }
        return a;
    }, []);
    return {type: 'MultiPolygon', coordinates};
}

function parseGeometry (geometry) {
    const {children} = geometry;
    return children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:Polygon':
                a = parsePolygon(e);
                break;
            case 'gml:MultiPolygon':
                a = parseMultiPolygon(e);
                break;
            default:
                break;
        }
        return a;
    }, {});
}

const parseCoordinates = coordinates =>
    coordinates.value
        .split(/\s+/g)
        .filter(e => e)
        .map(e => e.split(',').map(v => parseFloat(v)));

function parseBox (box) {
    const {children} = box;
    return children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:coordinates':
                return parseCoordinates(e).reduce((b, p) => b.concat(p), []);                
            default:
                return a;
        }        
    }, []);
}

function parseBoundedBy(boundedBy) {
    const {children} = boundedBy;
    return children.reduce((a, e) => {
        switch(e.name) {
            case 'gml:Box':
                return parseBox(e);                
            default:
                return a;
        }        
    }, []);
}

function parseFeature(feature) {
    const {name, children} = feature.children[0];
    return children.reduce((a, e) => {        
        switch(e.name) {
            case 'gml:boundedBy':
                a.bbox = parseBoundedBy(e);
                break;
            case 'ms:msGeometry':
                a.geometry = parseGeometry(e);
                break;
            case 'ms:id':
            case 'ms:layer':
            case 'ms:border_color':
                a.properties[e.name] = e.value;
                break;
            default:
                break;
        }
        return a;
    },  {type: 'Feature', properties: {name}});
}

export default parseFeature;