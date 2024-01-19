import { Application } from 'express';
import { AuthRouter } from '../routers/auth.router';
import { UserRouter } from '../routers/user.router';

export class RouteConfig {
  init(app: Application) {
    app.use('/auth', new AuthRouter().addRoot());
    app.use('/api/users', new UserRouter().addRoot());
  }
}
