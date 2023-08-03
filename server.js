const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

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

// form-data service with multer middleware for file filtering
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.png', '.jpg', '.jpeg', '.gif'];
  const ext = path.extname(file.originalname);
  if (allowedFileTypes.includes(ext.toLowerCase())) {
    cb(null, true); // Accept the file
  } else {
    req.fileError = 'Only .png, .jpg, .jpeg, or .gif files are allowed.'; // Save the error message to req.fileError
    cb(null, false); // Reject the file
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Save the file to the "public/uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  }
});

const upload = multer({ fileFilter });

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

app.post('/contact/send-message', upload.single('file'),  (req, res) => {

  const { author, sender, title, message } = req.body;

  if(author && sender && title && message && req.file) {
    const fileName = req.file && req.file.originalname;

    // If all fields are filled, display success message
    res.render('contact', { isSent: true, fileName });
  }
  else {
    // If any field is missing, display error message
    res.render('contact', { isError: true, fileError: req.fileError  });
  }

});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});