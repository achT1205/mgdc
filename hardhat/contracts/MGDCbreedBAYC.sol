// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MGDCbreedBAYC is ERC1155, Ownable {
    string public constant name = "Bored Kid";
    string public constant symbol = "BKid";
    uint256 public NFTPrice = 250000000000000000;
    using SafeMath for uint256;
    using Strings for uint256;
    uint256 public totalSupply = 0;
    string private baseURI;
    string private blindURI;
    bool public reveal;
    bool public isActive;
    mapping(uint256 => bool) public hasBreed;
    uint256 public giveawayCount;
    IERC721 public MGDC = IERC721(0x0191c41DBceB20a612b25137133ca719E84f7933);
    IERC721 public BAYC = IERC721(0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d);
    mapping(uint256 => bool) public MGDCisBreeding;
    uint256 public MGDCisBreedingCount;
    mapping(uint256 => uint256) public MGDCbreeding;

    /*
     * Function to reveal all NFTs
     */
    function revealNow() external onlyOwner {
        reveal = true;
    }

    /*
     * Function to mint NFTs
     */
    function mint(address to, uint32 count) internal {
        if (count > 1) {
            uint256[] memory ids = new uint256[](uint256(count));
            uint256[] memory amounts = new uint256[](uint256(count));

            for (uint32 i = 0; i < count; i++) {
                ids[i] = totalSupply + i;
                amounts[i] = 1;
            }

            _mintBatch(to, ids, amounts, "");
        } else {
            _mint(to, totalSupply, 1, "");
        }

        totalSupply += count;
    }

    /*
     * Function setIsActive to activate/desactivate the smart contract
     */
    function setIsActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    /*
     * Function to set Base and Blind URI
     */
    function setURIs(string memory _blindURI, string memory _URI)
        external
        onlyOwner
    {
        blindURI = _blindURI;
        baseURI = _URI;
    }

    function listBreeding(
        //uint256 idFirst,
        uint256 idSecond
    ) external payable {
        require(NFTPrice == msg.value, "Ether value sent is not correct");
        require(
            MGDC.ownerOf(idSecond) == msg.sender,
            "You don't own this BAYC nor this MGDC"
        );

        if (MGDC.ownerOf(idSecond) == msg.sender) {
            require(MGDCisBreeding[idSecond] == false);
            MGDCisBreeding[idSecond] = true;
            MGDCbreeding[MGDCisBreedingCount] = idSecond;
            MGDCisBreedingCount = MGDCisBreedingCount + 1;
        }
    }

    /*
     * Function to mint new NFTs when breeding
     */
    function breed(uint256 idSecond) public payable {
        require(NFTPrice == msg.value, "Ether value sent is not correct");
        require(isActive, "Contract is not active");
        require(BAYC.balanceOf(msg.sender) >= 1, "You don't own this BAYC");
        require(!hasBreed[idSecond], "1 MGDC can breed only once");
        require(MGDCisBreeding[idSecond], "this MGDC is not listed");
        mint(msg.sender, 1);
        mint(MGDC.ownerOf(idSecond), 1);
        hasBreed[idSecond] = true;
    }

    /*
     * Function to mint all NFTs to create the collection
     */
    function mintByOwner(address _to) public onlyOwner {
        require(giveawayCount.add(1) <= 1, "Cannot do more giveaway");
        mint(_to, 1);
        giveawayCount = giveawayCount.add(1);
    }

    /*
     * Function to get token URI of given token ID
     */
    function uri(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _tokenId < totalSupply,
            "ERC1155Metadata: URI query for nonexistent token"
        );
        if (!reveal) {
            return string(abi.encodePacked(blindURI));
        } else {
            return string(abi.encodePacked(baseURI, _tokenId.toString()));
        }
    }

    /*
     * Function to withdraw collected amount during minting by the owner
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance should be more then zero");
        payable(address(0xD802024da90dD1CF3227a37B76520aadfE198971)).transfer(
            balance
        );
    }
}
