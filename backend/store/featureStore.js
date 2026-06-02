class FeatureStore {
  constructor() {
    // In-memory store: user_id -> array of transaction objects
    this.transactions = {};
  }

  addTransaction(tx) {
    if (!this.transactions[tx.user_id]) {
      this.transactions[tx.user_id] = [];
    }
    this.transactions[tx.user_id].push({
      ...tx,
      timestamp: Date.now()
    });
  }

  getFeatures(userId, currentAmount, currentLat, currentLon) {
    const history = this.transactions[userId] || [];
    
    // Calculate Transaction Velocity (count in last 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentTx = history.filter(tx => tx.timestamp > oneHourAgo);
    const transactionVelocity = recentTx.length + 1; // including current

    // Calculate Distance from Home (mocking home as the first transaction location or average)
    let distanceFromHome = 0;
    if (history.length > 0) {
      // Mock calculation: arbitrary distance based on lat/lon differences
      const homeLat = history[0].lat;
      const homeLon = history[0].lon;
      
      // Simple euclidean distance scaled to look like KM for mockup purposes
      distanceFromHome = Math.sqrt(
        Math.pow(currentLat - homeLat, 2) + Math.pow(currentLon - homeLon, 2)
      ) * 111; // 1 degree is roughly 111km
    }

    return {
      amount: currentAmount,
      transaction_velocity: transactionVelocity,
      distance_from_home: distanceFromHome
    };
  }
}

module.exports = new FeatureStore();
