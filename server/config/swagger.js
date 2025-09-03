import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trip Planner API',
            version: '1.0.0',
            description: 'API documentation for the Trip Planner project',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT Bearer token'
                }
            },
            security: [
                {
                    BearerAuth: []
                }
            ]
        },
    },
    // נתיב מתוקן לקבצי הנתיבים
    apis: ['./server/routes/*.js']

};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true, // שומר את הטוקן גם אחרי רענון דף
            securityDefinitions: {
                BearerAuth: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header'
                }
            }
        },
        customCss: '.swagger-ui .topbar { display: none }', // מסתיר את הבאר העליון
        customSiteTitle: "Trip Planner API Documentation"
    }));
    console.log('Swagger is available at http://localhost:5000/api-docs');
};