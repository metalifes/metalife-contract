// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./ExtendERC721.sol";

contract Pet is ExtendERC721 {
    constructor() ExtendERC721("Metalife Pet", "MLP") {}
}
