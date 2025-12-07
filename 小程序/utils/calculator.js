// 贷款类型
const LoanType = {
    COMMERCIAL: '商业贷款',
    PROVIDENT: '公积金贷款',
    COMBINED: '组合贷款',
};

// 还款方式
const RepaymentMethod = {
    EQUAL_INTEREST: '等额本息', // 等额本息
    EQUAL_PRINCIPAL: '等额本金', // 等额本金
};

// 默认利率
const DEFAULT_COMMERCIAL_RATE = 3.45; // LPR示例
const DEFAULT_PROVIDENT_RATE = 2.85;

// 贷款年限选项
const LOAN_YEAR_OPTIONS = [30, 25, 20, 15, 10, 5];

// 计算房贷
function calculateMortgage(principal, ratePercent, years, method) {
    const months = years * 12;
    const monthlyRate = ratePercent / 100 / 12;
    const details = [];

    let totalInterest = 0;
    let totalRepayment = 0;
    let monthlyPayment = 0;
    let monthlyPaymentDecrease = 0;

    if (method === RepaymentMethod.EQUAL_INTEREST) {
        // 等额本息公式：[P * r * (1+r)^n] / [(1+r)^n - 1]
        const pow = Math.pow(1 + monthlyRate, months);
        monthlyPayment = (principal * monthlyRate * pow) / (pow - 1);
        totalRepayment = monthlyPayment * months;
        totalInterest = totalRepayment - principal;

        let remainingPrincipal = principal;
        for (let i = 1; i <= months; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const principalRepayment = monthlyPayment - interest;
            remainingPrincipal -= principalRepayment;
            // 处理浮点数精度问题
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
        // 等额本金
        const principalPerMonth = principal / months;
        totalInterest = 0;

        // 首月还款额
        monthlyPayment = principalPerMonth + (principal * monthlyRate);
        // 每月递减金额 = 本金部分 * 月利率
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
}

// 格式化货币
function formatCurrency(val) {
    return '¥' + val.toFixed(2);
}

// 格式化万元
function formatWan(val) {
    return (val / 10000).toFixed(2) + '万';
}

module.exports = {
    LoanType,
    RepaymentMethod,
    DEFAULT_COMMERCIAL_RATE,
    DEFAULT_PROVIDENT_RATE,
    LOAN_YEAR_OPTIONS,
    calculateMortgage,
    formatCurrency,
    formatWan
};
