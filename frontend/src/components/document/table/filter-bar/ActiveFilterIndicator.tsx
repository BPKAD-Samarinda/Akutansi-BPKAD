export default function ActiveFilterIndicator() {
  return (
    <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-xs lg:text-sm">
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-semibold">Filter Aktif</span>
    </div>
  );
}
