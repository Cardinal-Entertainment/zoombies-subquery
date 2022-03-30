import {Transaction,Sum,ZoomPerDay,RarityPerDay,LogCardMinted,MintedType,LogPackOpened,LogSponsorReward,LogDailyReward,LogRewardBooster,LogSacrificeNFT,NftTransfer} from "../types";
import { MoonbeamEvent} from '@subql/contract-processors/dist/moonbeam';
import { BigNumber } from "ethers";

// Setup types from ABI
type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; value: BigNumber; };
type CardMintedEventArgs = [string, BigNumber, number, BigNumber] & {buyer: string; tokenId: bigint; cardTypeId: number; editionNumber: bigint; };
type LogPackOpenedEventArgs = [string, number] & {buyer: string; rarity:number; };
type LogSponsorRewardEventArgs = [string, string, BigNumber] & {sponsor:string, affiliate:string, zoomReward:bigint};
type LogDailyRewardEventArgs = [string, BigNumber] & {player:string, newBoosterBalance:bigint; };
type LogRewardBoostersEventArgs = [string, BigNumber] & {winner:string, boostersAwarded:bigint; };
type LogSacrificeNFTEventArgs = [string, BigNumber, BigNumber, BigNumber] & {owner:string, tokenId:bigint, cardTypeId:bigint, zoomGained:bigint; };
type NFTTransferEventArgs = [string, string, BigNumber] & { from: string; to: string; tokenId: bigint; };


function createSum(id: string): Sum {
  const entity = new Sum(id);
  entity.mintedTotal = BigInt(0);
  entity.burnedTotal = BigInt(0);
  return entity;
}

function createTrackedPerDay(timestamp: string): ZoomPerDay {
  const entity = new ZoomPerDay(timestamp);
  entity.minted = BigInt(0);
  entity.burned = BigInt(0);
  return entity;
}

function createRarityPerDay(timestamp: string): RarityPerDay {
  const entity = new RarityPerDay(timestamp);
  entity.diamond = BigInt(0);
  entity.platinum = BigInt(0);
  entity.epic = BigInt(0);
  entity.rare = BigInt(0);
  entity.uncommon = BigInt(0);
  entity.common = BigInt(0);
  return entity;
}

function createMintedTypes(cardTypeId: string): MintedType {
  const entity = new MintedType(cardTypeId);
  return
}

export async function handleMoonriverEvent(event: MoonbeamEvent<TransferEventArgs>): Promise<void> {
    const transaction = new Transaction(event.transactionHash);
    transaction.blockNumber = Math.trunc(event.blockNumber);
    transaction.blockTimestamp = event.blockTimestamp;
    transaction.value = event.args.value.toBigInt();
    transaction.from = event.args.from;
    transaction.to = event.args.to;
    transaction.contractAddress = event.address;
    await transaction.save();

    //Create entity to hold TOTAL minted/burned
    let entity = await Sum.get("1");
    if(entity === undefined){
      entity = createSum("1");
    }

    //Create entity to hold Summary minted/burned Per Day
    const date = Date.parse(new Date(transaction.blockTimestamp).toISOString().split('T')[0]).toString();

    let zpd = await ZoomPerDay.get(date);
    if(zpd === undefined){
      zpd = createTrackedPerDay(date);
    }

    //Track our totals
    if(transaction.from == "0x0000000000000000000000000000000000000000") {
      entity.mintedTotal = BigInt(entity.mintedTotal) + event.args.value.toBigInt();
      zpd.minted = BigInt(zpd.minted) + event.args.value.toBigInt();
    }
    if(transaction.to == "0x0000000000000000000000000000000000000000") {
      entity.burnedTotal = BigInt(entity.burnedTotal) + event.args.value.toBigInt();
      zpd.burned = BigInt(zpd.burned) + event.args.value.toBigInt();
    }

    await entity.save();
    await zpd.save();
}

export async function handleLogCardMintedEvent(event: MoonbeamEvent<CardMintedEventArgs>): Promise<void> {
  const card = new LogCardMinted(event.transactionHash);
  card.blockNumber = event.blockNumber;
  card.blockTimestamp = event.blockTimestamp;
  card.buyer = event.args.buyer;
  card.tokenId = event.args.tokenId;
  card.cardTypeId = event.args.cardTypeId;
  card.editionNumber = event.args.editionNumber;
  await card.save();

  let typeMinted = await MintedType.get((event.args.cardTypeId).toString());
  if(typeMinted === undefined){
    typeMinted = new MintedType((event.args.cardTypeId).toString());
    typeMinted.blockTimestamp = event.blockTimestamp;
    typeMinted.cardTypeId = event.args.cardTypeId;
    await typeMinted.save();
  }
}

export async function handleLogPackOpenedEvent(event: MoonbeamEvent<LogPackOpenedEventArgs>): Promise<void> {
  const pack = new LogPackOpened(event.transactionHash);
  pack.blockNumber = event.blockNumber;
  pack.blockTimestamp = event.blockTimestamp;
  pack.buyer = event.args.buyer;
  pack.rarity = event.args.rarity;
  await pack.save();

  const date = Date.parse(new Date(event.blockTimestamp).toISOString().split('T')[0]).toString();

  let rpd = await RarityPerDay.get(date);
  if(rpd === undefined){
    rpd = createRarityPerDay(date);
  }

  switch (event.args.rarity) {
    case 1:
          rpd.diamond = BigInt(rpd.diamond) + BigInt(1);
      break;
    case 2:
          rpd.platinum = BigInt(rpd.platinum) + BigInt(1);
      break;
    case 3:
          rpd.epic = BigInt(rpd.epic) + BigInt(1);
      break;
    case 4:
          rpd.rare = BigInt(rpd.rare) + BigInt(1);
      break;
    case 5:
          rpd.uncommon = BigInt(rpd.uncommon) + BigInt(1);
      break;
    case 6:
          rpd.common = BigInt(rpd.common) + BigInt(1);
      break;
    default:
          logger.info("Error in storing LogPackOpenedEvent");
          logger.info(event);
      break;
  }

  await rpd.save();
}

export async function handleLogSponsorRewardEvent(event: MoonbeamEvent<LogSponsorRewardEventArgs>): Promise<void> {
  const reward = new LogSponsorReward(event.transactionHash);
  reward.blockNumber = event.blockNumber;
  reward.blockTimestamp = event.blockTimestamp;
  reward.sponsor = event.args.sponsor;
  reward.affiliate = event.args.affiliate;
  reward.zoomReward = event.args.zoomReward;

  await reward.save();
}

export async function handleLogDailyRewardEvent(event: MoonbeamEvent<LogDailyRewardEventArgs>): Promise<void> {
  const reward = new LogDailyReward(event.transactionHash);
  reward.blockNumber = event.blockNumber;
  reward.blockTimestamp = event.blockTimestamp;
  reward.player = event.args.player;
  reward.newBoosterBalance = event.args.newBoosterBalance;

  await reward.save();
}

export async function handleLogRewardBoostersEvent(event: MoonbeamEvent<LogRewardBoostersEventArgs>): Promise<void> {
  const reward = new LogRewardBooster(event.transactionHash);
  reward.blockNumber = event.blockNumber;
  reward.blockTimestamp = event.blockTimestamp;
  reward.winner = event.args.winner;
  reward.boostersAwarded = event.args.boostersAwarded;

  await reward.save();
}

export async function handleLogSacrificeNFTEvent(event: MoonbeamEvent<LogSacrificeNFTEventArgs>): Promise<void> {
  const sac = new LogSacrificeNFT(event.transactionHash);
  sac.blockNumber = event.blockNumber;
  sac.blockTimestamp = event.blockTimestamp;
  sac.owner = event.args.owner;
  sac.tokenId = event.args.tokenId;
  sac.cardTypeId = event.args.cardTypeId;
  sac.zoomGained = event.args.zoomGained;

  await sac.save();
}

export async function handleNFTTransferEvent(event: MoonbeamEvent<NFTTransferEventArgs>): Promise<void> {
  const nftTransfer = new NftTransfer(event.transactionHash);
  nftTransfer.blockNumber = event.blockNumber;
  nftTransfer.blockTimestamp = event.blockTimestamp;
  nftTransfer.from = event.args.from;
  nftTransfer.to = event.args.to;
  nftTransfer.tokenId = event.args.tokenId;

  await nftTransfer.save();
}
