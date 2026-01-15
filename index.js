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

//Basic Auth

function adminAuth(req,res,next){
    const authheader = req.headers.authorization
    console.log(req.headers)

    if(!authheader){
        let err = new Error('Anda tidak boleh masuk laman admin')
        res.setHeader('WWW-Authenticate','Basic')
        err.status = 401
        return next(err)
    }

    const auth = new Buffer.from(authheader.split(' ')[1],
        'base64').toString().split(':')
    const user = auth[0]
    const pass = auth[1]

    if(user == 'admin' && pass == 'admin'){
        next()
    }else{
        let err = new Error('Nama atau password salah')
        res.setHeader('WWW-Authenticate','Basic')
        err.status = 401
        return next(err)
    }
}

//Guest route
app.get('/',async(req,res)=>{
    try{
        let articles = []
        try{
            const data = await fs.readFile(articlesFile)
            articles = JSON.parse(data || '[]')
            if(!Array.isArray(articles)) articles = []
        }catch(e){
            articles = []
        }
        res.render('guest/index',{articles})
    }catch(e){
        console.error(e)
        res.status(500).send('Failed to load articles')
    }
})

app.get(`/article/:id`,async(req,res)=>{
    const id = Number(req.params.id) //cek id ada atau nggak
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

//Admin route
app.get('/admin',adminAuth,async(req,res)=>{
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

app.get('/admin/article/:id',adminAuth,async(req,res)=>{
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

app.get('/admin/addarticle',adminAuth,(req,res)=>{
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

app.get('/admin/editarticle/:id',adminAuth,async(req,res)=>{
    const id = Number(req.params.id)
    if(!Number.isInteger(id) || id <= 0) return res.status(400).send('invalid id')
    try{
        const data = await fs.readFile(articlesFile,'utf-8')
        const articles = JSON.parse(data || '[]')
        const article = Array.isArray(articles) ? articles.find(a => Number(a.id) === id) : null
        if(!article) return res.status(404).send('Article Not Found')
        return res.render('admin/editarticle',{article})
    }catch(err){
        console.error(err)
        return res.status(500).send('Failed to load article')
    }
})

app.post('/admin/editarticle/:id',async(req,res)=>{
    const {id,title,content} = req.body
    const idNum = Number(id)
    if(!Number.isInteger(idNum) || idNum <= 0) return res.status(400).send('invalid id')
    if(!title || !content) return res.status(400).send('content and title needed')
    
    try{
        const data = await fs.readFile(articlesFile,'utf-8')
        let articles = JSON.parse(data || '[]')
        if(!Array.isArray(articles)) articles = []

        const article = articles.find(a => Number(a.id) === idNum)
        if(!article) return res.status(404).send('Article not found')

        article.title = title
        article.content = content
        article.updated_date = new Date().toISOString()

        await fs.writeFile(articlesFile,JSON.stringify(articles,null,2),'utf-8')

        res.redirect('/admin')
    }catch(err){
        Console.error(err)
        res.status(500).send('Failed to update article')
    }
})

app.listen(port, ()=>{
    console.log(`Server up on port ${port}`)
})