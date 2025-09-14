import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors({ origin: ['http://localhost:5173', 'https://eliana.com.bd', "https://admin.eliana.com.bd"], credentials: true }));
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serving static files
app.use(express.static('public'));

app.use('/api/v1', routes);

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
