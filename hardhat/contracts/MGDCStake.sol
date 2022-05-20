// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;



import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract MGDCStake is ERC20Burnable, Ownable {
    uint256 public constant MAX_WALLET_Staked = 30;
    uint256 public constant MGDC_EMISSIONS_RATE = 34722222222222; // 3 per day
    // address public MGDC_ADDRESS = 0x0191c41dbceb20a612b25137133ca719e84f7933;
    bool public stakingLive = false;

    mapping(uint256 => uint256) internal MGDCTokenIdTimeStaked;
    mapping(uint256 => address) internal MGDCTokenIdTostaker;
    mapping(address => uint256[]) internal stakerToMGDCTokenIds;
    
    IERC721Enumerable private _MGDCIERC721Enumerable; // = IERC721Enumerable(MGDC_ADDRESS);

    constructor( address mgdc) ERC20("MGDC", "MGDC") {
        _MGDCIERC721Enumerable = IERC721Enumerable(mgdc);
    }

    modifier stakingEnabled {
        require(stakingLive, "STAKING_NOT_LIVE");
        _;
    }

    function getMGDCStaked(address staker) public view returns (uint256[] memory) {
        return stakerToMGDCTokenIds[staker];
    }
    
    function getStakedCount(address staker) public view returns (uint256) {
        return stakerToMGDCTokenIds[staker].length ;
    }

    function removeTokenIdFromArray(uint256[] storage array, uint256 tokenId) internal {
        uint256 length = array.length;
        for (uint256 i = 0; i < length; i++) {
            if (array[i] == tokenId) {
                length--;
                if (i < length) {
                    array[i] = array[length];
                }
                array.pop();
                break;
            }
        }
    }

    function stakeMGDCByIds(uint256[] memory tokenIds) public stakingEnabled {
        require(getStakedCount(msg.sender) + tokenIds.length <= MAX_WALLET_Staked, "MAX_TOKENS_BURRIED_PER_WALLET");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 id = tokenIds[i];
            require(_MGDCIERC721Enumerable.ownerOf(id) == msg.sender && MGDCTokenIdTostaker[id] == address(0), "TOKEN_IS_NOT_YOURS");
            _MGDCIERC721Enumerable.transferFrom(msg.sender, address(this), id);

            stakerToMGDCTokenIds[msg.sender].push(id);
            MGDCTokenIdTimeStaked[id] = block.timestamp;
            MGDCTokenIdTostaker[id] = msg.sender;
        }
    }


    function unstakeAll() public {
        require(getStakedCount(msg.sender) > 0, "MUST_ATLEAST_BE_Staked_ONCE");
        uint256 totalRewards = 0;

        for (uint256 i = stakerToMGDCTokenIds[msg.sender].length; i > 0; i--) {
            uint256 tokenId = stakerToMGDCTokenIds[msg.sender][i - 1];

            _MGDCIERC721Enumerable.transferFrom(address(this), msg.sender, tokenId);
            totalRewards += ((block.timestamp - MGDCTokenIdTimeStaked[tokenId]) * MGDC_EMISSIONS_RATE);
            stakerToMGDCTokenIds[msg.sender].pop();
            MGDCTokenIdTostaker[tokenId] = address(0);
        }
        
        _mint(msg.sender, totalRewards);
    }

    function unstakeMGDCByIds(uint256[] memory tokenIds) public {
        uint256 totalRewards = 0;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 id = tokenIds[i];
            require(MGDCTokenIdTostaker[id] == msg.sender, "NOT_ORIGINAL_staker");

            _MGDCIERC721Enumerable.transferFrom(address(this), msg.sender, id);
            totalRewards += ((block.timestamp - MGDCTokenIdTimeStaked[id]) * MGDC_EMISSIONS_RATE);

            removeTokenIdFromArray(stakerToMGDCTokenIds[msg.sender], id);
            MGDCTokenIdTostaker[id] = address(0);
        }

        _mint(msg.sender, totalRewards);
    }


    function claimByMGDCTokenId(uint256 tokenId) public {
        require(MGDCTokenIdTostaker[tokenId] == msg.sender, "NOT_Staked_BY_YOU");
        _mint(msg.sender, ((block.timestamp - MGDCTokenIdTimeStaked[tokenId]) * MGDC_EMISSIONS_RATE));
        MGDCTokenIdTimeStaked[tokenId] = block.timestamp;
    }

    function airDropToken(address _to, uint256 _amount) external onlyOwner  {
        _mint(_to, _amount * 1e18);

    }

    function claimAll() public {
        uint256 totalRewards = 0;

        uint256[] memory MGDCTokenIds = stakerToMGDCTokenIds[msg.sender];
        for (uint256 i = 0; i < MGDCTokenIds.length; i++) {
            uint256 id = MGDCTokenIds[i];
            require(MGDCTokenIdTostaker[id] == msg.sender, "NOT_Staked_BY_YOU");
            totalRewards += ((block.timestamp - MGDCTokenIdTimeStaked[id]) * MGDC_EMISSIONS_RATE);
            MGDCTokenIdTimeStaked[id] = block.timestamp;
        }
      
        _mint(msg.sender, totalRewards);
    }

    function getAllRewards(address staker) public view returns (uint256) {
        uint256 totalRewards = 0;

        uint256[] memory MGDCTokenIds = stakerToMGDCTokenIds[staker];
        for (uint256 i = 0; i < MGDCTokenIds.length; i++) {
            totalRewards += ((block.timestamp - MGDCTokenIdTimeStaked[MGDCTokenIds[i]]) * MGDC_EMISSIONS_RATE);
        }

        return totalRewards;
    }

    function getRewardsByMGDCTokenId(uint256 tokenId) public view returns (uint256) {
        require(MGDCTokenIdTostaker[tokenId] != address(0), "TOKEN_NOT_Staked");

        uint256 secondsStaked = block.timestamp - MGDCTokenIdTimeStaked[tokenId];
        return secondsStaked * MGDC_EMISSIONS_RATE;
    }
    
    function getMGDCtaker(uint256 tokenId) public view returns (address) {
        return MGDCTokenIdTostaker[tokenId];
    }

    function toggle() external onlyOwner {
        stakingLive = !stakingLive;
    }
}
