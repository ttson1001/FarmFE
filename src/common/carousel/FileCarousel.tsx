import { Carousel } from "primereact/carousel";

interface FileCarouselProps {
  files: any[];
}

const FileCarousel: React.FC<FileCarouselProps> = ({ files }) => {
  const itemTemplate = (item: any) => {
    return (
      <div className="flex justify-center">
        <a
          href={item.filePath}
          download // Thêm thuộc tính download để tải tệp về
          className="border p-4 rounded text-center"
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <rect width="50" height="50" fill="#f0f0f0" stroke="#ccc" />
            <text x="25" y="30" textAnchor="middle" fill="#000">
              File
            </text>
          </svg>
          <p className="mt-2">Tải xuống</p>
        </a>
      </div>
    );
  };

  return (
    <Carousel
      value={files}
      itemTemplate={itemTemplate}
      numVisible={1}
      numScroll={1}
    />
  );
};

export default FileCarousel;
