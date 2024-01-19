import express, { Application, Express } from 'express';
import logger from 'morgan';
import appConfig from '../configs/appConfig';
import { RouteConfig } from '../configs/routeConfig';
import errorMiddleware from '../middlewares/errorHandler.middlewares';
import path from 'path';
import cors from 'cors';
import { createServer, Server as HttpServer } from 'http';
import { socketIo } from '../socket/socket';
import { ExpressPeerServer, PeerServerEvents } from 'peer';
import { peerEmitters } from '../peer/peer';
console.log(path.join(path.resolve(), 'public'));

export class Server {
  private app: Express;
  private server: HttpServer;
  private peerServer: express.Express & PeerServerEvents;
  private middleware = [
    logger('dev'), // common, dev,
    express.urlencoded({ extended: true }),
    express.json(),
    express.static(path.join(path.resolve(), 'public')),
  ];

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.peerServer = ExpressPeerServer(this.server, {
      path: '/myapp',
    });
  }

  private routerConfig = new RouteConfig();

  private initializeStatic() {
    this.middleware.forEach((m) => {
      this.app.use(m);
    });

    this.app.use('/peerjs', this.peerServer);

    this.app.get('/check-server', (req, res) => res.json({ success: true }));
  }

  private initializeApiRouters() {
    this.app.use(cors({ origin: getCorsOrigins(), credentials: true }));
    this.routerConfig.init(this.app);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initSocketIo() {
    socketIo(this.server, getCorsOrigins());
  }

  private intiPeerServer() {
    peerEmitters(this.peerServer);
  }

  start() {
    this.initializeStatic();
    this.initializeApiRouters();
    this.initializeErrorHandling();
    this.initSocketIo();
    this.intiPeerServer();

    this.server.listen(appConfig.env.port, () => console.log(`Server started: http://localhost:${appConfig.env.port}`));
  }
}

function getCorsOrigins() {
  const origins = process.env.CORS_ORIGINS;
  if (!origins) return '*';

  return origins.split(',').map((origin) => origin.trim());
}
