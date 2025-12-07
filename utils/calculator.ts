import { RepaymentMethod, CalculationResult } from '../types';

export const calculateMortgage = (
  principal: number, // in Yuan
  ratePercent: number, // Annual rate in %
  years: number,
  method: RepaymentMethod
): CalculationResult => {
  const months = years * 12;
  const monthlyRate = ratePercent / 100 / 12;
  const details = [];
  
  let totalInterest = 0;
  let totalRepayment = 0;
  let monthlyPayment = 0;
  let monthlyPaymentDecrease = 0;

  if (method === RepaymentMethod.EQUAL_INTEREST) {
    // Formula: [P * r * (1+r)^n] / [(1+r)^n - 1]
    const pow = Math.pow(1 + monthlyRate, months);
    monthlyPayment = (principal * monthlyRate * pow) / (pow - 1);
    totalRepayment = monthlyPayment * months;
    totalInterest = totalRepayment - principal;

    let remainingPrincipal = principal;
    for (let i = 1; i <= months; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const principalRepayment = monthlyPayment - interest;
      remainingPrincipal -= principalRepayment;
      // Handle floating point precision at the end
      if (remainingPrincipal < 0) remainingPrincipal = 0;
      
      details.push({
        month: i,
        payment: monthlyPayment,
        interest: interest,
        principal: principalRepayment,
        remaining: remainingPrincipal
      });
    }

  } else {
    // Equal Principal
    const principalPerMonth = principal / months;
    totalInterest = 0;
    
    // First month payment
    monthlyPayment = principalPerMonth + (principal * monthlyRate);
    // Decrease amount per month = principalPerMonth * monthlyRate
    monthlyPaymentDecrease = principalPerMonth * monthlyRate;

    let remainingPrincipal = principal;

    for (let i = 1; i <= months; i++) {
      const interest = remainingPrincipal * monthlyRate;
      const currentPayment = principalPerMonth + interest;
      totalRepayment += currentPayment;
      totalInterest += interest;
      remainingPrincipal -= principalPerMonth;
       if (remainingPrincipal < 0) remainingPrincipal = 0;

      details.push({
        month: i,
        payment: currentPayment,
        interest: interest,
        principal: principalPerMonth,
        remaining: remainingPrincipal
      });
    }
  }

  return {
    monthlyPayment,
    monthlyPaymentDecrease: method === RepaymentMethod.EQUAL_PRINCIPAL ? monthlyPaymentDecrease : 0,
    totalInterest,
    totalRepayment,
    months,
    principal,
    details
  };
};

export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(val);
};

export const formatWan = (val: number) => {
   return (val / 10000).toFixed(2) + '万';
}