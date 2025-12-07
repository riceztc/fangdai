const calculator = require('../../utils/calculator.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        loanType: '',
        repaymentMethod: '',
        years: 0,
        months: 0,
        commercialResult: null,
        providentResult: null,
        totalAmount: 0,
        totalMonthly: 0,
        totalInterest: 0,
        totalRepayment: 0,
        monthlyDecrease: 0,
        // 格式化后的显示数据
        totalAmountFormatted: '0.00万',
        totalMonthlyFormatted: '¥0.00',
        totalInterestFormatted: '0.00万',
        totalRepaymentFormatted: '0.00万',
        monthlyDecreaseFormatted: '¥0.00',
        // 还款计划数据
        paymentSchedule: [],
    },

    /**
     * 格式化货币
     */
    formatCurrency(val) {
        return calculator.formatCurrency(val);
    },

    /**
     * 格式化万元
     */
    formatWan(val) {
        return calculator.formatWan(val);
    },

    /**
     * 生成还款计划数据
     */
    generatePaymentSchedule(commercialResult, providentResult) {
        const schedule = [];
        
        // 合并商业贷款和公积金贷款的详细数据
        const commercialDetails = commercialResult?.details || [];
        const providentDetails = providentResult?.details || [];
        const totalMonths = Math.max(commercialDetails.length, providentDetails.length);
        
        console.log('商业贷款详情:', commercialDetails.length, '条');
        console.log('公积金贷款详情:', providentDetails.length, '条');
        console.log('总月数:', totalMonths);
        
        for (let i = 0; i < totalMonths; i++) {
            const commercial = commercialDetails[i] || { payment: 0, principal: 0, interest: 0, remaining: 0 };
            const provident = providentDetails[i] || { payment: 0, principal: 0, interest: 0, remaining: 0 };
            
            const month = i + 1;
            const payment = commercial.payment + provident.payment;
            const principal = commercial.principal + provident.principal;
            const interest = commercial.interest + provident.interest;
            const remaining = commercial.remaining + provident.remaining;
            
            // 只显示前12期和最后12期的数据，中间用省略号表示
            if (month <= 12 || month > totalMonths - 12 || month === Math.floor(totalMonths / 2)) {
                schedule.push({
                    month: month + '期',
                    payment: payment,
                    paymentFormatted: this.formatCurrency(payment),
                    principal: principal,
                    principalFormatted: this.formatCurrency(principal),
                    interest: interest,
                    interestFormatted: this.formatCurrency(interest),
                    remaining: remaining,
                    remainingFormatted: this.formatWan(remaining)
                });
                
                // 如果是中间节点，添加省略标记
                if (month === Math.floor(totalMonths / 2) && month > 12 && month < totalMonths - 12) {
                    schedule.push({
                        month: '...',
                        payment: 0,
                        paymentFormatted: '...',
                        principal: 0,
                        principalFormatted: '...',
                        interest: 0,
                        interestFormatted: '...',
                        remaining: 0,
                        remainingFormatted: '...'
                    });
                }
            }
        }
        
        console.log('生成的还款计划:', schedule.length, '条');
        return schedule;
    },

    /**
     * 重新计算
     */
    handleReset() {
        wx.navigateBack();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        try {
            // 解析参数
            const loanType = decodeURIComponent(options.loanType || '');
            const repaymentMethod = decodeURIComponent(options.repaymentMethod || '');
            const years = parseInt(options.years || '0');
            const months = parseInt(options.months || '0');
            const commercialResult = JSON.parse(decodeURIComponent(options.commercialResult || 'null'));
            const providentResult = JSON.parse(decodeURIComponent(options.providentResult || 'null'));

            // 计算汇总数据
            const totalAmount = (commercialResult?.principal || 0) + (providentResult?.principal || 0);
            const totalMonthly = (commercialResult?.monthlyPayment || 0) + (providentResult?.monthlyPayment || 0);
            const totalInterest = (commercialResult?.totalInterest || 0) + (providentResult?.totalInterest || 0);
            const totalRepayment = (commercialResult?.totalRepayment || 0) + (providentResult?.totalRepayment || 0);
            const monthlyDecrease = (commercialResult?.monthlyPaymentDecrease || 0) + (providentResult?.monthlyPaymentDecrease || 0);

            // 生成还款计划数据
            const paymentSchedule = this.generatePaymentSchedule(commercialResult, providentResult);
            
            // 设置数据
            this.setData({
                loanType,
                repaymentMethod,
                years,
                months,
                commercialResult,
                providentResult,
                totalAmount,
                totalMonthly,
                totalInterest,
                totalRepayment,
                monthlyDecrease,
                // 预先格式化显示数据
                totalAmountFormatted: this.formatWan(totalAmount),
                totalMonthlyFormatted: this.formatCurrency(totalMonthly),
                totalInterestFormatted: this.formatWan(totalInterest),
                totalRepaymentFormatted: this.formatWan(totalRepayment),
                monthlyDecreaseFormatted: this.formatCurrency(monthlyDecrease),
                // 还款计划
                paymentSchedule,
            });
        } catch (error) {
            console.error('解析参数失败:', error);
            wx.showToast({
                title: '数据解析失败',
                icon: 'none'
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
