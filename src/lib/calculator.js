module.exports = {
    calculateSMA: function(records) {
        var sum = 0.0;
        for (const dr of records) {
            sum += dr.close
        }
        return (sum/records.length).toFixed(4);
    },
    calculateRSI: function(records) {
        var gains = 0, losses = 0
        for (let i = 1; i < records.length; i++) {
            var change = records[i].close-records[i-1].close
            gains += Math.max(0, change)
            losses += Math.max(0, -change)
        }
        var change = gains + losses
        return change == 0 ? "50.0000" : (100*gains/change).toFixed(4)
    }
}