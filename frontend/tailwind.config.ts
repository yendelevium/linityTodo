import type { Config } from 'tailwindcss'
import { PluginAPI } from 'tailwindcss/types/config'

const config: Config = {
    content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        screens: {
            desktop: '1680px',
            laptop: '1280px',
            vertical: '1024px',
            tablet: '768px',
            phablet: '560px',
            mobile: '330px',
        },
        fontSize: {},
        fontWeight: {
            normal: '400',
            'semi-bold': '550',
            bold: '700',
        },
        fontFamily: {
            title: ['Cairo', 'sans-serif'],
            body: ['Cairo', 'sans-serif'],
            math: ['Cairo', 'sans-serif'],
            button: ['Cairo', 'sans-serif'],
        },

        borderRadius: {
            none: '0px',
            sm: '4px',
            md: '8px',
            lg: '16px',
            xl: '24px',
            full: '9999px',
        },
        boxShadow: {
            none: '0 0 #0000',
            100: '0px 2px 4px -2px rgba(40, 51, 58, 0.12), 0px 4px 4px -2px rgba(40, 51, 58, 0.08)',
            200: '0px 4px 6px -4px rgba(40, 51, 58, 0.12), 0px 8px 8px -4px rgba(40, 51, 58, 0.08)',
            300: '0px 6px 8px -6px rgba(40, 51, 58, 0.12), 0px 8px 16px -6px rgba(40, 51, 58, 0.08)',
            400: '0px 6px 12px -6px rgba(40, 51, 58, 0.12), 0px 8px 24px -4px rgba(40, 51, 58, 0.08)',
            500: '0px 6px 14px -6px rgba(40, 51, 58, 0.12), 0px 10px 32px -4px rgba(40, 51, 58, 0.10)',
            600: '0px 8px 18px -6px rgba(40, 51, 58, 0.12), 0px 12px 42px -4px rgba(40, 51, 58, 0.12)',
            700: '0px 8px 22px -6px rgba(40, 51, 58, 0.12), 0px 14px 64px -4px rgba(40, 51, 58, 0.12)',
            800: '0px 8px 28px -6px rgba(40, 51, 58, 0.12), 0px 18px 88px -4px rgba(40, 51, 58, 0.14)',
            'light-100':
                '0px 2px 4px -2px rgba(228, 241, 253, 0.12), 0px 4px 4px -2px rgba(228, 241, 253, 0.08)',
            'light-200':
                '0px 4px 6px -4px rgba(228, 241, 253, 0.12), 0px 8px 8px -4px rgba(228, 241, 253, 0.08)',
            'light-300':
                '0px 6px 8px -6px rgba(228, 241, 253, 0.12), 0px 8px 16px -6px rgba(228, 241, 253, 0.08)',
            'light-400':
                '0px 6px 12px -6px rgba(228, 241, 253, 0.12), 0px 8px 24px -4px rgba(228, 241, 253, 0.08)',
            'light-500':
                '0px 6px 14px -6px rgba(228, 241, 253, 0.12), 0px 10px 32px -4px rgba(228, 241, 253, 0.10)',
            'light-600':
                '0px 8px 18px -6px rgba(228, 241, 253, 0.12), 0px 12px 42px -4px rgba(228, 241, 253, 0.12)',
            'light-700':
                '0px 8px 22px -6px rgba(228, 241, 253, 0.12), 0px 14px 64px -4px rgba(228, 241, 253, 0.12)',
            'light-800':
                '0px 8px 28px -6px rgba(228, 241, 253, 0.12), 0px 18px 88px -4px rgba(228, 241, 253, 0.14)',
        },
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: '#000000',
            white: '#FFFFFF',
            primary: {
                50: '#F1F8FE',
                100: '#E4F1FD', //cloud
                200: '#C9D9E2',
                300: '#ADC1C7', //storm
                400: '#778F9B', //slate
                500: '#5B737F',
                600: '#496571',
                700: '#40555E', //outer Space
                800: '#3A4950',
                900: '#343F45',
                950: '#28333A', //gunmetal
            },
            accent: {
                DEFAULT: '#DDDE59',
                primary: '#DDDE59',
                'primary-hover': '#E9EC9C',
            },
            success: '#008A00',
            warning: '#EE8A00',
            error: '#EE0000',
            //to be replaced (depreceated)
            gunmetal: {
                DEFAULT: '#28333A',
                950: '#28333A',
                900: '#343F45',
                800: '#3A4950',
                700: '#3A4950',
            },
            slate: '#778F9B',
            storm: '#ADC1C7',
            cloud: '#e4f1fd',
            lime: '#DDDE59',
        },
        extend: {
            backgroundImage: {
                'gradient-radial':
                    'radial-gradient(38.04% 75.07% at 48.61% 57.34%, #ADC1C7 0%, #E4F1FD 100%)',
                'gradient-gunmetal-white': 'linear-gradient(to right, #28333A 25%, #ffffff 25%)',
                'gradient-cloud':
                    'radial-gradient(rgba(241, 248, 254, 0.4), rgba(201, 217, 226, 0.4)),' +
                    'linear-gradient(' +
                    '    -45deg,' +
                    '    rgba(201, 217, 226, 0.4) 0%,' +
                    '    rgba(228, 241, 253, 0) 30%,' +
                    '    rgba(241, 248, 254, 0.4) 65%,' +
                    '    rgba(228, 241, 253, 0) 100%)',
                'radial-cloud-overlay':
                    'radial-gradient(circle, rgba(40,51,58,0) 0%, rgba(228,241,253,0) 50%, rgba(228,241,253,1) 100%)',
                'loading-gradient': 'linear-gradient(45deg, #28333A 35%, #DDDE59 50%,#28333A 65%)',
            },
            keyframes: {
                loadingAnimation: {
                    '0%': { backgroundPosition: '100% 0%' },
                    '100%': { backgroundPosition: '0% 0' },
                },
                'rotate-y': {
                    '0%': {
                        transform: 'rotateY(360deg)',
                    },
                    '100%': {
                        transform: 'rotateY(0)',
                    },
                },
                bounce: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                    },
                    '50%': {
                        transform: 'translateY(25%)',
                    },
                },
                wiggle: {
                    '0%, 100%': {
                        transform: 'rotate(-3deg)',
                    },
                    '50%': {
                        transform: 'rotate(3deg)',
                    },
                },
                heartbeat: {
                    '0%': {
                        transform: 'scale(1)',
                    },
                    '10%': {
                        transform: 'scale(1.3)',
                    },
                    '20%': {
                        transform: 'scale(1)',
                    },
                    '30%': {
                        transform: 'scale(1.3)',
                    },
                    '40%': {
                        transform: 'scale(1)',
                    },
                    '100%': {
                        transform: 'scale(1)',
                    },
                },
            },
            animation: {
                'rotate-y':
                    'rotate-y var(--tw-animate-duration, 1s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, 1) var(--tw-animate-fill, both)',
                bounce: 'bounce var(--tw-animate-duration, 1s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite) var(--tw-animate-fill, none)',
                wiggle: 'wiggle var(--tw-animate-duration, 1s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, 1) var(--tw-animate-fill, both)',
                heartbeat:
                    'heartbeat var(--tw-animate-duration, 1.5s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite) var(--tw-animate-fill, both)',
                'loading-bg':
                    'loadingAnimation  var(--tw-animate-duration, 5s) var(--tw-animate-easing, ease) var(--tw-animate-delay, 0s) var(--tw-animate-iteration, infinite)',
            },
            spacing: {
                '3xs': '2px',
                xxs: '4px',
                xs: '8px',
                sm: '12px',
                md: '16px',
                ld: '24px',
                xl: '40px',
                xxl: '64px',
                '3xl': '96px',
                0: '0px',
                0.25: '2px',
                0.5: '4px',
                0.75: '6px',
                1: '8px',
                1.5: '12px',
                1.75: '14px',
                2: '16px',
                2.5: '20px',
                3: '24px',
                3.5: '28px',
                4: '32px',
                4.5: '36px',
                5: '40px',
                5.5: '44px',
                6: '48px',
                6.5: '52px',
                7: '56px',
                7.5: '60px',
                8: '64px',
                9: '72px',
                10: '80px',
                11: '88px',
                12: '96px',
                13: '104px',
                14: '112px',
                15: '120px',
                16: '128px',
                17: '136px',
                18: '144px',
                20: '160px',
                21: '168px',
                22: '176px',
                24: '192px',
                27: '216px',
                28: '224px',
                32: '256px',
                35: '280px',
                36: '288px',
                40: '320px',
                44: '352px',
                48: '384px',
                50: '400px',
                52: '416px',
                54: '432px',
                55: '440px',
                56: '448px',
                60: '480px',
                64: '512px',
                68: '544px',
                72: '576px',
                78: '624px',
                80: '640px',
                90: '720px',
                96: '768px',
                100: '800px',
                120: '960px',
                128: '1024px',
                144: '1152px',
                150: '1200px',
                160: '1280px',
                192: '1536px',
            },
        },
    },
    corePlugins: {
        container: false,
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwindcss-animated'),
        require('tailwind-scrollbar'),
        function ({ addBase, theme }: PluginAPI) {
            addBase({
                h1: {
                    fontWeight: theme?.('fontWeight.semi-bold') || '550',
                    fontFamily: theme?.('fontFamily.title') || ['Cairo', 'sans-serif'],
                    letterSpacing: '0.05em',
                },
                h2: {
                    fontWeight: theme?.('fontWeight.normal') || '400',
                    fontFamily: theme?.('fontFamily.title') || ['Cairo', 'sans-serif'],
                    letterSpacing: '0.025em',
                },
                h3: {
                    fontWeight: theme?.('fontWeight.semi-bold') || '550',
                    fontFamily: theme?.('fontFamily.title') || ['Cairo', 'sans-serif'],
                    letterSpacing: '0.025em',
                },
                p: {
                    fontWeight: theme('fontWeight.normal') || '400',
                    fontFamily: theme('fontFamily.body') || ['Cairo', 'sans-serif'],
                },
                label: {
                    fontWeight: theme('fontWeight.normal') || '400',
                    fontFamily: theme('fontFamily.body') || ['Cairo', 'sans-serif'],
                },
                [`@media (min-width: ${theme('screens.tablet')})`]: {
                    '.text-subtext': { fontSize: '16px', lineHeight: '20px' },
                    '.text-text': { fontSize: '19px', lineHeight: '24px' },
                    '.text-h3': { fontSize: '32px', lineHeight: '40px', letterSpacing: '0.025em' },
                    '.text-h2': { fontSize: '48px', lineHeight: '64px', letterSpacing: '0.025em' },
                    '.text-h1': { fontSize: '64px', lineHeight: '80px', letterSpacing: '0.05em' },
                    h1: { fontSize: '64px', lineHeight: '80px', letterSpacing: '0.05em' },
                    h2: { fontSize: '48px', lineHeight: '64px', letterSpacing: '0.025em' },
                    h3: { fontSize: '32px', lineHeight: '40px', letterSpacing: '0.025em' },
                    p: { fontSize: '21px', lineHeight: '32px' },
                    label: { fontSize: '21px', lineHeight: '32px' },
                },
                [`@media (max-width: ${theme('screens.tablet')})`]: {
                    '.text-subtext': { fontSize: '10px', lineHeight: '16px' },
                    '.text-text': { fontSize: '16px', lineHeight: '24px' },
                    '.text-h3': { fontSize: '21px', lineHeight: '32px', letterSpacing: '0.025em' },
                    '.text-h2': { fontSize: '32px', lineHeight: '40px', letterSpacing: '0.025em' },
                    '.text-h1': { fontSize: '48px', lineHeight: '64px', letterSpacing: '0.05em' },
                    h1: { fontSize: '48px', lineHeight: '64px', letterSpacing: '0.05em' },
                    h2: { fontSize: '32px', lineHeight: '40px', letterSpacing: '0.025em' },
                    h3: { fontSize: '21px', lineHeight: '32px', letterSpacing: '0.025em' },
                    p: { fontSize: '16px', lineHeight: '24px' },
                    label: { fontSize: '10px', lineHeight: '16px' },
                },
            })
        },
        function ({ addComponents }: PluginAPI) {
            addComponents({
                '.container': {
                    maxWidth: '100%',
                    minWidth: '312px',
                    '@screen mobile': {
                        maxWidth: '312px',
                    },
                    '@screen phablet': {
                        maxWidth: '520px',
                    },
                    '@screen tablet': {
                        maxWidth: '672px',
                    },
                    '@screen vertical': {
                        maxWidth: '864px',
                    },
                    '@screen laptop': {
                        maxWidth: '1120px',
                    },
                    '@screen desktop': {
                        maxWidth: '1504px',
                    },
                },
            })
        },
    ],
}

export default config
