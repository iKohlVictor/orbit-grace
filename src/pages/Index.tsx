import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { systems, type SystemConfig } from "@/data/systems";
import { SystemCard } from "@/components/SystemCard";

interface ShellContext {
  activeSystem: SystemConfig | null;
  setActiveSystem: (sys: SystemConfig | null) => void;
}

const Index = () => {
  const navigate = useNavigate();
  const { setActiveSystem } = useOutletContext<ShellContext>();

  const handleOpenSystem = (sys: SystemConfig) => {
    setActiveSystem(sys);
    navigate(sys.groups[0]?.items[0]?.path ?? "/");
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
          Bem-vindo de volta 👋
        </h1>
        <p className="text-muted-foreground">
          Selecione um sistema para começar.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {systems.map((sys, i) => (
          <SystemCard
            key={sys.id}
            system={sys}
            index={i}
            onClick={() => handleOpenSystem(sys)}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
