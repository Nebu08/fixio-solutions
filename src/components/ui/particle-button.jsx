"use client"

import * as React from "react"
import { useState, useRef } from "react";
import { Button } from "./button-shadcn";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Slot } from "@radix-ui/react-slot";

function SuccessParticles({
    buttonRef,
}) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (
        <AnimatePresence>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed w-2 h-2 bg-black dark:bg-white rounded-full pointer-events-none z-[100]"
                    style={{ left: centerX, top: centerY }}
                    initial={{
                        scale: 0,
                        x: 0,
                        y: 0,
                    }}
                    animate={{
                        scale: [0, 1, 0],
                        x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
                        y: [0, -Math.random() * 50 - 20],
                    }}
                    transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        ease: "easeOut",
                    }}
                />
            ))}
        </AnimatePresence>
    );
}

const ParticleButton = React.forwardRef(({
    children,
    onClick,
    onSuccess,
    successDuration = 1000,
    className,
    asChild = false,
    ...props
}, ref) => {
    const [showParticles, setShowParticles] = useState(false);
    const internalRef = useRef(null);
    const buttonRef = ref || internalRef;

    const handleClick = async (e) => {
        setShowParticles(true);

        if (onClick) {
            onClick(e);
        }

        setTimeout(() => {
            setShowParticles(false);
            if (onSuccess) onSuccess();
        }, successDuration);
    };

    const Comp = asChild ? Slot : "button";

    return (
        <>
            {showParticles && <SuccessParticles buttonRef={buttonRef} />}
            <Comp
                ref={buttonRef}
                onClick={handleClick}
                className={cn(
                    "relative",
                    showParticles && "scale-95",
                    "transition-transform duration-100",
                    className
                )}
                {...props}
            >
                {children}
            </Comp>
        </>
    );
});
ParticleButton.displayName = "ParticleButton";

export { ParticleButton }
