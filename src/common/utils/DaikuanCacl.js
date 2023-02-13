const Daikuan={
  getTotalInterestRepay(price,yearRate,month){
    /** 获取总利息 **/
    price=parseFloat(price)
    yearRate=parseFloat(yearRate)
    month=parseInt(month)
    let monthRate=yearRate/100/12
    let monthInterest = 0;
    let capital=price
    let tmpCapital = 0;
    let totalInterest = 0;
    for(let i=1;i<month+1;i++){
      capital = capital - tmpCapital;
      monthInterest = capital * monthRate;
      tmpCapital = (price * monthRate * (Math.pow((1 + monthRate), i - 1))) / (Math.pow(1 + monthRate, month) - 1);
      totalInterest = totalInterest + monthInterest;
    }
    return parseFloat(totalInterest.toFixed(2))
  },getFirstPayCash(cash,rate){
    /** 根据首付比例获取首付 **/
    return parseFloat(cash) * (parseFloat(rate) / 100)
  },getLoanCash(cash,firstPayCash){
    /** 获取所需贷款金额 **/
    return parseFloat(cash) - firstPayCash
  },getMonthRepay(yearRate,loanCash,month){
    /** 获取贷款后的月供 **/
    let monthRate = parseFloat(yearRate) / 100 / 12
    let monthRepay = (parseFloat(loanCash) * monthRate * Math.pow(1 + monthRate, month)) / (Math.pow(1 + monthRate, month) - 1)
    return parseFloat(monthRepay.toFixed(2))
  }
}

export {Daikuan}
