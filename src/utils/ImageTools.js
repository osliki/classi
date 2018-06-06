// https://gist.github.com/dcollien/312bce1270a5f511bf4a

import pica from 'pica/dist/pica.min'

export default class ImageTools {
    static resize(file, maxDimensions, callback) {
        if (typeof maxDimensions === 'function') {
            callback = maxDimensions;
            maxDimensions = {
                width: 640,
                height: 480
            };
        }

        if (!file.type.match(/image.*/)) {
            callback(file, false);
            return false;
        }

        if (file.type.match(/image\/gif/)) {
            // Not attempting, could be an animated gif
            callback(file, false);
            // TODO: use https://github.com/antimatter15/whammy to convert gif to webm
            return false;
        }

        let image = document.createElement('img');

        image.onerror = (err) => {
          callback(file, false);
        }

        image.onload = (imgEvt) => {
            URL.revokeObjectURL(image.src)

            let width  = image.width;
            let height = image.height;
            let isTooLarge = false;

            if (width >= height && width > maxDimensions.width) {
                // width is the largest dimension, and it's too big.
                height *= maxDimensions.width / width;
                width = maxDimensions.width;
                isTooLarge = true;
            } else if (height > maxDimensions.height) {
                // either width wasn't over-size or height is the largest dimension
                // and the height is over-size
                width *= maxDimensions.height / height;
                height = maxDimensions.height;
                isTooLarge = true;
            }

            if (!isTooLarge) {
                // early exit; no need to resize
                callback(file, false);
                return;
            }

            const canvasFrom = document.createElement('canvas');
            canvasFrom.width = image.width;
            canvasFrom.height = image.height;
            canvasFrom.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

            const canvasTo = document.createElement('canvas');
            canvasTo.width = width;
            canvasTo.height = height;

            pica().resize(canvasFrom, canvasTo, {alpha: true})
              .then(result => pica().toBlob(result, file.type, 0.97))
              .then(blob => callback(blob, true));
        };

        image.src = URL.createObjectURL(file);

        return true;
    }

}
