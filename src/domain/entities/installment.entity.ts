export interface Installment{
    id: number;
    loanApplicationId : number;
    dueDate : Date;
    amount : number;
    paid : boolean;
}