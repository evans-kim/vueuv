module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/vueuv/'
        : '/',
    outputDir:process.env.NODE_ENV === 'production'
        ? 'docs'
        : 'public',
}