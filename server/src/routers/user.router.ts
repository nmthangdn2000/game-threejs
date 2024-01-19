import { HTTP_METHOD, ROLE } from '../common/constants';
import { BaseRouter } from './basic.router';
import { UserController } from '../controllers/user.controlle';
import { auth } from '../middlewares/authorization.middleware';
import { validation } from '../middlewares/validation.middleware';
import { schemaUser } from '../validations/user.validation';
import { uploadDiskStorage } from '../middlewares/upload.middleware';

export class UserRouter extends BaseRouter {
  private userController = new UserController();

  constructor() {
    super();
    this.init();
  }

  init() {
    this.route({
      method: HTTP_METHOD.GET,
      url: '/',
      action: this.userController.getAll,
      middleware: [auth([ROLE.ADMIN])],
    });
    this.route({
      method: HTTP_METHOD.GET,
      url: '/:id',
      action: this.userController.getById,
      middleware: [auth([ROLE.ADMIN])],
    });
    this.route({
      method: HTTP_METHOD.GET,
      url: '/profile',
      action: this.userController.getProfile,
      middleware: [auth([])],
    });
    this.route({
      method: HTTP_METHOD.PUT,
      url: '/:id',
      action: this.userController.updateById,
      middleware: [auth([ROLE.ADMIN]), uploadDiskStorage.single('avatar'), validation.body(schemaUser)],
    });
    this.route({
      method: HTTP_METHOD.PUT,
      url: '/profile',
      action: this.userController.updateProfile,
      middleware: [auth([]), uploadDiskStorage.single('avatar'), validation.body(schemaUser)],
    });
    this.route({
      method: HTTP_METHOD.DELETE,
      url: '/:id',
      action: this.userController.deleteById,
      middleware: [auth([ROLE.ADMIN])],
    });
  }
}
