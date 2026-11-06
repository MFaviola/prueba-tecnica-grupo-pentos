const loans = [
  { dni: '0101198803456', amount: 290000, term: 72, status: 'approved', createdAt: '2026-04-05 14:00:00', paidInstallments: 5 },
  { dni: '1234567897539', amount: 45000, term: 24, status: 'approved', createdAt: '2026-07-22 13:10:00', paidInstallments: 1 },
  { dni: '0301199209876', amount: 80000, term: 10, status: 'pending', createdAt: '2026-09-30 17:30:00', paidInstallments: 0 },
  { dni: '1801199507890', amount: 100000, term: 48, status: 'rejected', createdAt: '2026-10-12 15:00:00', paidInstallments: 0 },
  { dni: '0601198713579', amount: 10000000, term: 48, status: 'approved', createdAt: '2026-10-28 18:00:00', paidInstallments: 0 },
  { dni: '0301199209876', amount: 250000, term: 12, status: 'pending', createdAt: '2026-11-03 14:30:00', paidInstallments: 0 },
  { dni: '0101198803456', amount: 150000, term: 9, status: 'rejected', createdAt: '2026-11-04 16:00:00', paidInstallments: 0 },
];

function buildSchedule(amount, term, createdAt) {
  const totalCents = Math.round(amount * 100);
  const baseCents = Math.floor(totalCents / term);
  const remainderCents = totalCents - baseCents * term;
  const startDate = new Date(`${createdAt.replace(' ', 'T')}Z`);
  const schedule = [];

  for (let i = 1; i <= term; i++) {
    const cents = i === term ? baseCents + remainderCents : baseCents;
    const dueDate = new Date(startDate);
    dueDate.setUTCMonth(dueDate.getUTCMonth() + i);
    schedule.push({ dueDate: dueDate.toISOString().slice(0, 10), amount: cents / 100 });
  }

  return schedule;
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  const clients = await knex('client').select('id', 'dni');
  const clientIdByDni = Object.fromEntries(clients.map((client) => [client.dni, client.id]));

  await knex.transaction(async (trx) => {
    for (const loan of loans) {
      const [loanApplicationId] = await trx('loan_application').insert({
        client_id: clientIdByDni[loan.dni],
        requested_amount: loan.amount,
        term_months: loan.term,
        status: loan.status,
        created_at: loan.createdAt,
      });

      if (loan.status !== 'approved') continue;

      const installments = buildSchedule(loan.amount, loan.term, loan.createdAt).map((item, index) => ({
        loan_application_id: loanApplicationId,
        due_date: item.dueDate,
        amount: item.amount,
        paid: index < loan.paidInstallments,
      }));

      await trx('installment').insert(installments);
    }
  });
}