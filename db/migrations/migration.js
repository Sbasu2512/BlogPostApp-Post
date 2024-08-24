import pg from 'pg';
import 'dotenv/config';
import createPostsTable from './create_post_table.js';
import createLikesTable from './create_likes_table.js';
import createDislikesTable from './create_dislikes_table.js';
import PromptSync from 'prompt-sync';

const db = new pg.Pool({
  host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const prompt = PromptSync();

const runDbMigrations = async () => {
  console.log('BEGIN DB MIGRATION');
  let table = prompt('What table are you migrating today? posts or likes or dislikes?');

  // use single client forn transactions
  const client = await db.connect()

  try {
    await client.query('BEGIN'); // begin transaction

    switch(table){
      case 'posts':
        await client.query(createPostsTable);
        break;

      case 'likes':
        await client.query(createLikesTable);
        break;
      
      case 'dislikes':
        await client.query(createDislikesTable);
        break;
    }

    await client.query('COMMIT') // commit transaction

    console.log('END DB MIGRATION');

    client.end();
  } catch (e) {
    await client.query('ROLLBACK') // rollback transaction

    console.log('DB migration failed');

    throw e
  } finally {
    client.release()
  }
}

await runDbMigrations();

//export default runDbMigrations;