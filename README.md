![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# KarunyaSetu: Decentralized Disaster Relief Protocol

> "From Generous Hearts to Deserving Hands – A Bridge of Hope and Healing."

---

## 📌 Problem Statement

Problem Statement 4 - Craft the Future of Onchain Consumer Experiences with Base.


---

## 🎯 Objective

KarunyaSetu solves the **inefficiencies, corruption, and delays in traditional disaster relief** by providing a decentralized platform that ensures **instant aid delivery, privacy-preserving victim verification, and transparent fund management**. It serves disaster victims, donors, NGOs, and governments, offering a trustless, tamper-proof system to deliver aid where it’s needed most. Multilingual AI chatbots improve accessibility to the victims as well as the donors.

---

## 🧠 Team & Approach

### Team Name:  
`HashMinds`

### Team Members:  
- Nandeesh aka 0x02AUDITOR ([Twitter](https://x.com/0x02Auditor)) – Smart Contracts, DAO Governance  
- Sribabu aka 5T3113E_10RD ([Twitter](https://x.com/5R1B4BU)) – Full Stack Web3 Developer
- Bhanu Teja ([Twitter](https://x.com/BhanuTe56789860)) – Backend Integration
- Umesh Chandra ([Twitter](https://x.com/0x_u1a01)) – Frontend/Backend Integration

### Our Approach:  
- **Why this problem?**: We were deeply moved by the inefficiencies and tragedies caused by delays in disaster relief, especially during events like floods, fires, and cyclones. The lack of transparency and the exploitation of relief funds inspired us to reimagine the entire system — one where trust is automated, and help reaches those who truly need it.  
- **Key challenges addressed**: Funds were delayed due to too many manual steps, and fake claims wasted money.Victims couldn’t access help easily, especially without ID or if they didn’t speak English. 
- **Breakthroughs**: We used ZKadhaar to check location and identity without exposing details.We added DAO voting, built chatbots, and made the whole process automatic with smart contracts.
- The following diagram illustrates the overall flow of the KarunyaSetu platform and its key components:
![Project Flow](https://raw.githubusercontent.com/Sribabu-Mandraju/aidChain_frontend/d3fa2957c4aecfecb536228c9a54da1164029fdf/src/assets/KarunyaSetuFlow.png)

---

## 🛠️ Tech Stack

### Core Technologies Used:
- **Frontend**: React.js, Tailwind CSS, Web3 Wallet Integration (MetaMask, WalletConnect)  
- **Backend**: Node.js, APIs for victim validation and campaign management  
- **Blockchain**: Solidity (Smart Contracts), zkProofs (Victim Verification), EVM-Compatible Chains  
- **Tools**: Base Onchain Kit (Coinbase smart Wallet & Contract Interaction)
  
### Sponsor Technologies Used:

- ✅ **Base**: Used OnchainKit for seamless blockchain wallet and smart contract interactions.  
- ✅ **Groq**: For developing multilingual chatbot and disaster summary generator model.  
- ❌ **Monad**: _Not used in this project._  
- ❌ **Fluvio**: _Not used in this project._  
- ❌ **Screenpipe**: _Not used in this project._  
- ❌ **Stellar**: _Not used in this project._

---

## ✨ Key Features

- ✅ **DAO-Driven Campaigns**: Community-proposed and voted relief efforts via a transparent governance system.  
- ✅ **Zero-Knowledge Victim Verification**: Privacy-preserving Aadhaar + GPS validation using zkProofs.  
- ✅ **Automated Fund Disbursement**: Smart contracts ensure instant, trustless payouts to verified victims.  
- ✅ **Donor NFT Rewards**: Unique NFTs as gratitude tokens for contributions.  
- ✅ **Real-Time Transparency**: All transactions auditable on-chain for full accountability.
- ✅ **Multilingual ChatBot**: Interacts in multiple Indian languages to assist donors and victims with their queries.
- ✅ **Disaster Summary Bot**: Gives DAO members realtime updates on disasters before voting.

![Web App](https://github.com/user-attachments/assets/cc717ce9-ea7d-4ed2-beee-2f8f1dc6e6b4)  
**Web App**: The main interface for creating campaigns, donating, and tracking relief efforts.

---

## 📽️ Demo & Deliverables

- **Web App**:[KarunyaSetu_deployed_link](https://karunyasethu.vercel.app)
- **Demo Video Link**:[KarunyaSetu_YouTube_demo_link] [(https://youtu.be/UVxC1TIaTFY)]  
- **Pitch Deck / PPT Link**:[KarunyaSetu_ppt_link](https://drive.google.com/file/d/1oBI9Fs8TxOXX8YpEbhgBDwSWO6COOyAU/view?usp=sharing)


---

## ✅ Tasks & Bonus Checklist

- [✅] **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form**  
- [✅] **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**  
- [✅] **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**  

---

## 🧪 How to Run the Project

### Requirements:
- Node.js (v16 or higher)
- MetaMask or compatible Web3 wallet
- Testnet ETH (via [Coinbase_developer_platform](https://portal.cdp.coinbase.com/products/faucet)

### Local Setup:
## frontend
```bash
# Clone the repo
git clone https://github.com/Sribabu-Mandraju/karunyasetu

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

```

```bash
## deploying contracts
cd contracts

forge script script/BaseDeployments.s.sol:BaseDeployments --private-key $your-private-key --rpc-url $rpc-url --broadcast -vvvvv
```

---

## 🦠 Future Scope

📈 **Discord DAO Bot**: Real-time voting and fund updates.  
🛡️ **National Disaster Alert Integration**: Auto-trigger DAO proposals during crises.  
🌐 **Social Media Badges**: NFT/QR-coded donor recognition.  
🕒 **Live Timers**: For registration, voting, and funding phases.  
📊 **Donor Dashboards**: Personalized impact and giving history.
🕒 **RealTime Notification System**:To provide Realtime updates about the campaigns to the citizens and governance.

---

## 📌 Resources / Credits

**APIs**: Aadhaar API (for zkProof integration), Base Onchain Kit  
**Open Source Libraries**: Foundry , Base-Sepolia RPC , ANON AAdhar , Leaflet-map for Locations
**Acknowledgements**: Thanks to the hackathon organizers and Base for providing robust blockchain tools.

## 🏁 Final Words

Building KarunyaSetu was a thrilling journey! We tackled complex challenges like zkProof integration and DAO governance while learning to balance decentralization with usability. The late-night brainstorms, countless coffee runs, and breakthrough moments made this hackathon unforgettable. Shout-out to our mentors and the vibrant hackathon community for the support!

