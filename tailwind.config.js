module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge :  [
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  variants: {
    borderRadius:['responsive','first','last'],
    borderWidth:['responsive','last']
  },
  plugins: [],
}
