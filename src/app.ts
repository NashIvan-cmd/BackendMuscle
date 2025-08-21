import express from "express"
import auth from "./routes/auth.routes"
import egg from "./routes/egg.routes"
import { errorHandler } from "./middleware/error.middleware";
import path from "path";
import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
const __appndir = path.resolve();

const createApp = () => {
    const app = express();

    app.use(express.json());
    // allows application/x-www-form-urlencoded payload
    app.use(express.urlencoded({ extended: true }));

    // app.use((req, res, next) => {
    //     console.log('=== DEBUG INFO ===');
    //     console.log('Method:', req.method);
    //     console.log('URL:', req.url);
    //     console.log('Headers:', req.headers);
    //     console.log('Content-Type:', req.get('content-type'));
    //     console.log('Raw Body:', req.body);
    //     console.log('Body Keys:', Object.keys(req.body || {}));
    //     console.log('==================');
    //     next();
    // });

    // View engine setup
    app.set('views', './src/views');
    app.set('view engine', 'ejs');
    app.use(express.static('./src/public'));

    // Routes
    app.get('/', (req, res) => {
    res.send(`Hello from process ${process.pid} on port ${process.env.PORT || 'unknown'}!`);
    });

    app.get('/index', (req, res) => {
        res.render('index');
    });

    app.use('/api', auth);
    app.use('/api', egg);
    app.use(errorHandler);

    return app;
}
export default createApp;