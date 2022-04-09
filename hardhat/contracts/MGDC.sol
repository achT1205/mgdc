// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MGDC is
    ERC721("Meta Gold Digger Club", "MGDC"),
    ERC721Enumerable,
    Ownable
{
    using SafeMath for uint256;
    using Strings for uint256;

    string private baseURI;
    string private blindURI;
    uint256 public constant BUY_LIMIT_PER_TX = 10;
    uint256 public constant MAX_NFT_PUBLIC = 4969;
    uint256 private constant MAX_NFT = 5369;
    uint256 public NFTPrice = 250000000000000000; // 0.25 ETH
    bool public reveal;
    bool public isActive;
    bool public isPresaleActive;
    bool private freeMintActive;
    bytes32 public root;
    uint256 public constant WHITELIST_MAX_MINT = 2;
    mapping(address => uint256) public whiteListClaimed;
    mapping(address => bool) private giveawayMintClaimed;
    uint256 public giveawayCount;

    /*
     * Function to reveal all MGDC
     */
    function revealNow() external onlyOwner {
        reveal = true;
    }

    /*
     * Function setIsActive to activate/desactivate the smart contract
     */
    function setIsActive(bool _isActive) external onlyOwner {
        isActive = _isActive;
    }

    /*
     * Function setPresaleActive to activate/desactivate the whitelist/raffle presale
     */
    function setPresaleActive(bool _isActive) external onlyOwner {
        isPresaleActive = _isActive;
    }

    /*
     * Function setFreeMintActive to activate/desactivate the free mint capability
     */
    function setFreeMintActive(bool _isActive) external onlyOwner {
        freeMintActive = _isActive;
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

    /*
     * Function to mint new NFTs during the public sale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
     */
    function mintNFT(uint256 _numOfTokens) public payable {
        require(isActive, "Contract is not active");
        require(!isPresaleActive, "Presale is still active");
        require(_numOfTokens <= BUY_LIMIT_PER_TX, "Cannot mint above limit");
        require(
            totalSupply().add(_numOfTokens).sub(giveawayCount) <=
                MAX_NFT_PUBLIC,
            "Purchase would exceed max public supply of NFTs"
        );
        require(
            NFTPrice.mul(_numOfTokens) == msg.value,
            "Ether value sent is not correct"
        );

        for (uint256 i = 0; i < _numOfTokens; i++) {
            _safeMint(msg.sender, totalSupply().sub(giveawayCount));
        }
    }

    /*
     * Function to mint new NFTs during the presale
     * It is payable. Amount is calculated as per (NFTPrice.mul(_numOfTokens))
     */
    function mintNFTDuringPresale(uint256 _numOfTokens, bytes32[] memory _proof)
        public
        payable
    {
        require(isActive, "Sale is not active");
        require(isPresaleActive, "Whitelist is not active");
        require(
            verify(_proof, bytes32(uint256(uint160(msg.sender)))),
            "Not whitelisted"
        );
        if (!freeMintActive) {
            require(
                totalSupply() < MAX_NFT_PUBLIC,
                "All public tokens have been minted"
            );
            require(
                _numOfTokens <= WHITELIST_MAX_MINT,
                "Cannot purchase this many tokens"
            );
            require(
                totalSupply().add(_numOfTokens).sub(giveawayCount) <=
                    MAX_NFT_PUBLIC,
                "Purchase would exceed max public supply of NFTs"
            );
            require(
                whiteListClaimed[msg.sender].add(_numOfTokens) <=
                    WHITELIST_MAX_MINT,
                "Purchase exceeds max whiteed"
            );
            require(
                NFTPrice.mul(_numOfTokens) == msg.value,
                "Ether value sent is not correct"
            );
            for (uint256 i = 0; i < _numOfTokens; i++) {
                whiteListClaimed[msg.sender] += 1;
                _safeMint(msg.sender, totalSupply().sub(giveawayCount));
            }
        } else {
            require(totalSupply() < MAX_NFT, "All tokens have been minted");
            require(_numOfTokens == 1, "Cannot purchase this many tokens");
            require(
                !giveawayMintClaimed[msg.sender],
                "Already claimed giveaway"
            );
            giveawayMintClaimed[msg.sender] = true;
            _safeMint(msg.sender, totalSupply());
        }
    }

    /*
     * Function to mint NFTs for giveaway and partnerships
     */
    function mintByOwner(address _to, uint256 _tokenId) public onlyOwner {
        require(
            _tokenId < MAX_NFT,
            "Tokens number to mint cannot exceed number of MAX tokens"
        );
        _safeMint(_to, _tokenId);
    }

    /*
     * Function to mint all NFTs for giveaway and partnerships
     */
    function mintMultipleByOwner(
        address[] memory _to,
        uint256[] memory _tokenId
    ) public onlyOwner {
        require(_to.length == _tokenId.length, "Should have same length");
        for (uint256 i = 0; i < _to.length; i++) {
            require(
                _tokenId[i] >= MAX_NFT_PUBLIC,
                "Tokens number to mint must exceed number of public tokens"
            );
            require(
                _tokenId[i] < MAX_NFT,
                "Tokens number to mint cannot exceed number of MAX tokens"
            );
            _safeMint(_to[i], _tokenId[i]);
            giveawayCount = giveawayCount.add(1);
        }
    }

    /*
     * Function to get token URI of given token ID
     * URI will be blank untill totalSupply reaches MAX_NFT_PUBLIC
     */
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (!reveal) {
            return string(abi.encodePacked(blindURI));
        } else {
            return string(abi.encodePacked(baseURI, _tokenId.toString()));
        }
    }

    // Set Root for whitelist and raffle to participate in presale
    function setRoot(uint256 _root) public onlyOwner {
        root = bytes32(_root);
    }

    // Verify MerkleProof
    function verify(bytes32[] memory proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                // Hash(current computed hash + current element of the proof)
                computedHash = sha256(
                    abi.encodePacked(computedHash, proofElement)
                );
            } else {
                // Hash(current element of the proof + current computed hash)
                computedHash = sha256(
                    abi.encodePacked(proofElement, computedHash)
                );
            }
        }

        // Check if the computed hash (root) is equal to the provided root
        return computedHash == root;
    }

    // Standard functions to be overridden in ERC721Enumerable
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    function _beforeTokenTransfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(_from, _to, _tokenId);
    }
}
