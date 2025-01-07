import React from "react";
import { Carousel } from "primereact/carousel";

interface ImageCarouselProps {
  images: any[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  console.log(images);
  const itemTemplate = (image: any) => {
    return (
      <div className="flex justify-center">
        <img
          src={image.url}
          alt="Image"
          className="w-1/2 h-auto" // 50% chiều rộng
        />
      </div>
    );
  };

  return (
    <Carousel
      value={images}
      itemTemplate={itemTemplate}
      numVisible={1}
      numScroll={1}
    >
      {/* Other carousel props can be added as needed */}
    </Carousel>
  );
};

export default ImageCarousel;
