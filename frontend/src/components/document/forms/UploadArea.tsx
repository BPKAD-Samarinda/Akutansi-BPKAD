import UploadIcon from "../../../assets/icons/upload.svg";
import AppTooltip from "../../ui/app-tooltip";

export default function UploadArea() {
  return (
    <div className="bg-white rounded-2xl shadow p-10 grid grid-cols-2 gap-10">
      <div>
        <label className="block mb-2">Nama Dokumen</label>
        <AppTooltip content="Nama Dokumen">
          <input
            title=""
            aria-label="Nama Dokumen"
            className="w-full border rounded-xl px-4 py-3 mb-6"
          />
        </AppTooltip>

        <label className="block mb-2">Tanggal</label>
        <AppTooltip content="Tanggal">
          <input
            type="date"
            title=""
            aria-label="Tanggal"
            className="w-full border rounded-xl px-4 py-3"
          />
        </AppTooltip>
      </div>

      <div className="border-2 border-dashed rounded-xl flex items-center justify-center">
        <img src={UploadIcon} className="w-10 h-10" alt="Upload Icon" />
      </div>

      <div className="col-span-2 flex justify-end gap-4">
        <button className="px-6 py-3 border rounded-xl">Batalkan</button>
        <button className="px-6 py-3 bg-[#FF6A00] text-white rounded-xl">
          Simpan Dokumen
        </button>
      </div>
    </div>
  );
}
