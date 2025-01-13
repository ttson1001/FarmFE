import { Carousel } from "primereact/carousel";
import { downloadFile } from "../../api/file";
import doc from "../../assets/doc.png";
import docx from "../../assets/docx.png";
import pdf from "../../assets/pdf.png";
import txt from "../../assets/txt.png";
import xls from "../../assets/xls.png";
import xlsx from "../../assets/xlsx.png";

interface FileCarouselProps {
  files: any[];
}

const fileIcons: Record<string, string> = {
  doc,
  docx,
  pdf,
  txt,
  xls,
  xlsx,
};

const FileCarousel: React.FC<FileCarouselProps> = ({ files }) => {
  const itemTemplate = (item: any) => {
    return (
      <div className="flex justify-center cursor-pointer">
        <div>
          <div className="flex justify-center">
            <img
              className="w-20 h-20"
              onClick={() => downloadFile(item.filePath)}
              src={getFileIcon(item.filePath)}
              alt=""
            />
          </div>

          <p className="mt-2">{item.filePath.split("/").pop()}</p>
        </div>
      </div>
    );
  };

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split(".").pop()?.toLowerCase(); // Lấy phần mở rộng và chuyển về chữ thường
    return (extension && fileIcons[extension]) || "../../assets/default.png"; // Trả về ảnh tương ứng hoặc ảnh mặc định
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
