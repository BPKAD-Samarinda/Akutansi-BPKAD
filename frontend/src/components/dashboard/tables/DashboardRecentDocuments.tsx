type RecentItem = {
  id: number | string;
  nama: string;
  kategori: string;
  tanggal: string;
  status: "Terverifikasi" | "Menunggu";
};

type DashboardRecentDocumentsProps = {
  documents: RecentItem[];
};

export default function DashboardRecentDocuments({
  documents,
}: DashboardRecentDocumentsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">5 Dokumen Terakhir</h3>
        <button className="text-sm font-semibold text-orange-500 hover:text-orange-600">
          Lihat Semua
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">NAMA DOKUMEN</th>
              <th className="text-left px-4 py-3">KATEGORI</th>
              <th className="text-left px-4 py-3">TANGGAL UNGGAH</th>
              <th className="text-left px-4 py-3">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-800">{doc.nama}</td>
                <td className="px-4 py-3 text-gray-600">{doc.kategori}</td>
                <td className="px-4 py-3 text-gray-600">{doc.tanggal}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doc.status === "Terverifikasi"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
