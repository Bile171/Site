const caixa1 = document.getElementById("box1");
const caixa2 = document.getElementById("box2");
const caixa3 = document.getElementById("box3");
const caixa4 = document.getElementById("box4");
const caixa5 = document.getElementById("box5");
const cursor = document.getElementById("cursor");
//const foto = document.getElementById("foto");
const modoEscuro = document.getElementById("modoEscuro");
let isDark = false;
const background = document.getElementById("background");
const info = document.getElementById("info");
const bio = document.getElementById("bio");
const mask = document.getElementById("mask");
let isInfo = false;
const logo = document.getElementById("logo");
var caixas = []
// const body = document.getElementsByClassName("body");
//foto = caixa1.getElementsByClassName("image")[0];
// FOTO = GETIMAGE(BOX)

haveExpanded = false;
zFrontIndex = 200;
//caixa1.style.transition = "width .5, height .5s linear";

// Make the DIV element draggable:
function dragElement(element) {
  var elementStartTop = 0, elementStartLeft = 0, mouseStartX, mouseStartY, oldTransition;
  var hasMoved =false;
  element.onmousedown = dragMouseDown;

  element.onmouseover = function(){
    if(element.isOverFoto && !element.isExpanded) changeCursor("cursor-eye.svg");
    else {
      changeCursor("cursor-grab.svg");
      rotateCursor();
    }
  }
  element.onmouseleave = function(){
    changeCursor("cursor-cross.svg");
    unrotateCursor();
  }

  function dragMouseDown(e) {
    //para de mexer se for clicado
    element.stop = true;
    element.isDragging = true;
    oldTransition = element.style.transition
    element.style.transition = "all .0s";
    elementStartTop = element.offsetTop;
    elementStartLeft = element.offsetLeft;
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    hasMoved = false;
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos1 = e.clientX;
    pos2 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    element.style.zIndex = zFrontIndex;
    zFrontIndex+=20;
    cursor.style.zIndex=zFrontIndex+20;  //previne que cursor fique atras
  }

  function elementDrag(e) {
    changeCursor("cursor-grabing.svg");
    if(!element.isExpanded){
      e = e || window.event;
      e.preventDefault();
      // set the element's new position:
      pixX = (elementStartLeft +(e.clientX-mouseStartX)); //posicao em pixeis
      pixY = (elementStartTop +(e.clientY-mouseStartY));
      element.posX = (pixX/window.innerWidth)*100; //posicao em porcentagem
      element.posY= (pixY/window.innerHeight)*100;
      element.style.left = element.posX + "vw";
      element.style.top = element.posY + "vh";
    }
  }

  function closeDragElement(e) {
    if(element.isOverFoto && !element.isExpanded) changeCursor("cursor-eye.svg");
    else changeCursor("cursor-grab.svg");

    element.isDragging = false;
    element.style.transition = oldTransition;
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    //se a posicao do mouse nao for diferente da posicao inicial, expande
    //if(e.clientX == mouseStartX && e.clientY == mouseStartY){
    if(Math.pow(e.clientX-mouseStartX,2) + Math.pow(e.clientY-mouseStartY,2) < 100){
      resizeDiv(element,96,87,53,50);
      //resizeDiv(foto,80,65,50,50);
    }
  }
}

//Expande div on-click
function resizeDiv(element,width,height,top,left) {
  if(!element.isExpanded){
    changeCursor("cursor-grab.svg");
    toZoom = element;
    element.isExpanded = true;
    haveExpanded = true;
    element.previousWidth = element.style.width
    element.previousHeight = element.style.height
    element.previousTop = element.style.top;
    element.previousLeft = element.style.left;
    element.foto.previousAnimation = element.foto.style.animation;
    element.foto.style.animationPlayState = "paused";
    element.style.width = width + "vw";
    element.style.height = height + "vh";
    element.style.top = top + "vh";
    element.style.left = left + "vw";
  }
  else{
    changeCursor("cursor-eye.svg");
    element.style.top = element.previousTop;
    element.style.left = element.previousLeft;
    element.style.width = element.previousWidth;
    element.style.height = element.previousHeight;
    element.foto.style.animation = element.foto.previousAnimation;
    element.isExpanded = false;
    haveExpanded = false;
    element.zoomElement.style.transform = "scale(1)";
  }
}

//Ativa o modo escuro
function showInfo() {
  if (!isInfo) {
    //document.body.style.backgroundColor = "#000000";
    //document.getElementsByClassName("box")[0].style.border = "10px solid #ff9fcf";

    // let caixas = document.getElementsByClassName("box");
    // for(let i = 0; i < caixas.length; i+=1){
    //   caixas[i].style.border = "10px solid #ff9fcf";
    // }

    //background.style.opacity = "0";
    logoImg = logo.getElementsByTagName("img")[0];
    bio.style.display = "block";
    setTimeout(function(){ bio.style.opacity = "1"; }, 1);
    bio.style.zIndex = "7";
    mask.style.transform = "scale(40)";

    isInfo = true;
    //Rearranja as caixas
    for(let i=0;i<caixas.length;i++){
      if(!caixas[i].isExpanded){
        caixas[i].style.zIndex = caixas[i].startZIndex;
        caixas[i].posX = caixas[i].infoPosX;
        caixas[i].posY = caixas[i].infoPosY;
        caixas[i].style.top = caixas[i].posY + "vh";
        caixas[i].style.left = caixas[i].posX + "vw";
        caixas[i].stop = true;
      }
    }
  } else {
    // let caixas = document.getElementsByClassName("box");
    // for(let i = 0; i < caixas.length; i+=1){
    //   caixas[i].style.border = "10px solid black";
    // }
    mask.style.transform = "scale(1)";
    bio.style.opacity = "0";
    setTimeout(function(){ bio.style.display = "none"; }, 800);
    bio.style.zIndex = "7";
    isInfo = false;
    //faz todas as caixas se moverem novamente
    for(let i=0;i<caixas.length;i++){
      caixas[i].stop = false;
    }
  }
}

//Ativa o modo escuro
function darkMode() {
  if (!isDark) {
    document.body.style.backgroundColor = "#000000";
    //document.getElementsByClassName("box")[0].style.border = "10px solid #ff9fcf";

    // let caixas = document.getElementsByClassName("box");
    // for(let i = 0; i < caixas.length; i+=1){
    //   caixas[i].style.border = "10px solid #ff9fcf";
    // }
    mask.style.backgroundColor = "#000000"
    background.style.opacity = "0";
    modoEscuro.getElementsByTagName("p")[0].innerHTML = "colorido";
    logoImg = logo.getElementsByTagName("img")[0];
    logoImg.style.opacity = "1";
    isDark = true;
    //Rearranja as caixas
    for(let i=0;i<caixas.length;i++){
        let modeX;
        let modeY;
      if(isInfo){
        modeX = "infoPosX"
        modeY = "infoPosY"
      }
      else{
        modeX = "darkPosX"
        modeY = "darkPosY"
      }
      if(!caixas[i].isExpanded){
        caixas[i].style.zIndex = caixas[i].startZIndex;
        caixas[i].posX = caixas[i][modeX];
        caixas[i].posY = caixas[i][modeY];
        caixas[i].style.top = caixas[i].posY + "vh";
        caixas[i].style.left = caixas[i].posX + "vw";
        caixas[i].stop = true;
      }
    }
  } else {
    document.body.style.backgroundColor = "#0000ff";
    // let caixas = document.getElementsByClassName("box");
    // for(let i = 0; i < caixas.length; i+=1){
    //   caixas[i].style.border = "10px solid black";
    // }
    mask.style.backgroundColor = "#0000ff"
    background.style.opacity = "1";
    modoEscuro.getElementsByTagName("p")[0].innerHTML = "modo escuro";
    logo.getElementsByTagName("img")[0].style.opacity = "0";
    isDark = false;
    //faz todas as caixas se moverem novamente
    for(let i=0;i<caixas.length;i++){
      caixas[i].stop = false;
    }
  }
}

function dragImage(element) {
  var imageStartTop = 0, imageStartLeft = 0, imgMouseStartX, imgMouseStartY, imgOldTransition;
  var imagHasMoved =false;
  element.onmousedown = imgDragMouseDown;

  function imgDragMouseDown(f) {
    imgOldTransition = element.style.transition
    element.style.transition = "all .5s ease-out";
    imageStartTop = element.offsetTop;
    imageStartLeft = element.offsetLeft;
    imgMouseStartX = f.clientX;
    imgMouseStartY = f.clientY;
    imgHasMoved = false;
    f = f || window.event;
    f.preventDefault();
    // get the mouse cursor position at startup:
    imgPos1 = f.clientX;
    imgPos2 = f.clientY;
    element.onmouseup = closeDragimage;
    // call a function whenever the cursor moves:
    element.onmousemove = imageDrag;
  }

  function imageDrag(f) {
    if(haveExpanded){
      f = f || window.event;
      f.preventDefault();
      // set the element's new position:
      element.style.left = (imageStartLeft +(f.clientX-imgMouseStartX)) + "px";
      element.style.top = (imageStartTop +(f.clientY-imgMouseStartY)) + "px";
    }
  }

  function closeDragimage(f) {
    element.style.transition = imgOldTransition;
    // stop moving when mouse button is released:
    element.onmouseup = null;
    element.onmousemove = null;
    //se a posicao do mouse nao for diferente da posicao inicial, expande
    //if(e.clientX == mouseStartX && e.clientY == mouseStartY){
//    if(Math.pow(e.clientX-mouseStartX,2) + Math.pow(e.clientY-mouseStartY,2) < 100){
//      resizeDiv(image,92,80,54,50);
      //resizeDiv(foto,80,65,50,50);
    }
  }

//MOUSE WHEEL START//////////////////////////////////////////////////////////
function detectMouseWheelDirection(e) {
  var delta = null,
    direction = false;
  if ( !e ) { // if the event is not provided, we get it from the window object
    e = window.event;
  }
  if ( e.wheelDelta ) { // will work in most cases
    delta = e.wheelDelta / 60;
  } else if ( e.detail ) { // fallback for Firefox
    delta = -e.detail / 2;
  }
  if ( delta !== null ) {
    direction = delta > 0 ? 'up' : 'down';
  }
  return direction;
}

function remapZoom(element) {
  zoomValue = element.zoom;
  if (element.zoom>=10) zoomValue = 10
  else if (element.zoom<=-7) zoomValue = -7
  element.zoom = zoomValue
  return Math.pow(1.1,zoomValue)
  //return zoomValue
}

function handleMouseWheelDirection(direction) {
  console.log( direction ); // see the direction in the console
  if (!haveExpanded) return;
  if (direction == 'down') {
    toZoom.zoom-=0.5;
    toZoom.zoomElement.style.transform = "scale(" + remapZoom(toZoom) + ")";
  }
  else if ( direction == 'up' ) {
    toZoom.zoom+=0.5;
    toZoom.zoomElement.style.transform = "scale(" + remapZoom(toZoom) + ")";
    // do something, like show the previous page
  }
}

function StartBoxElement(element){
  //muda cursor se mouse em cima
  element.posX = 20 + (Math.floor(Math.random() * 60));
  element.posY = 20 + (Math.floor(Math.random() * 60));
  theta = Math.random()*2*3.14159;
  element.velX = 0.1*Math.cos(theta);
  element.velY = 0.1*Math.sin(theta);
  //element.style.top = 20 + (Math.floor(Math.random() * 60)) + "vh";
  //element.style.left = 20 + (Math.floor(Math.random() * 60)) + "vw";
  element.isDragging = false;
  element.stop = false;
  element.zoomElement = element.getElementsByClassName("innerContainer")[0];
  element.foto = element.getElementsByClassName("image")[0];
  element.foto.parent = element;
  element.isOverFoto = false;
  //faz olhinho na foto
  element.foto.onmouseover = function(){
    if (!element.isExpanded){
      element.isOverFoto = true;
    }
  }
  element.foto.onmouseleave = function(){
    element.isOverFoto = false;
  }
  element.isExpanded = false;
  element.previousTop = element.style.top;
  element.previousLeft = element.style.left;
  element.foto.previousTop = element.foto.style.top;
  element.foto.previousLeft = element.foto.style.left;
  isDark = false;
  zoom = 1.5;
  element.zoom = 1.5
  element.foto.onmousewheel = function(e) {
    handleMouseWheelDirection( detectMouseWheelDirection(e) );
  };

  if (element.addEventListener) {
    document.addEventListener( 'DOMMouseScroll', function(e) {
      handleMouseWheelDirection( detectMouseWheelDirection(e) );
    });
  }
  element.startZIndex = zFrontIndex;
  element.zIndex = zFrontIndex;
  zFrontIndex+=1;
  dragElement(element);
  dragImage(element.foto);
  caixas.push(element)
}



function moveBoxes(){
  marginX = 5;
  marginY = 10;
  for(let i = 0; i < caixas.length; i++){
    caixa=caixas[i] ;
    if (!caixa.isExpanded && !isDark &&!caixa.isDragging && !caixa.stop){
      caixa.posX += caixa.velX;
      caixa.posY += caixa.velY;
      if (caixa.posX >=100-marginX || caixa.posX <= marginX) caixa.velX*=-1;
      if (caixa.posY >=100-marginY || caixa.posY <= marginY) caixa.velY*=-1;
      caixa.style.top = caixa.posY + "vh";
      caixa.style.left = caixa.posX + "vw";
    }
  }
}

window.setInterval(function(){
  //chamadas por frame
  moveBoxes();
  console.log("ok");
}, 33);

function startCursor(){
  // cursor.img1 = cursor.getElementById("main");
  // cursor.img2 = document.getElementById("ast");
  cursor.style.left = 0 + "px";
  cursor.style.top = 0 + "px";
}

startCursor();

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  cursor.style.left = cursorX +"px";
  cursor.style.top = cursorY + "px";
});

//funcao chamada uma vez somente
function organizeDarkMode(){
  startW = 20;
  startH = 30;
  endW = 60;
  endH = 90;
  stepW = (startW-endW)/caixas.length;
  stepH = (startH-endH)/caixas.length;

  for (let i=0; i<caixas.length; i++){
    caixas[i].darkPosX =  startW - i*stepW;
    caixas[i].darkPosY = startH - i*stepH;
  }
}

function organizeInfoMode(){
  posH = 80;
  startW = 12;
  endW = 108;
  stepW = (startW-endW)/caixas.length;
  for (let i=0; i<caixas.length; i++){
    caixas[i].infoPosX =  startW - i*stepW;
    caixas[i].infoPosY = posH;
  }
}

function copy(that){
  var inp =document.createElement('input');
  document.body.appendChild(inp)
  inp.value =that.textContent
  inp.select();
  document.execCommand('copy',false);
  inp.remove();
  changeCursor("cursor-copy.svg");
  cursor.style.transform = "translate(-50%, -50%) rotate(0deg) scale(3)";
  setTimeout(function(){ cursor.style.transform = "translate(-50%, -50%) rotate(0deg) scale(1)"; }, 2000);
  setTimeout(function(){ changeCursor("cursor-cross.svg"); }, 2000);
}

StartBoxElement(caixa1);
StartBoxElement(caixa2);
StartBoxElement(caixa3);
StartBoxElement(caixa4);
StartBoxElement(caixa5);
organizeInfoMode();
organizeDarkMode();

function rotateCursor(){
  cursor.style.transform = "translate(-50%, -50%) rotate(135deg)";
  cursor.style.width = "50px";
}
function unrotateCursor(){
  cursor.style.transform = "translate(-50%, -50%) rotate(0deg)";
  cursor.style.width = "70px";
}

modoEscuro.onmouseenter = rotateCursor;
info.onmouseenter = rotateCursor;
modoEscuro.onmouseleave = unrotateCursor;
info.onmouseleave = unrotateCursor;

function changeCursor(src){
  cursor.src = src;
}

toZoom = caixa1;

//zoomElement(caixa2)

//MOUSE WHEEL END////////////////////////////////////////////////////////////

modoEscuro.onmousedown = function(){darkMode()};
info.onmousedown = function(){showInfo()};
