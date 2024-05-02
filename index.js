const express=require ('express');
const app=express();

const {connectDB}=require('./connection.js')

const path = require('path');

const cookieParser=require('cookie-parser');

const Blog=require('./models/blog.models.js')

const userRouter=require('./routes/user.router.js');

const blogRouter=require('./routes/blog.router.js')

const { checkForAuthenticationCookie } = require('./middleware/authentication.js');

const PORT=8000;

//connect database
connectDB('mongodb://127.0.0.1:27017/blogify')
.then(()=>{console.log("DB connected for Blogify")})
.catch((err)=>{
    console.log("DB connection failed",err);
})


app.set('view engine','ejs');
app.set("views",path.resolve('./views'));

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))//this middleware is used for serving images sattically of a perticular folder
app.use(checkForAuthenticationCookie("token"))

app.get('/',async (req,res)=>{
    const allBlogs=await Blog.find({}).sort({'createdAt': -1});

    return  res.render('home',{
        user:req.user,//this req.user is came from upper 'c'heckForAuthenticationCookie' middleware, that holds payload, //if we do not write return befor res.render(), and suppose there were a bunch of code lines , they would have been executed after rendering but it is a good practice  to ensure that your function exits immediately after initiating a render/redirect
        blogs:allBlogs
    })                   
});

app.use('/user',userRouter)
app.use('/blog',blogRouter)
 

app.listen(PORT,()=>{ 
    console.log(`server started on port ${PORT}`);
}) 