export type LoanStatus = 'pending' | 'approved' | 'rejected';


export interface LoanApplication{

    id:number;
    clientId: number;
    requestedAmount : number;
    termMonths: number;
    status :LoanStatus;
    createdAt: Date;
}