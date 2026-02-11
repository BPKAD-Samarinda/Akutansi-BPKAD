import buildingImage from "../../assets/images/logo-bpkad.png";

export default function AuthHero() {
    return (
        <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
            <div
                className="absolute inset-0 bg-no-repeat animate-zoomIn"
                style={{
                    backgroundImage: `url(${buildingImage})`,
                    backgroundSize: "100% auto",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "100% 90%",
                }}
            />

            {/* Gradient Overlay with Animation */}
            <div
                className="
    absolute inset-0
    bg-gradient-to-t
    from-[#FF5700]/60
    via-[#FF5700]/10
    to-transparent
  "
            />
            {/* Animated Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] border-[3px] border-white/20 rotate-45 rounded-[60px] animate-spin" style={{ animationDuration: '30s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] lg:w-[550px] lg:h-[550px] border-[2px] border-white/10 rotate-45 rounded-[50px] animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            </div>

            {/* Info Card */}
            <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-4 right-4 sm:left-8 sm:right-8 lg:left-16 lg:right-16 max-w-xl mx-auto lg:mx-0 animate-slideInRight animate-delay-500">
                <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] group">
                    {/* Badge */}
                    <div className="flex items-center text-xs font-bold mb-4 tracking-widest">
                        <span className="relative flex h-3 w-3 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            LAYANAN AKUNTANSI DIGITAL
                        </span>
                    </div>

                    {/* Title with Gradient */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:scale-[1.02] transition-transform duration-500">
                        <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                            Manajemen Dokumen Keuangan
                            <br />
                            yang Efisien dan
                            <br />
                            Terintegrasi
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                        Sistem terintegrasi untuk pengelolaan data akuntansi yang aman dan
                        transparan di seluruh unit kerja.
                    </p>

                    {/* Decorative Line */}
                    <div className="mt-6 h-1 w-24 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent rounded-full group-hover:w-32 transition-all duration-500"></div>
                </div>
            </div>

            {/* Floating Particles Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
