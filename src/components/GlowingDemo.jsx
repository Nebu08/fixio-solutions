"use client";

import { ShieldCheck, Truck, Zap, Box, Users } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingDemo() {
  return (
    <section className="container" style={{ marginTop: '5rem', marginBottom: '3rem' }}>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)'}}>
          ¿Por qué elegir <span style={{ color: 'var(--color-primary)' }}>Fixio Solutions</span>?
        </h2>
        <p className="max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
          Democratizamos el acceso a un hogar inteligente con tecnología de vanguardia que es fácil de usar, garantizada y con respaldo local.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row w-full gap-6 p-0 mt-8 list-none">
        <GridItem
          icon={<ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />}
          title="🛡️ Garantía de Calidad"
          description="Todos nuestros equipos pasan por un riguroso proceso de calidad antes de llegar a tus manos."
        />
        <GridItem
          icon={<Zap className="h-6 w-6 text-[var(--color-accent)]" />}
          title="⚡ Uso Práctico"
          description="Implementación instantánea. Diseños orientados a facilitar tus tareas diarias sin complicaciones."
        />
        <GridItem
          icon={<Truck className="h-6 w-6 text-[var(--color-primary)]" />}
          title="🚚 Envíos a todo el País"
          description="Llevamos la última tecnología hasta la puerta de tu hogar en Colombia y exprés en Bogotá."
        />
        <GridItem
          icon={<Users className="h-6 w-6 text-[#C8E4F9]" />}
          title="👥 Soporte Humano Local"
          description="Personas reales listas para ayudarte. Detrás de cada pedido hay un equipo cuidando tu experiencia."
        />
      </div>
    </section>
  );
}

const GridItem = ({ icon, title, description }) => {
  return (
    <div className="flex-1 w-full min-w-0">
      <div className="relative w-full h-full rounded-2xl border-[1px] border-border/50 hover:border-[var(--color-primary)] transition-colors p-1.5 bg-[var(--color-surface-2)]">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex flex-col items-center text-center justify-start gap-4 overflow-hidden rounded-[14px] bg-[var(--color-surface-1)] p-6 shadow-sm h-full w-full z-10">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[var(--color-bg)] border border-[var(--color-border)] shadow-sm">
            {icon}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold font-sans text-[var(--color-text-primary)]">
              {title}
            </h3>
            <p className="font-sans text-[0.95rem] leading-relaxed text-[var(--color-text-secondary)]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
