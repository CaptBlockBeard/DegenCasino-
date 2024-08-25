import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { AddressLookupTableAccount, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

// import jupiterApi from "@/app/util/jupiter-api";
import { jupiterSwap } from "@/app/utl/jupSwap";
import { getRandomToken } from "@/app/utl/getRandomToken";



export const GET = async (req: Request) => {
    const requestUrl = new URL(req.url);
    const amount = 0.001

    const baseHref = new URL(
      `/api/swap?`,
      requestUrl.origin,
    ).toString();

    const payload: ActionGetResponse = {
        type: "action",
        icon: new URL("/CAPTbb_gif3", new URL(req.url).origin).toString(),
        label: "Spin the Wheel, Buccaneer!",
        title: "Arrr!, What booty be in yer chest? What coin will ye plunder, matey? Spin the wheel and see what treasure awaits ye!",
        description: "Remember, this be no treasure map—just a bit o' fun. Not financial advice, so keep yer doubloons safe! A 1% cut be the price o' entry, matey! Arrr!",
        links: {
            actions: [
                {
                  label: "Spin fer 1 SOL, ye scallywag!", // button text
                  href: `${baseHref}&amount=${"1"}`,
                },
                {
                  label: "Spin fer 0.5 SOL, ye barnacle!", // button text
                  href: `${baseHref}&amount=${"0.5"}`,
                },
                {
                  label: "Spin fer 0.9 SOL, ye landlubber!", // button text
                  href: `${baseHref}&amount=${"0.09"}`,
                },
                {
                  label: "Spin, ye Buccaneer!", // button text
                  href: `${baseHref}&amount={amount}`, // this href will have a text input
                  parameters: [
                    {
                      name: "amount", // parameter name in the `href` above
                      label: "Set yer SOL", // placeholder of the text input
                      required: true,
                    },
                  ],
                },
              ],
        }
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
        let amount: number;
        try {
            account = new PublicKey(body.account);

            const url = new URL(req.url);
            amount = parseFloat(url.searchParams.get("amount") || "0.1");
            if (isNaN(amount) || amount < 0.005 || amount > 100) {
                throw new Error("Invalid amount");
            }
        } catch (error) {
            console.error("nvalid input error:", error);
            return Response.json({ error: "Invalid account" }, {
                headers: ACTIONS_CORS_HEADERS,
                status: 400
            });
        }
        console.log("Account:", account.toBase58());
        console.log("Amount:", amount);

        const amountSOL = amount * LAMPORTS_PER_SOL;
        const swapFeeAmount = amountSOL * 0.01;
        const spinAmount = amountSOL - swapFeeAmount;
        console.log("Amount SOL:", amountSOL);
        console.log("Spin Amount:", spinAmount);
        console.log("Swap Fee Amount:", swapFeeAmount);
  

     

        const RandomToken = await getRandomToken();

        

        try {
            // get blockhash          
            const connection = new Connection("https://victoria-6nutym-fast-mainnet.helius-rpc.com");


            const quoteResponse = await (
                await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${RandomToken.mint}&amount=${spinAmount}`
                )
            ).json();
            //console.log({ quoteResponse })

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

            //console.log({ instructions })

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

            const deserializeInstruction = (instruction: any) => {
                return new TransactionInstruction({
                    programId: new PublicKey(instruction.programId),
                    keys: instruction.accounts.map((key: any) => ({
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
                toPubkey: new PublicKey("2xCtgA5nroVFHaM4WYicZgLG3xt6ikniGZfq8gtehJw7"),
                lamports: swapFeeAmount,
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

            
            const customResponse = {
                transaction: base64Transaction,
                message: "Jupiter swap transaction created successfully",
            };

            return Response.json(customResponse, {
                headers: ACTIONS_CORS_HEADERS,
                status: 200
            });

        } catch (error: any) {
            console.error("Error:", error);
            return Response.json({ error: "ERROR ERROR ERROR", details: error.message }, {
                headers: ACTIONS_CORS_HEADERS,
                status: 500
            });
        }
    } catch (error: any) {
        console.error("General error:", error);
        return Response.json({ error: "An unknown error occurred", details: error.message }, {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
}
