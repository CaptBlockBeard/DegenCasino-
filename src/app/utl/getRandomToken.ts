type Token = {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  isToken2022: boolean;
};

const SpinTokens: Token[] = [
  {"mint":"CBBTCYTLFmQMKQznzSX4un9zBdnL3Em7PU99ZQ1UWwfv","name":"Captain BlockBeard","symbol":"CBBT","image":"T_CBlockBeard.jpg","isToken2022":true},
  {"mint":"CBBTCYTLFmQMKQznzSX4un9zBdnL3Em7PU99ZQ1UWwfv","name":"Captain BlockBeard","symbol":"CBBT","image":"T_CBlockBeard.jpg","isToken2022":true},
  {"mint":"CBBTCYTLFmQMKQznzSX4un9zBdnL3Em7PU99ZQ1UWwfv","name":"Captain BlockBeard","symbol":"CBBT","image":"T_CBlockBeard.jpg","isToken2022":true},
  {"mint":"CBBTCYTLFmQMKQznzSX4un9zBdnL3Em7PU99ZQ1UWwfv","name":"Captain BlockBeard","symbol":"CBBT","image":"T_CBlockBeard.jpg","isToken2022":true},
  {"mint":"CBBTCYTLFmQMKQznzSX4un9zBdnL3Em7PU99ZQ1UWwfv","name":"Captain BlockBeard","symbol":"CBBT","image":"T_CBlockBeard.jpg","isToken2022":true},
  {"mint":"CBBTCYTLFmQMKQznzSX4un9zBdnL3Em7PU99ZQ1UWwfv","name":"Captain BlockBeard","symbol":"CBBT","image":"T_CBlockBeard.jpg","isToken2022":true},
  {"mint":"EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm","name":"dogwifhat","symbol":"$WIF","image":"T_WIF.jpg","isToken2022":false},
  {"mint":"DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263","name":"Bonk","symbol":"Bonk","image":"T_Bonk.jpg","isToken2022":false},
  {"mint":"H7ed7UgcLp3ax4X1CQ5WuWDn6d1pprfMMYiv5ejwLWWU","name":"CHONKY","symbol":"CHONKY","image":"T_Chonky.jpg","isToken2022":false},
  {"mint":"2oMYg3aPHjFjxg1PRYLwvdRQayexUS8N4CjLXJ64GkLq","name":"BOJI","symbol":"BOJI","image":"T_BOJI.jpg","isToken2022":false},
  {"mint":"ErbakSHZWeLnq1hsqFvNz8FvxSzggrfyNGB6TEGSSgNE","name":"Founders Wif Abs","symbol":"FABS","image":"T_Fabs.jpg","isToken2022":false},
];

export const getRandomToken = async (): Promise<Token> => {
  const randomIndex = Math.floor(Math.random() * SpinTokens.length);
  return SpinTokens[randomIndex];
};