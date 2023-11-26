//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GatedPoster
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x43359E2f7Ef8d5C1E32B3DEc667cb20d267604a1)
 */
export const gatedPosterABI = [
    {
        stateMutability: 'nonpayable',
        type: 'constructor',
        inputs: [
            { name: '_tokenAddress', internalType: 'address', type: 'address' },
            { name: '_threshold', internalType: 'uint256', type: 'uint256' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'user',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'content',
                internalType: 'string',
                type: 'string',
                indexed: false,
            },
            {
                name: 'tag',
                internalType: 'string',
                type: 'string',
                indexed: true,
            },
        ],
        name: 'NewPost',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'previousOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'newOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'OwnershipTransferred',
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            { name: 'content', internalType: 'string', type: 'string' },
            { name: 'tag', internalType: 'string', type: 'string' },
        ],
        name: 'post',
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [{ name: '_newThreshold', internalType: 'uint256', type: 'uint256' }],
        name: 'setThreshold',
        outputs: [],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            {
                name: '_newTokenAddress',
                internalType: 'address',
                type: 'address',
            },
        ],
        name: 'setTokenAddress',
        outputs: [],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'threshold',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'tokenAddress',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [{ name: '_newOwner', internalType: 'address', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
    },
] as const;

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x43359E2f7Ef8d5C1E32B3DEc667cb20d267604a1)
 */
export const gatedPosterAddress = {
    11155111: '0x43359E2f7Ef8d5C1E32B3DEc667cb20d267604a1',
} as const;

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x43359E2f7Ef8d5C1E32B3DEc667cb20d267604a1)
 */
export const gatedPosterConfig = {
    address: gatedPosterAddress,
    abi: gatedPosterABI,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Poster
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x325547F6F5f3d3Bf974f1C1B2C283F56445e48eB)
 */
export const posterABI = [
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'user',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'content',
                internalType: 'string',
                type: 'string',
                indexed: false,
            },
            {
                name: 'tag',
                internalType: 'string',
                type: 'string',
                indexed: true,
            },
        ],
        name: 'NewPost',
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            { name: 'content', internalType: 'string', type: 'string' },
            { name: 'tag', internalType: 'string', type: 'string' },
        ],
        name: 'post',
        outputs: [],
    },
] as const;

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x325547F6F5f3d3Bf974f1C1B2C283F56445e48eB)
 */
export const posterAddress = {
    11155111: '0x325547F6F5f3d3Bf974f1C1B2C283F56445e48eB',
} as const;

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x325547F6F5f3d3Bf974f1C1B2C283F56445e48eB)
 */
export const posterConfig = { address: posterAddress, abi: posterABI } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Token
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x8b0F4DA7ad4497134F920C886be456ae468a1714)
 */
export const tokenABI = [
    {
        stateMutability: 'nonpayable',
        type: 'constructor',
        inputs: [
            { name: '_name', internalType: 'string', type: 'string' },
            { name: '_symbol', internalType: 'string', type: 'string' },
            { name: '_totalSupply', internalType: 'uint256', type: 'uint256' },
        ],
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'owner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'spender',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Approval',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'previousOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'newOwner',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
        ],
        name: 'OwnershipTransferred',
    },
    {
        type: 'event',
        anonymous: false,
        inputs: [
            {
                name: 'from',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'to',
                internalType: 'address',
                type: 'address',
                indexed: true,
            },
            {
                name: 'value',
                internalType: 'uint256',
                type: 'uint256',
                indexed: false,
            },
        ],
        name: 'Transfer',
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [
            { name: '_owner', internalType: 'address', type: 'address' },
            { name: '_spender', internalType: 'address', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            { name: '_spender', internalType: 'address', type: 'address' },
            { name: '_amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            { name: '_account', internalType: 'address', type: 'address' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'mint',
        outputs: [],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'name',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', internalType: 'address', type: 'address' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', internalType: 'string', type: 'string' }],
    },
    {
        stateMutability: 'view',
        type: 'function',
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            { name: 'to', internalType: 'address', type: 'address' },
            { name: 'amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [
            { name: '_from', internalType: 'address', type: 'address' },
            { name: '_to', internalType: 'address', type: 'address' },
            { name: '_amount', internalType: 'uint256', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    },
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [{ name: '_newOwner', internalType: 'address', type: 'address' }],
        name: 'transferOwnership',
        outputs: [],
    },
] as const;

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x8b0F4DA7ad4497134F920C886be456ae468a1714)
 */
export const tokenAddress = {
    11155111: '0x8b0F4DA7ad4497134F920C886be456ae468a1714',
} as const;

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x8b0F4DA7ad4497134F920C886be456ae468a1714)
 */
export const tokenConfig = { address: tokenAddress, abi: tokenABI } as const;
