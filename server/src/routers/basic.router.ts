import { HTTP_METHOD } from '../common/constants';
import { Router } from 'express';
import cors from 'cors';

interface Route {
  method: HTTP_METHOD;
  url: string;
  action: any;
  middleware: Array<any>;
}

export class BaseRouter {
  private router: Router;
  private routes: Array<Route>;

  constructor() {
    this.router = Router();
    // this.roots = [];
    this.routes = [];
  }

  route(route: Route) {
    this.routes.push(route);
  }

  getRouter() {
    this.routes = this.routes.sort((r1, r2) => r2.url.localeCompare(r1.url));
    this.routes.forEach((route) => {
      this.addRoute(route);
    });
    return this.router;
  }

  addRoot() {
    return this.getRouter();
  }

  addRoute(route: Route) {
    switch (route.method) {
      case HTTP_METHOD.POST:
        this.router.post(route.url, route.middleware, route.action);
        break;
      case HTTP_METHOD.PUT:
        this.router.put(route.url, route.middleware, route.action);
        break;
      case HTTP_METHOD.DELETE:
        this.router.delete(route.url, route.middleware, route.action);
        break;
      default:
        this.router.get(route.url, route.middleware, route.action);
        break;
    }
  }
}
