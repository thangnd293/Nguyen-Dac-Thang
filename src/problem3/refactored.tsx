/*
  ASSUME:
  * I assume all types, hooks, components, and others used in this file are defined
  * I assume that prices is an object with currency as key and price as value 
    and not have the case prices[balance.currency] is undefined
  * I assume that we only want to show the balances 
    that are Osmosis, Ethereum, Arbitrum, Zilliqa, or Neo with amount <= 0
    But I don't know why we need to filter out the balances that have amount <= 0, 
    and usdValue is calculated with balance.amount <= 0. So I will keep it for now
*/

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

type WalletPageProps = BoxProps;
const WalletPage: React.FC<WalletPageProps> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedValidBalances: WalletBalance[] = useMemo(() => {
    // It's short but I think it's okay to understand the code
    const validBalances = balances.filter(
      (balance) =>
        getPriority(balance.blockchain) !== OTHERS_BLOCKCHAIN_PRIORITY &&
        balance.amount <= 0
    );

    // Same as above, it's short but I think it's okay to understand the code
    // With people who have been working with sort, it's not hard to understand
    return validBalances.sort(
      (leftBalance, rightBalance) =>
        getPriority(rightBalance.blockchain) -
        getPriority(leftBalance.blockchain)
    );
  }, [balances]);

  return (
    <div {...props}>
      {sortedValidBalances.map((balance, index) => (
        <WalletRow
          className={classes.row}
          // We can use key={index} because the balances are static and don't have an ID
          key={index}
          amount={balance.amount}
          usdValue={prices[balance.currency] * balance.amount}
          formattedAmount={balance.amount.toFixed()}
        />
      ))}
    </div>
  );
};

const OTHERS_BLOCKCHAIN_PRIORITY = -99;
const getPriority = (blockchain: string): number => {
  // We can enhance this function by using a map instead of a switch case
  // It's easier to read and maintain
  const blockchainPriorityMap: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };

  return blockchainPriorityMap[blockchain] ?? OTHERS_BLOCKCHAIN_PRIORITY;
};
