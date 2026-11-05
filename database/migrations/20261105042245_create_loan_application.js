export async function up(knex) {
    await knex.schema.createTable('loan_application', (table) => {
        table.increments('id');
        table.integer('client_id').unsigned().notNullable()
            .references('id').inTable('client').onDelete('RESTRICT');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.decimal('requested_amount', 12, 2).notNullable();
        table.integer("term_months").notNullable();
        table.enu('status', ['pending', 'approved', 'rejected']).defaultTo('pending').notNullable();


    });
    await knex.raw(
        "Alter table loan_application add constraint chk_loan_application_requested_amount check (requested_amount > 0)"
    )
    await knex.raw(
        "Alter table loan_application add constraint chk_loan_application_term_months check (term_months > 0)"
    )
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('loan_application');
}