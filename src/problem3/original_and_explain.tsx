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
}

// FormattedWalletBalance is a WalletBalance with an additional formatted field
// Instead create a new interface from scratch with the same fields, we can extend WalletBalance
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// In this case, We are extending BoxProps with no additional fields
// So we can just use BoxProps instead of defining a new interface
// It's okay to change the name for clarity, but I think we should use type instead of interface
// I prefer to use WalletPageProps instead of Props
interface Props extends BoxProps {}

// Because we used React.FC<BoxProps>, we can get rid of props: Props, it's redundant
const WalletPage: React.FC<Props> = (props: Props) => {
  // We can also use destructuring to get children and the rest of the props
  // children is not used in this component, so we can remove it
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Because getPriority does not use any props from the component inside its body
  // We can move getPriority outside of the WalletPage component to avoid redefining it on every render
  const getPriority = (blockchain: any): number => {
    // We can use a map instead of a switch statement for better performance and scalability
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // We should only use useMemo to memoize the sortedBalances array
  // if the array has a lot of balances and the sorting operation is expensive
  // So I assume that the balances array has a lot of elements
  // If not, we can just sort the balances array directly in render
  const sortedBalances = useMemo(() => {
    /*
      NOTE:
        I don't know what lhsPriority is :(, I think it's a typo
        So I will use balancePriority instead of lhsPriority
    */

    return (
      balances
        // If useWalletBalances has been defined with good types, we can get rid of "balance: WalletBalance"
        // and use "balance" directly
        .filter((balance: WalletBalance) => {
          // balance is a WalletBalance object but WalletBalance does not have a blockchain field
          // I think we should add a blockchain field to WalletBalance
          const balancePriority = getPriority(balance.blockchain);
          // As I noted above, I will change lhsPriority to balancePriority
          // and use balancePriority !== -99 instead of balancePriority > -99
          // But what is -99? I think we should use a constant instead of a magic number
          // I will use a constant called OTHERS_BLOCKCHAIN_PRIORITY

          // I have a little puzzled with balance.amount <= 0,
          // why we need to filter out the balances that have amount <= 0

          // I will keep it for now
          // We can collapse the if statement to make it shorter
          if (lhsPriority > -99) {
            if (balance.amount <= 0) {
              return true;
            }
          }
          return false;
        })
        // We can get rid of : WalletBalance
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          // We can write this shorter
          // return rightPriority - leftPriority;
          if (leftPriority > rightPriority) {
            return -1;
          } else if (rightPriority > leftPriority) {
            return 1;
          }
        })
    );
    // prices is not used in the sortedBalances array, so we don't need to add it to the dependencies
    // It will cause the sortedBalances array to be recalculated every time prices changes
  }, [balances, prices]);

  // I think this map is redundant, we can calculate formatted amount in JSX
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // I assume that prices is an object with currency as key and price as value
      // And not have case prices[balance.currency] is undefined
      // I have a little puzzled with prices[balance.currency] * balance.amount,
      // Because we are using balance.amount <= 0, so usdValue will be 0 or negative
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          // We can calculate formatted amount here, so we don't need to calculate it before
          // And we don't need to store formatted amount in the state
          // So we can get rid of formattedBalances and FormattedWalletBalance
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
