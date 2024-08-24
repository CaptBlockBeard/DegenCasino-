import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { AddressLookupTableAccount, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

// import jupiterApi from "@/app/util/jupiter-api";
import { jupiterSwap } from "@/app/utl/jupSwap";



export const GET = async (req: Request) => {
    // const payload: ActionGetResponse = {
    //     type: "action",
    //     icon: new URL("/BlinkiImage-ez.webp", new URL(req.url).origin).toString(),
    //     label: "Spin the Wheel, Buccaneer!",
    //     description: "Captain Blink is a Solana-based protocol for creating and executing actions on Solana.",
    //     title: "DEGEN CASINO - What coin will you get?",
    //     links: {
    //         actions: [
    //             {
    //                 href: "/api/actions/spin?amount={amount}",
    //                 label: "SPIN",
    //                 parameters: [
    //                   {
    //                     name: "amount",
    //                     label: "Enter a SOL",
    //                   },
    //                 ],
    //               },
    //         ]
    //     }
     
    // }

    const payload: ActionGetResponse = {
        type: "action",
        icon: new URL("/BlinkiImage-ez.webp", new URL(req.url).origin).toString(),
        label: "Spin the Wheel, Buccaneer!",
        description: "Captain Blink is a Solana-based protocol for creating and executing actions on Solana.",
        title: "DEGEN CASINO - What coin will you get?",
    }

    return Response.json(payload, { 
        headers: ACTIONS_CORS_HEADERS,
    });

};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
        const body: ActionPostRequest = await req.json();
        let account: PublicKey 
        try {
            account = new PublicKey(body.account);
        } catch (error) {
            console.error("Invalid account error:", error);
            return Response.json({ error: "Invalid account" }, {
                headers: ACTIONS_CORS_HEADERS,
                status: 400
            });
        }
        console.log("Account:", account.toBase58());

        // const url = new URL(req.url);
        // let amount: number = 0.1;

        // if (url.searchParams.has("amount")) {
        //     try {
        //       amount = parseFloat(url.searchParams.get("amount") || "0.1") || amount;
        //     } catch (err) {
        //       throw "Invalid 'amount' input";
        //     }
        //   }
        const amount = 0.0005*LAMPORTS_PER_SOL;

        try {
                 // get blockhash          
     const connection = new Connection("https://victoria-6nutym-fast-mainnet.helius-rpc.com");

        
            const quoteResponse = await (
                await fetch('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=100000000&slippageBps=50'
                )
              ).json();
               console.log({ quoteResponse })
              
              const instructions = await (
                await fetch('https://quote-api.jup.ag/v6/swap-instructions', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    // quoteResponse from /quote api
                    quoteResponse,
                    userPublicKey: account.toBase58(),
                  })
                })
              ).json();

              console.log({ instructions })
              
              if (instructions.error) {
                throw new Error("Failed to get swap instructions: " + instructions.error);
              }
              
              const {
                tokenLedgerInstruction, // If you are using `useTokenLedger = true`.
                computeBudgetInstructions, // The necessary instructions to setup the compute budget.
                setupInstructions, // Setup missing ATA for the users.
                swapInstruction: swapInstructionPayload, // The actual swap instruction.
                cleanupInstruction, // Unwrap the SOL if `wrapAndUnwrapSol = true`.
                addressLookupTableAddresses, // The lookup table addresses that you can use if you are using versioned transaction.
              } = instructions;
              
              const deserializeInstruction = (instruction:any) => {
                return new TransactionInstruction({
                  programId: new PublicKey(instruction.programId),
                  keys: instruction.accounts.map((key:any) => ({
                    pubkey: new PublicKey(key.pubkey),
                    isSigner: key.isSigner,
                    isWritable: key.isWritable,
                  })),
                  data: Buffer.from(instruction.data, "base64"),
                });
              };
              
              const getAddressLookupTableAccounts = async (
                keys: string[]
              ): Promise<AddressLookupTableAccount[]> => {
                console.log("Fetching address lookup tables for keys:", keys);
                const addressLookupTableAccountInfos =
                  await connection.getMultipleAccountsInfo(
                    keys.map((key) => new PublicKey(key))
                  );
              
                return addressLookupTableAccountInfos.reduce((acc, accountInfo, index) => {
                  const addressLookupTableAddress = keys[index];
                  if (accountInfo) {
                    console.log(`Found account info for ${addressLookupTableAddress}`);
                    const addressLookupTableAccount = new AddressLookupTableAccount({
                      key: new PublicKey(addressLookupTableAddress),
                      state: AddressLookupTableAccount.deserialize(accountInfo.data),
                    });
                    acc.push(addressLookupTableAccount);
                  } else {
                    console.warn(`No account info found for ${addressLookupTableAddress}`);
                  }
              
                  return acc;
                }, new Array<AddressLookupTableAccount>());
              };
              
              const addressLookupTableAccounts: AddressLookupTableAccount[] = [];
              
              addressLookupTableAccounts.push(
                ...(await getAddressLookupTableAccounts(addressLookupTableAddresses))
              );
              
              const transferSolInstruction = SystemProgram.transfer({
                fromPubkey: account,
                toPubkey: account,
                lamports: amount * LAMPORTS_PER_SOL,
            });
    
            const TransInstructions = [
                transferSolInstruction, // Add the transfer instruction first
                ...computeBudgetInstructions.map(deserializeInstruction),
                ...setupInstructions.map(deserializeInstruction),
                deserializeInstruction(swapInstructionPayload),
                deserializeInstruction(cleanupInstruction),
            ];

              const blockhash = await connection.getLatestBlockhash();
              
              const messageV0 = new TransactionMessage({
                payerKey: account,
                recentBlockhash: blockhash.blockhash,
                instructions: TransInstructions
            }).compileToV0Message(addressLookupTableAccounts);
              
              const transaction = new VersionedTransaction(messageV0);
              
               // Serialize the transaction
            const serializedTransaction = transaction.serialize();
            const base64Transaction = Buffer.from(serializedTransaction).toString('base64');

            // Create a custom response
            const customResponse = {
                transaction: base64Transaction,
                message: "Jupiter swap transaction created successfully",
                // You can include additional fields here if needed
            };

        return Response.json(customResponse, {
            headers: ACTIONS_CORS_HEADERS,
            status: 200
        });


            // return Response.json(payload, {
            //     headers: ACTIONS_CORS_HEADERS,
            //     status: 200
            // });
        } catch (error:any) {
            console.error("Error:", error);
            return Response.json({ error: "ERROR ERROR ERROR", details: error.message }, {
                headers: ACTIONS_CORS_HEADERS,
                status: 500
            });
        }
    } catch (error:any) {
        console.error("General error:", error);
        return Response.json({ error: "An unknown error occurred", details: error.message }, {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
}
