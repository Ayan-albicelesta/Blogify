const Blog=require('../models/blog.models.js')

const User=require('../models/user.models.js')

const Comment=require('../models/comments.model.js')

const multer=require('multer')

const path=require('path')



const  {Router}=require('express')


const blogRouter=Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {

       //path.resolve and path.join() is working same here

      // cb(null, path.join( './public/uploads'))
      // cb(null,path.join(__dirname, '../public/uploads')); //path.join(__dirname, '..', 'public', 'uploads');

      // cb(null,path.resolve('./public/uploads'))
      // cb(null,path.resolve(__dirname,'../public/uploads'))
      cb(null,path.resolve(__dirname,'..','public','uploads'))
      

    },
    filename: function (req, file, cb) {
      const filename=`${Date.now()}-${file.originalname}`
      cb(null,filename)
    }
  })

const upload=multer({storage:storage})  




blogRouter.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user//req.user  will come from middleware 
    })
})

blogRouter.post('/',upload.single('coverImage'),async(req,res)=>{
    // console.log(req.body);
    // console.log(req.file);//req.file will contain file data
    console.log(req.user);
    const {title,body}=req.body
    const blog= await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,//req.user is accesible from checkForAuthenticationCookie middleware
    })
     
    return res.redirect(`/blog/${blog._id}`)//will be redirected to a dynamic url based on unique id
       

})


blogRouter.get('/:blogId',async (req,res)=>{//for a perticuar blog id
    const Id=req.params.blogId;

    const blog=await Blog.findById(Id).populate('createdBy')
    console.log(blog);

    const comments=await Comment.find({blogId:req.params.blogId}).populate('createdBy')
    console.log('comments ',comments);

    try {
        if(blog){
          return res.render('blog',{
             user:req.user,
             blog,
             comments
          })
        }
        else{
          return res.render('blog',{
             msg:"No blog found"
         })
        }
    } catch (error) {
        return res.render('blog',{
          error:"Error occured"
        })
    }
})


// blogRouter.get('/showBlogsForuser/:userId',async (req,res)=>{//for a perticuar blog id
//   const userId=req.params.id;

//   try {
//     const allBlogs=await Blog.find({createdBy:userId})

//       if(allBlogs){
//          return res.render('/home',{
//            blogs:allBlogs
//          })
//       }
//       else{
//         return res.render('home',{
//           msg:"No blog found"
//       })
//       }
//   } catch (error) {
//     return res.render('home',{
//       error:"Error occured"
//     })
//   }
// })


blogRouter.post('/comment/:blogId',async (req,res)=>{
  const {content} =req.body
    const comment=await Comment.create({
         content,
         blogId:req.params.blogId,
         createdBy:req.user._id
    })

     return res.redirect(`/blog/${req.params.blogId}`)

    // return res.render('blog',{
    //   comment
    // })
})


module.exports=blogRouter