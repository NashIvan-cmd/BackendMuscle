import express from "express"
import auth from "./routes/auth.routes"
import egg from "./routes/egg.routes"
import { errorHandler } from "./middleware/error.middleware";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createApp = () => {
    const app = express();

    app.use(express.json());
    // allows application/x-www-form-urlencoded payload
    app.use(express.urlencoded({ extended: true }));

    // View engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, 'public')));

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