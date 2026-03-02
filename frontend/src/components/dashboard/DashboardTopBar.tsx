type DashboardTopBarProps = {
  onAddDocument: () => void;
};

export default function DashboardTopBar({ onAddDocument }: DashboardTopBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistik Dokumen</h2>
        <p className="text-sm text-gray-500">Ringkasan data berkas masuk ke sistem</p>
      </div>
      <button
        onClick={onAddDocument}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
      >
        + Tambah Dokumen
      </button>
    </div>
  );
}
