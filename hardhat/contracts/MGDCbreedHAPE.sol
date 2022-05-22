// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ERC1155URIStorage.sol";

contract MGDCbreedHAPE is ERC1155, ERC1155URIStorage, Ownable {
    uint256 public NFTPrice = 250000000000000000;
    uint256 public breedPrice = 1;
    using SafeMath for uint256;
    using Strings for uint256;
    uint256 public totalSupply = 0;
    bool public reveal;
    bool public isActive;
    mapping(uint256 => bool) public hasBreed;
    IERC721 public MGDC;
    IERC721 public HAPE;
    IERC20 public MGDC_TOKEN;
    mapping(uint256 => bool) public MGDCisBreeding;
    uint256 public MGDCisBreedingCount;
    mapping(uint256 => uint256) public MGDCbreeding;
    mapping(address => bool) public whiteList;

    constructor(
        string memory _uri,
        IERC20 mgdcToken_,
        IERC721 mgdc_,
        IERC721 hape_
    )
    ERC1155(_uri)
    {
        MGDC_TOKEN = IERC20(mgdcToken_);
        MGDC = IERC721(mgdc_);
        HAPE = IERC721(hape_);
    }

    function revealNow() external onlyOwner
    {
        reveal = true;
    }

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

    function setIsActive( bool _isActive) external onlyOwner
    {
        isActive = _isActive;
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return ERC1155URIStorage.uri(tokenId);
    }

    function setURI(string memory newuri) public  onlyOwner{
        _setURI(newuri);
    }

    function setBaseURI(string memory baseURI) public onlyOwner{
        _setBaseURI(baseURI);
    }

    function listBreeding( uint256 _tokenId)
     external
     payable
    {
        if(whiteList[msg.sender]){
            whiteList[msg.sender] = false;
        }else{
            require(NFTPrice == msg.value, "Ether value sent is not correct");
        }
        require(MGDC.ownerOf(_tokenId)==msg.sender,"You don't own this HAPE nor this MGDC");
        if(MGDC.ownerOf(_tokenId)==msg.sender){
        require(MGDCisBreeding[_tokenId] == false, "This MGDC is not available");
          MGDCisBreeding[_tokenId] = true;
          MGDCbreeding[MGDCisBreedingCount] = _tokenId;
          MGDCisBreedingCount = MGDCisBreedingCount+1;
        }
    }

    function listBreedingWithMGDCToken(
        uint256 _tokenId
    )
     external
    {
        if(whiteList[msg.sender]){
            whiteList[msg.sender] = false;
        }else{
            require(MGDC_TOKEN.balanceOf(msg.sender) >= breedPrice * 1e18, "You dont have enough MGDC TOKEN");
        }
        require(MGDC.ownerOf(_tokenId)==msg.sender,"You don't own this HAPE nor this MGDC");
        if(MGDC.ownerOf(_tokenId)==msg.sender){
        require(MGDCisBreeding[_tokenId] == false, "This MGDC is not available");
        MGDC_TOKEN.transferFrom(msg.sender, address(this), breedPrice * 1e18);
          MGDCisBreeding[_tokenId] = true;
          MGDCbreeding[MGDCisBreedingCount] = _tokenId;
          MGDCisBreedingCount = MGDCisBreedingCount+1;
        }
    }

    function listBreedingByOwner(
        address _to,
        uint256 _tokenId
    )
     external onlyOwner
    {
        if(MGDC.ownerOf(_tokenId) == _to){
        require(MGDCisBreeding[_tokenId] == false, "This MGDC is not available");
          MGDCisBreeding[_tokenId] = true;
          MGDCbreeding[MGDCisBreedingCount] = _tokenId;
          MGDCisBreedingCount = MGDCisBreedingCount+1;
        }
    }

    function breed(
        uint256 _tokenId
    )
        public
        payable
    {
        if(whiteList[msg.sender]){
            whiteList[msg.sender] = false;
        }else{
            require(NFTPrice == msg.value, "Ether value sent is not correct");
        }
        require(isActive, "Contract is not active");
        require(HAPE.balanceOf(msg.sender)>=1,"You are not HAPE");
        require(!hasBreed[_tokenId],"1 MGDC can breed only once");
        require(MGDCisBreeding[_tokenId],"this MGDC is not listed");
        mint(msg.sender,1);
        mint(MGDC.ownerOf(_tokenId),1);
        hasBreed[_tokenId] = true;
    }


    function breedWithMGDCToken(
        uint256 _tokenId
    )
        public
    {
        if(whiteList[msg.sender]){
            whiteList[msg.sender] = false;
        }else{
            require(MGDC_TOKEN.balanceOf(msg.sender) >= breedPrice * 1e18, "You dont have enough MGDC TOKEN");
        }

        require(isActive, "Contract is not active");
        require(HAPE.balanceOf(msg.sender)>=1,"You are not HAPE");
        require(!hasBreed[_tokenId],"1 MGDC can breed only once");
        require(MGDCisBreeding[_tokenId],"this MGDC is not listed");
        MGDC_TOKEN.transferFrom(msg.sender, address(this), breedPrice * 1e18);
        mint(msg.sender,1);
        mint(MGDC.ownerOf(_tokenId),1);
        hasBreed[_tokenId] = true;
    }

    function breedByOwner (
        address _to,
        uint256 _tokenId
    ) external onlyOwner
    {
        require(isActive, "Contract is not active");
        require(HAPE.balanceOf(_to)>=1,"You are not HAPE");
        require(!hasBreed[_tokenId],"1 MGDC can breed only once");
        require(MGDCisBreeding[_tokenId],"this MGDC is not listed");
        mint(_to,1);
        mint(MGDC.ownerOf(_tokenId),1);
        hasBreed[_tokenId] = true;
    }

    function mintHapeKidByOwner (
        address _to
    ) external onlyOwner
    {
        mint(_to,1);
    }

    function setNFTPrice(uint256 _price) external onlyOwner {
        NFTPrice = _price;
    }
   
    function setBreedPrice(uint256 _price) external onlyOwner {
        breedPrice = _price;
    }

    function addToWhiteList(
        address[] memory _addresses
    )
        external
        onlyOwner
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            require(_addresses[i] != address(0), "Cannot add the null address");
            whiteList[_addresses[i]] = true;
        }
    }

    function addToList(
         uint256 idSecond
    )
        external
        onlyOwner
    {
          require(MGDCisBreeding[idSecond] == false, "this MGDC is not listed");
          MGDCisBreeding[idSecond] = true;
          MGDCbreeding[MGDCisBreedingCount] = idSecond;
          MGDCisBreedingCount = MGDCisBreedingCount+1;
    }

    function withdraw()external onlyOwner
    {
        uint balance = address(this).balance;
        payable(address(0xbD7D5f86f2343aDe4108b638F34f01ad1986b8A5)).transfer(balance);
    }
}