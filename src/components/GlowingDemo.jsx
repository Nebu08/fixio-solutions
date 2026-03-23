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

      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2 p-0">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<ShieldCheck className="h-4 w-4 text-[var(--color-primary)]" />}
          title="Garantía de Calidad"
          description="Todos nuestros equipos pasan por un riguroso proceso de calidad antes de llegar a tus manos."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<Zap className="h-4 w-4 text-[var(--color-accent)]" />}
          title="Uso Práctico y Sencillo"
          description="Implementación instantánea. Diseños orientados a facilitar tus tareas diarias sin complicaciones."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Truck className="h-4 w-4 text-[var(--color-primary)]" />}
          title="Envíos a todo el País"
          description="Llevamos la última tecnología hasta la puerta de tu hogar en toda Colombia y con envío ágil en Bogotá."
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Users className="h-4 w-4 text-[#C8E4F9]" />}
          title="Soporte Humano"
          description="Personas reales listas para ayudarte. Detrás de cada pedido hay un equipo cuidando tu experiencia."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Box className="h-4 w-4 text-[var(--color-text-secondary)]" />}
          title="Catálogo Variado"
          description="Desde audio inteligente hasta cámaras de seguridad 4K, todo seleccionado cuidadosamente para ti."
        />
      </ul>
    </section>
  );
}

const GridItem = ({ area, icon, title, description }) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm md:p-6" style={{ backgroundColor: 'var(--color-surface-1)' }}>
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2" style={{ backgroundColor: 'var(--color-bg)' }}>
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground" style={{ color: 'var(--color-text-primary)' }}>
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground" style={{ color: 'var(--color-text-secondary)' }}>
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
