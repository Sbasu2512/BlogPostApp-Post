import db from "./db/index.js";

const createPost = async (
  post_id,
  post_title,
  post_body,
  created_on,
  user_id,
  is_draft,
  isPublished,
  tag
) => {
  const query = `INSERT INTO posts (id, post_title, post_body, createdon, tag, is_draft, is_published, user_id) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;`;
  const result = await db.query(query, [
    post_id,
    post_title,
    post_body,
    created_on,
    tag,
    is_draft,
    isPublished,
    user_id
  ]);
  return result.rows[0];
};

//get all posts by a certain user with likes and dislikes
const getAllPostByUserId = async (user_id) => {
  const query = `SELECT posts.*, likes.id as likes, dislikes.id as dislikes FROM posts
                   LEFT OUTER JOIN likes ON posts.id = likes.post_id
                   LEFT OUTER JOIN dislikes ON posts.id = dislikes.post_id
                   WHERE posts.user_id=$1;`;
  const result = await db.query(query, [user_id]);
  return result.rows;
};

//get all posts along with likes and dislikes
const getAllPosts = async () => {
  const query = `SELECT posts.* , profiles.displayName, likes.id as likes, dislikes.id as dislikes FROM posts
                LEFT OUTER JOIN likes ON posts.id = likes.post_id
                LEFT OUTER JOIN dislikes ON posts.id = dislikes.post_id
                LEFT OUTER JOIN profiles ON posts.user_id = profiles.user_id
   ;`;
  const result = await db.query(query);
  return result.rows;
};

//get post by post id
const getPostById = async(post_id) => {
  const query = `SELECT posts.*, likes.id as likes, dislikes.id as dislikes FROM posts
  LEFT OUTER JOIN likes ON posts.id = likes.post_id
  LEFT OUTER JOIN dislikes ON posts.id = dislikes.post_id
  WHERE posts.id = $1;`
  const result = await db.query(query,[post_id]);
  return result.rows;
}

const updatePost = async (
  post_id,
  post_title,
  post_body,
  is_draft,
  isPublished,
  is_edited,
  edited_on,
  user_id
) => {
  const query = `UPDATE posts SET post_title = $1, post_body = $2, is_draft = $3, is_published = $4, is_edited = $5, edited_on = $6
    WHERE id = $7 and user_id = $8 RETURNING *;`;
  const result = await db.query(query, [
    post_title,
    post_body,
    is_draft,
    isPublished,
    is_edited,
    edited_on,
    post_id,
    user_id,
  ]);
  return result.rows[0];
};

const deletePost = async (post_id, user_id) => {
  const query = `DELETE FROM posts WHERE id=$1 AND user_id=$2;`;
  const result = await db.query(query, [post_id, user_id]);
  return result.rows[0];
};

const createLikes = async (like_id, post_id, user_id) => {
  const query = `INSERT INTO likes (id,post_id,user_id) VALUES ($1,$2,$3) RETURNING *;`;
  const result = await db.query(query, [like_id, post_id, user_id]);
  return result.rows[0];
};

//get all likes for a certain post
const getLikesByPost = async (post_id) => {
  const query = `SELECT * FROM likes WHERE post_id=$1;`;
  const result = await db.query(query, [post_id]);
  return result.rows;
};
//get all likes by a certain user
const getLikesByUser = async (user_id) => {
  const query = `SELECT * FROM likes WHERE user_id = $1;`;
  const result = await db.query(query, [user_id]);
  return result.rows;
};

//get likes by user_id and post_id
const getLikesByPostAndUser = async(user_id, post_id)=>{
  const query = `SELECT * FROM likes WHERE user_id = $1 AND post_id = $2;`;
  const result = await db.query(query,[user_id,post_id]);
  return result.rows
}

const removeLikes = async (like_id, post_id) => {
  const query = `DELETE FROM likes WHERE id=$1 AND post_id=$2 RETURNING *;`;
  const result = await db.query(query, [like_id, post_id]);
  return result.rows[0];
};

const createDislikes = async (dislike_id, post_id, user_id) => {
  const query = `INSERT INTO dislikes (id,post_id,user_id) VALUES ($1,$2,$3) RETURNING *;`;
  const result = await db.query(query, [dislike_id, post_id, user_id]);
  return result.rows[0];
};

const getDislikesByUser = async (user_id) => {
  const query = `SELECT * FROM dislikes WHERE user_id = $1;`;
  const result = await db.query(query, [user_id]);
};

//get all likes for a certain post
const getDislikesByPost = async (post_id) => {
  const query = `SELECT * FROM dislikes WHERE post_id=$1;`;
  const result = await db.query(query, [post_id]);
  return result.rows;
};

//get likes by user_id and post_id
const getDislikesByPostAndUser = async(user_id, post_id)=>{
  const query = `SELECT * FROM dislikes WHERE user_id = $1 AND post_id = $2;`;
  const result = await db.query(query,[user_id,post_id]);
  return result.rows
}

const removeDislikes = async (dislike_id, post_id) => {
  const query = `DELETE FROM dislikes WHERE id=$1 AND post_id=$2 RETURNING *;`;
  const result = await db.query(query, [dislike_id, post_id]);
};

export default {
  createPost,
  getAllPostByUserId,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  createLikes,
  getLikesByPost,
  getDislikesByPost,
  getAllPosts,
  getLikesByUser,
  removeLikes,
  createDislikes,
  getDislikesByUser,
  removeDislikes,
  getLikesByPostAndUser,
  getDislikesByPostAndUser
};
