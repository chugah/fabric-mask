var mycanvas;
var myctx;

$(document).ready(function () {

	mycanvas  = new fabric.Canvas('c');
	mycanvas.backgroundColor = "#68a5c4";
	mycanvas.renderAll();
	myctx = mycanvas.getContext("2d");
  

	console.log("Loading main image...");
    fabric.Image.fromURL('http://localhost/fabric/mask2.jpg', function(myImg) {
    	     console.log("done loading main image.");

			 //i create an extra var for to change some image properties
			 var img2 = myImg.set({ left: 200, top: 0 , width:300,height:218});
			 img2.itemId = 'a65c6bd6-a33b-4c9c-8d3c-811c6aae17d6';
			 mycanvas.add(img2); 

			 console.log("Loading mask...");
			 fabric.Maskedimage.fromURL('http://localhost/fabric/image.jpg', function(myImg) {
			 	 console.log("done loading mask.");
				 //i create an extra var for to change some image properties
				 var img1 = myImg.set({ left: 0, top: 0 ,width:300,height:218, opacity: 1.0});
				 img1.objectCaching=false;				 
				 mycanvas.add(img1); 
			 });
	});


	// listen for mouse:move events
	/*
	mycanvas.on('mouse:move', function(e) {
	    var rgbaObj = getRGBAforPixelUnderCursor(e);
	    console.log('At [' + rgbaObj.x + ' / ' + rgbaObj.y + ']: Red/Green/Blue/Alpha = [' + rgbaObj.r + ' / ' + rgbaObj.g + ' / ' + rgbaObj.b + ' / ' + rgbaObj.a + ']')	;
	});
	*/

});


/* Example usage:
        mycanvas.on('mouse:move', function(e) {
	       var rgbaObj = getRGBAforPixelUnderCursor(e);
	       console.log('At [' + rgbaObj.x + ' / ' + rgbaObj.y + ']: Red/Green/Blue/Alpha = [' + rgbaObj.r + ' / ' + rgbaObj.g + ' / ' + rgbaObj.b + ' / ' + rgbaObj.a + ']')	;
	    });
*/
function getRGBAforPixelUnderCursor(e)
{
	 // get the current mouse position
	  var mouse = mycanvas.getPointer(e.e);
	  var x = parseInt(mouse.x);
	  var y = parseInt(mouse.y);

	  // get the color array for the pixel under the mouse
	  var px = myctx.getImageData(x, y, 1, 1).data;

	  // report that pixel data
	  //console.log('At [' + x + ' / ' + y + ']: Red/Green/Blue/Alpha = [' + px[0] + ' / ' + px[1] + ' / ' + px[2] + ' / ' + px[3] + ']')	;

	  return {
	  	  x: x,
	  	  y: y,
	  	  r: px[0],
	  	  g: px[1],
	  	  b: px[2],
	  	  a: px[3]
	  }
}


function maskImage( ctx, w, h, imageData1, imageData2)
{
	var imageData1Pixels = imageData1.data;
	var imageData2Pixels = imageData2.data;

    var resultImgData = ctx.createImageData(w,h);


   for(var i = 0; i < imageData1Pixels.length; i += 4){
    	resultImgData.data[i]   = imageData1Pixels[i]; 
    	resultImgData.data[i+1] = imageData1Pixels[i+1];
    	resultImgData.data[i+2] = imageData1Pixels[i+2]; 

    	var averageVal =   (imageData2Pixels[i] + imageData2Pixels[i+1] + imageData2Pixels[i+2]) / 3; 
    	//[i+3] position controls the alpha 
    	resultImgData.data[i+3] = averageVal;
    }

  

    return resultImgData;
}


function createFabricImageFromImageData(ctx,data,w,h,canvas)
{
	var c = document.createElement('canvas');
	c.setAttribute('id', '_temp_canvas');
	c.width = w;
	c.height = h;
	c.getContext('2d').putImageData(data, 0, 0);

	fabric.Image.fromURL(c.toDataURL(), function(img) {
	    img.left = 300;
	    img.top = 300;
	    setFunkyBorder(img);
	    canvas.add(img);
	    img.bringToFront();
	    c = null;
	    $('#_temp_canvas').remove();
	    canvas.renderAll();
	});
}

function setFunkyBorder(obj)
{
	 obj.set({
		    transparentCorners: false,
		    cornerColor: 'blue',
		    cornerStrokeColor: 'red',
		    borderColor: 'red',
		    cornerSize: 12,
		    padding: 10,
		    cornerStyle: 'circle',
		    borderDashArray: [3, 3]
		  });
}

