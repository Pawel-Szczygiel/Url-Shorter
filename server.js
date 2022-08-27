const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlDatabase', {
    useNewUrlParser: true, useUnifiedTopology: true});

app
    .set('view engine', 'ejs')
    .use(express.urlencoded({extended: false}))


app.get('/', async (req,res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls });
});

app.post('/shortUrls', async (req,res) => {
    await ShortUrl.create({ full: req.body.fullUrl });
    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save();
    
    res.redirect(shortUrl.full);
});

app.get('/delete/all', async (req,res) => {
    
   await ShortUrl.deleteMany();
   res.redirect('/');
})

app.get('/delete/:id', async (req, res) => {
    await ShortUrl.deleteOne({_id: req.params.id})
    res.redirect('/');
})


app.listen(process.env.PORT || 5000, console.log('app is running on port 5000'));
