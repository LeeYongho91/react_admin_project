process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import Routes from '@/interfaces/route/routes.interface';
import connect from '@databases/index';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@/utils/logger';
import passport from 'passport';
import passportConfig from '@/passports/index';
import path from 'path';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public passportConfig = new passportConfig();

  constructor(routes: Routes[]) {
    this.app = express();

    this.port = process.env.PORT || 5000;
    this.env = process.env.NODE_ENV || 'development';

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.pageSetting();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port} 🚀`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await connect();
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    } else {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use('/uploads', express.static('uploads'));

    this.passportConfig.passportConfig();
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private pageSetting() {
    if (this.env === 'production') {
      // Set static folder
      // All the javascript and css files will be read and served from this folder
      this.app.use(express.static('front/build'));

      // index.html for all page routes    html or routing and naviagtion
      this.app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../front', 'build', 'index.html'));
      });
    }
  }
}

export default App;
