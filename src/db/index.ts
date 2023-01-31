import { Pool, QueryResultRow } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const dbQuery = async <T extends QueryResultRow>(queryText: string, values?: any[]) => {
  return pool.query<T>(queryText, values)
}

const executeTransaction = async <T extends QueryResultRow>(text: string, values: any[]) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const queryResult = await client.query<T>(text, values)

    await client.query("COMMIT")
    return queryResult
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

export { dbQuery, executeTransaction }
