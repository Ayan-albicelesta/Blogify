const User=require('../models/user.models.js')

const  {Router}=require('express')

const userRouter=Router();

userRouter.get("/signup",(req,res)=>{
    return res.render('signup')
})

userRouter.get('/signin',(req,res)=>{
    return res.render("signin")
})

userRouter.post('/signup',async (req,res)=>{
    const {fullName,email,password}=req.body

    await User.create({
        fullName,
        email,
        password
    })
    return res.render('home')
})

userRouter.post('/signin',async (req,res)=>{
    try {
        const {email,password}=req.body
    
        const token=await User.matchPasswordAndGenerateToken(email,password)//aceepting JWT token in cookie after suucefully verifing email,password
        console.log(token)

        return res.cookie('token',token,{ httpOnly: true, sameSite: 'strict' }).redirect('/')
     
    } catch (error) {
        return res.render('signin',{
            error: "Incorrect Email or password"//this error is handeled in nav partials(nav.ejs)
        })
    }
      
     
})


userRouter.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})

module.exports=userRouter;

 