/*
 * Raphael 1.2.8 - JavaScript Vector Library
 *
 * Copyright (c) 2008 - 2009 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

window.Raphael=(function(){var a=/[, ]+/,aH=/^(circle|rect|path|ellipse|text|image)$/,G=document,an=window,k={was:"Raphael" in an,is:an.Raphael},ai=function(){if(ai.is(arguments[0],"array")){var e=arguments[0],E=t[aO](ai,e.splice(0,3+ai.is(e[0],ag))),aS=E.set();for(var S=0,aT=e[l];S<aT;S++){var R=e[S]||{};aH.test(R.type)&&aS[d](E[R.type]().attr(R));}return aS;}return t[aO](ai,arguments);},aE="appendChild",aO="apply",aL="concat",am="",ah=" ",A="click dblclick mousedown mousemove mouseout mouseover mouseup".split(ah),L="hasOwnProperty",ae=/^\[object\s+|\]$/gi,ar="join",l="length",aQ="prototype",aR=String[aQ].toLowerCase,W=Math,f=W.max,aB=W.min,ag="number",at="toString",ap=Object[aQ][at],aJ={},aF=W.pow,d="push",aM=/^(?=[\da-f]$)/,c=/^url\(['"]?([^\)]+)['"]?\)$/i,u=/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgb\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|rgb\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i,J=W.round,s="setAttribute",w="split",P=parseFloat,B=parseInt,aG=String[aQ].toUpperCase,h={"clip-rect":"0 0 10e9 10e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/",opacity:1,path:"M0,0",r:0,rotation:0,rx:0,ry:0,scale:"1 1",src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",translation:"0 0",width:0,x:0,y:0},U={"clip-rect":"csv",cx:ag,cy:ag,fill:"colour","fill-opacity":ag,"font-size":ag,height:ag,opacity:ag,path:"path",r:ag,rotation:"csv",rx:ag,ry:ag,scale:"csv",stroke:"colour","stroke-opacity":ag,"stroke-width":ag,translation:"csv",width:ag,x:ag,y:ag},aI="replace";ai.version="1.2.8";ai.type=(an.SVGAngle||G.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML");ai.svg=!(ai.vml=ai.type=="VML");ai._id=0;ai._oid=0;ai.fn={};ai.is=function(i,e){e=aR.call(e);return((e=="object"||e=="undefined")&&typeof i==e)||(i==null&&e=="null")||aR.call(ap.call(i)[aI](ae,am))==e;};ai.setWindow=function(e){an=e;G=an.document;};var aw=function(E){if(ai.vml){var e=/^\s+|\s+$/g;aw=ad(function(S){var aS;S=(S+am)[aI](e,am);try{var aT=new ActiveXObject("htmlfile");aT.write("<body>");aT.close();aS=aT.body;}catch(aV){aS=createPopup().document.body;}var i=aS.createTextRange();try{aS.style.color=S;var aU=i.queryCommandValue("ForeColor");aU=((aU&255)<<16)|(aU&65280)|((aU&16711680)>>>16);return"#"+("000000"+aU[at](16)).slice(-6);}catch(aV){return"none";}});}else{var R=G.createElement("i");R.title="Rapha\xebl Colour Picker";R.style.display="none";G.body[aE](R);aw=ad(function(i){R.style.color=i;return G.defaultView.getComputedStyle(R,am).getPropertyValue("color");});}return aw(E);};ai.hsb2rgb=ad(function(aW,aU,a0){if(ai.is(aW,"object")&&"h" in aW&&"s" in aW&&"b" in aW){a0=aW.b;aU=aW.s;aW=aW.h;}var S,aS,a1;if(a0==0){return{r:0,g:0,b:0,hex:"#000"};}if(aW>1||aU>1||a0>1){aW/=255;aU/=255;a0/=255;}var aT=~~(aW*6),aX=(aW*6)-aT,R=a0*(1-aU),E=a0*(1-(aU*aX)),a2=a0*(1-(aU*(1-aX)));S=[a0,E,R,R,a2,a0,a0][aT];aS=[a2,a0,a0,E,R,R,a2][aT];a1=[R,R,a2,a0,a0,E,R][aT];S*=255;aS*=255;a1*=255;var aY={r:S,g:aS,b:a1},e=(~~S)[at](16),aV=(~~aS)[at](16),aZ=(~~a1)[at](16);e=e[aI](aM,"0");aV=aV[aI](aM,"0");aZ=aZ[aI](aM,"0");aY.hex="#"+e+aV+aZ;return aY;},ai);ai.rgb2hsb=ad(function(e,i,aU){if(ai.is(e,"object")&&"r" in e&&"g" in e&&"b" in e){aU=e.b;i=e.g;e=e.r;}if(ai.is(e,"string")){var aW=ai.getRGB(e);e=aW.r;i=aW.g;aU=aW.b;}if(e>1||i>1||aU>1){e/=255;i/=255;aU/=255;}var aT=f(e,i,aU),E=aB(e,i,aU),S,R,aS=aT;if(E==aT){return{h:0,s:0,b:aT};}else{var aV=(aT-E);R=aV/aT;if(e==aT){S=(i-aU)/aV;}else{if(i==aT){S=2+((aU-e)/aV);}else{S=4+((e-i)/aV);}}S/=6;S<0&&S++;S>1&&S--;}return{h:S,s:R,b:aS};},ai);var ax=/,?([achlmqrstvxz]),?/gi;ai._path2string=function(){return this.join(",")[aI](ax,"$1");};function ad(R,i,e){function E(){var S=Array[aQ].slice.call(arguments,0),aT=S[ar]("\u25ba"),aS=E.cache=E.cache||{},aU=E.count=E.count||[];if(aS[L](aT)){return e?e(aS[aT]):aS[aT];}aU[l]>=1000&&delete aS[aU.shift()];aU[d](aT);aS[aT]=R[aO](i,S);return e?e(aS[aT]):aS[aT];}return E;}ai.getRGB=ad(function(e){if(!e||!!((e=e+am).indexOf("-")+1)){return{r:-1,g:-1,b:-1,hex:"none",error:1};}if(e=="none"){return{r:-1,g:-1,b:-1,hex:"none"};}!(({hs:1,rg:1})[L](e.substring(0,2))||e.charAt()=="#")&&(e=aw(e));var aS,E,R,aV,aW,aT=e.match(u);if(aT){if(aT[2]){aV=B(aT[2].substring(5),16);R=B(aT[2].substring(3,5),16);E=B(aT[2].substring(1,3),16);}if(aT[3]){aV=B((aW=aT[3].charAt(3))+aW,16);R=B((aW=aT[3].charAt(2))+aW,16);E=B((aW=aT[3].charAt(1))+aW,16);}if(aT[4]){aT=aT[4][w](/\s*,\s*/);E=P(aT[0]);R=P(aT[1]);aV=P(aT[2]);}if(aT[5]){aT=aT[5][w](/\s*,\s*/);E=P(aT[0])*2.55;R=P(aT[1])*2.55;aV=P(aT[2])*2.55;}if(aT[6]){aT=aT[6][w](/\s*,\s*/);E=P(aT[0]);R=P(aT[1]);aV=P(aT[2]);return ai.hsb2rgb(E,R,aV);}if(aT[7]){aT=aT[7][w](/\s*,\s*/);E=P(aT[0])*2.55;R=P(aT[1])*2.55;aV=P(aT[2])*2.55;return ai.hsb2rgb(E,R,aV);}aT={r:E,g:R,b:aV};var i=(~~E)[at](16),S=(~~R)[at](16),aU=(~~aV)[at](16);i=i[aI](aM,"0");S=S[aI](aM,"0");aU=aU[aI](aM,"0");aT.hex="#"+i+S+aU;return aT;}return{r:-1,g:-1,b:-1,hex:"none",error:1};},ai);ai.getColor=function(i){var E=this.getColor.start=this.getColor.start||{h:0,s:1,b:i||0.75},e=this.hsb2rgb(E.h,E.s,E.b);E.h+=0.075;if(E.h>1){E.h=0;E.s-=0.2;E.s<=0&&(this.getColor.start={h:0,s:1,b:E.b});}return e.hex;};ai.getColor.reset=function(){delete this.start;};ai.parsePathString=ad(function(e){if(!e){return null;}var E={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},i=[];if(ai.is(e,"array")&&ai.is(e[0],"array")){i=ao(e);}if(!i[l]){(e+am)[aI](/([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,function(S,R,aU){var aT=[],aS=aR.call(R);aU[aI](/(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,function(aW,aV){aV&&aT[d](+aV);});while(aT[l]>=E[aS]){i[d]([R][aL](aT.splice(0,E[aS])));if(!E[aS]){break;}}});}i[at]=ai._path2string;return i;});var N=ad(function(aY){if(!aY){return{x:0,y:0,width:0,height:0};}aY=C(aY);var aV=0,aU=0,S=[],E=[],R;for(var aS=0,aX=aY[l];aS<aX;aS++){R=aY[aS];if(R[0]=="M"){aV=R[1];aU=R[2];S[d](aV);E[d](aU);}else{var aT=au(aV,aU,R[1],R[2],R[3],R[4],R[5],R[6]);S=S[aL](aT.min.x,aT.max.x);E=E[aL](aT.min.y,aT.max.y);aV=R[5];aU=R[6];}}var e=aB[aO](0,S),aW=aB[aO](0,E);return{x:e,y:aW,width:f[aO](0,S)-e,height:f[aO](0,E)-aW};}),ao=function(aT){var R=[];if(!ai.is(aT,"array")||!ai.is(aT&&aT[0],"array")){aT=ai.parsePathString(aT);}for(var E=0,S=aT[l];E<S;E++){R[E]=[];for(var e=0,aS=aT[E][l];e<aS;e++){R[E][e]=aT[E][e];}}R[at]=ai._path2string;return R;},Y=ad(function(S){if(!ai.is(S,"array")||!ai.is(S&&S[0],"array")){S=ai.parsePathString(S);}var aX=[],aZ=0,aY=0,a2=0,a1=0,R=0;if(S[0][0]=="M"){aZ=S[0][1];aY=S[0][2];a2=aZ;a1=aY;R++;aX[d](["M",aZ,aY]);}for(var aU=R,a3=S[l];aU<a3;aU++){var e=aX[aU]=[],a0=S[aU];if(a0[0]!=aR.call(a0[0])){e[0]=aR.call(a0[0]);switch(e[0]){case"a":e[1]=a0[1];e[2]=a0[2];e[3]=a0[3];e[4]=a0[4];e[5]=a0[5];e[6]=+(a0[6]-aZ).toFixed(3);e[7]=+(a0[7]-aY).toFixed(3);break;case"v":e[1]=+(a0[1]-aY).toFixed(3);break;case"m":a2=a0[1];a1=a0[2];default:for(var aT=1,aV=a0[l];aT<aV;aT++){e[aT]=+(a0[aT]-((aT%2)?aZ:aY)).toFixed(3);}}}else{e=aX[aU]=[];if(a0[0]=="m"){a2=a0[1]+aZ;a1=a0[2]+aY;}for(var aS=0,E=a0[l];aS<E;aS++){aX[aU][aS]=a0[aS];}}var aW=aX[aU][l];switch(aX[aU][0]){case"z":aZ=a2;aY=a1;break;case"h":aZ+=+aX[aU][aW-1];break;case"v":aY+=+aX[aU][aW-1];break;default:aZ+=+aX[aU][aW-2];aY+=+aX[aU][aW-1];}}aX[at]=ai._path2string;return aX;},0,ao),p=ad(function(S){if(!ai.is(S,"array")||!ai.is(S&&S[0],"array")){S=ai.parsePathString(S);}var aW=[],aY=0,aX=0,a1=0,a0=0,R=0;if(S[0][0]=="M"){aY=+S[0][1];aX=+S[0][2];a1=aY;a0=aX;R++;aW[0]=["M",aY,aX];}for(var aU=R,a2=S[l];aU<a2;aU++){var e=aW[aU]=[],aZ=S[aU];if(aZ[0]!=aG.call(aZ[0])){e[0]=aG.call(aZ[0]);switch(e[0]){case"A":e[1]=aZ[1];e[2]=aZ[2];e[3]=aZ[3];e[4]=aZ[4];e[5]=aZ[5];e[6]=+(aZ[6]+aY);e[7]=+(aZ[7]+aX);break;case"V":e[1]=+aZ[1]+aX;break;case"H":e[1]=+aZ[1]+aY;break;case"M":a1=+aZ[1]+aY;a0=+aZ[2]+aX;default:for(var aT=1,aV=aZ[l];aT<aV;aT++){e[aT]=+aZ[aT]+((aT%2)?aY:aX);}}}else{for(var aS=0,E=aZ[l];aS<E;aS++){aW[aU][aS]=aZ[aS];}}switch(e[0]){case"Z":aY=a1;aX=a0;break;case"H":aY=e[1];break;case"V":aX=e[1];break;default:aY=aW[aU][aW[aU][l]-2];aX=aW[aU][aW[aU][l]-1];}}aW[at]=ai._path2string;return aW;},null,ao),aP=function(i,R,e,E){return[i,R,e,E,e,E];},aD=function(i,R,aT,S,e,E){var aS=1/3,aU=2/3;return[aS*i+aU*aT,aS*R+aU*S,aS*e+aU*aT,aS*E+aU*S,e,E];},F=function(a2,bw,bb,a9,a3,aX,aS,a1,bv,a4){var S=W.PI,a8=S*120/180,e=S/180*(+a3||0),bf=[],bc,bs=ad(function(bx,bA,i){var bz=bx*W.cos(i)-bA*W.sin(i),by=bx*W.sin(i)+bA*W.cos(i);return{x:bz,y:by};});if(!a4){bc=bs(a2,bw,-e);a2=bc.x;bw=bc.y;bc=bs(a1,bv,-e);a1=bc.x;bv=bc.y;var E=W.cos(S/180*a3),aZ=W.sin(S/180*a3),bh=(a2-a1)/2,bg=(bw-bv)/2;bb=f(bb,W.abs(bh));a9=f(a9,W.abs(bg));var R=bb*bb,bk=a9*a9,bm=(aX==aS?-1:1)*W.sqrt(W.abs((R*bk-R*bg*bg-bk*bh*bh)/(R*bg*bg+bk*bh*bh))),a6=bm*bb*bg/a9+(a2+a1)/2,a5=bm*-a9*bh/bb+(bw+bv)/2,aW=W.asin(((bw-a5)/a9).toFixed(7)),aV=W.asin(((bv-a5)/a9).toFixed(7));aW=a2<a6?S-aW:aW;aV=a1<a6?S-aV:aV;aW<0&&(aW=S*2+aW);aV<0&&(aV=S*2+aV);if(aS&&aW>aV){aW=aW-S*2;}if(!aS&&aV>aW){aV=aV-S*2;}}else{aW=a4[0];aV=a4[1];a6=a4[2];a5=a4[3];}var a0=aV-aW;if(W.abs(a0)>a8){var a7=aV,ba=a1,aY=bv;aV=aW+a8*(aS&&aV>aW?1:-1);a1=a6+bb*W.cos(aV);bv=a5+a9*W.sin(aV);bf=F(a1,bv,bb,a9,a3,0,aS,ba,aY,[aV,a7,a6,a5]);}a0=aV-aW;var aU=W.cos(aW),bu=W.sin(aW),aT=W.cos(aV),bt=W.sin(aV),bi=W.tan(a0/4),bl=4/3*bb*bi,bj=4/3*a9*bi,br=[a2,bw],bq=[a2+bl*bu,bw-bj*aU],bp=[a1+bl*bt,bv-bj*aT],bn=[a1,bv];bq[0]=2*br[0]-bq[0];bq[1]=2*br[1]-bq[1];if(a4){return[bq,bp,bn][aL](bf);}else{bf=[bq,bp,bn][aL](bf)[ar]()[w](",");var bd=[];for(var bo=0,be=bf[l];bo<be;bo++){bd[bo]=bo%2?bs(bf[bo-1],bf[bo],e).y:bs(bf[bo],bf[bo+1],e).x;}return bd;}},H=ad(function(i,e,R,E,aV,aU,aT,aS,aW){var S=1-aW;return{x:aF(S,3)*i+aF(S,2)*3*aW*R+S*3*aW*aW*aV+aF(aW,3)*aT,y:aF(S,3)*e+aF(S,2)*3*aW*E+S*3*aW*aW*aU+aF(aW,3)*aS};}),av=ad(function(i,e,a6,a4,aS,S,aU,aT,a0){var aY=1-a0,aX=aF(aY,3)*i+aF(aY,2)*3*a0*a6+aY*3*a0*a0*aS+aF(a0,3)*aU,aV=aF(aY,3)*e+aF(aY,2)*3*a0*a4+aY*3*a0*a0*S+aF(a0,3)*aT,a2=i+2*a0*(a6-i)+a0*a0*(aS-2*a6+i),a1=e+2*a0*(a4-e)+a0*a0*(S-2*a4+e),a5=a6+2*a0*(aS-a6)+a0*a0*(aU-2*aS+a6),a3=a4+2*a0*(S-a4)+a0*a0*(aT-2*S+a4),aZ=(1-a0)*i+a0*a6,aW=(1-a0)*e+a0*a4,R=(1-a0)*aS+a0*aU,E=(1-a0)*S+a0*aT;return{x:aX,y:aV,m:{x:a2,y:a1},n:{x:a5,y:a3},start:{x:aZ,y:aW},end:{x:R,y:E}};}),au=ad(function(E,e,S,R,a2,a1,aY,aV){var a0=(a2-2*S+E)-(aY-2*a2+S),aX=2*(S-E)-2*(a2-S),aU=E-S,aT=(-aX+W.sqrt(aX*aX-4*a0*aU))/2/a0,aS=(-aX-W.sqrt(aX*aX-4*a0*aU))/2/a0,aW=[e,aV],aZ=[E,aY],i;W.abs(aT)>1000000000000&&(aT=0.5);W.abs(aS)>1000000000000&&(aS=0.5);if(aT>0&&aT<1){i=H(E,e,S,R,a2,a1,aY,aV,aT);aZ[d](i.x);aW[d](i.y);}if(aS>0&&aS<1){i=H(E,e,S,R,a2,a1,aY,aV,aS);aZ[d](i.x);aW[d](i.y);}a0=(a1-2*R+e)-(aV-2*a1+R);aX=2*(R-e)-2*(a1-R);aU=e-R;aT=(-aX+W.sqrt(aX*aX-4*a0*aU))/2/a0;aS=(-aX-W.sqrt(aX*aX-4*a0*aU))/2/a0;W.abs(aT)>1000000000000&&(aT=0.5);W.abs(aS)>1000000000000&&(aS=0.5);if(aT>0&&aT<1){i=H(E,e,S,R,a2,a1,aY,aV,aT);aZ[d](i.x);aW[d](i.y);}if(aS>0&&aS<1){i=H(E,e,S,R,a2,a1,aY,aV,aS);aZ[d](i.x);aW[d](i.y);}return{min:{x:aB[aO](0,aZ),y:aB[aO](0,aW)},max:{x:f[aO](0,aZ),y:f[aO](0,aW)}};}),C=ad(function(a2,aX){var S=p(a2),aY=aX&&p(aX),aZ={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},e={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},aT=function(a3,a4){var i,a5;if(!a3){return["C",a4.x,a4.y,a4.x,a4.y,a4.x,a4.y];}!(a3[0] in {T:1,Q:1})&&(a4.qx=a4.qy=null);switch(a3[0]){case"M":a4.X=a3[1];a4.Y=a3[2];break;case"A":a3=["C"][aL](F[aO](0,[a4.x,a4.y][aL](a3.slice(1))));break;case"S":i=a4.x+(a4.x-(a4.bx||a4.x));a5=a4.y+(a4.y-(a4.by||a4.y));a3=["C",i,a5][aL](a3.slice(1));break;case"T":a4.qx=a4.x+(a4.x-(a4.qx||a4.x));a4.qy=a4.y+(a4.y-(a4.qy||a4.y));a3=["C"][aL](aD(a4.x,a4.y,a4.qx,a4.qy,a3[1],a3[2]));break;case"Q":a4.qx=a3[1];a4.qy=a3[2];a3=["C"][aL](aD(a4.x,a4.y,a3[1],a3[2],a3[3],a3[4]));break;case"L":a3=["C"][aL](aP(a4.x,a4.y,a3[1],a3[2]));break;case"H":a3=["C"][aL](aP(a4.x,a4.y,a3[1],a4.y));break;case"V":a3=["C"][aL](aP(a4.x,a4.y,a4.x,a3[1]));break;case"Z":a3=["C"][aL](aP(a4.x,a4.y,a4.X,a4.Y));break;}return a3;},E=function(a3,a4){if(a3[a4][l]>7){a3[a4].shift();var a5=a3[a4];while(a5[l]){a3.splice(a4++,0,["C"][aL](a5.splice(0,6)));}a3.splice(a4,1);a0=f(S[l],aY&&aY[l]||0);}},R=function(a7,a6,a4,a3,a5){if(a7&&a6&&a7[a5][0]=="M"&&a6[a5][0]!="M"){a6.splice(a5,0,["M",a3.x,a3.y]);a4.bx=0;a4.by=0;a4.x=a7[a5][1];a4.y=a7[a5][2];a0=f(S[l],aY&&aY[l]||0);}};for(var aV=0,a0=f(S[l],aY&&aY[l]||0);aV<a0;aV++){S[aV]=aT(S[aV],aZ);E(S,aV);aY&&(aY[aV]=aT(aY[aV],e));aY&&E(aY,aV);R(S,aY,aZ,e,aV);R(aY,S,e,aZ,aV);var aU=S[aV],a1=aY&&aY[aV],aS=aU[l],aW=aY&&a1[l];aZ.x=aU[aS-2];aZ.y=aU[aS-1];aZ.bx=P(aU[aS-4])||aZ.x;aZ.by=P(aU[aS-3])||aZ.y;e.bx=aY&&(P(a1[aW-4])||e.x);e.by=aY&&(P(a1[aW-3])||e.y);e.x=aY&&a1[aW-2];e.y=aY&&a1[aW-1];}return aY?[S,aY]:S;},null,ao),n=ad(function(aW){var aV=[];for(var aS=0,aX=aW[l];aS<aX;aS++){var e={},aU=aW[aS].match(/^([^:]*):?([\d\.]*)/);e.color=ai.getRGB(aU[1]);if(e.color.error){return null;}e.color=e.color.hex;aU[2]&&(e.offset=aU[2]+"%");aV[d](e);}for(var aS=1,aX=aV[l]-1;aS<aX;aS++){if(!aV[aS].offset){var E=P(aV[aS-1].offset||0),R=0;for(var S=aS+1;S<aX;S++){if(aV[S].offset){R=aV[S].offset;break;}}if(!R){R=100;S=aX;}R=P(R);var aT=(R-E)/(S-aS+1);for(;aS<S;aS++){E+=aT;aV[aS].offset=E+"%";}}}return aV;}),aj=function(){var E,i,S,R,e;if(ai.is(arguments[0],"string")||ai.is(arguments[0],"object")){if(ai.is(arguments[0],"string")){E=G.getElementById(arguments[0]);}else{E=arguments[0];}if(E.tagName){if(arguments[1]==null){return{container:E,width:E.style.pixelWidth||E.offsetWidth,height:E.style.pixelHeight||E.offsetHeight};}else{return{container:E,width:arguments[1],height:arguments[2]};}}}else{if(ai.is(arguments[0],ag)&&arguments[l]>3){return{container:1,x:arguments[0],y:arguments[1],width:arguments[2],height:arguments[3]};}}},az=function(e,E){var i=this;for(var R in E){if(E[L](R)&&!(R in e)){switch(typeof E[R]){case"function":(function(S){e[R]=e===i?S:function(){return S[aO](i,arguments);};})(E[R]);break;case"object":e[R]=e[R]||{};az.call(this,e[R],E[R]);break;default:e[R]=E[R];break;}}}},af=function(e,i){e==i.top&&(i.top=e.prev);e==i.bottom&&(i.bottom=e.next);e.next&&(e.next.prev=e.prev);e.prev&&(e.prev.next=e.next);},T=function(e,i){if(i.top===e){return;}af(e,i);e.next=null;e.prev=i.top;i.top.next=e;i.top=e;},j=function(e,i){if(i.bottom===e){return;}af(e,i);e.next=i.bottom;e.prev=null;i.bottom.prev=e;i.bottom=e;},x=function(i,e,E){af(i,E);e==E.top&&(E.top=i);e.next&&(e.next.prev=i);i.next=e.next;i.prev=e;e.next=i;},ak=function(i,e,E){af(i,E);e==E.bottom&&(E.bottom=i);e.prev&&(e.prev.next=i);i.prev=e.prev;e.prev=i;i.next=e;},al=/^r(?:\(([^,]+?)\s*,\s*([^\)]+?)\))?/;if(ai.svg){aJ.svgns="http://www.w3.org/2000/svg";aJ.xlink="http://www.w3.org/1999/xlink";var J=function(e){return +e+(~~e===e)*0.5;},O=function(aS){for(var E=0,R=aS[l];E<R;E++){if(aR.call(aS[E][0])!="a"){for(var e=1,S=aS[E][l];e<S;e++){aS[E][e]=J(aS[E][e]);}}else{aS[E][6]=J(aS[E][6]);aS[E][7]=J(aS[E][7]);}}return aS;},aC=function(E,e){if(e){for(var i in e){if(e[L](i)){E[s](i,e[i]);}}}else{return G.createElementNS(aJ.svgns,E);}};ai[at]=function(){return"Your browser supports SVG.\nYou are running Rapha\xebl "+this.version;};var o=function(e,R){var i=aC("path");R.canvas&&R.canvas[aE](i);var E=new aq(i,R);E.type="path";V(E,{fill:"none",stroke:"#000",path:e});return E;};var b=function(R,a0,e){var aX="linear",aU=0.5,aS=0.5,a2=R.style;a0=(a0+am)[aI](al,function(a4,i,a5){aX="radial";if(i&&a5){aU=P(i);aS=P(a5);var a3=((aS>0.5)*2-1);aF(aU-0.5,2)+aF(aS-0.5,2)>0.25&&(aS=W.sqrt(0.25-aF(aU-0.5,2))*a3+0.5)&&aS!=0.5&&(aS=aS.toFixed(5)-0.00001*a3);}return am;});a0=a0[w](/\s*\-\s*/);if(aX=="linear"){var aT=a0.shift();aT=-P(aT);if(isNaN(aT)){return null;}var S=[0,0,W.cos(aT*W.PI/180),W.sin(aT*W.PI/180)],aZ=1/(f(W.abs(S[2]),W.abs(S[3]))||1);S[2]*=aZ;S[3]*=aZ;if(S[2]<0){S[0]=-S[2];S[2]=0;}if(S[3]<0){S[1]=-S[3];S[3]=0;}}var aW=n(a0);if(!aW){return null;}var E=aC(aX+"Gradient");E.id="r"+(ai._id++)[at](36);aC(E,aX=="radial"?{fx:aU,fy:aS}:{x1:S[0],y1:S[1],x2:S[2],y2:S[3]});e.defs[aE](E);for(var aV=0,a1=aW[l];aV<a1;aV++){var aY=aC("stop");aC(aY,{offset:aW[aV].offset?aW[aV].offset:!aV?"0%":"100%","stop-color":aW[aV].color||"#fff"});E[aE](aY);}aC(R,{fill:"url(#"+E.id+")",opacity:1,"fill-opacity":1});a2.fill=am;a2.opacity=1;a2.fillOpacity=1;return 1;};var I=function(i){var e=i.getBBox();aC(i.pattern,{patternTransform:ai.format("translate({0},{1})",e.x,e.y)});};var V=function(aZ,a8){var a2={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},a4=aZ.node,a0=aZ.attrs,aW=aZ.rotate(),aS=function(bf,be){be=a2[aR.call(be)];if(be){var bc=bf.attrs["stroke-width"]||"1",ba={round:bc,square:bc,butt:0}[bf.attrs["stroke-linecap"]||a8["stroke-linecap"]]||0,bd=[];var bb=be[l];while(bb--){bd[bb]=be[bb]*bc+((bb%2)?1:-1)*ba;}aC(a4,{"stroke-dasharray":bd[ar](",")});}};a8[L]("rotation")&&(aW=a8.rotation);var aV=(aW+am)[w](a);if(!(aV.length-1)){aV=null;}else{aV[1]=+aV[1];aV[2]=+aV[2];}P(aW)&&aZ.rotate(0,true);for(var a3 in a8){if(a8[L](a3)){if(!h[L](a3)){continue;}var a1=a8[a3];a0[a3]=a1;switch(a3){case"rotation":aZ.rotate(a1,true);break;case"href":case"title":case"target":var a6=a4.parentNode;if(aR.call(a6.tagName)!="a"){var R=aC("a");a6.insertBefore(R,a4);R[aE](a4);a6=R;}a6.setAttributeNS(aZ.paper.xlink,a3,a1);break;case"cursor":a4.style.cursor=a1;break;case"clip-rect":var i=(a1+am)[w](a);if(i[l]==4){aZ.clip&&aZ.clip.parentNode.parentNode.removeChild(aZ.clip.parentNode);var E=aC("clipPath"),a5=aC("rect");E.id="r"+(ai._id++)[at](36);aC(a5,{x:i[0],y:i[1],width:i[2],height:i[3]});E[aE](a5);aZ.paper.defs[aE](E);aC(a4,{"clip-path":"url(#"+E.id+")"});aZ.clip=a5;}if(!a1){var a7=G.getElementById(a4.getAttribute("clip-path")[aI](/(^url\(#|\)$)/g,am));a7&&a7.parentNode.removeChild(a7);aC(a4,{"clip-path":am});delete aZ.clip;}break;case"path":if(a1&&aZ.type=="path"){a0.path=O(p(a1));aC(a4,{d:a0.path});}break;case"width":a4[s](a3,a1);if(a0.fx){a3="x";a1=a0.x;}else{break;}case"x":if(a0.fx){a1=-a0.x-(a0.width||0);}case"rx":if(a3=="rx"&&aZ.type=="rect"){break;}case"cx":aV&&(a3=="x"||a3=="cx")&&(aV[1]+=a1-a0[a3]);a4[s](a3,J(a1));aZ.pattern&&I(aZ);break;case"height":a4[s](a3,a1);if(a0.fy){a3="y";a1=a0.y;}else{break;}case"y":if(a0.fy){a1=-a0.y-(a0.height||0);}case"ry":if(a3=="ry"&&aZ.type=="rect"){break;}case"cy":aV&&(a3=="y"||a3=="cy")&&(aV[2]+=a1-a0[a3]);a4[s](a3,J(a1));aZ.pattern&&I(aZ);break;case"r":if(aZ.type=="rect"){aC(a4,{rx:a1,ry:a1});}else{a4[s](a3,a1);}break;case"src":if(aZ.type=="image"){a4.setAttributeNS(aZ.paper.xlink,"href",a1);}break;case"stroke-width":a4.style.strokeWidth=a1;a4[s](a3,a1);if(a0["stroke-dasharray"]){aS(aZ,a0["stroke-dasharray"]);}break;case"stroke-dasharray":aS(aZ,a1);break;case"translation":var aT=(a1+am)[w](a);aT[0]=+aT[0]||0;aT[1]=+aT[1]||0;if(aV){aV[1]+=aT[0];aV[2]+=aT[1];}q.call(aZ,aT[0],aT[1]);break;case"scale":var aT=(a1+am)[w](a);aZ.scale(+aT[0]||1,+aT[1]||+aT[0]||1,+aT[2]||null,+aT[3]||null);break;case"fill":var S=(a1+am).match(c);if(S){var E=aC("pattern"),aY=aC("image");E.id="r"+(ai._id++)[at](36);aC(E,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1});aC(aY,{x:0,y:0});aY.setAttributeNS(aZ.paper.xlink,"href",S[1]);E[aE](aY);var a9=G.createElement("img");a9.style.cssText="position:absolute;left:-9999em;top-9999em";a9.onload=function(){aC(E,{width:this.offsetWidth,height:this.offsetHeight});aC(aY,{width:this.offsetWidth,height:this.offsetHeight});G.body.removeChild(this);aJ.safari();};G.body[aE](a9);a9.src=S[1];aZ.paper.defs[aE](E);a4.style.fill="url(#"+E.id+")";aC(a4,{fill:"url(#"+E.id+")"});aZ.pattern=E;aZ.pattern&&I(aZ);break;}if(!ai.getRGB(a1).error){delete a8.gradient;delete a0.gradient;!ai.is(a0.opacity,"undefined")&&ai.is(a8.opacity,"undefined")&&aC(a4,{opacity:a0.opacity});!ai.is(a0["fill-opacity"],"undefined")&&ai.is(a8["fill-opacity"],"undefined")&&aC(a4,{"fill-opacity":a0["fill-opacity"]});}else{if((({circle:1,ellipse:1})[L](aZ.type)||(a1+am).charAt()!="r")&&b(a4,a1,aZ.paper)){a0.gradient=a1;a0.fill="none";break;}}case"stroke":a4[s](a3,ai.getRGB(a1).hex);break;case"gradient":(({circle:1,ellipse:1})[L](aZ.type)||(a1+am).charAt()!="r")&&b(a4,a1,aZ.paper);break;case"opacity":case"fill-opacity":if(a0.gradient){var e=G.getElementById(a4.getAttribute("fill")[aI](/^url\(#|\)$/g,am));if(e){var aU=e.getElementsByTagName("stop");aU[aU[l]-1][s]("stop-opacity",a1);}break;}default:a3=="font-size"&&(a1=B(a1,10)+"px");var aX=a3[aI](/(\-.)/g,function(ba){return aG.call(ba.substring(1));});a4.style[aX]=a1;a4[s](a3,a1);break;}}}z(aZ,a8);if(aV){aZ.rotate(aV.join(ah));}else{P(aW)&&aZ.rotate(aW,true);}};var g=1.2;var z=function(e,S){if(e.type!="text"||!(S[L]("text")||S[L]("font")||S[L]("font-size")||S[L]("x")||S[L]("y"))){return;}var aW=e.attrs,E=e.node,aY=E.firstChild?B(G.defaultView.getComputedStyle(E.firstChild,am).getPropertyValue("font-size"),10):10;if(S[L]("text")){aW.text=S.text;while(E.firstChild){E.removeChild(E.firstChild);}var R=(S.text+am)[w]("\n");for(var aS=0,aX=R[l];aS<aX;aS++){if(R[aS]){var aU=aC("tspan");aS&&aC(aU,{dy:aY*g,x:aW.x});aU[aE](G.createTextNode(R[aS]));E[aE](aU);}}}else{var R=E.getElementsByTagName("tspan");for(var aS=0,aX=R[l];aS<aX;aS++){aS&&aC(R[aS],{dy:aY*g,x:aW.x});}}aC(E,{y:aW.y});var aT=e.getBBox(),aV=aW.y-(aT.y+aT.height/2);aV&&isFinite(aV)&&aC(E,{y:aW.y+aV});};var aq=function(i,e){var R=0,E=0;this[0]=i;this.id=ai._oid++;this.node=i;i.raphael=this;this.paper=e;this.attrs=this.attrs||{};this.transformations=[];this._={tx:0,ty:0,rt:{deg:0,cx:0,cy:0},sx:1,sy:1};!e.bottom&&(e.bottom=this);this.prev=e.top;e.top&&(e.top.next=this);e.top=this;this.next=null;};aq[aQ].rotate=function(i,e,R){if(this.removed){return this;}if(i==null){if(this._.rt.cx){return[this._.rt.deg,this._.rt.cx,this._.rt.cy][ar](ah);}return this._.rt.deg;}var E=this.getBBox();i=(i+am)[w](a);if(i[l]-1){e=P(i[1]);R=P(i[2]);}i=P(i[0]);if(e!=null){this._.rt.deg=i;}else{this._.rt.deg+=i;}(R==null)&&(e=null);this._.rt.cx=e;this._.rt.cy=R;e=e==null?E.x+E.width/2:e;R=R==null?E.y+E.height/2:R;if(this._.rt.deg){this.transformations[0]=ai.format("rotate({0} {1} {2})",this._.rt.deg,e,R);this.clip&&aC(this.clip,{transform:ai.format("rotate({0} {1} {2})",-this._.rt.deg,e,R)});}else{this.transformations[0]=am;this.clip&&aC(this.clip,{transform:am});}aC(this.node,{transform:this.transformations[ar](ah)});return this;};aq[aQ].hide=function(){!this.removed&&(this.node.style.display="none");return this;};aq[aQ].show=function(){!this.removed&&(this.node.style.display="");return this;};aq[aQ].remove=function(){if(this.removed){return;}af(this,this.paper);this.node.parentNode.removeChild(this.node);for(var e in this){delete this[e];}this.removed=true;};aq[aQ].getBBox=function(){if(this.removed){return this;}if(this.type=="path"){return N(this.attrs.path);}if(this.node.style.display=="none"){this.show();var R=true;}var aU={};try{aU=this.node.getBBox();}catch(aS){}finally{aU=aU||{};}if(this.type=="text"){aU={x:aU.x,y:Infinity,width:0,height:0};for(var E=0,S=this.node.getNumberOfChars();E<S;E++){var aT=this.node.getExtentOfChar(E);(aT.y<aU.y)&&(aU.y=aT.y);(aT.y+aT.height-aU.y>aU.height)&&(aU.height=aT.y+aT.height-aU.y);(aT.x+aT.width-aU.x>aU.width)&&(aU.width=aT.x+aT.width-aU.x);}}R&&this.hide();return aU;};aq[aQ].attr=function(){if(this.removed){return this;}if(arguments[l]==0){var S={};for(var R in this.attrs){if(this.attrs[L](R)){S[R]=this.attrs[R];}}this._.rt.deg&&(S.rotation=this.rotate());(this._.sx!=1||this._.sy!=1)&&(S.scale=this.scale());delete S.translation;S.gradient&&S.fill=="none"&&(S.fill=S.gradient)&&delete S.gradient;return S;}if(arguments[l]==1&&ai.is(arguments[0],"string")){if(arguments[0]=="translation"){return q.call(this);}if(arguments[0]=="rotation"){return this.rotate();}if(arguments[0]=="scale"){return this.scale();}if(arguments[0]=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient){return this.attrs.gradient;}return this.attrs[arguments[0]];}if(arguments[l]==1&&ai.is(arguments[0],"array")){var e={};for(var E in arguments[0]){if(arguments[0][L](E)){e[arguments[0][E]]=this.attrs[arguments[0][E]];}}return e;}if(arguments[l]==2){var aS={};aS[arguments[0]]=arguments[1];V(this,aS);}else{if(arguments[l]==1&&ai.is(arguments[0],"object")){V(this,arguments[0]);}}return this;};aq[aQ].toFront=function(){if(this.removed){return this;}this.node.parentNode[aE](this.node);var e=this.paper;e.top!=this&&T(this,e);return this;};aq[aQ].toBack=function(){if(this.removed){return this;}if(this.node.parentNode.firstChild!=this.node){this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild);j(this,this.paper);var e=this.paper;}return this;};aq[aQ].insertAfter=function(i){if(this.removed){return this;}var e=this.paper,E=i.node;if(E.nextSibling){E.parentNode.insertBefore(this.node,E.nextSibling);}else{E.parentNode[aE](this.node);}x(this,i,this.paper);return this;};aq[aQ].insertBefore=function(e){if(this.removed){return this;}var i=e.node;i.parentNode.insertBefore(this.node,i);ak(this,e,this.paper);return this;};var K=function(i,e,aS,S){e=J(e);aS=J(aS);var R=aC("circle");i.canvas&&i.canvas[aE](R);var E=new aq(R,i);E.attrs={cx:e,cy:aS,r:S,fill:"none",stroke:"#000"};E.type="circle";aC(R,E.attrs);return E;};var ay=function(E,e,aU,i,aS,aT){e=J(e);aU=J(aU);var S=aC("rect");E.canvas&&E.canvas[aE](S);var R=new aq(S,E);R.attrs={x:e,y:aU,width:i,height:aS,r:aT||0,rx:aT||0,ry:aT||0,fill:"none",stroke:"#000"};R.type="rect";aC(S,R.attrs);return R;};var ac=function(i,e,aT,aS,S){e=J(e);aT=J(aT);var R=aC("ellipse");i.canvas&&i.canvas[aE](R);var E=new aq(R,i);E.attrs={cx:e,cy:aT,rx:aS,ry:S,fill:"none",stroke:"#000"};E.type="ellipse";aC(R,E.attrs);return E;};var m=function(E,aT,e,aU,i,aS){var S=aC("image");aC(S,{x:e,y:aU,width:i,height:aS,preserveAspectRatio:"none"});S.setAttributeNS(E.xlink,"href",aT);E.canvas&&E.canvas[aE](S);var R=new aq(S,E);R.attrs={x:e,y:aU,width:i,height:aS,src:aT};R.type="image";return R;};var Q=function(i,e,aS,S){var R=aC("text");aC(R,{x:e,y:aS,"text-anchor":"middle"});i.canvas&&i.canvas[aE](R);var E=new aq(R,i);E.attrs={x:e,y:aS,"text-anchor":"middle",text:S,font:h.font,stroke:"none",fill:"#000"};E.type="text";V(E,E.attrs);return E;};var aN=function(i,e){this.width=i||this.width;this.height=e||this.height;this.canvas[s]("width",this.width);this.canvas[s]("height",this.height);return this;};var t=function(){var R=aj[aO](null,arguments),E=R&&R.container,i=R.x,aU=R.y,S=R.width,e=R.height;if(!E){throw new Error("SVG container not found.");}aJ.canvas=aC("svg");var aT=aJ.canvas;aJ.width=S||512;aJ.height=e||342;aC(aT,{xmlns:"http://www.w3.org/2000/svg",version:1.1,width:aJ.width,height:aJ.height});if(E==1){aT.style.cssText="position:absolute;left:"+i+"px;top:"+aU+"px";G.body[aE](aT);}else{if(E.firstChild){E.insertBefore(aT,E.firstChild);}else{E[aE](aT);}}E={canvas:aT};for(var aS in aJ){if(aJ[L](aS)){E[aS]=aJ[aS];}}E.bottom=E.top=null;az.call(E,E,ai.fn);E.clear();E.raphael=ai;return E;};aJ.clear=function(){var e=this.canvas;while(e.firstChild){e.removeChild(e.firstChild);}this.bottom=this.top=null;(this.desc=aC("desc"))[aE](G.createTextNode("Created with Rapha\xebl"));e[aE](this.desc);e[aE](this.defs=aC("defs"));};aJ.remove=function(){this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);for(var e in this){delete this[e];}};}if(ai.vml){var aA=function(a1){var aY=/[ahqtv]/ig,aT=p;(a1+am).match(aY)&&(aT=C);aY=/[clmz]/g;if(aT==p&&!(a1+am).match(aY)){var E={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},S=/([clmz]),?([^clmz]*)/gi,aS=/-?[^,\s-]+/g;var aX=(a1+am)[aI](S,function(a2,a4,i){var a3=[];i[aI](aS,function(a5){a3[d](J(a5));});return E[a4]+a3;});return aX;}var aZ=aT(a1),R,aX=[],e;for(var aV=0,a0=aZ[l];aV<a0;aV++){R=aZ[aV];e=aR.call(aZ[aV][0]);e=="z"&&(e="x");for(var aU=1,aW=R[l];aU<aW;aU++){e+=J(R[aU])+(aU!=aW-1?",":am);}aX[d](e);}return aX[ar](ah);};ai[at]=function(){return"Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl "+this.version;};var o=function(e,aS){var R=ab("group");R.style.cssText="position:absolute;left:0;top:0;width:"+aS.width+"px;height:"+aS.height+"px";R.coordsize=aS.coordsize;R.coordorigin=aS.coordorigin;var E=ab("shape"),i=E.style;i.width=aS.width+"px";i.height=aS.height+"px";E.coordsize=this.coordsize;E.coordorigin=this.coordorigin;R[aE](E);var S=new aq(E,R,aS);S.isAbsolute=true;S.type="path";S.path=[];S.Path=am;e&&V(S,{fill:"none",stroke:"#000",path:e});aS.canvas[aE](R);return S;};var V=function(aW,a1){aW.attrs=aW.attrs||{};var aZ=aW.node,a2=aW.attrs,aT=aZ.style,R,a6=aW;for(var aU in a1){if(a1[L](aU)){a2[aU]=a1[aU];}}a1.href&&(aZ.href=a1.href);a1.title&&(aZ.title=a1.title);a1.target&&(aZ.target=a1.target);a1.cursor&&(aT.cursor=a1.cursor);if(a1.path&&aW.type=="path"){a2.path=a1.path;aZ.path=aA(a2.path);}if(a1.rotation!=null){aW.rotate(a1.rotation,true);}if(a1.translation){R=(a1.translation+am)[w](a);q.call(aW,R[0],R[1]);if(aW._.rt.cx!=null){aW._.rt.cx+=+R[0];aW._.rt.cy+=+R[1];aW.setBox(aW.attrs,R[0],R[1]);}}if(a1.scale){R=(a1.scale+am)[w](a);aW.scale(+R[0]||1,+R[1]||+R[0]||1,+R[2]||null,+R[3]||null);}if("clip-rect" in a1){var e=(a1["clip-rect"]+am)[w](a);if(e[l]==4){e[2]=+e[2]+(+e[0]);e[3]=+e[3]+(+e[1]);var aV=aZ.clipRect||G.createElement("div"),a5=aV.style,aS=aZ.parentNode;a5.clip=ai.format("rect({1}px {2}px {3}px {0}px)",e);if(!aZ.clipRect){a5.position="absolute";a5.top=0;a5.left=0;a5.width=aW.paper.width+"px";a5.height=aW.paper.height+"px";aS.parentNode.insertBefore(aV,aS);aV[aE](aS);aZ.clipRect=aV;}}if(!a1["clip-rect"]){aZ.clipRect&&(aZ.clipRect.style.clip=am);}}if(aW.type=="image"&&a1.src){aZ.src=a1.src;}if(aW.type=="image"&&a1.opacity){aZ.filterOpacity=" progid:DXImageTransform.Microsoft.Alpha(opacity="+(a1.opacity*100)+")";aT.filter=(aZ.filterMatrix||am)+(aZ.filterOpacity||am);}a1.font&&(aT.font=a1.font);a1["font-family"]&&(aT.fontFamily='"'+a1["font-family"][w](",")[0][aI](/^['"]+|['"]+$/g,am)+'"');a1["font-size"]&&(aT.fontSize=a1["font-size"]);a1["font-weight"]&&(aT.fontWeight=a1["font-weight"]);a1["font-style"]&&(aT.fontStyle=a1["font-style"]);if(a1.opacity!=null||a1["stroke-width"]!=null||a1.fill!=null||a1.stroke!=null||a1["stroke-width"]!=null||a1["stroke-opacity"]!=null||a1["fill-opacity"]!=null||a1["stroke-dasharray"]!=null||a1["stroke-miterlimit"]!=null||a1["stroke-linejoin"]!=null||a1["stroke-linecap"]!=null){aZ=aW.shape||aZ;var a0=(aZ.getElementsByTagName("fill")&&aZ.getElementsByTagName("fill")[0]),a3=false;!a0&&(a3=a0=ab("fill"));if("fill-opacity" in a1||"opacity" in a1){var i=((+a2["fill-opacity"]+1||2)-1)*((+a2.opacity+1||2)-1);i<0&&(i=0);i>1&&(i=1);a0.opacity=i;}a1.fill&&(a0.on=true);if(a0.on==null||a1.fill=="none"){a0.on=false;}if(a0.on&&a1.fill){var E=a1.fill.match(c);if(E){a0.src=E[1];a0.type="tile";}else{a0.color=ai.getRGB(a1.fill).hex;a0.src=am;a0.type="solid";if(ai.getRGB(a1.fill).error&&(a6.type in {circle:1,ellipse:1}||(a1.fill+am).charAt()!="r")&&b(a6,a1.fill)){a2.fill="none";a2.gradient=a1.fill;}}}a3&&aZ[aE](a0);var S=(aZ.getElementsByTagName("stroke")&&aZ.getElementsByTagName("stroke")[0]),a4=false;!S&&(a4=S=ab("stroke"));if((a1.stroke&&a1.stroke!="none")||a1["stroke-width"]||a1["stroke-opacity"]!=null||a1["stroke-dasharray"]||a1["stroke-miterlimit"]||a1["stroke-linejoin"]||a1["stroke-linecap"]){S.on=true;}(a1.stroke=="none"||S.on==null||a1.stroke==0||a1["stroke-width"]==0)&&(S.on=false);S.on&&a1.stroke&&(S.color=ai.getRGB(a1.stroke).hex);var i=((+a2["stroke-opacity"]+1||2)-1)*((+a2.opacity+1||2)-1),aX=(P(a1["stroke-width"])||1)*0.75;i<0&&(i=0);i>1&&(i=1);a1["stroke-width"]==null&&(aX=a2["stroke-width"]);a1["stroke-width"]&&(S.weight=aX);aX&&aX<1&&(i*=aX)&&(S.weight=1);S.opacity=i;a1["stroke-linejoin"]&&(S.joinstyle=a1["stroke-linejoin"]||"miter");S.miterlimit=a1["stroke-miterlimit"]||8;a1["stroke-linecap"]&&(S.endcap=a1["stroke-linecap"]=="butt"?"flat":a1["stroke-linecap"]=="square"?"square":"round");if(a1["stroke-dasharray"]){var aY={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};S.dashstyle=aY[L](a1["stroke-dasharray"])?aY[a1["stroke-dasharray"]]:am;}a4&&aZ[aE](S);}if(a6.type=="text"){var aT=a6.paper.span.style;a2.font&&(aT.font=a2.font);a2["font-family"]&&(aT.fontFamily=a2["font-family"]);a2["font-size"]&&(aT.fontSize=a2["font-size"]);a2["font-weight"]&&(aT.fontWeight=a2["font-weight"]);a2["font-style"]&&(aT.fontStyle=a2["font-style"]);a6.node.string&&(a6.paper.span.innerHTML=(a6.node.string+am)[aI](/</g,"&#60;")[aI](/&/g,"&#38;")[aI](/\n/g,"<br>"));a6.W=a2.w=a6.paper.span.offsetWidth;a6.H=a2.h=a6.paper.span.offsetHeight;a6.X=a2.x;a6.Y=a2.y+J(a6.H/2);switch(a2["text-anchor"]){case"start":a6.node.style["v-text-align"]="left";a6.bbx=J(a6.W/2);break;case"end":a6.node.style["v-text-align"]="right";a6.bbx=-J(a6.W/2);break;default:a6.node.style["v-text-align"]="center";break;}}};var b=function(e,aU){e.attrs=e.attrs||{};var aV=e.attrs,aX=e.node.getElementsByTagName("fill"),aS="linear",aT=".5 .5";e.attrs.gradient=aU;aU=(aU+am)[aI](al,function(aZ,a0,i){aS="radial";if(a0&&i){a0=P(a0);i=P(i);aF(a0-0.5,2)+aF(i-0.5,2)>0.25&&(i=W.sqrt(0.25-aF(a0-0.5,2))*((i>0.5)*2-1)+0.5);aT=a0+ah+i;}return am;});aU=aU[w](/\s*\-\s*/);if(aS=="linear"){var E=aU.shift();E=-P(E);if(isNaN(E)){return null;}}var S=n(aU);if(!S){return null;}e=e.shape||e.node;aX=aX[0]||ab("fill");if(S[l]){aX.on=true;aX.method="none";aX.type=(aS=="radial")?"gradientradial":"gradient";aX.color=S[0].color;aX.color2=S[S[l]-1].color;var aY=[];for(var R=0,aW=S[l];R<aW;R++){S[R].offset&&aY[d](S[R].offset+ah+S[R].color);}aX.colors&&(aX.colors.value=aY[l]?aY[ar](","):"0% "+aX.color);if(aS=="radial"){aX.focus="100%";aX.focussize=aT;aX.focusposition=aT;}else{aX.angle=(270-E)%360;}}return 1;};var aq=function(S,aT,e){var aS=0,E=0,i=0,R=1;this[0]=S;this.id=ai._oid++;this.node=S;S.raphael=this;this.X=0;this.Y=0;this.attrs={};this.Group=aT;this.paper=e;this._={tx:0,ty:0,rt:{deg:0},sx:1,sy:1};!e.bottom&&(e.bottom=this);this.prev=e.top;e.top&&(e.top.next=this);e.top=this;this.next=null;};aq[aQ].rotate=function(i,e,E){if(this.removed){return this;}if(i==null){if(this._.rt.cx){return[this._.rt.deg,this._.rt.cx,this._.rt.cy][ar](ah);}return this._.rt.deg;}i=(i+am)[w](a);if(i[l]-1){e=P(i[1]);E=P(i[2]);}i=P(i[0]);if(e!=null){this._.rt.deg=i;}else{this._.rt.deg+=i;}E==null&&(e=null);this._.rt.cx=e;this._.rt.cy=E;this.setBox(this.attrs,e,E);this.Group.style.rotation=this._.rt.deg;return this;};aq[aQ].setBox=function(a4,E,e){if(this.removed){return this;}var aY=this.Group.style,S=(this.shape&&this.shape.style)||this.node.style;a4=a4||{};for(var a2 in a4){if(a4[L](a2)){this.attrs[a2]=a4[a2];}}E=E||this._.rt.cx;e=e||this._.rt.cy;var a0=this.attrs,aU,aT,aV,a3;switch(this.type){case"circle":aU=a0.cx-a0.r;aT=a0.cy-a0.r;aV=a3=a0.r*2;break;case"ellipse":aU=a0.cx-a0.rx;aT=a0.cy-a0.ry;aV=a0.rx*2;a3=a0.ry*2;break;case"rect":case"image":aU=+a0.x;aT=+a0.y;aV=a0.width||0;a3=a0.height||0;break;case"text":this.textpath.v=["m",J(a0.x),", ",J(a0.y-2),"l",J(a0.x)+1,", ",J(a0.y-2)][ar](am);aU=a0.x-J(this.W/2);aT=a0.y-this.H/2;aV=this.W;a3=this.H;break;case"path":if(!this.attrs.path){aU=0;aT=0;aV=this.paper.width;a3=this.paper.height;}else{var a1=N(this.attrs.path);aU=a1.x;aT=a1.y;aV=a1.width;a3=a1.height;}break;default:aU=0;aT=0;aV=this.paper.width;a3=this.paper.height;break;}E=(E==null)?aU+aV/2:E;e=(e==null)?aT+a3/2:e;var R=E-this.paper.width/2,aX=e-this.paper.height/2;if(this.type=="path"||this.type=="text"){(aY.left!=R+"px")&&(aY.left=R+"px");(aY.top!=aX+"px")&&(aY.top=aX+"px");this.X=this.type=="text"?aU:-R;this.Y=this.type=="text"?aT:-aX;this.W=aV;this.H=a3;(S.left!=-R+"px")&&(S.left=-R+"px");(S.top!=-aX+"px")&&(S.top=-aX+"px");}else{(aY.left!=R+"px")&&(aY.left=R+"px");(aY.top!=aX+"px")&&(aY.top=aX+"px");this.X=aU;this.Y=aT;this.W=aV;this.H=a3;(aY.width!=this.paper.width+"px")&&(aY.width=this.paper.width+"px");(aY.height!=this.paper.height+"px")&&(aY.height=this.paper.height+"px");(S.left!=aU-R+"px")&&(S.left=aU-R+"px");(S.top!=aT-aX+"px")&&(S.top=aT-aX+"px");(S.width!=aV+"px")&&(S.width=aV+"px");(S.height!=a3+"px")&&(S.height=a3+"px");var aS=(+a4.r||0)/aB(aV,a3);if(this.type=="rect"&&this.arcsize.toFixed(4)!=aS.toFixed(4)&&(aS||this.arcsize)){var aZ=ab("roundrect"),a5={},a2=0,aW=this.events&&this.events[l];aZ.arcsize=aS;aZ.raphael=this;this.Group[aE](aZ);this.Group.removeChild(this.node);this[0]=this.node=aZ;this.arcsize=aS;for(var a2 in a0){a5[a2]=a0[a2];}delete a5.scale;this.attr(a5);if(this.events){for(;a2<aW;a2++){this.events[a2].unbind=Z(this.node,this.events[a2].name,this.events[a2].f,this);}}}}};aq[aQ].hide=function(){!this.removed&&(this.Group.style.display="none");return this;};aq[aQ].show=function(){!this.removed&&(this.Group.style.display="block");return this;};aq[aQ].getBBox=function(){if(this.removed){return this;}if(this.type=="path"){return N(this.attrs.path);}return{x:this.X+(this.bbx||0),y:this.Y,width:this.W,height:this.H};};aq[aQ].remove=function(){if(this.removed){return;}af(this,this.paper);this.node.parentNode.removeChild(this.node);this.Group.parentNode.removeChild(this.Group);this.shape&&this.shape.parentNode.removeChild(this.shape);for(var e in this){delete this[e];}this.removed=true;};aq[aQ].attr=function(){if(this.removed){return this;}if(arguments[l]==0){var R={};for(var E in this.attrs){if(this.attrs[L](E)){R[E]=this.attrs[E];}}this._.rt.deg&&(R.rotation=this.rotate());(this._.sx!=1||this._.sy!=1)&&(R.scale=this.scale());delete R.translation;R.gradient&&R.fill=="none"&&(R.fill=R.gradient)&&delete R.gradient;return R;}if(arguments[l]==1&&ai.is(arguments[0],"string")){if(arguments[0]=="translation"){return q.call(this);}if(arguments[0]=="rotation"){return this.rotate();}if(arguments[0]=="scale"){return this.scale();}if(arguments[0]=="fill"&&this.attrs.fill=="none"&&this.attrs.gradient){return this.attrs.gradient;}return this.attrs[arguments[0]];}if(this.attrs&&arguments[l]==1&&ai.is(arguments[0],"array")){var e={};for(var E=0,S=arguments[0][l];E<S;E++){e[arguments[0][E]]=this.attrs[arguments[0][E]];}return e;}var aS;if(arguments[l]==2){aS={};aS[arguments[0]]=arguments[1];}arguments[l]==1&&ai.is(arguments[0],"object")&&(aS=arguments[0]);if(aS){if(aS.text&&this.type=="text"){this.node.string=aS.text;}V(this,aS);if(aS.gradient&&(({circle:1,ellipse:1})[L](this.type)||(aS.gradient+am).charAt()!="r")){b(this,aS.gradient);}(this.type!="path"||this._.rt.deg)&&this.setBox(this.attrs);}return this;};aq[aQ].toFront=function(){!this.removed&&this.Group.parentNode[aE](this.Group);this.paper.top!=this&&T(this,this.paper);return this;};aq[aQ].toBack=function(){if(this.removed){return this;}if(this.Group.parentNode.firstChild!=this.Group){this.Group.parentNode.insertBefore(this.Group,this.Group.parentNode.firstChild);j(this,this.paper);}return this;};aq[aQ].insertAfter=function(e){if(this.removed){return this;}if(e.Group.nextSibling){e.Group.parentNode.insertBefore(this.Group,e.Group.nextSibling);}else{e.Group.parentNode[aE](this.Group);}x(this,e,this.paper);return this;};aq[aQ].insertBefore=function(e){if(this.removed){return this;}e.Group.parentNode.insertBefore(this.Group,e.Group);ak(this,e,this.paper);return this;};var K=function(i,e,aU,aS){var S=ab("group"),aT=ab("oval"),E=aT.style;S.style.cssText="position:absolute;left:0;top:0;width:"+i.width+"px;height:"+i.height+"px";S.coordsize=i.coordsize;S.coordorigin=i.coordorigin;S[aE](aT);var R=new aq(aT,S,i);R.type="circle";V(R,{stroke:"#000",fill:"none"});R.attrs.cx=e;R.attrs.cy=aU;R.attrs.r=aS;R.setBox({x:e-aS,y:aU-aS,width:aS*2,height:aS*2});i.canvas[aE](S);return R;};var ay=function(i,aU,aT,aV,R,e){var S=ab("group"),E=ab("roundrect"),aW=(+e||0)/(aB(aV,R));S.style.cssText="position:absolute;left:0;top:0;width:"+i.width+"px;height:"+i.height+"px";S.coordsize=i.coordsize;S.coordorigin=i.coordorigin;S[aE](E);E.arcsize=aW;var aS=new aq(E,S,i);aS.type="rect";V(aS,{stroke:"#000"});aS.arcsize=aW;aS.setBox({x:aU,y:aT,width:aV,height:R,r:e});i.canvas[aE](S);return aS;};var ac=function(e,aV,aU,E,i){var S=ab("group"),R=ab("oval"),aT=R.style;S.style.cssText="position:absolute;left:0;top:0;width:"+e.width+"px;height:"+e.height+"px";S.coordsize=e.coordsize;S.coordorigin=e.coordorigin;S[aE](R);var aS=new aq(R,S,e);aS.type="ellipse";V(aS,{stroke:"#000"});aS.attrs.cx=aV;aS.attrs.cy=aU;aS.attrs.rx=E;aS.attrs.ry=i;aS.setBox({x:aV-E,y:aU-i,width:E*2,height:i*2});e.canvas[aE](S);return aS;};var m=function(i,e,aV,aU,aW,R){var S=ab("group"),E=ab("image"),aT=E.style;S.style.cssText="position:absolute;left:0;top:0;width:"+i.width+"px;height:"+i.height+"px";S.coordsize=i.coordsize;S.coordorigin=i.coordorigin;E.src=e;S[aE](E);var aS=new aq(E,S,i);aS.type="image";aS.attrs.src=e;aS.attrs.x=aV;aS.attrs.y=aU;aS.attrs.w=aW;aS.attrs.h=R;aS.setBox({x:aV,y:aU,width:aW,height:R});i.canvas[aE](S);return aS;};var Q=function(i,aV,aU,aW){var S=ab("group"),R=ab("shape"),aT=R.style,aX=ab("path"),e=aX.style,E=ab("textpath");S.style.cssText="position:absolute;left:0;top:0;width:"+i.width+"px;height:"+i.height+"px";S.coordsize=i.coordsize;S.coordorigin=i.coordorigin;aX.v=ai.format("m{0},{1}l{2},{1}",J(aV),J(aU),J(aV)+1);aX.textpathok=true;aT.width=i.width;aT.height=i.height;E.string=aW+am;E.on=true;R[aE](E);R[aE](aX);S[aE](R);var aS=new aq(E,S,i);aS.shape=R;aS.textpath=aX;aS.type="text";aS.attrs.text=aW;aS.attrs.x=aV;aS.attrs.y=aU;aS.attrs.w=1;aS.attrs.h=1;V(aS,{font:h.font,stroke:"none",fill:"#000"});aS.setBox();i.canvas[aE](S);return aS;};var aN=function(E,e){var i=this.canvas.style;E==+E&&(E+="px");e==+e&&(e+="px");i.width=E;i.height=e;i.clip="rect(0 "+E+" "+e+" 0)";return this;};G.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!G.namespaces.rvml&&G.namespaces.add("rvml","urn:schemas-microsoft-com:vml");var ab=function(e){return G.createElement("<rvml:"+e+' class="rvml">');};}catch(aa){var ab=function(e){return G.createElement("<"+e+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');};}var t=function(){var R=aj[aO](null,arguments),i=R.container,aW=R.height,aX,E=R.width,aV=R.x,aU=R.y;if(!i){throw new Error("VML container not found.");}var aS={},aT=aS.canvas=G.createElement("div"),S=aT.style;E=E||512;aW=aW||342;E==+E&&(E+="px");aW==+aW&&(aW+="px");aS.width=1000;aS.height=1000;aS.coordsize="1000 1000";aS.coordorigin="0 0";aS.span=G.createElement("span");aS.span.style.cssText="position:absolute;left:-9999px;top:-9999px;padding:0;margin:0;line-height:1;display:inline;";aT[aE](aS.span);S.cssText=ai.format("width:{0};height:{1};position:absolute;clip:rect(0 {0} {1} 0);overflow:hidden",E,aW);if(i==1){G.body[aE](aT);S.left=aV+"px";S.top=aU+"px";i={style:{width:E,height:aW}};}else{i.style.width=E;i.style.height=aW;if(i.firstChild){i.insertBefore(aT,i.firstChild);}else{i[aE](aT);}}for(var e in aJ){if(aJ[L](e)){aS[e]=aJ[e];}}az.call(aS,aS,ai.fn);aS.top=aS.bottom=null;aS.raphael=ai;return aS;};aJ.clear=function(){this.canvas.innerHTML=am;this.bottom=this.top=null;};aJ.remove=function(){this.canvas.parentNode.removeChild(this.canvas);for(var e in this){delete this[e];}};}if((/^Apple|^Google/).test(navigator.vendor)&&!(navigator.userAgent.indexOf("Version/4.0")+1)){aJ.safari=function(){var e=this.rect(-99,-99,this.width+99,this.height+99);setTimeout(function(){e.remove();});};}else{aJ.safari=function(){};}var Z=(function(){if(G.addEventListener){return function(S,E,i,e){var R=function(aS){return i.call(e,aS);};S.addEventListener(E,R,false);return function(){S.removeEventListener(E,R,false);return true;};};}else{if(G.attachEvent){return function(aS,R,E,i){var S=function(aT){return E.call(i,aT||an.event);};aS.attachEvent("on"+R,S);var e=function(){aS.detachEvent("on"+R,S);return true;};return e;};}}})();for(var X=A[l];X--;){(function(e){aq[aQ][e]=function(i){if(ai.is(i,"function")){this.events=this.events||[];this.events.push({name:e,f:i,unbind:Z(this.shape||this.node,e,i,this)});}return this;};aq[aQ]["un"+e]=function(R){var E=this.events,i=E[l];while(i--){if(E[i].name==e&&E[i].f==R){E[i].unbind();E.splice(i,1);!E.length&&delete this.events;return this;}}return this;};})(A[X]);}aq[aQ].hover=function(i,e){return this.mouseover(i).mouseout(e);};aq[aQ].unhover=function(i,e){return this.unmouseover(i).unmouseout(e);};aJ.circle=function(e,E,i){return K(this,e||0,E||0,i||0);};aJ.rect=function(e,S,i,E,R){return ay(this,e||0,S||0,i||0,E||0,R||0);};aJ.ellipse=function(e,R,E,i){return ac(this,e||0,R||0,E||0,i||0);};aJ.path=function(e){e&&!ai.is(e,"string")&&!ai.is(e[0],"array")&&(e+=am);return o(ai.format[aO](ai,arguments),this);};aJ.image=function(R,e,S,i,E){return m(this,R||"about:blank",e||0,S||0,i||0,E||0);};aJ.text=function(e,E,i){return Q(this,e||0,E||0,i||am);};aJ.set=function(e){arguments[l]>1&&(e=Array[aQ].splice.call(arguments,0,arguments[l]));return new M(e);};aJ.setSize=aN;function r(){return this.x+ah+this.y;}aq[aQ].scale=function(a2,a1,R,E){if(a2==null&&a1==null){return{x:this._.sx,y:this._.sy,toString:r};}a1=a1||a2;!+a1&&(a1=a2);var a6,a4,a5,a3,bi=this.attrs;if(a2!=0){var aZ=this.getBBox(),aW=aZ.x+aZ.width/2,aS=aZ.y+aZ.height/2,bh=a2/this._.sx,bg=a1/this._.sy;R=(+R||R==0)?R:aW;E=(+E||E==0)?E:aS;var aY=~~(a2/W.abs(a2)),aV=~~(a1/W.abs(a1)),a9=this.node.style,bk=R+(aW-R)*bh,bj=E+(aS-E)*bg;switch(this.type){case"rect":case"image":var aX=bi.width*aY*bh,a8=bi.height*aV*bg,a0=bi.r*aB(bh,bg),aU=bk-aX/2,S=bj-a8/2;this.attr({height:a8,r:a0,width:aX,x:aU,y:S});break;case"circle":case"ellipse":this.attr({rx:bi.rx*aY*bh,ry:bi.ry*aV*bg,r:bi.r*aB(aY*bh,aV*bg),cx:bk,cy:bj});break;case"path":var bc=Y(bi.path),bd=true;for(var bf=0,a7=bc[l];bf<a7;bf++){var ba=bc[bf],be,aT=aG.call(ba[0]);if(aT=="M"&&bd){continue;}else{bd=false;}if(aT=="A"){ba[bc[bf][l]-2]*=bh;ba[bc[bf][l]-1]*=bg;ba[1]*=aY*bh;ba[2]*=aV*bg;ba[5]=+(aY+aV?!!+ba[5]:!+ba[5]);}else{if(aT=="H"){for(be=1,jj=ba[l];be<jj;be++){ba[be]*=bh;}}else{if(aT=="V"){for(be=1,jj=ba[l];be<jj;be++){ba[be]*=bg;}}else{for(be=1,jj=ba[l];be<jj;be++){ba[be]*=(be%2)?bh:bg;}}}}}var e=N(bc),a6=bk-e.x-e.width/2,a4=bj-e.y-e.height/2;bc[0][1]+=a6;bc[0][2]+=a4;this.attr({path:bc});break;}if(this.type in {text:1,image:1}&&(aY!=1||aV!=1)){if(this.transformations){this.transformations[2]="scale("[aL](aY,",",aV,")");this.node[s]("transform",this.transformations[ar](ah));a6=(aY==-1)?-bi.x-(aX||0):bi.x;a4=(aV==-1)?-bi.y-(a8||0):bi.y;this.attr({x:a6,y:a4});bi.fx=aY-1;bi.fy=aV-1;}else{this.node.filterMatrix=" progid:DXImageTransform.Microsoft.Matrix(M11="[aL](aY,", M12=0, M21=0, M22=",aV,", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");a9.filter=(this.node.filterMatrix||am)+(this.node.filterOpacity||am);}}else{if(this.transformations){this.transformations[2]=am;this.node[s]("transform",this.transformations[ar](ah));bi.fx=0;bi.fy=0;}else{this.node.filterMatrix=am;a9.filter=(this.node.filterMatrix||am)+(this.node.filterOpacity||am);}}bi.scale=[a2,a1,R,E][ar](ah);this._.sx=a2;this._.sy=a1;}return this;};aq[aQ].clone=function(){return this.paper[this.type]().attr(this.attr());};ai.easing_formulas={linear:function(e){return e;},"<":function(e){return aF(e,3);},">":function(e){return aF(e-1,3)+1;},"<>":function(e){e=e*2;if(e<1){return aF(e,3)/2;}e-=2;return(aF(e,3)+2)/2;},backIn:function(i){var e=1.70158;return i*i*((e+1)*i-e);},backOut:function(i){i=i-1;var e=1.70158;return i*i*((e+1)*i+e)+1;},elastic:function(E){if(E==0||E==1){return E;}var i=0.3,e=i/4;return aF(2,-10*E)*W.sin((E-e)*(2*W.PI)/i)+1;},bounce:function(R){var i=7.5625,E=2.75,e;if(R<(1/E)){e=i*R*R;}else{if(R<(2/E)){R-=(1.5/E);e=i*R*R+0.75;}else{if(R<(2.5/E)){R-=(2.25/E);e=i*R*R+0.9375;}else{R-=(2.625/E);e=i*R*R+0.984375;}}}return e;}};var D={length:0},aK=function(){var aV=+new Date;for(var a6 in D){if(a6!="length"&&D[L](a6)){var bb=D[a6];if(bb.stop){delete D[a6];D[l]--;continue;}var aT=aV-bb.start,a4=bb.ms,a3=bb.easing,a7=bb.from,a0=bb.diff,R=bb.to,aZ=bb.t,a2=bb.prev||0,aU=bb.el,S=bb.callback,a1={},E;if(aT<a4){var aS=ai.easing_formulas[a3]?ai.easing_formulas[a3](aT/a4):aT/a4;for(var a5 in a7){if(a7[L](a5)){switch(U[a5]){case"number":E=+a7[a5]+aS*a4*a0[a5];break;case"colour":E="rgb("+[y(J(a7[a5].r+aS*a4*a0[a5].r)),y(J(a7[a5].g+aS*a4*a0[a5].g)),y(J(a7[a5].b+aS*a4*a0[a5].b))][ar](",")+")";break;case"path":E=[];for(var a9=0,aY=a7[a5][l];a9<aY;a9++){E[a9]=[a7[a5][a9][0]];for(var a8=1,ba=a7[a5][a9][l];a8<ba;a8++){E[a9][a8]=+a7[a5][a9][a8]+aS*a4*a0[a5][a9][a8];}E[a9]=E[a9][ar](ah);}E=E[ar](ah);break;case"csv":switch(a5){case"translation":var aX=a0[a5][0]*(aT-a2),aW=a0[a5][1]*(aT-a2);aZ.x+=aX;aZ.y+=aW;E=aX+ah+aW;break;case"rotation":E=+a7[a5][0]+aS*a4*a0[a5][0];a7[a5][1]&&(E+=","+a7[a5][1]+","+a7[a5][2]);break;case"scale":E=[+a7[a5][0]+aS*a4*a0[a5][0],+a7[a5][1]+aS*a4*a0[a5][1],(2 in R[a5]?R[a5][2]:am),(3 in R[a5]?R[a5][3]:am)][ar](ah);break;case"clip-rect":E=[];var a9=4;while(a9--){E[a9]=+a7[a5][a9]+aS*a4*a0[a5][a9];}break;}break;}a1[a5]=E;}}aU.attr(a1);aU._run&&aU._run.call(aU);}else{(aZ.x||aZ.y)&&aU.translate(-aZ.x,-aZ.y);R.scale&&(R.scale=R.scale+am);aU.attr(R);delete D[a6];D[l]--;aU.in_animation=null;ai.is(S,"function")&&S.call(aU);}bb.prev=aT;}}ai.svg&&aJ.safari();D[l]&&setTimeout(aK);},y=function(e){return e>255?255:(e<0?0:e);},q=function(e,E){if(e==null){return{x:this._.tx,y:this._.ty,toString:r};}this._.tx+=+e;this._.ty+=+E;switch(this.type){case"circle":case"ellipse":this.attr({cx:+e+this.attrs.cx,cy:+E+this.attrs.cy});break;case"rect":case"image":case"text":this.attr({x:+e+this.attrs.x,y:+E+this.attrs.y});break;case"path":var i=Y(this.attrs.path);i[0][1]+=+e;i[0][2]+=+E;this.attr({path:i});break;}return this;};aq[aQ].animateWith=function(i,E,e,S,R){D[i.id]&&(E.start=D[i.id].start);return this.animate(E,e,S,R);};aq[aQ].onAnimation=function(e){this._run=e||null;return this;};aq[aQ].animate=function(R,e,aX,a3){if(ai.is(aX,"function")||!aX){a3=aX||null;}var aY={},aZ={},a0={};for(var aW in R){if(R[L](aW)){if(U[L](aW)){aY[aW]=this.attr(aW);(aY[aW]==null)&&(aY[aW]=h[aW]);aZ[aW]=R[aW];switch(U[aW]){case"number":a0[aW]=(aZ[aW]-aY[aW])/e;break;case"colour":aY[aW]=ai.getRGB(aY[aW]);var aU=ai.getRGB(aZ[aW]);a0[aW]={r:(aU.r-aY[aW].r)/e,g:(aU.g-aY[aW].g)/e,b:(aU.b-aY[aW].b)/e};break;case"path":var E=C(aY[aW],aZ[aW]);aY[aW]=E[0];aZ[aW]=E[1];a0[aW]=[];for(var aT=0,a2=aY[aW][l];aT<a2;aT++){a0[aW][aT]=[0];for(var S=1,aV=aY[aW][aT][l];S<aV;S++){a0[aW][aT][S]=(aZ[aW][aT][S]-aY[aW][aT][S])/e;}}break;case"csv":var a1=(R[aW]+am)[w](a),aS=(aY[aW]+am)[w](a);switch(aW){case"translation":aY[aW]=[0,0];a0[aW]=[a1[0]/e,a1[1]/e];break;case"rotation":aY[aW]=(aS[1]==a1[1]&&aS[2]==a1[2])?aS:[0,a1[1],a1[2]];a0[aW]=[(a1[0]-aY[aW][0])/e,0,0];break;case"scale":R[aW]=a1;aY[aW]=(aY[aW]+am)[w](a);a0[aW]=[(a1[0]-aY[aW][0])/e,(a1[1]-aY[aW][1])/e,0,0];break;case"clip-rect":aY[aW]=(aY[aW]+am)[w](a);a0[aW]=[];var aT=4;while(aT--){a0[aW][aT]=(a1[aT]-aY[aW][aT])/e;}break;}aZ[aW]=a1;}}}}this.stop();this.in_animation=1;D[this.id]={start:R.start||+new Date,ms:e,easing:aX,from:aY,diff:a0,to:aZ,el:this,callback:a3,t:{x:0,y:0}};++D[l]==1&&aK();return this;};aq[aQ].stop=function(){D[this.id]&&D[l]--;delete D[this.id];return this;};aq[aQ].translate=function(e,i){return this.attr({translation:e+" "+i});};aq[aQ][at]=function(){return"Rapha\xebl\u2019s object";};ai.ae=D;var M=function(e){this.items=[];this[l]=0;if(e){for(var E=0,R=e[l];E<R;E++){if(e[E]&&(e[E].constructor==aq||e[E].constructor==M)){this[this.items[l]]=this.items[this.items[l]]=e[E];this[l]++;}}}};M[aQ][d]=function(){var S,e;for(var E=0,R=arguments[l];E<R;E++){S=arguments[E];if(S&&(S.constructor==aq||S.constructor==M)){e=this.items[l];this[e]=this.items[e]=S;this[l]++;}}return this;};M[aQ].pop=function(){delete this[this[l]--];return this.items.pop();};for(var v in aq[aQ]){if(aq[aQ][L](v)){M[aQ][v]=(function(e){return function(){for(var E=0,R=this.items[l];E<R;E++){this.items[E][e][aO](this.items[E],arguments);}return this;};})(v);}}M[aQ].attr=function(E,aT){if(E&&ai.is(E,"array")&&ai.is(E[0],"object")){for(var e=0,aS=E[l];e<aS;e++){this.items[e].attr(E[e]);}}else{for(var R=0,S=this.items[l];R<S;R++){this.items[R].attr[aO](this.items[R],arguments);}}return this;};M[aQ].animate=function(aS,E,aV,aU){(ai.is(aV,"function")||!aV)&&(aU=aV||null);var e=this.items[l],R=e,aT=this,S;aU&&(S=function(){!--e&&aU.call(aT);});this.items[--R].animate(aS,E,aV||S,S);while(R--){this.items[R].animateWith(this.items[e-1],aS,E,aV||S,S);}return this;};M[aQ].insertAfter=function(E){var e=this.items[l];while(e--){this.items[e].insertAfter(E);}return this;};M[aQ].getBBox=function(){var e=[],aT=[],E=[],S=[];for(var R=this.items[l];R--;){var aS=this.items[R].getBBox();e[d](aS.x);aT[d](aS.y);E[d](aS.x+aS.width);S[d](aS.y+aS.height);}e=aB[aO](0,e);aT=aB[aO](0,aT);return{x:e,y:aT,width:f[aO](0,E)-e,height:f[aO](0,S)-aT};};ai.registerFont=function(i){if(!i.face){return i;}this.fonts=this.fonts||{};var R={w:i.w,face:{},glyphs:{}},E=i.face["font-family"];for(var aT in i.face){if(i.face[L](aT)){R.face[aT]=i.face[aT];}}if(this.fonts[E]){this.fonts[E][d](R);}else{this.fonts[E]=[R];}if(!i.svg){R.face["units-per-em"]=B(i.face["units-per-em"],10);for(var S in i.glyphs){if(i.glyphs[L](S)){var aS=i.glyphs[S];R.glyphs[S]={w:aS.w,k:{},d:aS.d&&"M"+aS.d[aI](/[mlcxtrv]/g,function(aU){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[aU]||"M";})+"z"};if(aS.k){for(var e in aS.k){if(aS[L](e)){R.glyphs[S].k[e]=aS.k[e];}}}}}}return i;};aJ.getFont=function(aV,aW,E,S){S=S||"normal";E=E||"normal";aW=+aW||{normal:400,bold:700,lighter:300,bolder:800}[aW]||400;var aS=ai.fonts[aV];if(!aS){var R=new RegExp("(^|\\s)"+aV[aI](/[^\w\d\s+!~.:_-]/g,am)+"(\\s|$)","i");for(var e in ai.fonts){if(ai.fonts[L](e)){if(R.test(e)){aS=ai.fonts[e];break;}}}}var aT;if(aS){for(var aU=0,aX=aS[l];aU<aX;aU++){aT=aS[aU];if(aT.face["font-weight"]==aW&&(aT.face["font-style"]==E||!aT.face["font-style"])&&aT.face["font-stretch"]==S){break;}}}return aT;};aJ.print=function(S,R,e,aU,aV,a4){a4=a4||"middle";var a0=this.set(),a3=(e+am)[w](am),a1=0,aX=am,a5;ai.is(aU,"string")&&(aU=this.getFont(aU));if(aU){a5=(aV||16)/aU.face["units-per-em"];var E=aU.face.bbox.split(a),aT=+E[0],aW=+E[1]+(a4=="baseline"?E[3]-E[1]+(+aU.face.descent):(E[3]-E[1])/2);for(var aZ=0,aS=a3[l];aZ<aS;aZ++){var aY=aZ&&aU.glyphs[a3[aZ-1]]||{},a2=aU.glyphs[a3[aZ]];a1+=aZ?(aY.w||aU.w)+(aY.k&&aY.k[a3[aZ]]||0):0;a2&&a2.d&&a0[d](this.path(a2.d).attr({fill:"#000",stroke:"none",translation:[a1,0]}));}a0.scale(a5,a5,aT,aW).translate(S-aT,R-aW);}return a0;};ai.format=function(E){var i=ai.is(arguments[1],"array")?[0][aL](arguments[1]):arguments,e=/\{(\d+)\}/g;E&&ai.is(E,"string")&&i[l]-1&&(E=E[aI](e,function(S,R){return i[++R]==null?am:i[R];}));return E||am;};ai.ninja=function(){var E=an.Raphael,i;if(k.was){an.Raphael=k.is;}else{try{delete an.Raphael;}catch(R){an.Raphael=i;}}return E;};ai.el=aq[aQ];return ai;})();

var Diagram = function()
{
	this.rad = Math.PI / 180;
	
	this.oldBalloon = false,
	this.oldBalloonIndex = -1;
	
	this.colors = ["#FF3300", "#FF9900", "#CCFF00", "#33CC00", "#33CCCC", "#66CCFF", "#0066FF", "#CC33FF", "#CC0066", "#FF6633", "#CCFF66", "#33FF33", "#00CCCC", "#0099FF", "#0033CC", "#9933FF", "#CC3399", "#990033", "#FF9933", "#99CC00", "#33CC99", "#33CCFF", "#006699", "#660099"];
	this.colorCounter = 0;
}

Diagram.prototype.draw = function(parent, width, height)
{
	var graphID = 'graph' + Math.random();
	
	_(parent, [_div([_div(null,[['attr','id',graphID],['css','width',width + 'px'],['css','height',height + 'px']])])]);

	return Raphael(graphID, width, height);
}

Diagram.prototype.getNextColor = function()
{
	var color = this.colors[this.colorCounter % this.colors.length];
	
	++this.colorCounter;
	
	return color;
}

Diagram.prototype.resetColor = function()
{
	this.colorCounter = 0;
}

Diagram.prototype.createPieDiagram = function(parent, width, height, data)
{
	var graph = this.draw(parent, width, height),
		_this = this;
	
	this.resetColor()
	
	// определяем суммарное значение для масштабирования
	var countGraphValue = 0;
	for (var layer in data)
			countGraphValue += Number(data[layer]);
	
	// отсупы и размеры
	var cx = width / 2,
		cy = height / 2,
		r = height / 3.5;
	
	function sector(cx, cy, r, startAngle, endAngle, params)
	{
		if (Math.abs(endAngle - startAngle - 360) < 180 / (Math.PI * r))
			return graph.circle(cx, cy, r).attr(params);
		
		var x1 = cx + r * Math.cos(-startAngle * _this.rad),
			x2 = cx + r * Math.cos(-endAngle * _this.rad),
			y1 = cy + r * Math.sin(-startAngle * _this.rad),
			y2 = cy + r * Math.sin(-endAngle * _this.rad);
		
		return graph.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
	}
	
	var angle = 0,
		startColor = 0,
		littleAngle = 0,
		littleValue = 0,
		delta = 20,
		ms = 300,
		startOpacity = 1,
		maxScale = 1.05,
		textTemplate = "text\nvalue (proc%)",
		process = function(layer)
		{
			var textData = layer,
				value = Number(data[layer]),
				proc = Number(100 * value / countGraphValue).toFixed(1),
	            angleplus = 360 * value / countGraphValue;
	        
	        if (angleplus < 180 / (Math.PI * r))
			{
				littleValue += value;
				littleAngle += angleplus;
				
				return;
			}
	        
	        var	popangle = angle + (angleplus / 2),
				bcolor = _diagram.getNextColor(),
				hsbBcolor = Raphael.rgb2hsb(bcolor),
				color = Raphael.hsb2rgb(hsbBcolor.h, hsbBcolor.s, hsbBcolor.b * 0.6).hex,
				p = sector(cx, cy, r, angle, angle + angleplus, {gradient: Math.abs(Math.round(angle + angleplus - 90)) + "-" + bcolor + "-" + color, stroke: color, "stroke-width": 1}).attr({id:layer}),
				txt = graph.text(cx + (r + delta) * Math.cos(-popangle * _this.rad), cy + (r + delta) * Math.sin(-popangle * _this.rad), textTemplate.replace(/text/g,textData).replace(/value/g, value).replace(/proc/g, proc))
	        					.attr({fill: "#153069", stroke: "none", opacity: startOpacity, "font-family": '"Arial"', "font-size": "13px", "text-anchor": (angle + angleplus /2 > 90 && angle + angleplus / 2 < 270) ? "end" : "start"});
	        
	        p.mouseover(function()
	        {
	        	p.animate({scale: [maxScale, maxScale, cx, cy]}, ms, "elastic");
				
			//	txt.animate({opacity: 1}, ms, "elastic");
				txt.node.setAttribute("fill","#FC830B")
	        }).mouseout(function()
	        {
	        	p.animate({scale: [1, 1, cx, cy]}, ms, "elastic");
	        	
			//	txt.animate({opacity: startOpacity}, ms);
				txt.node.setAttribute("fill","#153069")
	        });
	        angle += angleplus;
	        startColor += .1;
	        
	        if (startColor > 1)
	        	startColor = 0.1;
		},
		processLittle = function()
		{
			var textData = 'Остальное',
		    	value = littleValue,
				angleplus = littleAngle,
				popangle = angle + (angleplus / 2),
				color = "#CCCCCF",
				bcolor = "#99999B";
		       
			var p = sector(cx, cy, r, angle, angle + angleplus, {gradient: Math.abs(Math.round(angle + angleplus - 90)) + "-" + bcolor + "-" + color, stroke: color, "stroke-width": 1}).attr({id:data}),
			    txt = graph.text(cx + (r + delta) * Math.cos(-popangle * _this.rad), cy + (r + delta) * Math.sin(-popangle * _this.rad), textTemplate.replace(/text/g,textData).replace(/value/g, value))
			                                       .attr({fill: "#4970AC", stroke: "none", opacity: startOpacity, "font-family": '"Arial"', "font-size": "10px"});
		       
		//	txt.node.setAttribute("angle", -popangle)
		//	p.node.setAttribute("angle", 0)

			p.mouseover(function()
			{
				p.animate({scale: [maxScale, maxScale, cx, cy]}, ms, "elastic");
				       
				txt.animate({opacity: 1}, ms, "elastic");
			}).mouseout(function()
			{
				p.animate({scale: [1, 1, cx, cy]}, ms, "elastic");

				txt.animate({opacity: startOpacity}, ms);
			});
		}
	
	Raphael.getColor.reset();
	
	for (var layer in data)
		process(layer);
	
	if (littleAngle > 0)
		processLittle();	
}

Diagram.prototype.createDateTimeDiagram = function(parent, width, height, data)
{
	var graph = this.draw(parent, width, height);

	var dateTimeData = [],
		minValue = Number.MAX_VALUE,
		maxValue = -Number.MAX_VALUE,
		_this = this;
	
	for (var propName in data)
	{
		dateTimeData.push({date:Number(propName), value:data[propName]});
		
		if (data[propName] < minValue)
			minValue = data[propName];
		
		if (data[propName] > maxValue)
			maxValue = data[propName];
	}
	
	Raphael.getColor.reset();
	
	dateTimeData = dateTimeData.sort(function(a,b)
	{
		return a.date - b.date;
	});
	
	var cx = width - 50,
		cy = height - 40,
		firstDate = dateTimeData[0].date,
		lastDate = dateTimeData[dateTimeData.length - 1].date,
		scaleX = lastDate - firstDate,
		scaleY = maxValue - minValue != 0 ? maxValue - minValue : 1,
		firstDate = dateTimeData[0].date,
		funcPath = [],
		leaveTimer,
		isLabelVisible = false
		processPath = function(data, i)
		{
			var xCoord = 40 + cx * (data.date - firstDate) / scaleX,
				yCoord = 10 + cy - cy * (data.value - minValue) / scaleY;
			
			if (i == 0)
				funcPath = funcPath.concat(['M', xCoord, yCoord]);
			else
				funcPath = funcPath.concat(['L', xCoord, yCoord]);
		},
		process = function(data, i)
		{
			var xCoord = 40 + cx * (data.date - firstDate) / scaleX,
				yCoord = 10 + cy - cy * (data.value - minValue) / scaleY;
			
			var dot = graph.circle(xCoord, yCoord, 3).attr({fill: '#33AB33', stroke: '#88CB99'});
			
			dot.mouseover(function()
	        {
	            dot.attr("r", 5);

                var newWidth = String(data.value).length * 7 + 12 + 55,
					newcoord = {x: xCoord + 20, y: yCoord > 10 + cy - 24 ? 10 + cy - 24 : yCoord};
                
                if (newcoord.x + newWidth > cx + 40) 
                    newcoord.x -= (newWidth + 40);
				
				if (!$.browser.msie)
				{
		            clearTimeout(leaveTimer);
	                ttFrame.show().animate({x: newcoord.x, y: newcoord.y, width:newWidth}, 200 * isLabelVisible);
	                ttText.attr({text: stringDate(data.date) + ': ' + String(data.value)}).show().animate({x: newcoord.x + 6, y: newcoord.y + 9}, 200 * isLabelVisible);
	                isLabelVisible = true;
	                graph.safari();
	            }
	            else
	            {
   	               	ttFrame.show().attr({x: newcoord.x, y: newcoord.y, width:newWidth});
                	ttText.show().attr({text: stringDate(data.date) + ': ' + String(data.value),x: newcoord.x + 6, y: newcoord.y + 12});
	            }
	            
	        }).mouseout(function()
	        {
	            dot.attr("r", 3);
	            
	            if (!$.browser.msie)
				{
	                graph.safari();
	                leaveTimer = setTimeout(function ()
	                {
	                    ttFrame.hide();
	                    ttText.hide();
	                    isLabelVisible = false;
	                    graph.safari();
	                }, 1);
	            }
	            else
	            {
            		ttFrame.hide();
                    ttText.hide();
	            }
	        });
		};

	graph.path(["M", 40, 10, "L", 40, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 2, opacity: 0.7});
	graph.path(["M", 40, cy + 10, "L", cx + 40, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 2, opacity: 0.7});
	
	if (lastDate - firstDate > 2 * 1000 * 86400 * 365)
	{
		// разбивка по годам
		var year = new Date(firstDate).getFullYear() + 1,
			lastXYear = -1;
		
		while (new Date(year, 0, 1) < lastDate)
		{
			var xYear = 40 + cx * (new Date(year, 0, 1).valueOf() - firstDate) / scaleX;
			
			if (lastXYear < 0 || (xYear - lastXYear) > 40)
			{
				graph.path(["M", xYear, 10, "L", xYear, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
				graph.text(xYear, cy + 25, String(year)).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "middle"});
				
				lastXYear = xYear;
			}
			
			year++;
		}
	}
	else if (lastDate - firstDate > 2 * 1000 * 86400 * 30)
	{
		// разбивка по месяцам
		var year = new Date(firstDate).getFullYear(),
			month = new Date(firstDate).getMonth() + 1,
			monthNames = {'0':'январь','1':'февраль','2':'март','3':'апрель','4':'май','5':'июнь','6':'июль','7':'август','8':'сентябрь','9':'октябрь','10':'ноябрь','11':'декабрь'},
			lastXYear = -1;
		
		if (month > 11)
		{
			month = 0;
			year++;
		}
		
		while (new Date(year, month, 1) < lastDate)
		{
			var xYear = 40 + cx * (new Date(year, month, 1).valueOf() - firstDate) / scaleX;
			
			if (lastXYear < 0 || (xYear - lastXYear) > 40)
			{
				graph.path(["M", xYear, 10, "L", xYear, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
				graph.text(xYear, cy + 25, String(monthNames[month] + '\n' + year)).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "middle"});
				
				lastXYear = xYear;
			}
			
			month++;
			
			if (month > 11)
			{
				month = 0;
				year++;
			}
		}
	}
	else
	{
		// разбивка по дням
		var currDate = firstDate + 24 * 3600 * 1000,
			monthNames = {'0':'января','1':'февраля','2':'марта','3':'апреля','4':'мая','5':'июня','6':'июля','7':'августа','8':'сентября','9':'октября','10':'ноября','11':'декабря'},
			lastXYear = -1;
		
		if (new Date(currDate).getDate() == new Date(firstDate).getDate())
			currDate = firstDate + 25 * 3600 * 1000;
		
		currDate = new Date(currDate);
		currDate.setHours(0);
		currDate = currDate.valueOf();

		while (currDate < lastDate)
		{
			var xYear = 40 + cx * (currDate - firstDate) / scaleX;
			
			if (lastXYear < 0 || (xYear - lastXYear) > 40)
			{
				graph.path(["M", xYear, 10, "L", xYear, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
				graph.text(xYear, cy + 25, String(String(new Date(currDate).getDate()) + ' ' + monthNames[new Date(currDate).getMonth()] + '\n' + String(new Date(currDate).getFullYear()))).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "middle"});
				
				lastXYear = xYear;
			}
			
			var oldCurrDate = new Date(currDate).getDate();
			
			currDate = currDate + 24 * 3600 * 1000;
			
			if (new Date(currDate).getDate() == oldCurrDate)
				currDate = currDate + 25 * 3600 * 1000;
			
			currDate = new Date(currDate);
			currDate.setHours(0);
			currDate = currDate.valueOf();
		}

	}
	
	var yLabels = [],
		labelIndex = -1;;
	
	// "красивые метки" на ось y
	for (var i = 0; i < 13; i++)
	{
		yLabels.push(1 * Math.pow(10, i - 5));
		yLabels.push(2 * Math.pow(10, i - 5));
		yLabels.push(5 * Math.pow(10, i - 5));
	}
	
	for (var i = 0; i < yLabels.length; i++)
	{
		if (scaleY / yLabels[i] > cy / 100 &&
			scaleY / yLabels[i] < cy / 50)
		{
			labelIndex = i;
			
			break;
		}
	}
	
	if (labelIndex > 0)
	{
		var labelCount = Math.floor(scaleY / yLabels[labelIndex]),
			firstYLabel = (Math.floor(minValue / yLabels[labelIndex]) + 1) * yLabels[labelIndex];
		
		while (firstYLabel < maxValue)
		{
			var yLabel = 10 + cy - cy * (firstYLabel - minValue) / scaleY;
		
			graph.path(["M", 40, yLabel, "L", cx + 40, yLabel]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
			graph.text(35, yLabel, String(firstYLabel)).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "end"});
			
			firstYLabel += yLabels[labelIndex]
		}
	}
	
	for (var i = 0; i < dateTimeData.length; i++)
		processPath(dateTimeData[i], i);

	graph.path(funcPath).attr({stroke: '#88CB99', 'stroke-width':2})
		
	var ttFrame = graph.rect(10, 10, 120, 20, 5).attr({fill: "#CBCBEA", stroke: "#ABABFA", "stroke-width": 2, opacity: 1}).hide(),
		ttText = graph.text(60, 10, String(minValue)).attr({"font": '12px "Arial"', stroke: "none", fill: "#FFF", "text-anchor": "start"}).hide();

	for (var i = 0; i < dateTimeData.length; i++)
		process(dateTimeData[i], i);
	
	ttFrame = graph.rect(10, 10, 120, 20, 5).attr({fill: "#CBCBEA", stroke: "#ABABFA", "stroke-width": 2, opacity: 1}).hide(),
	ttText = graph.text(60, 10, String(minValue)).attr({"font": '12px "Arial"', stroke: "none", fill: "#FFF", "text-anchor": "start"}).hide();
}

// data: {'legend1':[], 'legend2':[], ..}
// dataColumns: "Октябрь, Ноябрь, .."

Diagram.prototype.createMultiLinesDiagram = function(parent, width, height, data, dataColumns, legendFlag)
{
	var graph = this.draw(parent, width, height);
	
	this.resetColor();
	
	var chartId = String(Math.random()).substr(2,12),
		minValue = Number.MAX_VALUE,
		maxValue = -Number.MAX_VALUE,
		layerNames = [],
		layerColors = {},
		curPosition = 0,
		legendCellHeight = 20,
		startColor = 0;
		
	for (var label in data)
	{
		layerNames.push(label.replace(/\s/g, ''));

		layerColors[label] = _diagram.getNextColor();

		for (var j = 0; j < data[label].length; j++)
		{
			if (data[label][j] > maxValue)
				maxValue = data[label][j];

			if (data[label][j] < minValue)
				minValue = data[label][j];
		}
		
		startColor += 0.1 * (1 + Math.random());
		
		if (startColor > 1)
	    	startColor = 0.1 * (1 + Math.random());
	}
	
	var cx = width - 55 - (legendFlag > 0 ? 130 : 0),
		cy = height - 40,
		namesByPage = Math.floor((cy - 40) / legendCellHeight),
		scaleY = maxValue - minValue != 0 ? maxValue - minValue : 1;
	
	// оси
	graph.path(["M", 40, 10, "L", 40, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 2, opacity: 0.7});
	graph.path(["M", 40, cy + 10, "L", cx + 40, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 2, opacity: 0.7});
	
	// "красивые метки" на ось x
	var columnTextLengths = [];
	
	for (var i = 0; i < dataColumns.length; i++)
	{
		var strs = dataColumns[i].split("\n"),
			maxLen = strs[0].length;
		
		for (var j = 1; j < strs.length; j++)
			if (strs[j].length > maxLen)
				maxLen = strs[j].length;
		
		columnTextLengths.push(maxLen * 7)
	}
	
	var lastTextCoord = -1;
	
	for (var i = 0; i < dataColumns.length; i++)
	{
		var currXCoord = 40 + cx * i / (dataColumns.length - 1);
		
		if (lastTextCoord < 0 || (currXCoord - lastTextCoord) > 10 + columnTextLengths[i] / 2)
		{
			graph.path(["M", currXCoord, 10, "L", currXCoord, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
			graph.text(currXCoord, cy + 25, String(dataColumns[i])).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "middle"});
			
			lastTextCoord = currXCoord + columnTextLengths[i] / 2;
		}
	}
	
	var yLabels = [],
		labelIndex = -1;;
	
	// "красивые метки" на ось y
	for (var i = 0; i < 13; i++)
	{
		yLabels.push(1 * Math.pow(10, i - 5));
		yLabels.push(2 * Math.pow(10, i - 5));
		yLabels.push(5 * Math.pow(10, i - 5));
	}
	
	for (var i = 0; i < yLabels.length; i++)
	{
		if (scaleY / yLabels[i] > cy / 200 &&
			scaleY / yLabels[i] < cy / 20)
		{
			labelIndex = i;
			
			break;
		}
	}
	
	if (labelIndex > 0)
	{
		var labelCount = Math.floor(scaleY / yLabels[labelIndex]),
			firstYLabel = (Math.floor(minValue / yLabels[labelIndex]) + 1) * yLabels[labelIndex];
		
		while (firstYLabel <= maxValue)
		{
			var yLabel = 10 + cy - cy * (firstYLabel - minValue) / scaleY;
		
			graph.path(["M", 40, yLabel, "L", cx + 40, yLabel]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
			graph.text(35, yLabel, String(firstYLabel)).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "end"});
			
			firstYLabel += yLabels[labelIndex]
		}
	}
	
	// сам график
	var	leaveTimer,
		isLabelVisible = false,
		process = function(label)
		{
			var values = data[label],
				funcPath = [];
			
			for (var i = 0; i < dataColumns.length; i++)
			{
				var xCoord = 40 + cx * i / (dataColumns.length - 1),
					yCoord = 10 + cy - cy * (values[i] - minValue) / scaleY;
			
				if (i == 0)
					funcPath = funcPath.concat(['M', xCoord, yCoord]);
				else
					funcPath = funcPath.concat(['L', xCoord, yCoord]);
			}
			
			var line = graph.path(funcPath).attr({stroke: layerColors[label], 'stroke-width':2});
			line.node.setAttribute('id', chartId + 'line_' + label);
			
			for (var i = 0; i < dataColumns.length; i++)
			{
				(function(i)
				{
					var xCoord = 40 + cx * i / (dataColumns.length - 1),
					yCoord = 10 + cy - cy * (values[i] - minValue) / scaleY;
					
					var dot = graph.circle(xCoord, yCoord, 3).attr({fill: layerColors[label], stroke: layerColors[label]});
					dot.node.setAttribute('id', chartId + 'dot_' + label + '_' + i);
					
					dot.mouseover(function()
			        {
			            dot.attr("r", 5);
			            
		                var newWidth = String(values[i]).length * 7 + 12,
		                	newcoord = {x: xCoord + 20, y: yCoord > 10 + cy - 24 ? 10 + cy - 24 : yCoord};
                		
                		if (newcoord.x + newWidth > cx + 40) 
                    		newcoord.x -= (newWidth + 40);
						
						if (!$.browser.msie)
						{
				            clearTimeout(leaveTimer);
			                ttFrame.show().animate({x: newcoord.x, y: newcoord.y, width:newWidth}, 200 * isLabelVisible);
			                ttText.attr({text: String(values[i])}).show().animate({x: newcoord.x + 6, y: newcoord.y + 9}, 200 * isLabelVisible);
			                isLabelVisible = true;
			                graph.safari();
			            }
			            else
			            {
		   	               	ttFrame.show().attr({x: newcoord.x, y: newcoord.y, width:newWidth});
		                	ttText.show().attr({text: String(values[i]),x: newcoord.x + 6, y: newcoord.y + 12});
			            }
			            
			        }).mouseout(function()
			        {
			            dot.attr("r", 3);
			            
			            if (!$.browser.msie)
						{
			                graph.safari();
			                leaveTimer = setTimeout(function ()
			                {
			                    ttFrame.hide();
			                    ttText.hide();
			                    isLabelVisible = false;
			                    graph.safari();
			                }, 1);
			            }
			            else
			            {
		            		ttFrame.hide();
		                    ttText.hide();
			            }
			        });
		        })(i);
			}
		},
		_this = this;

	var ttFrame = graph.rect(10, 10, 120, 20, 5).attr({fill: "#CBCBEA", stroke: "#ABABFA", "stroke-width": 2, opacity: 1}).hide(),
		ttText = graph.text(60, 10, String(minValue)).attr({"font": '12px "Arial"', stroke: "none", fill: "#FFF", "text-anchor": "start"}).hide();
	
	for (var label in data)
		process(label)
	
	ttFrame = graph.rect(10, 10, 120, 20, 5).attr({fill: "#CBCBEA", stroke: "#ABABFA", "stroke-width": 2, opacity: 1}).hide(),
	ttText = graph.text(60, 10, String(minValue)).attr({"font": '12px "Arial"', stroke: "none", fill: "#FFF", "text-anchor": "start"}).hide();
	
	// легенда
	if (legendFlag > 0)
	{
		var width = 130,
			height = Math.min(namesByPage, objLength(data)) * legendCellHeight + 40;
		
		graph.rect(cx + 50, 10, width, height, 5)
			.attr('fill','#FAFAFE')
			.attr('stroke','#BABABE')
			.attr('stroke-width',1);
		
		var up = graph.path(["M", cx + 50 + 5, 10 + 15, "L", cx + 50 + width - 5, 10 + 15, "L", cx + 50 + width / 2, 10 + 5, "L", cx + 50 + 5,  10 + 15,"Z"]).attr({fill: '#ABCDEF', opacity: 0.5}),
			down = graph.path(["M", cx + 50 + 5, 10 + height - 15, "L", cx + 50 + width - 5, 10 + height - 15, "L", cx + 50 + width / 2,  10 + height - 5, "L",cx + 50 + 5,  10 + height - 15, "Z"]).attr({fill: '#ABCDEF', opacity: 0.5});
		
		up.node.style.cursor = "pointer";
		down.node.style.cursor = "pointer";
		
		var drawCurrentPage = function(position, count, names)
		{
			var length = count,
				endPosition = (names.length < position + length) ? names.length : position + length;
			
			var attachEvent = function(elem, name)
			{
				$(elem.node).mousedown(function()
				{
					if (elem.attr('opacity') == 1)
					{
						for (var i = 0; i < dataColumns.length; i++)
						{
							var bar = $('#' + chartId + 'dot_' + name + '_' + i)[0];
							$(bar).hide();
						}
						
						$('#' + chartId + 'line_' + name).hide();
						$('#' + chartId + 'legRect_' + name).attr('fill','#999999');
						
						elem.attr('opacity', 0.2);
					}
					else
					{
						for (var i = 0; i < dataColumns.length; i++)
						{
							var bar = $('#' + chartId + 'dot_' + name + '_' + i)[0];
							$(bar).show();
						}
						
						$('#' + chartId + 'line_' + name).show();
						$('#' + chartId + 'legRect_' + name).attr('fill','#153069');
						
						elem.attr('opacity', 1);
					}
				})
			}
			
			if (position == 0)
				$(up.node).hide()
			else
				$(up.node).show()
				
			if (position + count >= names.length)
				$(down.node).hide()
			else
				$(down.node).show()

			for (var i = position; i < endPosition; i++)
			{
				var xCoord = cx + 50 + 50,
					yCoord = 14 + /*(height - 40) / length*/ legendCellHeight * (i - position) + 20,
					layerName = names[i],
					area = $('#' + chartId + 'dot_' + layerName + '_0')[0],
					opacity = area.style.display == 'none' ? 0.2 : 1,
					shownName = layerName.length > 12 ? layerName.substring(0, 12) + '...' : layerName;
				
				var txt = graph.text(xCoord - 20, yCoord + 5, shownName)
							.attr({fill: '#153069', stroke: "none", "font-family": '"Arial"',
									"font-size": "12px", "text-anchor": "start"});
				
				txt.node.setAttribute('id', chartId + 'legRect_' + layerName)
				
				var rect = graph.rect(xCoord - 45, yCoord, 20, 10)
									.attr({fill: layerColors[layerName], opacity: opacity, stroke: layerColors[layerName]});
				
				rect.node.setAttribute('id', chartId + 'legTxt_' + layerName)
									
				rect.node.style.cursor = "pointer";
				attachEvent(rect, layerName);
			}
		}
		
		$(up.node).mousedown(function()
		{
			if (curPosition == 0)
				return;
			
			for (var i = 0; i < layerNames.length; i++)
			{
				$('#' + chartId + 'legRect_' + layerNames[i]).remove();
				$('#' + chartId + 'legTxt_' + layerNames[i]).remove();
			}

			curPosition -= namesByPage;
			drawCurrentPage(curPosition, namesByPage, layerNames);
		})
		$(down.node).mousedown(function()
		{
			if (curPosition + namesByPage >= layerNames.length)
				return;
				
			for (var i = 0; i < layerNames.length; i++)
			{
				$('#' + chartId + 'legRect_' + layerNames[i]).remove();
				$('#' + chartId + 'legTxt_' + layerNames[i]).remove();
			}
			
			curPosition += namesByPage;
			drawCurrentPage(curPosition, namesByPage, layerNames);
		})
		
		drawCurrentPage(0, namesByPage, layerNames);
	}
}

Diagram.prototype.createBarsDiagram = function(parent, width, height, data, dataColumns, legendFlag, multipleFlag)
{
	var graph = this.draw(parent, width, height);
	
	this.resetColor();
	
	var chartId = String(Math.random()).substr(2,12),
		minValue = 0,
		maxValue = -Number.MAX_VALUE,
		layerNames = [],
		layerColors = {},
		curPosition = 0,
		legendCellHeight = 20,
		startColor = 0;
		
	for (var label in data)
	{
		layerNames.push(label);

		layerColors[label] = _diagram.getNextColor();

		for (var j = 0; j < data[label].length; j++)
		{
			if (data[label][j] > maxValue)
				maxValue = data[label][j];
		}
		
		startColor += 0.1 * (1 + Math.random());
		
		if (startColor > 1)
	    	startColor = 0.1 * (1 + Math.random());
	}
	
	var cx = width - 55 - (legendFlag > 0 ? 130 : 0),
		cy = height - 40,
		namesByPage = Math.floor((cy - 40) / legendCellHeight),
		scaleY = maxValue - minValue != 0 ? maxValue - minValue : 1;
	
	// оси
	graph.path(["M", 40, 10, "L", 40, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 2, opacity: 0.7});
	graph.path(["M", 40, cy + 10, "L", cx + 40, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 2, opacity: 0.7});
	
	// "красивые метки" на ось x
	var columnTextLengths = [];
	
	for (var i = 0; i < dataColumns.length; i++)
	{
		var strs = dataColumns[i].split("\n"),
			maxLen = strs[0].length;
		
		for (var j = 1; j < strs.length; j++)
			if (strs[j].length > maxLen)
				maxLen = strs[j].length;
		
		columnTextLengths.push(maxLen * 7)
	}
	
	var lastTextCoord = -1;
	
	for (var i = 0; i < dataColumns.length; i++)
	{
		var barWidth = 0.9 * cx / dataColumns.length,
			size = cx / dataColumns.length,
			currXCoord = 40 + size * i + size / 2 + 10;
		
		if (lastTextCoord < 0 || (currXCoord - lastTextCoord) > 10 + columnTextLengths[i] / 2)
		{
			graph.path(["M", currXCoord, 10, "L", currXCoord, cy + 10]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
			graph.text(currXCoord, cy + 25, String(dataColumns[i])).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "middle"});
			
			lastTextCoord = currXCoord + columnTextLengths[i] / 2;
		}
	}
	
	var yLabels = [],
		labelIndex = -1;;
	
	// "красивые метки" на ось y
	for (var i = 0; i < 13; i++)
	{
		yLabels.push(1 * Math.pow(10, i - 5));
		yLabels.push(2 * Math.pow(10, i - 5));
		yLabels.push(5 * Math.pow(10, i - 5));
	}
	
	for (var i = 0; i < yLabels.length; i++)
	{
		if (scaleY / yLabels[i] > cy / 200 &&
			scaleY / yLabels[i] < cy / 20)
		{
			labelIndex = i;
			
			break;
		}
	}
	
	if (labelIndex > 0)
	{
		var labelCount = Math.floor(scaleY / yLabels[labelIndex]),
			firstYLabel = (Math.floor(minValue / yLabels[labelIndex]) + 1) * yLabels[labelIndex];
		
		while (firstYLabel <= maxValue)
		{
			var yLabel = 10 + cy - cy * (firstYLabel - minValue) / scaleY;
		
			graph.path(["M", 40, yLabel, "L", cx + 40, yLabel]).attr({stroke: "#ABABAB", "stroke-width": 1, opacity: 0.2});
			graph.text(35, yLabel, String(firstYLabel)).attr({"font": '12px "Arial"', stroke: "none", fill: "#153069", "text-anchor": "end"});
			
			firstYLabel += yLabels[labelIndex]
		}
	}
	
	// сам график
	
	var	leaveTimer,
		isLabelVisible = false,
		process = function(i)
		{
			var barValues = [],
				size = cx / dataColumns.length;
			
			for (var label in data)
				barValues.push({label: label, value: data[label][i], color:layerColors[label]})
			
			if (!multipleFlag)	
				barValues = barValues.sort(function(a, b){return b.value - a.value});
			
			for (var j = 0; j < barValues.length; j++)
			{
				(function(i,j)
				{
					var barHeight = barValues[j].value / maxValue * cy,
						barWidth = multipleFlag ? Math.floor((0.9 * cx / dataColumns.length) / layerNames.length) : Math.floor(0.9 * cx / dataColumns.length),
						maxBarWidth = Math.floor(0.9 * cx / dataColumns.length),
						color = barValues[j].color,
						hsbFillColor = Raphael.rgb2hsb(color),
						xCoord = Math.floor(40 + size * i + size / 2 - maxBarWidth / 2 + 10 + (multipleFlag ? barWidth * j : 0)),
						yCoord =  cy + 10 - barHeight;
					
					var rect = graph.rect(xCoord, yCoord, barWidth, barHeight)
							.attr({stroke: Raphael.hsb2rgb(hsbFillColor.h, hsbFillColor.s, hsbFillColor.b * 0.75).hex, 'stroke-width': 1, fill : color, opacity: 1});
					
					rect.node.setAttribute('id',chartId + 'rect_' + barValues[j].label + '_' + i);

					rect.mouseover(function()
			        {
			            rect.attr("stroke", color);
			            
		                var newWidth = String(barValues[j].value).length * 7 + 12,
		                	newcoord = {x: xCoord + barWidth + 5, y: yCoord > 10 + cy - 24 ? 10 + cy - 24 : yCoord};
	            		
	            		if (newcoord.x + newWidth > cx + 40) 
	                		newcoord.x -= (newWidth + barWidth + 5);
						
						if (!$.browser.msie)
						{
				            clearTimeout(leaveTimer);
			                ttFrame.show().animate({x: newcoord.x, y: newcoord.y, width:newWidth}, 200 * isLabelVisible);
			                ttText.attr({text: String(barValues[j].value)}).show().animate({x: newcoord.x + 6, y: newcoord.y + 9}, 200 * isLabelVisible);
			                isLabelVisible = true;
			                graph.safari();
			            }
			            else
			            {
		   	               	ttFrame.show().attr({x: newcoord.x, y: newcoord.y, width:newWidth});
		                	ttText.show().attr({text: String(barValues[j].value),x: newcoord.x + 6, y: newcoord.y + 12});
			            }
			            
			        }).mouseout(function()
			        {
			            rect.attr("stroke", Raphael.hsb2rgb(hsbFillColor.h, hsbFillColor.s, hsbFillColor.b * 0.75).hex);
			            
			            if (!$.browser.msie)
						{
			                graph.safari();
			                leaveTimer = setTimeout(function ()
			                {
			                    ttFrame.hide();
			                    ttText.hide();
			                    isLabelVisible = false;
			                    graph.safari();
			                }, 1);
			            }
			            else
			            {
		            		ttFrame.hide();
		                    ttText.hide();
			            }
			        });
				})(i,j) 
			}
		},
		_this = this;
	
	var ttFrame = graph.rect(10, 10, 120, 20, 5).attr({fill: "#CBCBEA", stroke: "#ABABFA", "stroke-width": 2, opacity: 1}).hide(),
		ttText = graph.text(60, 10, String(minValue)).attr({"font": '12px "Arial"', stroke: "none", fill: "#FFF", "text-anchor": "start"}).hide();
	
	for (var i = 0; i < dataColumns.length; i++)
		process(i)
	
	ttFrame = graph.rect(10, 10, 120, 20, 5).attr({fill: "#CBCBEA", stroke: "#ABABFA", "stroke-width": 2, opacity: 1}).hide(),
	ttText = graph.text(60, 10, String(minValue)).attr({"font": '12px "Arial"', stroke: "none", fill: "#FFF", "text-anchor": "start"}).hide();
	
	// легенда
	if (legendFlag > 0)
	{
		var width = 130,
			height = Math.min(namesByPage, objLength(data)) * legendCellHeight + 40;
		
		graph.rect(cx + 50, 10, width, height, 5)
			.attr('fill','#FAFAFE')
			.attr('stroke','#BABABE')
			.attr('stroke-width',1);
		
		var up = graph.path(["M", cx + 50 + 5, 10 + 15, "L", cx + 50 + width - 5, 10 + 15, "L", cx + 50 + width / 2, 10 + 5, "L", cx + 50 + 5,  10 + 15,"Z"]).attr({fill: '#ABCDEF', opacity: 0.5}),
			down = graph.path(["M", cx + 50 + 5, 10 + height - 15, "L", cx + 50 + width - 5, 10 + height - 15, "L", cx + 50 + width / 2,  10 + height - 5, "L",cx + 50 + 5,  10 + height - 15, "Z"]).attr({fill: '#ABCDEF', opacity: 0.5});
		
		up.node.style.cursor = "pointer";
		down.node.style.cursor = "pointer";
		
		var drawCurrentPage = function(position, count, names)
		{
			var length = count,
				endPosition = (names.length < position + length) ? names.length : position + length;
			
			var attachEvent = function(elem, name)
			{
				$(elem.node).mousedown(function()
				{
					if (elem.attr('opacity') == 1)
					{
						for (var i = 0; i < dataColumns.length; i++)
						{
							var bar = $('#' + chartId + 'rect_' + name + '_' + i)[0];
							$(bar).hide();
						}
						
						$('#' + chartId + 'legRect_' + name).attr('fill','#999999');
						
						elem.attr('opacity', 0.2);
					}
					else
					{
						for (var i = 0; i < dataColumns.length; i++)
						{
							var bar = $('#' + chartId + 'rect_' + name + '_' + i)[0];
							$(bar).show();
						}
						
						$('#' + chartId + 'legRect_' + name).attr('fill','#153069');
						
						elem.attr('opacity', 1);
					}
				})
			}
			
			if (position == 0)
				$(up.node).hide()
			else
				$(up.node).show()
				
			if (position + count >= names.length)
				$(down.node).hide()
			else
				$(down.node).show()

			for (var i = position; i < endPosition; i++)
			{
				var xCoord = cx + 50 + 50,
					yCoord = 14 + legendCellHeight * (i - position) + 20,
					layerName = names[i],
					area = $('#' + chartId + 'rect_' + layerName + '_0')[0],
					opacity = area.style.display == 'none' ? 0.2 : 1,
					shownName = layerName.length > 12 ? layerName.substring(0, 12) + '...' : layerName;
				
				var txt = graph.text(xCoord - 20, yCoord + 5, shownName)
							.attr({fill: '#153069', stroke: "none", "font-family": '"Arial"',
									"font-size": "12px", "text-anchor": "start"});
				
				txt.node.setAttribute('id', chartId + 'legRect_' + layerName)
				
				var rect = graph.rect(xCoord - 45, yCoord, 20, 10)
									.attr({fill: layerColors[layerName], opacity: opacity, stroke: layerColors[layerName]});
				
				rect.node.setAttribute('id', chartId + 'legTxt_' + layerName)
									
				rect.node.style.cursor = "pointer";
				attachEvent(rect, layerName);
			}
		}
		
		$(up.node).mousedown(function()
		{
			if (curPosition == 0)
				return;
			
			for (var i = 0; i < layerNames.length; i++)
			{
				$('#' + chartId + 'legRect_' + layerNames[i]).remove();
				$('#' + chartId + 'legTxt_' + layerNames[i]).remove();
			}

			curPosition -= namesByPage;
			drawCurrentPage(curPosition, namesByPage, layerNames);
		})
		$(down.node).mousedown(function()
		{
			if (curPosition + namesByPage >= layerNames.length)
				return;
				
			for (var i = 0; i < layerNames.length; i++)
			{
				$('#' + chartId + 'legRect_' + layerNames[i]).remove();
				$('#' + chartId + 'legTxt_' + layerNames[i]).remove();
			}
			
			curPosition += namesByPage;
			drawCurrentPage(curPosition, namesByPage, layerNames);
		})
		
		drawCurrentPage(0, namesByPage, layerNames);
	}
}

Diagram.prototype.createBalloon = function(obj, htmlContent)
{
	if (this.oldBalloon)
		this.oldBalloon.remove();
	
	if (this.oldBalloonIndex == obj.objectId)
	{
		this.oldBalloonIndex = -1;
		
		this.oldBalloon = false;
		
		return false;
	}
	
	var coords = obj.getGeometry().coordinates,
		_this = this;
		
	this.oldBalloon = globalFlashMap.addBalloon();
	
	this.oldBalloon.setPoint(coords[0], coords[1]);
	
	_(this.oldBalloon.div, [htmlContent]);
	
	var remove = makeImageButton("img/close.png", "img/close_orange.png");
	remove.onclick = function()
	{
		_this.oldBalloon.remove();
		
		_this.oldBalloonIndex = -1;
		
		_this.oldBalloon = false;
	}
	
	remove.style.position = 'absolute';
	remove.style.right = '9px';
	remove.style.top = '5px';
	remove.style.cursor = 'pointer';
	
	_(this.oldBalloon.div, [remove])
	
	this.oldBalloon.resize();
	
	this.oldBalloonIndex = obj.objectId;
	
	return true;
}

Diagram.prototype.createDateTimeDiagramByAttrs = function(parent, width, height, attrs, regexp)
{
	var graphDataFunc;
	
	if (regexp.indexOf("%") > -1)
	{
		var replaceIndex = {},
			currReplaceIndex = 0;
		
		regexp = regexp.replace(/%y%y%y%y/, function(){currReplaceIndex++; replaceIndex['y'] = currReplaceIndex; return "(\\d\\d\\d\\d)"})
						.replace(/%m%m/, function(){currReplaceIndex++; replaceIndex['m'] = currReplaceIndex; return "(\\d\\d)"})
						.replace(/%d%d/, function(){currReplaceIndex++; replaceIndex['d'] = currReplaceIndex; return "(\\d\\d)"});
						
		graphDataFunc = function(x, reResult)
		{
			var year = reResult[replaceIndex['y']],
				month = reResult[replaceIndex['m']] - 1,
				date = reResult[replaceIndex['d']];
			
			return String(new Date(year, month, date).valueOf());
		};
	}
	else
		return false;
	
	var re = new RegExp(regexp),
		graphData = {};
	
	for (var prop in attrs)
	{
		var res = re.exec(prop);
		
		if (res && res.length == 4)
			graphData[graphDataFunc(prop, res)] = Number(attrs[prop]);
	}
	
	if (objLength(graphData) > 0)
	{
		_diagram.createDateTimeDiagram(parent, width, height, graphData);
		
		return true;
	}
	
	return false
}

Diagram.prototype.createDateTimeDiagramByAttrsText = function(width, height, attrs, regexp)
{
	var id = String(Math.random()).substr(2, 12),
		text = "<div style=\"width:" + width + "px;height:" + height + "px\">";
		
	text += "<div><div id=\"balloonGraph" + id + "\" style=\"width:" + width + "px;height:" + height + "px\"></div></div>";
	
	text += "<iframe src=\"blank.html\" onload=\"javascript:_diagram.createDateTimeDiagramByAttrs($$('balloonGraph" + id + "'), " + width + ", " + height + ", " + JSON.stringify(attrs).replace(/\"/g, "'") + ", '" + regexp + "')\" style=\"display:none\"/>";
	
	text += "</div>";
	
	return text;
}

Diagram.prototype.createPieDiagramByAttrs = function(parent, width, height, attrs, regexp)
{
	var graphDataFunc;
	
	if (regexp.indexOf("%") > -1)
	{
		var replaceIndex = {},
			currReplaceIndex = 0;
		
		regexp = regexp.replace(/%y%y%y%y/, function(){currReplaceIndex++; replaceIndex['y'] = currReplaceIndex; return "(\\d\\d\\d\\d)"})
						.replace(/%m%m/, function(){currReplaceIndex++; replaceIndex['m'] = currReplaceIndex; return "(\\d\\d)"})
						.replace(/%d%d/, function(){currReplaceIndex++; replaceIndex['d'] = currReplaceIndex; return "(\\d\\d)"});
						
		graphDataFunc = function(x, reResult)
		{
			var year = reResult[replaceIndex['y']],
				month = reResult[replaceIndex['m']] - 1,
				date = reResult[replaceIndex['d']];
			
			return stringDate(new Date(year, month, date).valueOf());
		};
	}
	
	var re = new RegExp(regexp),
		graphData = {};
	
	for (var prop in attrs)
	{
		var res = re.exec(prop);
		
		if (res)
		{
			if (res.length == 4)
				graphData[graphDataFunc(prop, res)] = Number(attrs[prop]);
			else
				graphData[prop] = Number(attrs[prop]);
		}
	}
	
	if (objLength(graphData) > 0)
	{
		_diagram.createPieDiagram(parent, width, height, graphData);
		
		return true;
	}
	
	return false
}

Diagram.prototype.createPieDiagramByAttrsText = function(width, height, attrs, regexp)
{
	var id = String(Math.random()).substr(2, 12),
		text = "<div style=\"width:" + width + "px;height:" + height + "px\">";
		
	text += "<div><div id=\"balloonGraph" + id + "\" style=\"width:" + width + "px;height:" + height + "px\"></div></div>";
	
	text += "<iframe src=\"blank.html\" onload=\"javascript:_diagram.createPieDiagramByAttrs($$('balloonGraph" + id + "'), " + width + ", " + height + ", " + JSON.stringify(attrs).replace(/\"/g, "'") + ", '" + regexp + "')\" style=\"display:none\"/>";
	
	text += "</div>";
	
	return text;
}

/*
	layersFilters :
	{
		'layerName1' : 'regexp1',
		'layerName2' : 'regexp2',
		...
	}
*/
Diagram.prototype.createMultiLinesDiagramText = function(width, height, data, dataColumns, legendFlag)
{
	var id = String(Math.random()).substr(2, 12),
		text = "<div style=\"width:" + width + "px;height:" + height + "px\">";
		
	text += "<div><div id=\"balloonGraph" + id + "\" style=\"width:" + width + "px;height:" + height + "px\"></div></div>";
	
	text += "<iframe src=\"blank.html\" onload=\"javascript:_diagram.createMultiLinesDiagram($$('balloonGraph" + id + "'), " + width + ", " + height + ", " + JSON.stringify(data).replace(/\"/g, "'") + ", " + JSON.stringify(dataColumns).replace(/\"/g, "'") + ", " + legendFlag + ")\" style=\"display:none\"/>";
	
	text += "</div>";
	
	return text;
}

Diagram.prototype.createBarsDiagramText = function(width, height, data, dataColumns, legendFlag, multipleFlag)
{
	var id = String(Math.random()).substr(2, 12),
		text = "<div style=\"width:" + width + "px;height:" + height + "px\">";
		
	text += "<div><div id=\"balloonGraph" + id + "\" style=\"width:" + width + "px;height:" + height + "px\"></div></div>";
	
	text += "<iframe src=\"blank.html\" onload=\"javascript:_diagram.createBarsDiagram($$('balloonGraph" + id + "'), " + width + ", " + height + ", " + JSON.stringify(data).replace(/\"/g, "'") + ", " + JSON.stringify(dataColumns).replace(/\"/g, "'") + ", " + legendFlag + ", " + multipleFlag + ")\" style=\"display:none\"/>";
	
	text += "</div>";
	
	return text;
}


var _diagram = new Diagram();

/*
var data = {'label1':[3,4,-1,2,3], 'label2': [2,-2,1,4,1],'label3':[1, -1, 3,3,4],'label4':[-2,4,1,-2,1],'label5':[1,0,-1,1,1],'label6':[-4,2,1,6,2],'label7':[-3,-2,5,1,-2],'label8':[-1,-3,4,1,0],'label9':[1,2,-5,-4,5],'label10':[1,1,-3,4,4],'label11':[0,0,-3,3,1]}
var dataColumns = ['Октябрь\n2009','Ноябрь\n2009','Декабрь\n2009','Январь\n2010','Февраль\n2010']

var div = _div()
showDialog("Graphics", div, 640, 340, false, false)

_diagram.createMultiLinesDiagram(div, 600, 300, data, dataColumns, 5)
*/

/*
function(map)
{
	var layer = map.layers["9A38F34E16FF446DA667FFAA55117C22"];

	layer.filters[0].enableHoverBalloon(function(o)
	{
		return _diagram.createDateTimeDiagramByAttrsText(500,300,o.properties,'D%y%y%y%y%m%m%d%d')
	});
	
	layer.filters[1].enableHoverBalloon(function(o)
	{
		var props = {};
			
		$.extend(props, o.properties);
		
		for (var name in props)
			if (!/D(1993)/.test(name))
				delete props[name];
			
		return _diagram.createPieDiagramByAttrsText(300,300,props,'D%y%y%y%y%m%m%d%d')
	});
	
	layer.filters[2].enableHoverBalloon(function(o)
	{
		var dataColumns = ['1992','1993','1995','1996','1997','1999','2000'],
			data = {'Слой1': [], 'Слой2': []};
		
		for (var i = 0; i < dataColumns.length; i++)
		{
			data['Слой1'].push(Number(o.properties['V_' + String(dataColumns[i])]));
			data['Слой2'].push(Number(o.properties['VSTD_' + String(dataColumns[i])]));
		}
		
		return _diagram.createMultiLinesDiagramText(500,300,data,dataColumns,1);
	});
	
	layer.filters[3].enableHoverBalloon(function(o)
	{
		var dataColumns = ['1995','1996','1997','1999','2000'],
			data = {'Слой1': [], 'Слой2': []};
		
		for (var i = 0; i < dataColumns.length; i++)
		{
			data['Слой1'].push(50 + Number(o.properties['V_' + String(dataColumns[i])]));
			data['Слой2'].push(50 + Number(o.properties['VSTD_' + String(dataColumns[i])]));
		}
		
		return _diagram.createBarsDiagramText(500,300,data,dataColumns,1,0);
	});
	
	layer.filters[4].enableHoverBalloon(function(o)
	{
		var dataColumns = ['1995','1996','1997','1999','2000'],
			data = {'Слой1': [], 'Слой2': []};
		
		for (var i = 0; i < dataColumns.length; i++)
		{
			data['Слой1'].push(50 + Number(o.properties['V_' + String(dataColumns[i])]));
			data['Слой2'].push(50 + Number(o.properties['VSTD_' + String(dataColumns[i])]));
		}
		
		return _diagram.createBarsDiagramText(500,300,data,dataColumns,1,1);
	});
	
	layer.filters[5].enableHoverBalloon(function(o)
	{
		var dataColumns = ['1992','1993','1995','1996'],
			data = {'Слой1': [], 'Слой2': []};
		
		for (var i = 0; i < dataColumns.length; i++)
		{
			data['Слой1'].push(50 + Number(o.properties['V_' + String(dataColumns[i])]));
			data['Слой2'].push(50 + Number(o.properties['VSTD_' + String(dataColumns[i])]));
		}
		
		return _diagram.createBarsDiagramText(400,300,data,dataColumns,0,1);
	});
}
*/

