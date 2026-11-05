"use client";

import { motion } from "motion/react";

import { fadeUp, stagger } from "@/components/motion/tokens";

type Item = { label?: string | null; note?: string | null };

export function CapabilityStrip({ items }: { items: Item[] }) {
  const visible = (items ?? []).filter((item) => item?.label).slice(0, 4);
  if (visible.length === 0) return null;

  return (
    <section aria-label="Capabilities" className="border-b border-border bg-surface">
      <div className="shell py-10 lg:py-12">
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {visible.map((item, index) => (
            <motion.li
              key={`${item.label}-${index}`}
              variants={fadeUp}
              className="border-l border-border pl-5 first:border-l-0 first:pl-0 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0 lg:border-l lg:pl-6"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-full ${index % 4 === 0 ? "bg-accent" : index % 4 === 1 ? "bg-mol-purple" : index % 4 === 2 ? "bg-mol-orange" : "bg-mol-yellow"}`}
                />
                <p className="font-display text-base font-semibold">{item.label}</p>
              </div>
              {item.note ? <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p> : null}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
