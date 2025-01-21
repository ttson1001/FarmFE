import React from "react";
import { Carousel } from "primereact/carousel";

interface ImageCarouselProps {
  images: { id: number; url: string }[]; // Nhận danh sách hình ảnh từ props
  onRemoveImage: (id: number) => void;
}

const ImageCarouselDel: React.FC<ImageCarouselProps> = ({
  images,
  onRemoveImage,
}) => {
  const itemTemplate = (image: { id: number; url: string }) => {
    return (
      <div className="flex flex-col items-center relative">
        {/* Nút X để xóa */}
        <button
          onClick={() => onRemoveImage(image.id)} // Gọi hàm xóa được truyền từ ngoài
          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full z-10"
        >
          X
        </button>
        {/* Hình ảnh */}
        <img
          src={image.url}
          alt={`Image ${image.id}`}
          className="w-32 h-auto rounded-md"
        />
      </div>
    );
  };

  return (
    <Carousel
      value={images}
      itemTemplate={itemTemplate}
      numVisible={1} // Hiển thị 3 hình ảnh
      numScroll={1} // Khi cuộn sẽ cuộn 1 hình
      responsiveOptions={[
        {
          breakpoint: "1024px", // Ngưỡng cho kích thước màn hình
          numVisible: 1,
          numScroll: 1,
        },
      ]}
    />
  );
};

export default ImageCarouselDel;
