const path = require('path');
const express = require('express');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

const SortMiddleware = require('./app/middlewares/sortMiddleware');

const route = require('./routes');
const db = require('./config/db');
// connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// custom Middleware
app.use(SortMiddleware);

app.use(methodOverride('_method'));
// HTTP logger
app.use(morgan('combined'));

// Template engine
app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable: (field, sort) => {
                const sortType = field === sort.column ? sort.type : 'default'

                const icons = {
                    default: 'oi oi-elevator',
                    asc: 'oi oi-sort-ascending',
                    desc: 'oi oi-sort-descending',
                }
                const types = {
                    default: 'desc',
                    asc: 'desc',
                    desc: 'asc',
                };

                const icon = icons[sortType];
                const type = types[sortType];

                return `<a href="?_sort&column=${field}&type=${type}"><span class="${icon}"></span></a>`
            }
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// init Route
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
