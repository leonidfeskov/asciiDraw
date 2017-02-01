//var string = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`. ';
var string = '@#%=+*:-. ';
var ASCIIColors = string.split('');
var limit = 1000000;
var maxWidth = 120;
var maxHeight = 120;


var inputFile = document.querySelector('.js-file');
var preview = document.querySelector('.js-preview');
var asciiImage = document.querySelector('.js-ascii-image');

function drawAsciiImage(data){

	console.log('draw:', data);
	var colors = data.data;
	var str = '';

	for (var i = 0; i < colors.length; i++) {
		var color = colors[i];
		if ( i > 0 && (i % data.width) == 0 ) {
			str += '<br>';
		}
		var symbol = ASCIIColors[color > 0 ? Math.ceil(color/255*ASCIIColors.length)-1 : 0];
		str += symbol+''+symbol;

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
		
		canvas.width = this.width;
		canvas.height = this.height;

		result.width = this.width;
		result.height = this.height;

		context.drawImage(this, 0, 0);

		var imageData = context.getImageData(0, 0, this.width, this.height);
		var data = imageData.data;

		console.log('data:', data);

		// преобразуем изображение в градации серого
		for(var i = 0; i < data.length; i += 4) {
			var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
			data[i] = brightness;
			data[i + 1] = brightness;
			data[i + 2] = brightness;
		}
		context.putImageData(imageData, 0, 0);

		// каждый пиксел предствлен 4-мя значениями, например [34, 34, 34, 255];
		// нас интересует только первое число
		var grayData = context.getImageData(0, 0, this.width, this.height).data;
		console.log('grayData:', grayData);

		var allPixels = grayData.filter(function(pixel, i){
			return i % 4 === 0;
		});

		var ratioWidth = Math.round(this.width / maxWidth);
		console.log(ratioWidth);

		// сжимаем изображение до размеров maxWidth * maxHeight
		result.data = allPixels.filter(function(pixel, i){
			return true;
		});

		drawAsciiImage(result);
	}, false);
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