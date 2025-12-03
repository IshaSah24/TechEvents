import React from "react";
import { motion } from "framer-motion";
import {Feature} from  '../constants/features'

interface FeatureCardProps {
    feature: Feature;
}

export default function FeatureCard({ feature}: FeatureCardProps) {
    const  Icon  =  feature.icon;
    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 +  0.08 }}
          className="group rounded-2xl border-[1.8px] border-slate-800 p-6 shadow-md transition-all hover:border-sky-100/30 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
        >
          <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-sky-50 p-3 transition-colors group-hover:bg-sky-100">
            <Icon className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-300">{feature.title}</h3>
          <p className="text-slate-500">{feature.description}</p>
        </motion.div>
      );
};

