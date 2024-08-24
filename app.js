import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { uuid } from 'uuidv4';
import database from './database.js';
import ResponseDto from './Models/responseDto.js';
import { likesAndDislikesCounter} from './helper/helper.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(morgan('dev'));

app.use(cors());

//a user can create posts
app.post('/posts', async(req,res)=>{
    const post_id = uuid();
    const {title,body,user_id, isPublished, is_draft, tag} = req.body;
    const created_on = new Date();
    const result = await database.createPost(post_id,title,body,created_on,user_id,is_draft,isPublished,tag);
    const x = new ResponseDto();
    x.result = result;
    x.message = 'Post has been created';
    return res.status(201).json(x);
});

//get all posts
app.get('/postsAll', async(req,res)=>{
    const posts = await database.getAllPosts();
    const postWithLikesAndDislikes = likesAndDislikesCounter(posts);
    const x = new ResponseDto();
    x.result = postWithLikesAndDislikes;
    x.message = 'Success';
    return res.status(200).json(x);
})

//a user can see all of his/her posts
app.get('/posts/:user_id', async(req,res)=>{
    const {user_id} = req.params;
    const result = await database.getAllPostByUserId(user_id);
    const postWithLikesAndDislikes = likesAndDislikesCounter(result);
    const x = new ResponseDto();
    x.result = postWithLikesAndDislikes;
    x.message = 'Success';
    return res.status(200).json(x);
});

//fetch post by post_id
app.get('/post/:id', async(req,res)=>{
    const {post_id} = req.params;
    if(post_id){
        const result = await database.getPostById(post_id);
        return res.status(200).json(result);
    } else {
        return res.json({message:'Invalid post Id'})
    }
})

//a user can edit posts
app.post('/editPosts', async(req,res)=>{
    const {post_id, title, body, isPublished, is_draft, user_id} = req.body;
    const is_edited = true;
    const edited_on = Date.now();

    const result = await database.updatePost(post_id, title, body, is_draft, isPublished, is_edited, edited_on, user_id);
    return res.status(201).json(result);
})

//a user can delete posts
app.post('/deletePost', async(req,res)=>{
    const {post_id, user_id} = req.body;
    await database.deletePost(post_id,user_id);
    return res.json('Post deleted Successfully');
})

//a user can like a post
app.post('/likes', async(req,res)=>{
    const {post_id, user_id} = req.body;
    //user can not like an already liked post
    //check if the user id and post id exists in the table -- if it does then already exists
    const postAlreadyLiked = await database.getLikesByPostAndUser(user_id,post_id);
    console.log("🚀 ~ file: app.js:75 ~ app.post ~ postAlreadyLiked:", postAlreadyLiked)
    if(postAlreadyLiked.length > 0){
        return res.json('Post already liked by user');
    }else{
        const like_id = uuid();
        await database.createLikes(like_id,post_id,user_id);
        return res.json('Post liked by user');
    }
});

//a user can get likes by postId
app.get('/likes', async(req,res)=>{
    const postId = req.params;
    const r = await database.getLikesByPost(postId)
   return res.json({message:success,result:r})
})

//a user can dislike a post
app.post('/dislikes', async(req,res)=>{
    const {post_id, user_id} = req.body;
    const postAlreadyDisliked = await database.getDislikesByPostAndUser(user_id,post_id);
    if(postAlreadyDisliked.length > 0){
        console.log(postAlreadyDisliked);
        return res.json('Post already disliked by user');
    }else{
        const like_id = uuid();
        const result = await database.createDislikes(like_id,post_id,user_id);
        // console.log(result);
     return   res.json('Post disliked by user');
    }
});


export default app;