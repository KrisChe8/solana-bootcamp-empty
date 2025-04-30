import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

const TOKEN_2022_PROGRAM_ID = new PublicKey(
  "TokenzQdYwepx6a5KSmwkvkYyGZgB5CWs3iWvzwpBoP"
);

export const MyTokensPage = () => {
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<
    { mint: string; amount: number; decimals: number }[]
  >([]);

  useEffect(() => {
    const fetchTokens = async () => {
      if (!connected || !publicKey) return;
      const connection = new Connection("https://api.devnet.solana.com");

      try {
        const [classicTokens, token2022] = await Promise.all([
          connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: TOKEN_PROGRAM_ID,
          }),
          connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: TOKEN_2022_PROGRAM_ID,
          }),
        ]);

        const allTokens = [...classicTokens.value, ...token2022.value].map(
          (acc) => {
            const info = acc.account.data.parsed.info;
            return {
              mint: info.mint,
              amount: info.tokenAmount.uiAmount,
              decimals: info.tokenAmount.decimals,
            };
          }
        );

        setTokens(allTokens);
      } catch (err) {
        console.error("Error fetching token accounts:", err);
      }
    };

    fetchTokens();
  }, [connected, publicKey]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Token-2022 Tokens</h2>
      {tokens.length === 0 ? (
        <p>No Token-2022 tokens found.</p>
      ) : (
        <ul className="space-y-2">
          {tokens.map((t, i) => (
            <li key={i} className="border p-2 rounded">
              <strong>Mint:</strong> {t.mint} <br />
              <strong>Amount:</strong> {t.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
