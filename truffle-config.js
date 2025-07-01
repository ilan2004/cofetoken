module.exports = {
    networks: {
        // Configuration for truffle develop command
        develop: {
            port: 9545,
            network_id: 5777,
            accounts: 5,
            defaultEtherBalance: 500,
            blockTime: 3
        },
        // Configuration for external ganache if needed
        development: {
            host: "127.0.0.1",
            port: 9545,
            network_id: "5777"
        }
    },
    compilers: {
        solc: {
            version: "0.8.20",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                },
                evmVersion: "london" // Specify a compatible EVM version
            }
        }
    }
};
  