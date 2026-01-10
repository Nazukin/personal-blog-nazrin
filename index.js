const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const app = express()
const port = 6767

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })); 

const articlesDir = path.join(__dirname,'articles')

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

app.post('/admin/addarticle',async (req,res)=>{
    //kirim input berupa judul, isi artikel, dan tanggal yang sudah di set hari ini sebagai JSON
    const {title,content} = req.body
    if(!title || !content) return res.status(400).send('Title and content required')
    
    try{
        await fs.mkdir(articlesDir,{recursive:true})

        const files = await fs.readdir(articlesDir)
        const ids = files
            .map(f => parseInt(path.parse(f).name,10))
            .filter(n => !isNaN(n))
        const maxId = ids.length ? Math.max(...ids) : 0
        const id = maxId + 1

        const article = {
            id,
            title,
            content,
            date: new Date().toISOString()
        }

        const filePath = path.join(articlesDir,`${id}.json`)
        await fs.writeFile(filePath,JSON.stringify(article,null,2),'utf-8')

        res.redirect('/admin')
    } catch(err){
        console.error(err)
        res.status(500).send('Failed to save article')
    }
})

app.get('/admin/editarticle',(req,res)=>{

})

app.patch('/admin/editarticle',(req,res)=>{

})

app.listen(port, ()=>{
    console.log(`Server up on port ${port}`)
})