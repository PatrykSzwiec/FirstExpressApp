const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');


const app = express();

app.engine('.hbs', hbs({ 
  layoutsDir: path.join(__dirname, 'views/layouts'), // Specify the layout directory
  defaultLayout: 'main' // Set 'main.hbs' as the default layout for all routes
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(path.join(__dirname, '/user')));

// Custom Middleware for /user/ routes
app.use('/user/', (req, res, next) => {
  res.render('forbidden', { layout: false })
});

// Rest of paths
app.get(['/','/home'], (req, res) => {
  res.render('index')
});

app.get('/about', (req, res) => {
  res.render('about', { layout: 'dark'})
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});