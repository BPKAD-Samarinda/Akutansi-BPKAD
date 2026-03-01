import buildingImage from "../../assets/images/logo-bpkad.png";
import "./AuthHero.css";

export default function AuthHero() {
  return (
    <div className="hidden lg:block lg:w-1/2 relative min-h-screen overflow-hidden order-2 bg-[#F6F6F6]">
      {/* area gambar di sisi kanan */}
      <div className="absolute inset-y-0 right-0 w-[84%] overflow-hidden">
        <img
          src={buildingImage}
          alt="Gedung BPKAD"
          className="absolute inset-0 w-full h-full object-cover object-[78%_85%] animate-zoomIn"
        />

        {/* overlay oranye hanya di area gambar */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FF5700]/60 via-[#FF5700]/10 to-transparent" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] border-[3px] border-white/20 rotate-45 rounded-[60px] auth-hero-ring-primary" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border-[2px] border-white/10 rotate-45 rounded-[50px] auth-hero-ring-secondary" />
        </div>

        {/* card teks: tetap di dalam gambar */}
        <div className="absolute bottom-12 left-6 right-6 animate-slideInRight animate-delay-500">
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-8 text-white shadow-2xl border border-white/10">
            <div className="flex items-center text-xs font-bold mb-4 tracking-widest">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                LAYANAN ARSIP AKUNTANSI DIGITAL
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-4">
              Sistem Arsip
              <br />
              Dokumen Keuangan
            </h1>

            <p className="text-base text-gray-200 leading-relaxed">
              Penyimpanan dan akses dokumen PDF untuk staf akuntansi secara
              terpusat, cepat, dan aman.
            </p>

            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
