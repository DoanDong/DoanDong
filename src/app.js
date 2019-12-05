const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000 

//Define path to Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewPath)
hbs.registerPartials(partialsPath)

// Thiết lập thư mục tĩnh để phục vụ
app.use(express.static(publicDirectoryPath))

app.get('',(req,res) => {
    res.render('index',{
        title: 'Weather app',
        name: 'Doan Dong'
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'LVOE',
        name: 'Doan Dong'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        helpText: 'Can I help you?',
        title: 'Help',
        name: 'Doan Dong'
    })
})

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'Error'
        })
    }
    geocode(req.query.address,(error,{latitude,longitude,location} = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products',(req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('*',(req,res) => {
    res.render('404',{
        title: '404',
        name: 'Doan Dong',
        errorMessage: 'Page not found.'
    })
})

app.listen(port,() =>{
    console.log('server is up on port ' + port)
})
