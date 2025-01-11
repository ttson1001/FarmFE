import React from "react";
import { Carousel } from "primereact/carousel";

interface ImageCarouselProps {
  images: any[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const itemTemplate = (image: any) => {
    return (
      <div className="flex justify-center">
        <img src={image.url} alt="Image" className="w-1/2 h-auto" />
      </div>
    );
  };

  return (
    <Carousel
      value={images}
      itemTemplate={itemTemplate}
      numVisible={1}
      numScroll={1}
    ></Carousel>
  );
};

export default ImageCarousel;
