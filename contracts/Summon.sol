// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IExtendERC721.sol";

contract Summon is Ownable, Pausable {
    IERC20 public acceptedToken;
    uint256 public fee;
    address public signer;
    mapping(uint8 => address) nftAddresses;

    event Created(
        address indexed nftAddress,
        uint256 tokenId
    );

    constructor(
        uint256 _fee,
        address _acceptedTokenAddress,
        address _fragmentSmartContractAddress,
        address _itemSmartContractAddress,
        address _petSmartContractAddress
    ) {
        fee = _fee;
        setAcceptedToken(_acceptedTokenAddress);
        setNFTAddresses(
            _fragmentSmartContractAddress,
            _itemSmartContractAddress,
            _petSmartContractAddress
        );
    }

    function setAcceptedToken(address _acceptedTokenAddress) public onlyOwner {
        acceptedToken = IERC20(_acceptedTokenAddress);
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }

    function setSigner(address _signer) public onlyOwner {
        signer = _signer;
    }

    function setNFTAddresses(
        address _fragmentSmartContractAddress,
        address _itemSmartContractAddress,
        address _petSmartContractAddress
    ) internal {
        nftAddresses[1] = _fragmentSmartContractAddress;
        nftAddresses[2] = _itemSmartContractAddress;
        nftAddresses[3] = _petSmartContractAddress;
    }

    function create(
        /// @notice
        /// 1. Fragment
        /// 2. Item
        /// 3. Pet
        uint8 nftType,
        string memory metadataId,
        bytes memory signature
    ) public whenNotPaused returns (uint256) {
        address _sender = _msgSender();

        bytes32 hash = ECDSA.toEthSignedMessageHash(
            keccak256(abi.encode(nftType, metadataId, _sender))
        );
        address recovered = ECDSA.recover(hash, signature);

        require(signer == recovered, "Summon: invalid signature");

        // Transfer fee to owner
        if (fee == 0 || acceptedToken.transferFrom(_sender, owner(), fee)) {
            address nftAddress = nftAddresses[nftType];

            if (nftAddress == address(0)) {
                revert("Summon: invalid nft type");
            } else {
                try IExtendERC721(nftAddress).mint(_sender, metadataId) returns (
                    uint256 tokenId
                ) {

                    emit Created(
                        nftAddress,
                        tokenId
                    );
                    return tokenId;
                } catch {
                    revert("Summon: failed to mint a nft");
                }
            }
        } else {
            revert("Summon: failed to transfer fee to owner");
        }
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }
}
