import { Carousel } from "primereact/carousel";
import { downloadFile } from "../../api/file";

interface FileCarouselProps {
  files: any[];
}

const FileCarousel: React.FC<FileCarouselProps> = ({ files }) => {
  const itemTemplate = (item: any) => {
    return (
      <div className="flex justify-center cursor-pointer">
        <div>
          <div className="flex justify-center">
            <img
              className="w-20 h-20"
              onClick={() => downloadFile(item.filePath)}
              src={`/src/assets/${item.filePath
                .split("\\")
                .pop()
                .split(".")
                .pop()}.png`}
              alt=""
            />
          </div>

          <p className="mt-2">{item.filePath.split("\\").pop()}</p>
        </div>
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
