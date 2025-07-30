//Librerias importadas
import express from 'express';
import cors from 'cors'
import cookieParser from "cookie-parser";


//Rutas de verificacion y recuperacion de usuarios
import registerRoutes from './src/routes/register.js';
import registerVetRoutes from './src/routes/registerVet.js'
import loginRoutes from './src/routes/login.js';
import logoutRoutes from './src/routes/logout.js';
import passwordRecovery from './src/routes/passwordRecovery.js';

import HolidayRoutes from './src/routes/holiday.js';
import ProductsRoutes from './src/routes/products.js';
import ReviewsRoutes from './src/routes/reviews.js';
import CartRoutes from './src/routes/cart.js';
import CategoriasRoutes from "./src/routes/categories.js";

// Rutas de CRUDS
import holidayRoutes from './src/routes/holiday.js';
import clientsRoutes from './src/routes/clients.js';
import adminRoutes from './src/routes/admin.js';
import productsRoutes from './src/routes/products.js';
import reviewsRoutes from './src/routes/reviews.js';
import employeesRoutes from "./src/routes/employees.js";
import categoriesRoutes from "./src/routes/categories.js";
import ordersRoutes from "./src/routes/orders.js"

//Rutas Invitados
import guestWholesalers from './src/routes/wholesalersPurchase.js';
import guestClients from './src/routes/retailsPurchase.js';


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
}

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions));

// Rutas verificacion y recuperacion de usuarios
app.use('/api/register', registerRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/logout', logoutRoutes)
app.use('/api/passwordRecovery', passwordRecovery)
app.use('/api/registerVet', registerVetRoutes)

// Rutas de CRUDS
app.use('/api/clients', clientsRoutes)
app.use('/api/employees', employeesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/holiday', holidayRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/category', categoriesRoutes)
app.use('/api/reviews', reviewsRoutes)

//Rutas Invitados
app.use('/api/guestWholesalers', guestWholesalers)
app.use('/api/guestClients', guestClients)

//Graficas
app.use('/api/Holiday', HolidayRoutes)
app.use('/api/products', ProductsRoutes)
app.use('/api/reviews', ReviewsRoutes)
app.use('/api/cart', CartRoutes);
app.use('/api/Categories', CategoriasRoutes)

export default app;