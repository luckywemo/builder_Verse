// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract FilecoinStorageManager is Initializable, OwnableUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    struct StorageDeal {
        address client;
        address provider;
        uint256 dealId;
        uint256 size;
        uint256 price;
        uint256 duration;
        uint256 startTime;
        bool isActive;
        bool isVerified;
        string pieceCid;
        string dataCid;
        uint256 dealProposalId; // Filecoin deal proposal ID
    }

    struct StorageProvider {
        address providerAddress;
        string name;
        bool isActive;
        uint256 totalDeals;
        uint256 totalSize;
        string providerId;
        uint256 stakeAmount;
        bool isStaked;
    }

    mapping(uint256 => StorageDeal) public deals;
    mapping(address => StorageProvider) public providers;
    mapping(address => uint256[]) public clientDeals;
    mapping(address => uint256[]) public providerDeals;
    mapping(string => address) public providerIdToAddress;
    mapping(uint256 => uint256) public dealProposalToDealId;

    IERC20Upgradeable public filToken;
    uint256 public dealCounter;
    uint256 public minDealSize;
    uint256 public maxDealSize;
    uint256 public minDealDuration;
    uint256 public maxDealDuration;
    uint256 public providerStakeAmount;
    uint256 public constant MIN_STAKE_AMOUNT = 10 * 10**18; // 10 tFIL minimum stake

    event DealCreated(
        uint256 indexed dealId,
        address indexed client,
        address indexed provider,
        uint256 size,
        uint256 price,
        uint256 duration,
        string pieceCid,
        string dataCid,
        uint256 dealProposalId
    );
    event DealVerified(uint256 indexed dealId, bool verified);
    event DealCompleted(uint256 indexed dealId);
    event ProviderRegistered(address indexed provider, string name, string providerId);
    event ProviderStatusChanged(address indexed provider, bool isActive);
    event ProviderStaked(address indexed provider, uint256 amount);
    event ProviderUnstaked(address indexed provider, uint256 amount);
    event DealProposalUpdated(uint256 indexed dealId, uint256 dealProposalId);

    function initialize(address _filToken) public initializer {
        __Ownable_init(msg.sender);
        __Pausable_init();
        __ReentrancyGuard_init();
        
        filToken = IERC20Upgradeable(_filToken);
        minDealSize = 1; // 1 byte
        maxDealSize = 32 * 1024 * 1024 * 1024; // 32 GB
        minDealDuration = 1 days;
        maxDealDuration = 365 days;
        providerStakeAmount = MIN_STAKE_AMOUNT;
    }

    function registerProvider(string memory name, string memory providerId) external {
        require(providers[msg.sender].providerAddress == address(0), "Provider already registered");
        require(providerIdToAddress[providerId] == address(0), "Provider ID already in use");
        require(bytes(providerId).length > 0, "Invalid provider ID");
        
        providers[msg.sender] = StorageProvider({
            providerAddress: msg.sender,
            name: name,
            isActive: false, // Provider needs to stake first
            totalDeals: 0,
            totalSize: 0,
            providerId: providerId,
            stakeAmount: 0,
            isStaked: false
        });

        providerIdToAddress[providerId] = msg.sender;
        emit ProviderRegistered(msg.sender, name, providerId);
    }

    function stakeProvider() external nonReentrant {
        require(providers[msg.sender].providerAddress != address(0), "Provider not registered");
        require(!providers[msg.sender].isStaked, "Provider already staked");
        
        filToken.safeTransferFrom(msg.sender, address(this), providerStakeAmount);
        
        providers[msg.sender].stakeAmount = providerStakeAmount;
        providers[msg.sender].isStaked = true;
        providers[msg.sender].isActive = true;
        
        emit ProviderStaked(msg.sender, providerStakeAmount);
    }

    function unstakeProvider() external nonReentrant {
        require(providers[msg.sender].isStaked, "Provider not staked");
        require(!providers[msg.sender].isActive, "Provider is still active");
        
        uint256 stakeAmount = providers[msg.sender].stakeAmount;
        providers[msg.sender].stakeAmount = 0;
        providers[msg.sender].isStaked = false;
        
        filToken.safeTransfer(msg.sender, stakeAmount);
        emit ProviderUnstaked(msg.sender, stakeAmount);
    }

    function createDeal(
        address provider,
        uint256 size,
        uint256 price,
        uint256 duration,
        string memory pieceCid,
        string memory dataCid,
        uint256 dealProposalId
    ) external nonReentrant whenNotPaused {
        require(providers[provider].isActive, "Provider is not active");
        require(providers[provider].isStaked, "Provider not staked");
        require(size >= minDealSize && size <= maxDealSize, "Invalid deal size");
        require(duration >= minDealDuration && duration <= maxDealDuration, "Invalid deal duration");
        require(bytes(pieceCid).length > 0, "Invalid piece CID");
        require(bytes(dataCid).length > 0, "Invalid data CID");
        require(dealProposalToDealId[dealProposalId] == 0, "Deal proposal already used");

        filToken.safeTransferFrom(msg.sender, address(this), price);

        uint256 dealId = dealCounter++;
        deals[dealId] = StorageDeal({
            client: msg.sender,
            provider: provider,
            dealId: dealId,
            size: size,
            price: price,
            duration: duration,
            startTime: block.timestamp,
            isActive: true,
            isVerified: false,
            pieceCid: pieceCid,
            dataCid: dataCid,
            dealProposalId: dealProposalId
        });

        dealProposalToDealId[dealProposalId] = dealId;
        clientDeals[msg.sender].push(dealId);
        providerDeals[provider].push(dealId);
        providers[provider].totalDeals++;
        providers[provider].totalSize += size;

        emit DealCreated(dealId, msg.sender, provider, size, price, duration, pieceCid, dataCid, dealProposalId);
    }

    function updateDealProposal(uint256 dealId, uint256 newDealProposalId) external {
        StorageDeal storage deal = deals[dealId];
        require(deal.provider == msg.sender, "Only provider can update");
        require(deal.isActive, "Deal is not active");
        require(dealProposalToDealId[newDealProposalId] == 0, "Deal proposal already used");
        
        dealProposalToDealId[deal.dealProposalId] = 0;
        deal.dealProposalId = newDealProposalId;
        dealProposalToDealId[newDealProposalId] = dealId;
        
        emit DealProposalUpdated(dealId, newDealProposalId);
    }

    function verifyDeal(uint256 dealId, bool verified) external {
        StorageDeal storage deal = deals[dealId];
        require(deal.provider == msg.sender, "Only provider can verify");
        require(deal.isActive, "Deal is not active");
        
        deal.isVerified = verified;
        emit DealVerified(dealId, verified);
    }

    function completeDeal(uint256 dealId) external nonReentrant {
        StorageDeal storage deal = deals[dealId];
        require(deal.isActive, "Deal is not active");
        require(deal.isVerified, "Deal is not verified");
        require(block.timestamp >= deal.startTime + deal.duration, "Deal duration not completed");
        
        deal.isActive = false;
        filToken.safeTransfer(deal.provider, deal.price);
        
        emit DealCompleted(dealId);
    }

    function setProviderStatus(address provider, bool isActive) external onlyOwner {
        require(providers[provider].providerAddress != address(0), "Provider not registered");
        require(providers[provider].isStaked, "Provider not staked");
        providers[provider].isActive = isActive;
        emit ProviderStatusChanged(provider, isActive);
    }

    function updateDealLimits(
        uint256 _minDealSize,
        uint256 _maxDealSize,
        uint256 _minDealDuration,
        uint256 _maxDealDuration
    ) external onlyOwner {
        minDealSize = _minDealSize;
        maxDealSize = _maxDealSize;
        minDealDuration = _minDealDuration;
        maxDealDuration = _maxDealDuration;
    }

    function setProviderStakeAmount(uint256 _amount) external onlyOwner {
        require(_amount >= MIN_STAKE_AMOUNT, "Stake amount too low");
        providerStakeAmount = _amount;
    }

    function getClientDeals(address client) external view returns (uint256[] memory) {
        return clientDeals[client];
    }

    function getProviderDeals(address provider) external view returns (uint256[] memory) {
        return providerDeals[provider];
    }

    function getDealDetails(uint256 dealId) external view returns (StorageDeal memory) {
        return deals[dealId];
    }

    function getProviderDetails(address provider) external view returns (StorageProvider memory) {
        return providers[provider];
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
} 