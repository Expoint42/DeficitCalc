/* 
        Player,只需要关心，投多少钱，返现额
    */
    function Player(recharge) {
    this.recharge = recharge;
    this.rebateDays = 0; // 用于计算是否返利结束
}

/*
    Dealer 庄家，关心每天的收入，返利，和余额
*/
function Dealer(rebateTimes, rebateDays, cpa){
    this.rebateTimes = rebateTimes || 1;  // 返利倍数
    this.rebateDays = rebateDays; // 返利持续天数
    this.dailyRebateRatio = 1.0 / rebateDays; // 日返利比例
    this.cpa = cpa || 0; // 获客成本
    this.balance = 0; // 余额
    this.players = []; // 所有的玩家 
}

Dealer.prototype.register = function (player) {
    this.players.push(player);
    // 每个新增用户会为庄家新增余额
    this.balance += player.recharge - this.cpa;
}

// 开支
Dealer.prototype.expense = function() {
    var pay = 0;

    this.players.forEach(function(player) {
        if(player.rebateDays < this.rebateDays) {
            pay += player.recharge * this.rebateTimes * this.dailyRebateRatio;
            player.rebateDays ++;
        } 
    }, this)

    return pay;
}

// 债务
Dealer.prototype.debt = function() {
    var temp = 0;

    this.players.forEach(function(player) {
        if(player.rebateDays < this.rebateDays) {
            temp += (player.recharge * this.rebateTimes * this.dailyRebateRatio * ( this.rebateDays - player.rebateDays));
        } 
    }, this);

    return -1 * temp;
}

// 赤字
Dealer.prototype.deficit = function() {
    return (this.debt() + this.balance) ;
}

