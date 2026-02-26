import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function DocumentPreview() {
  const [searchParams] = useSearchParams();
  const fileUrl = searchParams.get("file") ?? "";
  const title = searchParams.get("title") ?? "Preview Dokumen";

  useEffect(() => {
    document.title = title;
  }, [title]);

  if (!fileUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-700 font-medium">URL dokumen tidak valid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-900">
      <iframe
        title={title}
        src={fileUrl}
        className="w-full h-full border-0"
        loading="eager"
      />
    </div>
  );
}
