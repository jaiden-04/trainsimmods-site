import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { AuthService } from '../services/AuthService';
import { UserRepository } from '../repositories/UserRepository';
import { environment } from './environment';

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

if (environment.steamApiKey) {
  passport.use(
    new SteamStrategy(
      {
        returnURL: environment.steamReturnUrl,
        realm: new URL(environment.steamReturnUrl).origin,
        apiKey: environment.steamApiKey,
      },
      async (identifier, profile, done) => {
        try {
          const steamId = identifier.replace('https://steamcommunity.com/openid/id/', '');
          const user = await authService.findOrCreateSteamUser(steamId, profile.displayName);
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;