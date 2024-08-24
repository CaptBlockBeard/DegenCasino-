import { createJupiterApiClient, QuoteGetRequest } from '@jup-ag/api';
import { getRandomToken } from './getRandomToken';
import { 
    PublicKey, 
    VersionedTransaction, 
    Connection, 
    LAMPORTS_PER_SOL,
    SystemProgram,
    AddressLookupTableAccount,
    TransactionMessage
} from '@solana/web3.js';

const connection = new Connection("https://victoria-6nutym-fast-mainnet.helius-rpc.com", "confirmed");

export async function jupiterSwap(account: PublicKey, amount: number) {
    const randomToken = await getRandomToken();
    const jupiterQuoteApi = createJupiterApiClient();

    const quoteParams: QuoteGetRequest = {
        inputMint: "So11111111111111111111111111111111111111112", // Wrapped SOL
        outputMint: randomToken.mint, 
        amount: amount, // 0.01 SOL in lamports
        // slippageBps: 50,
    }
    try {
        const quoteResponse = await jupiterQuoteApi.quoteGet(quoteParams);
        console.log("Quote received:", quoteResponse);

        const swapInstructions = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: account.toBase58(),
                wrapUnwrapSOL: true
            })
        }).then(res => res.json());
        console.log("Swap instructions:", swapInstructions);

        
        
        const swapTransactionBuf = Buffer.from(swapInstructions.swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

       

        return resolvedTransaction;


        console.log("------transaction", transaction)

        return transaction;
    } catch (error) {
        console.error("Jupiter swap error:", error);
        throw error;
    }
}