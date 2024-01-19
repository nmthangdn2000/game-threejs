import { HTTP_METHOD } from '../common/constants';
import { BaseRouter } from './basic.router';
import { AuthController } from '../controllers/auth.controller';
import { validation } from '../middlewares/validation.middleware';
import { schemaUser } from '../validations/user.validation';
import { auth } from '../middlewares/authorization.middleware';

export class AuthRouter extends BaseRouter {
  private authController = new AuthController();

  constructor() {
    super();
    this.init();
  }

  init() {
    this.route({
      method: HTTP_METHOD.POST,
      url: '/login',
      action: this.authController.login,
      middleware: [validation.body(schemaUser)],
    });
    this.route({
      method: HTTP_METHOD.POST,
      url: '/register',
      action: this.authController.register,
      middleware: [validation.body(schemaUser.and('password', 'email'))],
    });
    this.route({
      method: HTTP_METHOD.POST,
      url: '/changePassword',
      action: this.authController.changePassword,
      middleware: [auth([]), validation.body(schemaUser.or('password'))],
    });
  }
}
