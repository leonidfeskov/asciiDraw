//var string = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`. ';
var string = '@#%=+*:-. ';
var ASCIIColors = string.split('');
var limit = 1000000;
var pictures = ['necr.png', 'venom.png', 'axe.png', 'sven.png', 'pudge.png', 'never.png', 'lich.png',  'zombi.png', 'darkseer.png', 'ursa.png', 'lina.png', 'invoker.png', 'balanar.png', 'kunka.png', 'spektra.png', 'puck.png'];
var activePic = 0;

var loadTexture = function (name, then) {
	var texture = new Image();
	var result = {};

	// on load
	texture.addEventListener('load', function () {
		if (this.width * this.height > limit) {
			alert('Изображение слишком большое. Максимальная плотность изображения '+limit+'px.');
			return false;
		}

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		
		canvas.width = this.width;
		canvas.height = this.height;

		result.width = this.width;
		result.height = this.height;

		context.drawImage(this, 0, 0);

		var imageData = context.getImageData(0, 0, this.width, this.height);
		var data = imageData.data;

		for(var i = 0; i < data.length; i += 4) {
			var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			data[i] = brightness;
			data[i + 1] = brightness;
			data[i + 2] = brightness;
		}

		// overwrite original image
		context.putImageData(imageData, 0, 0);

		result.data = context.getImageData(0, 0, this.width, this.height).data;

		then();
	}, false);

	texture.src = name;
	return result;
};

function drawPicture(data){
	var colors = data.data;
	var pic = document.querySelector('.pic');
	var str = '';

	for (var i = 0; i < colors.length; i+=4) {
		var color = colors[i];
		if ( i > 0 && (i % (data.width*4)) == 0 ) {
			str += '<br>';
		}
		var symbol = ASCIIColors[color > 0 ? Math.ceil(color/255*ASCIIColors.length)-1 : 0];
		str += symbol+''+symbol;

	}
	pic.innerHTML = str;
}

function loadPicture(src){
	var texture = loadTexture(src, function () {
		if (texture) {
			drawPicture(texture);
		}
	});
}

document.addEventListener('click', function(){
	loadPicture('i/' + pictures[activePic++]);
	if (activePic >= pictures.length) {
		activePic = 0;
	}
});