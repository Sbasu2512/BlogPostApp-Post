const createLikesTable=`
DROP TABLE IF EXISTS likes ;

CREATE TABLE likes(
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE
);`;

export default createLikesTable;