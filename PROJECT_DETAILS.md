# Frogger - Tier 2 Specification

## Overview
A blockchain-native arcade game where players navigate a "frog" across lanes of live on-chain transactions, smart contract calls, and DeFi activity. Each lane represents real mempool/blockchain data streams—dodge whale trades, time your jumps through gas spikes, and reach the other side to claim rewards.

## Core Concept
Inspired by the classic Frogger arcade game, reimagined for crypto. Instead of cars and logs, players navigate through streams of actual blockchain transactions. The "highway" is alive: transactions appear as obstacles or platforms based on real-time chain activity. Survive the chaos of on-chain activity to earn $FROG tokens.

## Technical Architecture

### Smart Contracts (Solidity/Base)
- **FroggerCore.sol**: Game session management, score tracking, reward distribution
- **LaneOracle.sol**: Chainlink integration for real-time mempool/block data feeds
- **FrogToken.sol**: ERC-20 utility token with play-to-earn mechanics
- **LeaderboardRegistry.sol**: On-chain high scores, seasonal rankings
- **SkinNFT.sol**: ERC-721 cosmetic frog skins with rarity tiers
- **TournamentManager.sol**: Prize pool escrow, bracket management

### Data Integration Layer
- **Transaction Feed**: Real-time mempool data via WebSocket RPC
- **Block Stream**: New blocks as "safe zones" between lane crossings
- **DEX Activity**: Uniswap/Aerodrome swaps as fast-moving obstacles
- **Whale Alerts**: Large transfers (>$100k) as dangerous "trucks"
- **Gas Tracker**: Gas price fluctuations affect game speed

### Frontend (Next.js + Phaser.js)
- 2D arcade-style game engine with pixel art aesthetic
- Real-time transaction visualization as game obstacles
- Responsive controls (keyboard, touch, gamepad)
- Wallet integration for seamless play sessions
- Spectator mode with live leaderboard

## Token Economics ($FROG)

### Supply & Distribution
- **Total Supply**: 420,690,000 $FROG
- **Initial Liquidity**: 25% (105M)
- **Play-to-Earn Pool**: 35% (147M) - unlocks per successful crossing
- **Team & Development**: 10% (42M) - 1-year cliff, 3-year vest
- **Treasury/DAO**: 20% (84M)
- **Launch Airdrop**: 10% (42M) - for early players

### Utility
- **Game Entry**: Stake 10 $FROG per session (refunded on completion)
- **Power-Ups**: Purchase temporary abilities (shield, speed boost)
- **Skin Marketplace**: Buy/sell/trade cosmetic NFTs
- **Tournament Entry**: Stake for competitive prize pools
- **Governance**: Vote on lane configurations, game parameters

### Sink Mechanisms
- Failed crossings forfeit entry stake (50% burned, 50% to pool)
- Power-up consumption
- Premium skin crafting
- Tournament entry fees (rake to treasury)

## Gameplay Systems

### Lane Types
| Lane | Obstacle Type | Speed | Behavior |
|------|---------------|-------|----------|
| Mempool Pending | Pending TXs | Slow | Predictable, can be timed |
| DEX Swaps | Token swaps | Medium | Cluster in groups |
| NFT Mints | Mint TXs | Fast bursts | Come in waves |
| Whale Transfers | Large TXs | Very Fast | Single high-damage hits |
| Contract Calls | Smart contract interactions | Variable | Unpredictable patterns |
| Bridge Activity | Cross-chain TXs | Slow | Wide, hard to dodge |

### Safe Zones
- **Block Confirmations**: New blocks create brief pauses between waves
- **Gas Dips**: Low gas periods slow obstacle speed
- **Lily Pads**: Stake positions that create temporary platforms

### Scoring System
```
Base Points:
- Lane crossed: 100 points
- Clean crossing (no hits): 2x multiplier
- Speed bonus: +10 points per second under par

Bonus Points:
- Whale dodge: 500 points
- Perfect round (no damage): 5x final multiplier
- Chain combo: +50 points per consecutive clean lane
```

### Lives & Damage
- **Starting Lives**: 3 hearts
- **Small TX Hit**: 0.5 heart damage
- **Medium TX Hit**: 1 heart damage  
- **Whale Hit**: Instant death (unless shielded)
- **Heart Regeneration**: Reach safe zone to heal 0.5 hearts

### Power-Ups (Purchasable with $FROG)
| Power-Up | Effect | Duration | Cost |
|----------|--------|----------|------|
| Shield | Block one hit | Single use | 5 $FROG |
| Speed Boost | 2x movement speed | 10 seconds | 3 $FROG |
| Slow-Mo | Halve obstacle speed | 5 seconds | 10 $FROG |
| Ghost | Phase through obstacles | 3 seconds | 15 $FROG |
| Magnet | Auto-collect nearby tokens | 15 seconds | 8 $FROG |

## Progression System

### Player Ranks
| Rank | Title | Crossings Required | Unlock |
|------|-------|-------------------|--------|
| 1 | Tadpole | 0 | Basic frog |
| 2 | Hopper | 10 | Color customization |
| 3 | Leaper | 50 | Second skin slot |
| 4 | Jumper | 200 | Power-up discount 10% |
| 5 | Frog King | 1,000 | Exclusive crown skin |
| 6 | Blockchain Hopper | 5,000 | Golden frog, DAO voting power |

### Seasonal Challenges
- **Daily Missions**: "Cross 5 lanes without damage" - 50 $FROG
- **Weekly Events**: "Dodge 100 whale transactions" - Rare skin
- **Monthly Tournaments**: Prize pool brackets, top 100 rewards

## NFT Skins

### Rarity Tiers
| Tier | Drop Rate | Examples |
|------|-----------|----------|
| Common | 60% | Classic Green, Pond Frog |
| Uncommon | 25% | Neon Frog, Pixel Pepe |
| Rare | 10% | Golden Frog, Diamond Skin |
| Epic | 4% | Mecha Frog, Ethereal Spirit |
| Legendary | 1% | Satoshi Frog, Vitalik Tribute |

### Skin Attributes
- **Visual Only**: Skins provide no gameplay advantage
- **Trail Effects**: Rare+ skins leave visual trails
- **Sound Effects**: Epic+ skins have custom hop sounds
- **Leaderboard Flair**: Legendary skins display special badge

## Multiplayer Modes

### Race Mode
- 4 players start simultaneously
- First to cross 10 lanes wins
- Obstacles shared (same transaction feed)
- Collision between frogs causes knockback

### Battle Royale
- 100 players, shrinking play area
- Last frog standing wins
- Eliminated players become obstacles
- 10-minute rounds

### Team Relay
- 4-player teams
- Each player completes 3 lanes then tags next
- Fastest cumulative time wins
- Strategic power-up sharing

## Integration with app.fun

### Launch Mechanics
- Token launches on app.fun bonding curve
- Early buyers get exclusive "Genesis Frog" skin
- Milestone unlocks:
  - $50k market cap: Race Mode enabled
  - $100k: Tournament system live
  - $250k: Battle Royale mode
  - $500k: Mobile app release

### Revenue Sharing
- 1% of all token swaps → Prize pool treasury
- Skin marketplace 5% royalty → Development fund
- Tournament rake 10% → $FROG buyback and burn

## Technical Requirements

### Performance Targets
- **Latency**: <100ms input response
- **TPS**: Handle 1000+ obstacles on screen
- **Mobile**: 60fps on modern smartphones
- **Data**: <5MB initial load, streaming updates

### Chain Integration
- **Primary**: Base (low fees for microtransactions)
- **Data Sources**: 
  - Base mempool (primary obstacles)
  - Ethereum mainnet (whale alerts)
  - Cross-chain bridges (special events)

## Roadmap

### Phase 1: Launch
- Core single-player gameplay
- Basic token integration
- 10 initial skins
- Leaderboard system

### Phase 2: Social
- Multiplayer race mode
- Friend system
- Replay sharing
- Twitch integration

### Phase 3: Competition
- Tournament system
- Prize pool mechanics
- Seasonal rankings
- Esports partnerships

### Phase 4: Expansion
- Battle Royale mode
- Mobile native apps
- Additional chain integrations
- User-generated skin marketplace

## Marketing Hooks

- "Cross the Blockchain or Get Rugged"
- "Dodge Whales, Stack $FROG"
- "The Most Dangerous Road? The Mempool."
- "Your Grandma Played Frogger. You Play On-Chain."
- "Every Transaction is an Obstacle. Every Block is a Breath."
