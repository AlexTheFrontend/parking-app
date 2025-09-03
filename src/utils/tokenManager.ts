import { TokenBalance, TokenTransaction, PARKING_DURATIONS, PRIORITY_PARKING_TOKENS } from '../types';

export class TokenManager {
  private static readonly TOTAL_WEEKLY_TOKENS = 10;
  private static readonly STORAGE_KEY = 'parking_tokens';
  private static readonly TRANSACTIONS_KEY = 'parking_token_transactions';

  static getCurrentWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate days to last Saturday (or current Saturday if today is Saturday)
    const daysToSaturday = dayOfWeek === 6 ? 0 : (dayOfWeek + 1);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToSaturday);
    weekStart.setHours(18, 0, 0, 0); // Saturday 6 PM

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(17, 59, 59, 999); // Friday 5:59 PM

    return { start: weekStart, end: weekEnd };
  }

  static getUserTokenBalance(userId: string): TokenBalance {
    const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
    const { start } = this.getCurrentWeekRange();

    if (stored) {
      const balance: TokenBalance = JSON.parse(stored);

      // Check if we need to refresh tokens (new week)
      if (new Date(balance.weekStartDate) < start) {
        return this.refreshUserTokens(userId);
      }

      return balance;
    }

    // Create new balance for user
    return this.refreshUserTokens(userId);
  }

  static refreshUserTokens(userId: string): TokenBalance {
    const { start, end } = this.getCurrentWeekRange();

    const balance: TokenBalance = {
      userId,
      currentTokens: this.TOTAL_WEEKLY_TOKENS,
      totalTokens: this.TOTAL_WEEKLY_TOKENS,
      weekStartDate: start.toISOString(),
      weekEndDate: end.toISOString()
    };

    localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(balance));

    // Log refill transaction
    this.addTransaction({
      id: Date.now().toString(),
      userId,
      type: 'refill',
      tokens: this.TOTAL_WEEKLY_TOKENS,
      timestamp: new Date().toISOString(),
      description: 'Weekly token refill'
    });

    return balance;
  }

  static canAffordParking(userId: string, tokens: number): boolean {
    const balance = this.getUserTokenBalance(userId);
    return balance.currentTokens >= tokens;
  }

  static spendTokens(userId: string, tokens: number, description: string, sessionId?: string): boolean {
    if (!this.canAffordParking(userId, tokens)) {
      return false;
    }

    const balance = this.getUserTokenBalance(userId);
    balance.currentTokens -= tokens;

    localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(balance));

    // Log spending transaction
    this.addTransaction({
      id: Date.now().toString(),
      userId,
      type: 'spend',
      tokens,
      timestamp: new Date().toISOString(),
      description,
      sessionId
    });

    return true;
  }

  static refundTokens(userId: string, tokens: number, description: string, sessionId?: string): void {
    const balance = this.getUserTokenBalance(userId);
    balance.currentTokens = Math.min(balance.currentTokens + tokens, balance.totalTokens);

    localStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(balance));

    // Log refund transaction
    this.addTransaction({
      id: Date.now().toString(),
      userId,
      type: 'refill',
      tokens,
      timestamp: new Date().toISOString(),
      description,
      sessionId
    });
  }

  static getTokensForDuration(hours: number): number {
    const duration = PARKING_DURATIONS.find(d => d.hours === hours);
    return duration ? duration.tokens : 0;
  }

  static getTokensForPriority(): number {
    return PRIORITY_PARKING_TOKENS;
  }

  static calculateTotalTokens(hours: number, isPriority: boolean): number {
    const baseTokens = this.getTokensForDuration(hours);
    const priorityTokens = isPriority ? PRIORITY_PARKING_TOKENS : 0;
    return baseTokens + priorityTokens;
  }

  static addTransaction(transaction: TokenTransaction): void {
    const stored = localStorage.getItem(this.TRANSACTIONS_KEY);
    const transactions: TokenTransaction[] = stored ? JSON.parse(stored) : [];

    transactions.push(transaction);

    // Keep only last 100 transactions
    const recentTransactions = transactions.slice(-100);
    localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(recentTransactions));
  }

  static getUserTransactions(userId: string, limit = 20): TokenTransaction[] {
    const stored = localStorage.getItem(this.TRANSACTIONS_KEY);
    const transactions: TokenTransaction[] = stored ? JSON.parse(stored) : [];

    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  static getDaysUntilRefresh(): number {
    const { end } = this.getCurrentWeekRange();
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  }

  static getTimeUntilRefresh(): string {
    const { end } = this.getCurrentWeekRange();
    const now = new Date();
    const timeDiff = end.getTime() - now.getTime();

    if (timeDiff <= 0) {return 'Now';}

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes}m`;
    }
  }
}
