const express = require('express')
const fs = require('fs/promises')
const path = require('path')
const app = express()
const port = 6767

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })); 

const articlesDir = path.join(__dirname,'articles')
const articlesFile = path.join(articlesDir, 'articles.json') // <-- single JSON "database"

//Guest route
app.get('/',(req,res)=>{
    res.render('guest/index')
})

app.get(`/article/`,(req,res)=>{
    
})

//Admin route
app.get('/admin',async(req,res)=>{
    //ambil artikel dari JSON articles dan tampilkan ke admin
    try{
        let articles = []
        try{
            const data = await fs.readFile(articlesFile)
            articles = JSON.parse(data || '[]')
            if(!Array.isArray(articles)) articles = []
        }catch(e){
            articles = []
        }
        res.render('admin/index',{articles})
    }catch(e){
        console.error(e)
        res.status(500).send('Failed to load articles')
    }
})

app.get('/admin/article/:id',async(req,res)=>{
    const id = Number(req.params.id)
    if(!Number.isInteger(id) || id <= 0) return res.status(400).send('invalid id')
    
    try{
        const data = await fs.readFile(articlesFile,'utf-8')
        const articles = JSON.parse(data || '[]')
        const article = Array.isArray(articles) ? articles.find(a => Number(a.id) === id) : null
        if(!article) return res.status(404).send('Article Not Found')
        return res.render('admin/article',{article})
    }catch(err){
        console.error(err)
        return res.status(500).send('Failed to load article')
    }
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

        // read existing articles array from single file
        let articles = []
        try {
            const data = await fs.readFile(articlesFile, 'utf8')
            articles = JSON.parse(data || '[]')
            if (!Array.isArray(articles)) articles = []
        } catch (err) {
            // file missing or invalid -> start with empty array
            articles = []
        }

        const maxId = articles.reduce((m,a) => Math.max(m, Number(a.id) || 0), 0)
        const id = maxId + 1

        const article = {
            id,
            title,
            content,
            date: new Date().toISOString()
        }

        articles.push(article)
        await fs.writeFile(articlesFile, JSON.stringify(articles,null,2),'utf8')

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