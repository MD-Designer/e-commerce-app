import { motion } from "framer-motion";

export function PageBackground() {
  const beams = [
    { position: "left-[30%]", rotate: -18 },
    { position: "left-[40%]", rotate: 12 },
    { position: "left-1/2 -translate-x-1/2", rotate: 0 },
    { position: "right-[40%]", rotate: -12 },
    { position: "right-[30%]", rotate: 18 },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 900px 800px at 50% 38%, #1a3628 0%, #0d1f16 38%, #1b1f1e 72%, #15181a 100%)",
        }}
      />

      {/* ================= LIGHT BEAMS ================= */}

      {beams.map((beam, index) => (
        <motion.div
          key={index}
          className={`absolute ${beam.position} top-[-80px] h-[950px] w-[160px]`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(220,245,230,0.22), rgba(125,199,158,0.10), transparent 80%)",
            clipPath: "polygon(43% 0%, 57% 0%, 100% 100%, 0% 100%)",
            filter: "blur(25px)",
            mixBlendMode: "screen",
            transformOrigin: "top center",
          }}
          initial={{
            rotate: beam.rotate,
          }}
          animate={{
            rotate: [beam.rotate - 3, beam.rotate + 3, beam.rotate - 3],
          }}
          transition={{
            duration: 7 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Soft top glow */}
      <motion.div
        className="absolute left-1/2 top-[-180px] h-[800px] w-[650px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(150,220,175,0.13), transparent 68%)",
          filter: "blur(70px)",
          mixBlendMode: "screen",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom Fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background:
            "linear-gradient(to top, rgba(10,14,14,0.7), transparent)",
        }}
      />

    </div>
  );
}