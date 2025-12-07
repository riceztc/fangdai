const calculator = require('../../utils/calculator.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 贷款类型
        loanType: calculator.LoanType.COMMERCIAL,

        // 还款方式
        repaymentMethod: calculator.RepaymentMethod.EQUAL_INTEREST,

        // 商业贷款金额(万元)
        amountCommercial: 100,
        // 商业贷款利率
        rateCommercial: calculator.DEFAULT_COMMERCIAL_RATE,

        // 公积金贷款金额(万元)
        amountProvident: 50,
        // 公积金贷款利率
        rateProvident: calculator.DEFAULT_PROVIDENT_RATE,

        // 贷款期限（月）
        months: 360,
    },

    /**
     * 改变贷款类型
     */
    changeLoanType(e) {
        const type = e.currentTarget.dataset.type;
        this.setData({
            loanType: type
        });
    },

    /**
     * 改变商业贷款金额
     */
    onAmountCommercialChange(e) {
        let value = e.detail.value;
        // 只允许数字和小数点
        value = value.replace(/[^\d.]/g, '');
        // 确保只有一个小数点
        const dotIndex = value.indexOf('.');
        if (dotIndex !== -1) {
            value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '');
        }
        // 限制小数点后最多2位
        if (dotIndex !== -1 && value.length > dotIndex + 3) {
            value = value.substring(0, dotIndex + 3);
        }
        this.setData({
            amountCommercial: value
        });
    },

    /**
     * 改变商业贷款利率
     */
    onRateCommercialChange(e) {
        let value = e.detail.value;
        // 只允许数字和小数点
        value = value.replace(/[^\d.]/g, '');
        // 确保只有一个小数点
        const dotIndex = value.indexOf('.');
        if (dotIndex !== -1) {
            value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '');
        }
        // 限制小数点后最多2位
        if (dotIndex !== -1 && value.length > dotIndex + 3) {
            value = value.substring(0, dotIndex + 3);
        }
        this.setData({
            rateCommercial: value
        });
    },

    /**
     * 改变公积金贷款金额
     */
    onAmountProvidentChange(e) {
        let value = e.detail.value;
        // 只允许数字和小数点
        value = value.replace(/[^\d.]/g, '');
        // 确保只有一个小数点
        const dotIndex = value.indexOf('.');
        if (dotIndex !== -1) {
            value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '');
        }
        // 限制小数点后最多2位
        if (dotIndex !== -1 && value.length > dotIndex + 3) {
            value = value.substring(0, dotIndex + 3);
        }
        this.setData({
            amountProvident: value
        });
    },

    /**
     * 改变公积金贷款利率
     */
    onRateProvidentChange(e) {
        let value = e.detail.value;
        // 只允许数字和小数点
        value = value.replace(/[^\d.]/g, '');
        // 确保只有一个小数点
        const dotIndex = value.indexOf('.');
        if (dotIndex !== -1) {
            value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '');
        }
        // 限制小数点后最多2位
        if (dotIndex !== -1 && value.length > dotIndex + 3) {
            value = value.substring(0, dotIndex + 3);
        }
        this.setData({
            rateProvident: value
        });
    },

    /**
     * 改变贷款期限
     */
    onMonthsChange(e) {
        this.setData({
            months: Number(e.detail.value)
        });
    },

    /**
     * 改变还款方式
     */
    changeRepaymentMethod(e) {
        const method = e.currentTarget.dataset.method;
        this.setData({
            repaymentMethod: method
        });
    },

    /**
     * 处理计算
     */
    handleCalculate() {
        const { loanType, repaymentMethod, amountCommercial, rateCommercial, amountProvident, rateProvident, months } = this.data;

        let commercialResult = null;
        let providentResult = null;

        // 计算商业贷款
        if (loanType === calculator.LoanType.COMMERCIAL || loanType === calculator.LoanType.COMBINED) {
            commercialResult = calculator.calculateMortgage(
                Number(amountCommercial) * 10000,
                Number(rateCommercial),
                months / 12,
                repaymentMethod
            );
        }

        // 计算公积金贷款
        if (loanType === calculator.LoanType.PROVIDENT || loanType === calculator.LoanType.COMBINED) {
            providentResult = calculator.calculateMortgage(
                Number(amountProvident) * 10000,
                Number(rateProvident),
                months / 12,
                repaymentMethod
            );
        }

        // 跳转到结果页面，传递数据
        wx.navigateTo({
            url: '/pages/result/result?' +
                'loanType=' + encodeURIComponent(loanType) + '&' +
                'repaymentMethod=' + encodeURIComponent(repaymentMethod) + '&' +
                'years=' + (months / 12) + '&' +
                'months=' + months + '&' +
                'commercialResult=' + encodeURIComponent(JSON.stringify(commercialResult)) + '&' +
                'providentResult=' + encodeURIComponent(JSON.stringify(providentResult))
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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
