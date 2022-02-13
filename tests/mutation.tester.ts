import {
  MakerTokenConfig,
  MutationConfig,
  MutationWrapper,
  RequiredUnits,
  TakerTokenConfig,
  TransmuterWrapper,
  VaultAction,
} from "../src";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { expectTX } from "@saberhq/chai-solana";
import {
  GEM_BANK_PROG_ID,
  GemBankClient,
  isKp,
  toBN,
} from "@gemworks/gem-farm-ts";
import { BN } from "@project-serum/anchor";
import { makeSDK } from "./workspace";
import { getATAAddress } from "@saberhq/token-utils";
import { expect } from "chai";

const bankIdl = require("./programs/gem_bank.json");

export class MutationTester {
  // --------------------------------------- state & constructor

  transmuter: TransmuterWrapper;
  mutation: MutationWrapper;

  //maker
  makerMintA: PublicKey;
  makerMintB?: PublicKey;
  makerMintC?: PublicKey;

  //taker
  takerMintA: PublicKey;
  takerAccA: PublicKey;
  takerVaultA: PublicKey;

  takerMintB: PublicKey;
  takerAccB: PublicKey;
  takerVaultB: PublicKey;

  takerMintC: PublicKey;
  takerAccC: PublicKey;
  takerVaultC: PublicKey;

  constructor(
    readonly taker = Keypair.generate(),
    readonly sdk = makeSDK(),
    readonly conn = sdk.provider.connection,
    readonly maker = sdk.provider.wallet.publicKey,
    readonly makerTokenAmount = toBN(10),
    readonly takerTokenAmount = toBN(5),
    readonly gb = new GemBankClient(
      sdk.provider.connection,
      sdk.provider.wallet as any,
      bankIdl,
      GEM_BANK_PROG_ID
    )
  ) {}

  // --------------------------------------- ix call wrappers

  prepareTransmuter = async (bankCount: number) => {
    const { transmuterWrapper, tx } = await this.sdk.initTransmuter(bankCount);
    await expectTX(tx, "init new transmuter").to.be.fulfilled;
    this.transmuter = transmuterWrapper;

    console.log("transmuter ready");
  };

  prepareMutation = async ({
    vaultAction = VaultAction.Lock,
    mutationTimeSec = toBN(0),
    takerTokenB = null,
    takerTokenC = null,
    makerTokenBAmount = null,
    makerTokenCAmount = null,
    reversible = false,
  }: {
    vaultAction?: any;
    mutationTimeSec?: BN;
    takerTokenB?: TakerTokenConfig;
    takerTokenC?: TakerTokenConfig;
    makerTokenBAmount?: BN;
    makerTokenCAmount?: BN;
    reversible?: boolean;
  }) => {
    //create any relevant maker mints
    [this.makerMintA] = await this.sdk.createMintAndATA(this.makerTokenAmount);
    if (makerTokenBAmount) {
      [this.makerMintB] = await this.sdk.createMintAndATA(makerTokenBAmount);
    }
    if (makerTokenCAmount) {
      [this.makerMintC] = await this.sdk.createMintAndATA(makerTokenCAmount);
    }

    //setup & fill up any relevant taker vaults
    ({
      vault: this.takerVaultA,
      takerMint: this.takerMintA,
      takerAcc: this.takerAccA,
    } = await this.prepareTakerVaults(this.transmuter.bankA));
    if (takerTokenB) {
      ({
        vault: this.takerVaultB,
        takerMint: this.takerMintB,
        takerAcc: this.takerAccB,
      } = await this.prepareTakerVaults(this.transmuter.bankB));
    }
    if (takerTokenC) {
      ({
        vault: this.takerVaultC,
        takerMint: this.takerMintC,
        takerAcc: this.takerAccC,
      } = await this.prepareTakerVaults(this.transmuter.bankC));
    }

    const config: MutationConfig = {
      takerTokenA: {
        gemBank: this.transmuter.bankA,
        requiredAmount: toBN(this.takerTokenAmount),
        requiredUnits: RequiredUnits.RarityPoints,
        vaultAction,
      },
      takerTokenB,
      takerTokenC,
      makerTokenA: {
        mint: this.makerMintA,
        totalFunding: toBN(this.makerTokenAmount),
        amountPerUse: toBN(this.makerTokenAmount),
      },
      makerTokenB: makerTokenBAmount
        ? {
            mint: this.makerMintB,
            totalFunding: toBN(makerTokenBAmount),
            amountPerUse: toBN(makerTokenBAmount),
          }
        : null,
      makerTokenC: makerTokenCAmount
        ? {
            mint: this.makerMintC,
            totalFunding: toBN(makerTokenCAmount),
            amountPerUse: toBN(makerTokenCAmount),
          }
        : null,
      price: {
        priceLamports: toBN(LAMPORTS_PER_SOL),
        reversalPriceLamports: toBN(LAMPORTS_PER_SOL),
      },
      mutationTimeSec,
      reversible,
    };

    const { mutationWrapper, tx } = await this.sdk.initMutation(
      config,
      this.transmuter.key,
      toBN(1)
    );
    await expectTX(tx, "init new mutation").to.be.fulfilled;
    this.mutation = mutationWrapper;

    console.log("mutation ready");
  };

  prepareTakerVaults = async (bank: PublicKey) => {
    //fund taker
    await this.sdk.provider.connection
      .requestAirdrop(this.taker.publicKey, 3 * LAMPORTS_PER_SOL)
      .then((sig) =>
        this.sdk.provider.connection.confirmTransaction(sig, "confirmed")
      );

    //create vaults
    const { vault } = await this.gb.initVault(
      bank,
      this.taker,
      this.taker,
      this.taker.publicKey,
      "abc"
    );

    //create tokens
    const [takerMint, takerAcc] = await this.sdk.createMintAndATA(
      toBN(this.takerTokenAmount),
      this.taker
    );

    //deposit tokens
    await this.gb.depositGem(
      bank,
      vault,
      this.taker,
      toBN(this.takerTokenAmount),
      takerMint,
      takerAcc
    );

    console.log("vault set up & funded");

    return { vault, takerMint, takerAcc };
  };

  // --------------------------------------- loader

  static load = async (): Promise<MutationTester> => {
    let tester = new MutationTester();
    await tester.prepareTransmuter(3);

    return tester;
  };

  // --------------------------------------- verifiiers

  verifyTakerReceivedMakerTokens = async (amount?: BN) => {
    const makerATA = await getATAAddress({
      mint: this.makerMintA,
      owner: this.taker.publicKey,
    });
    expect(
      (await this.sdk.provider.connection.getTokenAccountBalance(makerATA))
        .value.amount
    ).to.eq(amount ? amount.toString() : this.makerTokenAmount.toString());

    console.log("received tokens valid");
  };

  verifyVault = async (locked: boolean, owner: PublicKey | Keypair) => {
    const vaultAcc = await this.gb.fetchVaultAcc(this.takerVaultA);

    //verify owner & lock
    expect(vaultAcc.owner.toBase58()).to.be.eq(
      isKp(owner)
        ? (<Keypair>owner).publicKey.toBase58()
        : (<PublicKey>owner).toBase58()
    );
    expect(vaultAcc.locked).to.be.eq(locked);

    //verify taker can/can't withdraw gems
    if (!locked) {
      await this.gb.withdrawGem(
        this.transmuter.bankA,
        this.takerVaultA,
        owner,
        toBN(this.takerTokenAmount),
        this.takerMintA,
        Keypair.generate().publicKey
      );
    } else {
      await expect(
        this.gb.withdrawGem(
          this.transmuter.bankA,
          this.takerVaultA,
          owner,
          toBN(this.takerTokenAmount),
          this.takerMintA,
          Keypair.generate().publicKey
        )
      ).to.be.rejectedWith("0x1784");
    }

    console.log("vault valid");
  };
}