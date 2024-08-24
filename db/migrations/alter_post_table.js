const alterPostsTable=`
ALTER TABLE posts
    ADD COLUMN likes ARRAY,
    ADD COLUMN dislikes ARRAY
;`;

export default alterPostsTable;