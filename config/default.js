module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://swift:chenlove1314@ds131742.mlab.com:31742/myblog'
};
