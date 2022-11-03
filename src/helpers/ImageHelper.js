class ImageHelper {
    fixImageNotAvailableStyle = (thumbnail, objectFitVal = 'contain') => {
        if (thumbnail) {
            let thumbnailStyle = {};
            if (thumbnail.indexOf('image_not_available.jpg') !== -1) {
                thumbnailStyle = {objectFit: objectFitVal};
            }
            return thumbnailStyle;
        }

        return {};
    }
}

export default ImageHelper;