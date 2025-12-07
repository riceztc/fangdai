export enum LoanType {
  COMMERCIAL = '商业贷款',
  PROVIDENT = '公积金贷款',
  COMBINED = '组合贷款',
}

export enum RepaymentMethod {
  EQUAL_INTEREST = '等额本息', // Equal Principal and Interest
  EQUAL_PRINCIPAL = '等额本金', // Equal Principal
}

export interface CalculationResult {
  monthlyPayment: number; // For Equal Interest: fixed. For Equal Principal: first month
  monthlyPaymentDecrease?: number; // For Equal Principal: amount decreased per month
  totalInterest: number;
  totalRepayment: number;
  months: number;
  principal: number;
  details: Array<{
    month: number;
    payment: number;
    interest: number;
    principal: number;
    remaining: number;
  }>;
}

export interface LoanInputState {
  loanType: LoanType;
  repaymentMethod: RepaymentMethod;
  amountCommercial: number; // Wan (10k)
  rateCommercial: number; // Percentage
  amountProvident: number; // Wan (10k)
  rateProvident: number; // Percentage
  years: number;
}