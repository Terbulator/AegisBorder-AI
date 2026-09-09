import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { cx } from '../lib/cn';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const EASE = [0.22, 1, 0.36, 1];

export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const STAGGER = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: EASE } },
};

export function StaggerContainer({ children, className, stagger = 0.06, delayChildren = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      exit="hidden"
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...rest }) {
  return (
    <motion.div className={className} variants={STAGGER} {...rest}>
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, y = 8, duration = 0.25 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: y * 0.5 }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function StatusTransition({ code, children }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={code}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.16, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function RiskReveal({ show, children }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AnimatedModal({ open, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Sheet({ open, children, onClose, position = 'bottom', className }) {
  const align = position === 'bottom'
    ? 'items-end'
    : position === 'right'
      ? 'justify-end'
      : 'items-center justify-center';
  const slide = position === 'bottom' ? { y: 24 } : position === 'right' ? { x: 24 } : { scale: 0.96 };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className={`fixed inset-0 z-50 flex ${align} ${className || ''}`}
          role="dialog" aria-modal="true" aria-label="Sheet"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <div className="absolute inset-0 bg-navy-950/60" aria-hidden="true" onClick={onClose} />
          <motion.div
            className={`relative z-10 ${position === 'bottom' ? 'w-full' : ''}`}
            initial={{ opacity: 0, ...slide }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AnimatedList({ children, className, stagger = 0.05 }) {
  return (
    <StaggerContainer className={className} stagger={stagger} delayChildren={0}>
      {children}
    </StaggerContainer>
  );
}

export function MotionButton({ children, className, ...rest }) {
  return (
    <motion.button
      className={className}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function ScrollReveal({ children, className, delay = 0, threshold = 0.15 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (useReducedMotion()) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className, ...rest }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.18, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function TapScale({ children, className, ...rest }) {
  return (
    <motion.div
      className={className}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.12, ease: EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StatusPulse({ color = 'emerald', className }) {
  const colorMap = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    slate: 'bg-slate-400',
  };
  const dot = colorMap[color] || colorMap.slate;
  return (
    <span className={cx('relative flex h-2.5 w-2.5', className)} aria-hidden="true">
      <span className={cx('absolute inline-flex h-full w-full animate-ping rounded-full opacity-40', dot)} />
      <span className={cx('relative inline-flex h-2.5 w-2.5 rounded-full', dot)} />
    </span>
  );
}