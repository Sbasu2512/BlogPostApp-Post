const createPostsTable=`
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE posts(
    id uuid PRIMARY KEY,
    post_title VARCHAR(255) NOT NULL,
    post_body text,
    createdOn Date NOT NULL,
    tag VARCHAR(255) NOT NULL,
    is_draft boolean NOT NULL,
    is_published boolean NOT NULL,
    is_edited boolean,
    edited_on Date,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE
);`;

export default createPostsTable;