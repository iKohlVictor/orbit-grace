import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { type SystemConfig } from "@/data/systems";

interface SystemCardProps {
  system: SystemConfig;
  index: number;
  onClick: () => void;
}

export function SystemCard({ system, index, onClick }: SystemCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      onClick={onClick}
      className="group relative bg-card rounded-xl border p-6 text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col gap-4"
    >
      <div
        className="h-11 w-11 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `hsl(var(${system.colorVar}) / 0.12)` }}
      >
        <system.icon
          className="h-5 w-5"
          style={{ color: `hsl(var(${system.colorVar}))` }}
        />
      </div>

      <div className="flex-1">
        <h3 className="font-display font-semibold text-base mb-1">{system.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{system.description}</p>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        Acessar
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </motion.button>
  );
}
