import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SystemPage = () => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex items-center justify-center p-10"
    >
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h2 className="font-display text-xl font-semibold mb-2">Área do Micro-Frontend</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Este é o espaço onde o micro-frontend será carregado via iframe ou module federation.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
          {location.pathname}
        </p>
      </div>
    </motion.div>
  );
};

export default SystemPage;
