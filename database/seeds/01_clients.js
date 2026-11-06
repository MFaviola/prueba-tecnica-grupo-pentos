/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
    // Deletes ALL existing entries
  await knex('installment').del();
  await knex('loan_application').del();
  await knex('client').del();
  await knex('client').insert([
    { full_name: 'Mindy Campos', dni: '1234567897531', monthly_income: 25000.0 },
    { full_name: 'Rodrigo Campos', dni: '1234567897539', monthly_income: 18000.0 },
    { full_name: 'Faviola Campos', dni: '1234567897532', monthly_income: 50000 },
    { full_name: 'José Luis Peralez', dni: '0301199209876', monthly_income: 225000.5 },
    { full_name: 'Miley Cyrus', dni: '0101198803456', monthly_income: 48000.0 },
    { full_name: 'Adele Blue', dni: '1801199507890', monthly_income: 150000.0 },
    { full_name: 'Leonel Messi', dni: '0501199302468', monthly_income: 620000.75 },
    { full_name: 'Diego Armando Maradona', dni: '0601198713579', monthly_income: 270000.0 },
  ]);
};
