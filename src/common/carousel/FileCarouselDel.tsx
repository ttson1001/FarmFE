import React from "react";
import { downloadFile } from "../../api/file";
import doc from "../../assets/doc.png";
import docx from "../../assets/docx.png";
import pdf from "../../assets/pdf.png";
import txt from "../../assets/txt.png";
import xls from "../../assets/xls.png";
import xlsx from "../../assets/xlsx.png";
import { Carousel } from "primereact/carousel";

interface FileCarouselProps {
  files: { id: number; filePath: string }[]; // Danh sách file
  onRemoveFile: (id: number) => void; // Hàm xử lý xóa file
}

const fileIcons: Record<string, string> = {
  doc,
  docx,
  pdf,
  txt,
  xls,
  xlsx,
};

const FileCarouselDel: React.FC<FileCarouselProps> = ({
  files,
  onRemoveFile,
}) => {
  const getFileIcon = (filePath: string) => {
    const extension = filePath.split(".").pop()?.toLowerCase(); // Lấy phần mở rộng file
    return (extension && fileIcons[extension]) || ""; // Trả về icon tương ứng hoặc icon mặc định
  };

  const itemTemplate = (file: { id: number; filePath: string }) => {
    return (
      <div className="flex flex-col items-center relative w-full">
        {/* Nút X để xóa file */}
        <button
          onClick={() => onRemoveFile(file.id)} // Gọi hàm xóa file
          className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full z-10"
        >
          X
        </button>
        {/* Icon file */}
        <div
          className="cursor-pointer flex justify-center"
          onClick={() => downloadFile(file.filePath)} // Tải xuống file
        >
          <img
            className="w-16 h-16"
            src={getFileIcon(file.filePath)}
            alt="File Icon"
          />
        </div>
        {/* Tên file */}
        <p className="mt-2 text-xs text-center truncate w-full">
          {file.filePath.split("/").pop()}
        </p>
      </div>
    );
  };

  return (
    <Carousel
      value={files}
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

export default FileCarouselDel;
