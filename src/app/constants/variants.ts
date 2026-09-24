export type Variant = 'accent' | 'danger' | 'info' | 'neutral' | 'warning' | 'ghost' | 'ghostDanger';

export const variantBorderClasses: Record<Variant, string> = {
    accent: 'border-accent',
    danger: 'border-danger',
    info: 'border-info',
    neutral: 'border-divider',
    warning: 'border-warning',
    ghost: 'border-transparent',
    ghostDanger: 'border-transparent',
};

export const variantButtonClasses: Record<Variant, string> = {
    accent: 'text-accent border-accent hover:bg-accent/12 active:bg-accent/22',
    danger: 'text-danger border-danger hover:bg-danger/12 active:bg-danger/22',
    info: 'text-info border-info hover:bg-info/12 active:bg-info/22',
    neutral: 'text-text border-divider hover:bg-text/7 active:bg-text/14',
    warning: 'text-warning border-warning hover:bg-warning/12 active:bg-warning/22',
    ghost: 'text-text/70 border-transparent hover:bg-text/7 hover:text-text active:bg-text/14',
    ghostDanger: 'text-text/50 border-transparent hover:text-danger hover:bg-danger/8 active:bg-danger/14',
};

export const variantTagClasses: Record<Variant, string> = {
    accent: 'bg-accent/20 text-accent',
    danger: 'bg-danger/20 text-danger',
    info: 'bg-info/20 text-info',
    neutral: 'bg-text/10 text-text/85',
    warning: 'bg-warning/20 text-warning',
    ghost: 'bg-text/7 text-text/70',
    ghostDanger: 'bg-danger/8 text-text/50',
};
