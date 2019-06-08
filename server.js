const express = require('express');
const connectDB = require('./config/db');
const app = express();
const usersRoute = require('./routes/api/users');
const authRoute = require('./routes/api/auth');
const postsRoute = require('./routes/api/posts');
const profilesRoute = require('./routes/api/profiles');
const PORT = process.env.PORT || 5000;

//Connect Database
connectDB();


//Init Middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) =>

  res.send('API Running'));


//Define Routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/profiles', profilesRoute);
















app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`));
