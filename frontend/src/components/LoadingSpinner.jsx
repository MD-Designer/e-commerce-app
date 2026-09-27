const LoadingSpinner = ({ fullScreen = false }) => {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm"
          : "flex items-center justify-center"
      }
    >
      <div className="relative w-14 h-14">
        {/* Background ring */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-700" />

        {/* Animated colorful ring */}
        <div
          className="
            absolute inset-0 rounded-full border-2 border-transparent
            border-t-emerald-400
            border-r-cyan-400
            border-b-purple-500
            border-l-pink-500
            animate-spin
          "
        />

        {/* Center */}
        <div className="absolute inset-3 rounded-full bg-gray-900 flex items-center justify-center">
          <div
            className="
              w-2 h-2 rounded-full
              bg-emerald-400
              animate-pulse
              shadow-lg shadow-emerald-400/50
            "
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;