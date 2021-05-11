'use strict'
function createLeinwand(id, width, height, callback) {

	const el = document.getElementById(id);

	if (!el) {
		throw(`Element with id '${id}' does not exist within document.`)
	}

	if (el.nodeName != 'CANVAS') {
		throw(`Element with id '${id}' is <${el.nodeName}>; need a <CANVAS>.`)
	}

	el.width = width;
	el.height = height;

	let currently_painting = false;
	const polylines = [];
	var current_poly = [];
	const ctx = el.getContext('2d');
	const last_point = {x: undefined, y: undefined}

	const lein = {
		id, width, height, el, currently_painting, polylines
	}



	function removeInitialHandlers() {
		el.removeEventListener('mousedown', useMouseEvents);
		el.removeEventListener('touchstart', useTouchEvents);
	}


	function useMouseEvents(firstEvent) {
		console.log('using mouse events.')
		el.addEventListener('mousedown', mouseDownHandler);
		el.addEventListener('mousemove', mouseMoveHandler);
		el.addEventListener('mouseup', mouseUpHandler);
		removeInitialHandlers();
		mouseDownHandler(firstEvent);
	}

	function useTouchEvents(firstEvent) {
		console.log('using touch events.')
		el.addEventListener('touchstart', touchStartHandler);
		el.addEventListener('touchmove', touchMoveHandler);
		el.addEventListener('touchend', mouseUpHandler);
		removeInitialHandlers();
		touchStartHandler(firstEvent);
	}

	el.addEventListener('mousedown', useMouseEvents);
	el.addEventListener('touchstart', useTouchEvents);


	/***********************************************************/
	function mouseDownHandler(e) {
		currently_painting = true;
		startCurrentPoly();
		mouseMoveHandler(e);
	}

	function mouseMoveHandler(e) {
		if (currently_painting) {

			let x = e.pageX - el.offsetLeft;
			let y = e.pageY - el.offsetTop;
			extendCurrentPoly(x, y);
		}
	}

	function mouseUpHandler(e) {
		currently_painting = false;
		startCurrentPoly();
	}

	function touchStartHandler(e) {
		console.log("touch: start");
		currently_painting = true;
		startCurrentPoly();
		touchMoveHandler(e);
	}

	function touchMoveHandler(e) {
		if (currently_painting) {
			let x = e.touches[0].pageX - el.offsetLeft;
			let y = e.touches[0].pageY - el.offsetTop;
			extendCurrentPoly(x, y);
		}
	}

	function startCurrentPoly() {
		if (current_poly.length == 1) {
			// special case: single point
			drawDot(current_poly[0][0], current_poly[0][1], 3)
		}

		if (current_poly.length) {
			console.log(`sending current polyline (length ${current_poly.length})...`);
			polylines.push(current_poly);
			callback(current_poly);
      Setze(current_poly, "Cookie-Name")
			current_poly = [];
		}
		last_point.x = undefined;
		last_point.y = undefined;
	}

	function extendCurrentPoly(x, y) {
		current_poly.push([x, y]);
		drawSegment(last_point.x, last_point.y, x, y);
		drawDot(x, y, 1.25)
		last_point.x = x;
		last_point.y = y;
	}


	function drawDot(x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	function drawSegment(x1, y1, x2, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

	}

	return lein;
}
const lein = createLeinwand('leinwand-canvas', 800, 600, console.log);


function wertSetzen(Bezeichner, Wert, Verfall) {
	var jetzt = new Date();
	var Auszeit = new Date(jetzt.getTime() + Verfall);
	document.cookie = Bezeichner + "=" + Wert + "; expires=" + Auszeit.toGMTString() +
		"; secure;";
}
function Setze(Form, name) {
	var Verfallszeit = 1000 * 60 * 60 * 24 * 365;

	


	wertSetzen(name, Form, Verfallszeit);
}

