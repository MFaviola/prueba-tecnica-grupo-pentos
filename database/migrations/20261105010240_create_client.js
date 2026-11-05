export async function up(knex) {
  await knex.schema.createTable('client', (table) => {
    table.increments('id');
    table.string('full_name', 150).notNullable();
    table.string('dni', 13).notNullable().unique();
    table.decimal('monthly_income', 12, 2).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
  await knex.raw(
    "ALTER TABLE client ADD CONSTRAINT chk_client_dni CHECK (dni REGEXP '^[0-9]{13}$')",
  );
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('client');
}