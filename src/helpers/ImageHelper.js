class ImageHelper {
    fixImageNotAvailableStyle = (thumbnail, objectFitVal = 'contain') => {
        let thumbnailStyle = {};
        if (thumbnail.indexOf('image_not_available.jpg') !== -1) {
            thumbnailStyle = {objectFit: objectFitVal};
        }
        return thumbnailStyle;
    }
}

export default ImageHelper;