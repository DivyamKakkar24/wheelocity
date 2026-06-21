const swaggerJsdoc = require('swagger-jsdoc');

// OpenAPI definition + JSDoc-annotated route files are combined into one spec
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wheelocity API',
            version: '1.0.0',
            description: 'REST API for the Wheelocity used-vehicle marketplace',
        },
        servers: [
            { url: '/api/v1', description: 'API base path' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Internal server error' },
                    },
                },
                MessageResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
                RegisterRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Jane Doe' },
                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                        password: { type: 'string', format: 'password', example: 'Sup3rSecret!' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                        password: { type: 'string', format: 'password', example: 'Sup3rSecret!' },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Login successful' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Jane Doe' },
                        email: { type: 'string', example: 'jane@example.com' },
                        phone: { type: 'string', nullable: true, example: '9876543210' },
                        city: { type: 'string', nullable: true, example: 'Mumbai' },
                        state: { type: 'string', nullable: true, example: 'Maharashtra' },
                    },
                },
                UpdateProfileRequest: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Jane Doe' },
                        phone: { type: 'string', example: '9876543210' },
                        city: { type: 'string', example: 'Mumbai' },
                        state: { type: 'string', example: 'Maharashtra' },
                    },
                },
                VehicleListing: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        vehicle_type: { type: 'string', example: 'car' },
                        brand: { type: 'string', example: 'Honda' },
                        model: { type: 'string', example: 'City' },
                        variant: { type: 'string', nullable: true, example: 'VX CVT' },
                        year: { type: 'integer', example: 2020 },
                        kilometers_driven: { type: 'integer', example: 35000 },
                        ownership: { type: 'string', example: '1st' },
                        fuel_type: { type: 'string', example: 'petrol' },
                        transmission: { type: 'string', example: 'automatic' },
                        price: { type: 'number', example: 950000 },
                        is_negotiable: { type: 'boolean', example: true },
                        city: { type: 'string', example: 'Mumbai' },
                        state: { type: 'string', example: 'Maharashtra' },
                        description: { type: 'string', nullable: true, example: 'Well maintained, single owner' },
                        phone: { type: 'string', example: '9876543210' },
                        status: { type: 'string', example: 'active' },
                        created_at: { type: 'string', format: 'date-time' },
                    },
                },
                CreateVehicleRequest: {
                    type: 'object',
                    required: [
                        'vehicle_type', 'brand', 'model', 'year', 'kilometers_driven',
                        'ownership', 'fuel_type', 'transmission', 'price', 'city', 'state', 'phone',
                    ],
                    properties: {
                        vehicle_type: { type: 'string', example: 'car' },
                        brand: { type: 'string', example: 'Honda' },
                        model: { type: 'string', example: 'City' },
                        variant: { type: 'string', example: 'VX CVT' },
                        year: { type: 'integer', example: 2020 },
                        kilometers_driven: { type: 'integer', example: 35000 },
                        ownership: { type: 'string', example: '1st' },
                        fuel_type: { type: 'string', example: 'petrol' },
                        transmission: { type: 'string', example: 'automatic' },
                        price: { type: 'number', example: 950000 },
                        is_negotiable: { type: 'boolean', example: true },
                        city: { type: 'string', example: 'Mumbai' },
                        state: { type: 'string', example: 'Maharashtra' },
                        description: { type: 'string', example: 'Well maintained, single owner' },
                        phone: { type: 'string', example: '9876543210' },
                    },
                },
                UpdateVehicleRequest: {
                    type: 'object',
                    properties: {
                        vehicle_type: { type: 'string', example: 'car' },
                        brand: { type: 'string', example: 'Honda' },
                        model: { type: 'string', example: 'City' },
                        variant: { type: 'string', example: 'VX CVT' },
                        year: { type: 'integer', example: 2020 },
                        kilometers_driven: { type: 'integer', example: 35000 },
                        ownership: { type: 'string', example: '1st' },
                        fuel_type: { type: 'string', example: 'petrol' },
                        transmission: { type: 'string', example: 'automatic' },
                        price: { type: 'number', example: 950000 },
                        is_negotiable: { type: 'boolean', example: true },
                        city: { type: 'string', example: 'Mumbai' },
                        state: { type: 'string', example: 'Maharashtra' },
                        description: { type: 'string', example: 'Well maintained, single owner' },
                        phone: { type: 'string', example: '9876543210' },
                        status: { type: 'string', enum: ['active', 'sold', 'inactive'], example: 'active' },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: { type: 'integer', example: 42 },
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 20 },
                        totalPages: { type: 'integer', example: 3 },
                    },
                },
            },
        },
    },
    apis: ['./src/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
