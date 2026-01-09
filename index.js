const express = require('express')
const app = express()
const port = 6767

app.set('view engine','ejs')
app.use(express.static('public'))

//Guest route
app.get('/',(req,res)=>{
    res.render('guest/index')
})

app.get(`/article/`,(req,res)=>{

})

//Admin route
app.get('/admin',(req,res)=>{
    //ambil artikel dari JSON articles dan tampilkan ke admin
    res.render('admin/index')
})

app.get('/admin/addarticle',(req,res)=>{
    res.render('admin/addarticle')
})

app.post('/admin/addarticle',(req,res)=>{
    //kirim input berupa judul, isi artikel, dan tanggal yang sudah di set hari ini sebagai JSON
})

app.get('/admin/editarticle',(req,res)=>{

})

app.patch('/admin/editarticle',(req,res)=>{

})

app.listen(port, ()=>{
    console.log(`Server up on port ${port}`)
})