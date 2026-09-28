import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import * as crypto from "crypto";

describe("parakletos_quorum", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new PublicKey("FsRpXPvwNbCaCU3CwC9UW9eFrwJYLCaq4hFVFhXyNd3w");
  const steward = provider.wallet;

  // Primary Node (Mothership / OLIVE) & Secondary Node (Exodus Shard / OLIE)
  const primaryNode = Keypair.generate();
  const secondaryNode = Keypair.generate();

  const agentId = "NOHARM__ETHICAL-USE-BOUNDARY__OBS__20260927_v0.1";
  const purpose = "NOHARM";
  const responsibility = "ETHICAL-USE-BOUNDARY";

  let agentPassportPda: PublicKey;

  before(async () => {
    console.log("\n1. Requesting Devnet SOL Airdrop for Dual-Node Quorum Keypairs...");
    try {
      const sig1 = await provider.connection.requestAirdrop(primaryNode.publicKey, 1000000000);
      const sig2 = await provider.connection.requestAirdrop(secondaryNode.publicKey, 1000000000);
      await provider.connection.confirmTransaction(sig1);
      await provider.connection.confirmTransaction(sig2);
      console.log("   🟢 Keypairs funded on Devnet.");
    } catch (err) {
      console.log("   ⚠️ Airdrop rate-limited or failed; continuing with provider wallet.");
    }

    [agentPassportPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("agent-passport"),
        steward.publicKey.toBuffer(),
        Buffer.from(agentId)
      ],
      programId
    );
    console.log(`   Agent Passport PDA: ${agentPassportPda.toBase58()}`);
  });

  it("Initializes Agent Passport on-chain", async () => {
    console.log("\n2. Executing initialize_agent_passport Instruction...");
    
    // Construct instruction data discriminator and parameters
    const tx = await provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        new anchor.web3.TransactionInstruction({
          keys: [
            { pubkey: agentPassportPda, isSigner: false, isWritable: true },
            { pubkey: steward.publicKey, isSigner: true, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          programId,
          data: Buffer.concat([
            Buffer.from([0]), // Instruction Discriminator
            Buffer.from(agentId),
            Buffer.from(purpose),
            Buffer.from(responsibility)
          ])
        })
      )
    );

    console.log(`   ✅ Passport Initialized! Tx Signature: ${tx}`);
  });

  it("Executes Dual-Node Hardware Quorum Verification", async () => {
    console.log("\n3. Executing record_quorum_execution Dual-Node Verification...");

    const actionHash = crypto.createHash('sha256').update("NOHARM_LINEAGE_PASSED").digest();
    const noharmLineagePass = true;

    const tx = await provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        new anchor.web3.TransactionInstruction({
          keys: [
            { pubkey: agentPassportPda, isSigner: false, isWritable: true },
            { pubkey: primaryNode.publicKey, isSigner: true, isWritable: false },
            { pubkey: secondaryNode.publicKey, isSigner: true, isWritable: false },
          ],
          programId,
          data: Buffer.concat([
            Buffer.from([1]), // Instruction Discriminator
            actionHash,
            Buffer.from([noharmLineagePass ? 1 : 0])
          ])
        })
      ),
      [primaryNode, secondaryNode]
    );

    console.log(`   ✅ Dual-Node Quorum Signature Verified! Tx Signature: ${tx}`);
  });
});
