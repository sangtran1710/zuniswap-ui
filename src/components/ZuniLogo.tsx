import { motion } from 'framer-motion';

const ZuniLogo = () => (
  <div className="flex items-center gap-1.5">
    <div className="relative w-7 h-7">
      <motion.div 
        className="absolute inset-0 bg-zuni-primary rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div 
        className="absolute inset-0 flex items-center justify-center text-white font-bold"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        Z
      </motion.div>
    </div>
    <span className="text-lg font-bold bg-gradient-to-r from-zuni-secondary to-zuni-accent bg-clip-text text-transparent tracking-wide">
      ZuniSwap
    </span>
  </div>
);

export default ZuniLogo; 