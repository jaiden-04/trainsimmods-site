import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { redisClient } from './database/redis';
import { environment } from './config/environment';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import path from 'path';
import passport from 'passport';
import { setLocals } from './middleware/locals';
import './config/passport';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));

import expressLayouts from 'express-ejs-layouts';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../src/views'));
app.use(expressLayouts);
app.set('layout', 'layout.ejs');

app.use(express.static(path.join(__dirname, '../src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client: redisClient as any }),
    secret: environment.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: environment.nodeEnv === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(setLocals);

app.use(routes);

app.use(routes);

app.use(errorHandler);

export default app;