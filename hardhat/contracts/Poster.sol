// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Poster {
    event NewPost(address indexed user, string content, string indexed tag);

    function post(string memory content, string memory tag) public {
        emit NewPost(msg.sender, content, tag);
    }
}
