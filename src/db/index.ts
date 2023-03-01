import { Pool, QueryResultRow } from "pg"

let dbPool: Pool
const getDbPool = () => {
  if (dbPool) return dbPool
  dbPool = new Pool({ connectionString: process.env.DATABASE_URL })
  return dbPool
}

const dbQuery = async <T extends QueryResultRow>(
  queryText: string,
  values?: string[]
) => {
  return getDbPool().query<T>(queryText, values)
}

const executeTransaction = async <T extends QueryResultRow>(
  text: string,
  values: (string | number)[]
) => {
  const client = await getDbPool().connect()
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

export { dbQuery, executeTransaction, getDbPool as getPool }
