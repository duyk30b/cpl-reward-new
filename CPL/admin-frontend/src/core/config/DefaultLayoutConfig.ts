import LayoutConfigTypes from '@/core/config/LayoutConfigTypes'

const config: LayoutConfigTypes = {
  themeName: 'AdminV3',
  themeVersion: '8.0.35',
  demo: 'AdminV3',
  main: {
    type: 'default',
    primaryColor: '#009EF7',
    logo: {
      dark: 'media/logos/logo-bitcastle-dark.png',
      light: 'media/logos/logo-1.svg',
    },
  },
  illustrations: {
    set: 'sketchy-1',
  },
  loader: {
    logo: 'media/logos/logo-bitcastle-dark.png',
    display: true,
    type: 'default',
  },
  scrollTop: {
    display: true,
  },
  header: {
    display: true,
    menuIcon: 'font',
    width: 'fluid',
    fixed: {
      desktop: false,
      tabletAndMobile: true,
    },
  },
  toolbar: {
    display: true,
    width: 'fluid',
    fixed: {
      desktop: true,
      tabletAndMobile: true,
    },
  },
  aside: {
    display: true,
    theme: 'dark',
    fixed: true,
    menuIcon: 'svg',
    minimized: false,
    minimize: true,
    hoverable: true,
  },
  content: {
    width: 'fluid',
  },
  footer: {
    width: 'fluid',
  },
}

export default config
