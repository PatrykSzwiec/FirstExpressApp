const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');


const app = express();

app.engine('.hbs', hbs());
app.set('view engine', '.hbs');

app.use((req, res, next) => {
  res.show = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});


app.use(express.static(path.join(__dirname, '/public')));

app.use(express.static(path.join(__dirname, '/user')));

// Custom Middleware for /user/ routes
app.use('/user/', (req, res, next) => {
  res.show('forbidden.html');
});

// Rest of paths
app.get(['/','/home'], (req, res) => {
  res.show('index.html');
});

app.get('/about', (req, res) => {
  res.show('about.html');
});

app.get('/hello/:name', (req, res) => {
  res.render('Hello', { layout: false, name: req.params.name });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});