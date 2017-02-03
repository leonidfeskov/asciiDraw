//var string = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`. ';
var string = '@#%=+*:-. ';
var ASCIIColors = string.split('');
var limit = 4000000;
var maxWidth = 150;
var maxHeight = 150;

var inputFile = document.querySelector('.js-file');
var preview = document.querySelector('.js-preview');
var asciiImage = document.querySelector('.js-ascii-image');

function drawAsciiImage(colors, width, height){
	// если изображение больше maxWidth * maxHeight px, то не рисуем каждый пиксель, а рисуем с шагом ratioWidth
	var ratioWidth = Math.ceil(width / maxWidth);
	var ratioHeight = Math.ceil(width / maxHeight);

	var str = '';

	for(var i = 0; i < height; i += ratioHeight) {
		var row = colors[i];

		for(var j = 0; j < width; j += ratioWidth) {
			var color = row[j];
			var symbol = ASCIIColors[color > 0 ? Math.ceil(color / 255 * ASCIIColors.length) - 1 : 0];
			str += symbol + '' + symbol;
		}

		str += '<br>';
	}

	asciiImage.innerHTML = str;
}

var getPixelsColorCode = function(name) {
	var texture = new Image();
	var result = {};

	texture.src = name;

	texture.addEventListener('load', function () {
		if (this.width * this.height > limit) {
			alert('Изображение слишком большое. Максимальная плотность изображения ' + limit + 'px.');
			return false;
		}

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		var width = this.width;
		var height = this.height;
		
		canvas.width = width;
		canvas.height = height;

		context.drawImage(this, 0, 0);

		var imageData = context.getImageData(0, 0, this.width, this.height);
		var data = imageData.data;

		// каждый пиксел предствлен 4-мя значениями, например [34, 136, 204, 255];
		// используя первые три значения, получаем нужный оттенок серого цвета.
		var pixelMatrix = [];
		var row = 0;
		pixelMatrix[0] = [];
		for(var i = 0; i < data.length; i += 4) {
			if ( (i / (row + 1)) >= (width * 4) ) {
				pixelMatrix[++row] = [];
			}
			var brightness = Math.round(0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]);
			pixelMatrix[row].push(brightness);
		}

		drawAsciiImage(pixelMatrix, width, height);
	});
};

function previewImage() {
	var file = inputFile.files[0];
	var reader = new FileReader();

	reader.onloadend = function() {
		preview.src = reader.result;

		getPixelsColorCode(preview.src);
	};

	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = '';
	}
}

inputFile.addEventListener('change', previewImage);