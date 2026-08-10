// in your main server file
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redisClient'); // your redis client instance

app.use(session({
  store: new RedisStore({ client: redisClient }),
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
}));