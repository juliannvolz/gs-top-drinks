/* ================================================================== */
/*  GS TOP DRINKS — GSAP Hooks & Utilities                              */
/*  Wrapper para GSAP com cleanup automático e reduced-motion          */
/* ================================================================== */

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

/**
 * Safe selector that returns empty array if not found
 */
function safeSelect(ctx: gsap.Context, selector: string): Element[] {
  if (!ctx.selector) return [];
  const selectorFn = ctx.selector(selector);
  if (!selectorFn) return [];
  try {
    return selectorFn() ?? [];
  } catch {
    return [];
  }
}

/**
 * Hook principal para animações GSAP com cleanup automático
 * Usa gsap.context() para escopo e limpeza no unmount
 */
export function useGSAP(callback: (ctx: gsap.Context) => void, deps: React.DependencyList = []) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctxRef.current = gsap.context(() => {
      if (ctxRef.current) {
        callback(ctxRef.current);
      }
    });

    return () => {
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, deps);

  return ctxRef;
}

/**
 * Hook para animações de entrada (reveal) com stagger
 */
export function useReveal(
  selector: string,
  options: {
    y?: number;
    opacity?: number;
    duration?: number;
    stagger?: number;
    delay?: number;
    ease?: string;
  } = {}
) {
  const { y = 30, opacity = 0, duration = 0.8, stagger = 0.1, delay = 0, ease = "power3.out" } = options;

  return useGSAP((ctx) => {
    const elements = safeSelect(ctx, selector);
    if (elements.length) {
      gsap.fromTo(
        elements,
        { y, opacity },
        {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          delay,
          ease,
          scrollTrigger: {
            trigger: elements[0],
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, [selector, y, opacity, duration, stagger, delay, ease]);
}

/**
 * Hook para animação de contador numérico (money counter)
 */
export function useMoneyCounter(
  elementRef: React.RefObject<HTMLElement>,
  value: number,
  options: { duration?: number; ease?: string; formatter?: (v: number) => string } = {}
) {
  const { duration = 0.7, ease = "power3.out", formatter = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) } = options;
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (!elementRef.current) return;
    if (prevValueRef.current === value) return;

    const obj = { val: prevValueRef.current };
    gsap.to(obj, {
      val: value,
      duration,
      ease,
      onUpdate: () => {
        if (elementRef.current) {
          elementRef.current.textContent = formatter(obj.val);
        }
      },
      onComplete: () => {
        prevValueRef.current = value;
      },
    });
  }, [value, duration, ease, formatter, elementRef]);
}

/**
 * Hook para animação de líquido na taça (HurricaneGlass progress)
 */
export function useLiquidAnimation(
  level: number,
  options: { duration?: number; ease?: string; onComplete?: () => void } = {}
) {
  const { onComplete } = options;
  const levelRef = useRef(level);

  useEffect(() => {
    if (levelRef.current === level) return;
    levelRef.current = level;
    if (onComplete) onComplete();
  }, [level, onComplete]);
}

/**
 * Hook para Flip animations (transições suaves de layout)
 */
export function useFlip() {
  const getState = useCallback((targets: string | Element | Element[]) => Flip.getState(targets), []);
  const animateFlip = useCallback(
    (fromState: any, options: any = {}) =>
      Flip.from(fromState, { duration: 0.5, ease: "power2.inOut", ...options }),
    []
  );
  return { getState, animateFlip };
}

/**
 * Hook para ScrollTrigger pin/parallax
 */
export function useScrollPin(
  trigger: string | Element,
  options: {
    pin?: boolean;
    pinSpacing?: boolean;
    scrub?: number | boolean;
    start?: string;
    end?: string;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
  } = {}
) {
  const { pin = false, pinSpacing = true, scrub = false, start = "top top", end = "bottom bottom", onEnter, onLeave, onEnterBack, onLeaveBack } = options;

  useGSAP((ctx) => {
    const elements = safeSelect(ctx, typeof trigger === "string" ? trigger : "");
    elements.forEach((el: Element) => {
      ScrollTrigger.create({
        trigger: el,
        pin,
        pinSpacing,
        scrub,
        start,
        end,
        onEnter: () => onEnter?.(),
        onLeave: () => onLeave?.(),
        onEnterBack: () => onEnterBack?.(),
        onLeaveBack: () => onLeaveBack?.(),
      });
    });
  }, [trigger, pin, pinSpacing, scrub, start, end, onEnter, onLeave, onEnterBack, onLeaveBack]);
}

/**
 * Hook para prefers-reduced-motion
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return reduced;
}

/**
 * Configuração global GSAP para reduced-motion
 */
export function setupGSAPReducedMotion(reduced: boolean) {
  if (reduced) {
    gsap.globalTimeline.timeScale(0);
    ScrollTrigger.getAll().forEach((st) => st.disable());
  } else {
    gsap.globalTimeline.timeScale(1);
    ScrollTrigger.getAll().forEach((st) => st.enable());
  }
}