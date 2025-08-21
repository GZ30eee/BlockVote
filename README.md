<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/455eec85-f271-49d3-98aa-57297eee577c" />

# BlockVote: Decentralized Blockchain Voting Platform

BlockVote is a decentralized voting platform built on the Ethereum blockchain, designed to provide secure, transparent, and tamper-proof elections. Inspired by the inefficiencies and vulnerabilities of traditional paper-based voting systems, BlockVote leverages blockchain technology to eliminate fraud, ensure vote verifiability, and enhance accessibility. The platform supports voters in casting secure votes via their Ethereum wallets and enables administrators to manage elections with robust controls, all while maintaining an immutable audit trail.

## Features

- **Secure Authentication**: Users authenticate using MetaMask or other Ethereum wallets, ensuring only authorized voters can participate.
- **Tamper-Proof Voting**: Votes are recorded on the Ethereum blockchain, making them immutable and verifiable.
- **Transparent Results**: Real-time vote tallies are displayed through dynamic charts, with transaction histories accessible for auditing.
- **Admin Controls**: Authorized administrators can create, manage, and end elections, restricted to the election creator’s wallet address.
- **User-Friendly Interface**: Built with Next.js and React, the platform offers an intuitive dashboard for voters and administrators, including vote visualizations and election notifications.
- **Scalability**: Simulated thousands of votes across numerous elections, demonstrating reliability for various use cases, from school elections to corporate governance.

## Technology Stack

- **Backend**:
  - **Solidity**: Smart contracts (`Election.sol`) manage election creation, voting, and data retrieval on the Ethereum blockchain.
  - **ethers.js**: Interfaces with the Ethereum blockchain for wallet connections and contract interactions (`ElectionContract.ts`).
- **Frontend**:
  - **Next.js**: Framework for server-side rendering and routing.
  - **React**: Component-based UI for dynamic and responsive interfaces.
  - **Shadcn UI**: Reusable UI components for buttons, cards, tables, and modals.
  - **Chart.js**: Powers bar and doughnut charts for vote distribution (`election-charts.tsx`).
  - **Zustand**: State management for election data, voters, and transactions (`store.ts`).
- **Tools**:
  - **MetaMask**: Browser extension for wallet authentication and transaction signing.
  - **TypeScript**: Ensures type safety across the application.
  - **date-fns**: Handles date formatting for election end times and timestamps.

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher): For running the Next.js application.
- **MetaMask**: Browser extension for Ethereum wallet interactions.
- **Ethereum Node**: Access to an Ethereum network (e.g., local Ganache, testnet like Polygon zkEVM Cardona, or mainnet).
- **Git**: For cloning the repository.
- **Yarn or npm**: For installing dependencies.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GZ30eee/blockvote.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
   ```
   Replace `0x000...` with the deployed `Election.sol` contract address (see Deployment below).

4. **Run a Local Ethereum Node (Optional for Development)**:
   - Install Ganache (`npm install -g ganache-cli`) or Hardhat.
   - Start a local blockchain:
     ```bash
     ganache-cli -p 7545
     ```
   - Import a Ganache account into MetaMask for testing.

5. **Deploy the Smart Contract**:
   - Use Hardhat or Remix to compile and deploy `Election.sol` to your chosen network (e.g., local Ganache, testnet, or mainnet).
   - Update `ElectionContract.ts` with the deployed contract address:
     ```javascript
     address: "0xYourDeployedContractAddress",
     ```
   - Obtain test ETH from a faucet for testnets (e.g., Polygon Faucet for zkEVM Cardona).

6. **Run the Application**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open `http://localhost:3000` in your browser.

### Usage

#### For Voters
1. **Install MetaMask**:
   - Add the MetaMask extension to Chrome, Firefox, Brave, Edge, or Opera.
   - Configure MetaMask for the correct network (e.g., `http://localhost:7545` for Ganache, Chain ID: 1337).
2. **Connect Wallet**:
   - On the homepage, click “Connect Wallet” to authenticate via MetaMask.
3. **Log In**:
   - Navigate to `/login` (`page4.tsx`), connect your wallet, and verify registration status.
   - If unregistered, click “Register as a Voter” and follow the admin’s registration process.
4. **Vote**:
   - Access the dashboard (`/dashboard`, `dashboard.tsx`), select an active election, and click “Vote for [Candidate]”.
   - Confirm the transaction in MetaMask to cast your vote, which is recorded on the blockchain.
   - View results and verify your vote in the “Transactions” tab on the election details page (`/elections/[id]`, `page.tsx`).

#### For Administrators
1. **Access Admin Dashboard**:
   - Navigate to `/admin` (`page2.tsx`) and connect the wallet used to create the election (must match `creator` in `Election.sol`).
2. **Create Election**:
   - In the “Create Election” tab, enter the title, description, end date, and candidate details.
   - Click “Create Election” to deploy the election via the `createElection` function in `Election.sol`.
3. **Manage Elections**:
   - In the “Manage Elections” tab, view active and past elections.
   - End an active election by clicking “End” (calls `endElection` in `Election.sol`) or view details (`/admin/elections/[id]`).
   - Add voters or edit election details as needed (simulated in the frontend, requires smart contract extension for production).

## Smart Contract Details

The `Election.sol` contract defines the core logic:
- **Structs**:
  - `Candidate`: Stores name, party, and vote count.
  - `ElectionData`: Manages title, description, end time, total votes, active status, creator, candidates, and voter tracking.
- **Functions**:
  - `createElection`: Deploys a new election with specified parameters.
  - `vote`: Records a vote for a candidate, restricted to active elections and unvoted wallets.
  - `endElection`: Terminates an election, restricted to the creator.
  - `getElection`, `getCandidate`, `getCandidateCount`, `hasVoted`: Retrieve election and voter data.
- **Modifiers**:
  - `onlyBeforeEnd`, `onlyActiveElection`, `hasNotVoted`: Ensure valid voting conditions.
- **Events**:
  - `ElectionCreated`, `VoteCast`: Log election creation and votes for transparency.

The contract is interfaced via `ElectionContract.ts`, which uses ethers.js to call these functions and retrieve data.

## Security Features

- **Wallet Verification**: Cryptographic signatures via MetaMask ensure only authorized voters participate.
- **Double-Vote Prevention**: The `hasVoted` mapping in `Election.sol` prevents multiple votes from the same address.
- **Immutable Records**: Votes are stored on the Ethereum blockchain, ensuring tamper-proof records.
- **Audit Trail**: Transaction histories (`store.ts`) allow verification of all votes via blockchain explorers.

## Development Notes

- **State Management**: Zustand (`store.ts`) simulates on-chain data for elections, voters, and transactions, with persistence for voted elections.
- **UI Components**: Shadcn UI ensures a consistent, responsive design, with custom components like `DatePicker` and `StatsCounter`.
- **Testing**: Use Ganache for local blockchain testing. Simulate votes and election management with test accounts.
- **Production**: Deploy the contract to a public network (e.g., Ethereum mainnet or Polygon) and update the contract address in `ElectionContract.ts`. Ensure sufficient ETH for gas fees.

## Limitations and Future Improvements

- **Voter Registration**: The current code simulates voter registration; a production system needs a smart contract function to manage voter whitelists.
- **Admin Authorization**: Admin access is limited to the election creator. A role-based access control system could allow multiple admins.
- **Privacy**: Votes are linked to wallet addresses. Zero-knowledge proofs could enhance voter anonymity.
- **Scalability**: Gas costs may increase with large elections. Layer-2 solutions like Polygon or Optimism could reduce costs.

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Please follow the code style and include tests for new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

- **GitHub Repository**: [github.com/your-username/blockvote](https://github.com/GZ30eee/blockvote)
- **Live Demo**: [blockvote-demo.com](https://v0-blockchain-voting-6hzl5qgjn-ghza3006-gmailcoms-projects.vercel.app/)

## Contact

For questions or collaboration, reach out via GitHub Issues or connect on LinkedIn.
