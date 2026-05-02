// Design System Theme Configuration
export const theme = {
    colors: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6', // Main brand blue
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7', // Main brand purple
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
        },
        accent: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981', // Success green
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
        },
        neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
        },
        dark: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
            950: '#020617',
        }
    },

    gradients: {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600',
        primaryHover: 'bg-gradient-to-r from-blue-700 to-purple-700',
        secondary: 'bg-gradient-to-r from-purple-600 to-pink-600',
        secondaryHover: 'bg-gradient-to-r from-purple-700 to-pink-700',
        success: 'bg-gradient-to-r from-green-600 to-emerald-600',
        successHover: 'bg-gradient-to-r from-green-700 to-emerald-700',
        danger: 'bg-gradient-to-r from-red-600 to-pink-600',
        dangerHover: 'bg-gradient-to-r from-red-700 to-pink-700',
        dark: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
        darkCard: 'bg-gradient-to-br from-slate-800/50 to-slate-900/50',
    },

    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        glow: '0 0 20px rgb(59 130 246 / 0.5)',
        glowPurple: '0 0 20px rgb(168 85 247 / 0.5)',
    },

    typography: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Poppins', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
            xs: ['0.75rem', { lineHeight: '1rem' }],
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            base: ['1rem', { lineHeight: '1.5rem' }],
            lg: ['1.125rem', { lineHeight: '1.75rem' }],
            xl: ['1.25rem', { lineHeight: '1.75rem' }],
            '2xl': ['1.5rem', { lineHeight: '2rem' }],
            '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
            '5xl': ['3rem', { lineHeight: '1' }],
            '6xl': ['3.75rem', { lineHeight: '1' }],
        }
    },

    spacing: {
        xs: '0.5rem',   // 8px
        sm: '0.75rem',  // 12px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
        '2xl': '3rem',  // 48px
        '3xl': '4rem',  // 64px
        '4xl': '6rem',  // 96px
    },

    borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
    },

    animation: {
        // Custom animations for the app
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        spin: 'spin 1s linear infinite',
    }
};

// Utility functions for consistent styling
export const getGradientClass = (variant = 'primary', hover = false) => {
    const key = hover ? `${variant}Hover` : variant;
    return theme.gradients[key] || theme.gradients.primary;
};

export const getShadowClass = (size = 'DEFAULT') => {
    return `shadow-${size}`;
};

export const getColorClass = (color = 'primary', shade = 500) => {
    return `${color}-${shade}`;
};

// Component variants
export const buttonVariants = {
    primary: `${theme.gradients.primary} hover:${theme.gradients.primaryHover} text-white shadow-lg hover:shadow-xl`,
    secondary: `${theme.gradients.secondary} hover:${theme.gradients.secondaryHover} text-white shadow-lg hover:shadow-xl`,
    success: `${theme.gradients.success} hover:${theme.gradients.successHover} text-white shadow-lg hover:shadow-xl`,
    danger: `${theme.gradients.danger} hover:${theme.gradients.dangerHover} text-white shadow-lg hover:shadow-xl`,
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
};

export const cardVariants = {
    default: 'bg-white border border-slate-200 shadow-md hover:shadow-lg',
    dark: 'bg-slate-800/50 border border-white/10 backdrop-blur-sm',
    gradient: 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 backdrop-blur-sm',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
};