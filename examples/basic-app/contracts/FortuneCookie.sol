// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FortuneCookie {
    uint256 public constant PRICE = 0.001 ether;
    address public owner;
    uint256 public cookiesCracked;

    string[] private fortunes = [
    "Great fortune awaits you.",
    "You will ship something amazing soon.",
    "A surprise profit is coming.",
    "Patience will reward you.",
    "An old idea will become valuable again."
    ];

    string[] private greetings = [
    "Hello there!",
    "GM",
    "Hey builder!",
    "Welcome, traveler.",
    "Good to see you!"
    ];

    event CookieCracked(address indexed cracker, uint256 totalCracked);

    constructor() {
        owner = msg.sender;
        cookiesCracked = 0;
    }

    function buyFortune() external payable returns (string memory) {
        require(msg.value >= PRICE, "Not enough ETH sent");

        uint256 index = _pseudoRandom(fortunes.length);
        return fortunes[index];
    }

    // Zero-value mutating function - increments counter and emits event
    function crackCookie() external {
        cookiesCracked++;
        emit CookieCracked(msg.sender, cookiesCracked);
    }

    function getGreeting() external view returns (string memory) {
        uint256 index = _pseudoRandom(greetings.length);
        return greetings[index];
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }

    function _pseudoRandom(uint256 mod) private view returns (uint256) {
        return uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender
                )
            )
        ) % mod;
    }
}
