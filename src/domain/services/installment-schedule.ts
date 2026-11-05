import type { ScheduledInstallment } from '../value-objects/scheduled-installment.js';

export function generateInstallmentSchedule(
    requestedAmount: number,
    termMonths: number,
    startDate: Date,
): ScheduledInstallment[] {

    const totalCents = Math.round(requestedAmount * 100);
    const baseCents = Math.floor(totalCents / termMonths);
    const remainderCents = totalCents - (baseCents * termMonths);

    const installments: ScheduledInstallment[] = [];

    for (let x = 1; x <= termMonths; x++) {

        const isLast = x === termMonths;
        const cents = isLast ? baseCents + remainderCents : baseCents;

        const dueDate = new Date(startDate);
        dueDate.setUTCMonth(dueDate.getUTCMonth() + x);

        installments.push({
            dueDate,
            amount: cents / 100
        });
    }
    return installments;
}