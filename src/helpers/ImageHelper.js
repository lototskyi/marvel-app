class ImageHelper {
    fixImageNotAvailableStyle = (thumbnail) => {
        let thumbnailStyle = {};
        if (thumbnail.indexOf('image_not_available.jpg') !== -1) {
            thumbnailStyle = {objectFit: 'contain'};
        }
        return thumbnailStyle;
    }
}

export default ImageHelper;