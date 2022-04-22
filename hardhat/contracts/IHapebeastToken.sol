// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract IHapebeastToken is ERC721 {
    function setProvenanceHash(string memory _provenanceHash) external virtual;

    function setStartingIndex() external virtual;

    function mint(uint256 _count, address _recipient) external virtual;

    function totalSupply() external virtual returns (uint256);

    function updateMinter(address _minter) external virtual;

    function lockMinter() external virtual;
}
