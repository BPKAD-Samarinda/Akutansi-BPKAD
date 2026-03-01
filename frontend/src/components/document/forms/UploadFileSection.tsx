import { RefObject } from "react";
import uploadIcon from "../../../assets/icons/upload.svg";
import { formatFileSize } from "../../../utils/fileUtils";
import "./UploadFileSection.css";

type UploadFileSectionProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  isDragging: boolean;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClickUploadArea: () => void;
  onRemoveFile: () => void;
};

export default function UploadFileSection({
  fileInputRef,
  selectedFile,
  isDragging,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickUploadArea,
  onRemoveFile,
}: UploadFileSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce animate-delay-400">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Berkas</h2>
      </div>

      <div
        onClick={onClickUploadArea}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          border-3 border-dashed rounded-2xl 
          min-h-[280px] lg:min-h-[320px]
          flex flex-col items-center justify-center
          cursor-pointer transition-all duration-500
          relative overflow-hidden
          ${
            isDragging
              ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 scale-105"
              : "border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-gradient-to-br hover:from-orange-50 hover:to-transparent"
          }
          ${selectedFile ? "border-green-400 bg-gradient-to-br from-green-50 to-transparent" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileInputChange}
          className="hidden"
          accept=".pdf,.docx,.xlsx,.pptx"
          title="File Input"
        />

        {selectedFile ? (
          <div className="text-center p-8 animate-scaleIn">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30 animate-bounce">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-600 mb-5">
              {formatFileSize(selectedFile.size)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
              }}
              className="text-sm text-red-600 hover:text-red-700 font-semibold underline transition-colors"
            >
              Hapus File
            </button>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
              <img
                src={uploadIcon}
                className="w-10 h-10 brightness-0 invert"
                alt="Upload"
              />
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">
              Klik untuk mengunggah
            </p>
            <p className="text-sm text-gray-600">PDF (Maks. 10MB)</p>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600 rounded-full filter blur-3xl animate-pulse upload-file-glow-delay"></div>
        </div>
      </div>
    </div>
  );
}
