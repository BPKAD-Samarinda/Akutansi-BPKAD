type HistoryStateProps = {
  loading: boolean;
  error: string;
  isEmpty: boolean;
};

export default function HistoryState({
  loading,
  error,
  isEmpty,
}: HistoryStateProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
        Memuat riwayat unggah...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
        Belum ada data riwayat.
      </div>
    );
  }

  return null;
}
