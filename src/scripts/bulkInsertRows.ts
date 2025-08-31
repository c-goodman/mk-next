import { VercelPoolClient } from "@vercel/postgres";

export interface BulkInsertProps<T> {
  client: VercelPoolClient;
  tableName: string;
  rows: T[];
  columns: (keyof T)[];
}

/**
 * Bulk inserts rows into a Postgres table dynamically based on specified columns.
 *
 * @param client - Connected Vercel Postgres client
 * @param tableName - Name of the table to insert into
 * @param rows - Array of row objects to insert
 * @param columns - Ordered list of column names to insert (keys in row objects)
 */
export async function bulkInsertRows<T extends object>({
  client,
  tableName,
  rows,
  columns,
}: BulkInsertProps<T>): Promise<void> {
  if (rows.length === 0) {
    console.log("No rows to insert.");
    return;
  }

  // Flatten values array in the order of columns, row by row
  const values = rows.flatMap((row) =>
    columns.map((col) => {
      // Defensive: if property missing, insert null
      return col in row ? row[col] : null;
    })
  );

  const columnCount = columns.length;

  // Generate placeholders like: ($1, $2, $3), ($4, $5, $6), ...
  const placeholders = rows
    .map((_, rowIndex) => {
      const offset = rowIndex * columnCount;
      const placeholderGroup = columns
        .map((_, colIndex) => `$${offset + colIndex + 1}`)
        .join(", ");
      return `(${placeholderGroup})`;
    })
    .join(", ");

  const query = `
    INSERT INTO ${tableName} (${columns.join(", ")})
    VALUES ${placeholders}
  `;

  await client.sql`BEGIN`;
  try {
    await client.query(query, values);
    await client.sql`COMMIT`;
    console.log(`Inserted ${rows.length} rows into ${tableName}`);
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error("Bulk insert failed:", error);
    throw error;
  }
}

// Test function
// async function testBulkInsert() {
//   const tableName = "test_table";

//   const rows = [
//     { id: 1, name: "Alice", age: 30 },
//     { id: 2, name: "Bob", age: 25 },
//     { id: 3, name: "Carol", age: 28 },
//   ];

//   const columns: (keyof (typeof rows)[0])[] = ["id", "name", "age"];

//   await bulkInsertRows({
//     client: undefined,
//     tableName,
//     rows,
//     columns,
//   });
// }

// testBulkInsert();
