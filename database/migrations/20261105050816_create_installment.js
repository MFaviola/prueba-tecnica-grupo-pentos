export async function up (knex) {
    await knex.schema.createTable('installment',(table)=>{
        table.increments('id');
         table.integer('loan_application_id').unsigned().notNullable()
            .references('id').inTable('loan_application').onDelete('RESTRICT');
            table.date('due_date').notNullable();
            table.decimal("amount", 12,2).notNullable();
        table.boolean("paid").defaultTo(false).notNullable();


    })
       await knex.raw(
        "Alter table installment add constraint chk_installment_amount check (amount > 0)"
    )
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('installment');
}