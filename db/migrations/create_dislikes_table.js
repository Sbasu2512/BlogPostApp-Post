const createDislikesTable=`
DROP TABLE IF EXISTS dislikes ;

CREATE TABLE dislikes(
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    post_id uuid REFERENCES posts(id) ON DELETE CASCADE
);`;

export default createDislikesTable;