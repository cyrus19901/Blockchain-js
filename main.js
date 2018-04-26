const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor (timestamp, transactions, previousHash =''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0 
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)+ this.nonce).toString();
    }

    mineBlock(difficulty){
        while (this.hash.substring(0,difficulty)!== Array(difficulty + 1).join("0")){
            this.nonce ++;
            this.hash = this.calculateHash();
        }
        console.log("BLOCK MINED " + this.hash);
    }

}

class Blockchain {
    constructor(){
        this.chain =[this.createGenesisBlock()];
        this.difficulty =2;
        this.pendingTransactions = [];
        this.miningRewards = 100;

    }

    createGenesisBlock(){
        return new Block("01/01/2018","Genesis Block", "0");
    } 
    getLatestBlock (){
        return this.chain[this.chain.length - 1];
    }

    // addblock (newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }
    minePendingTransactions(miningRewardAddress){
        let block =  new Block (Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("block successfully mined ");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction (null,miningRewardAddress, this.miningRewards)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for (const block of this.chain){
            for (const trans of block.transactions){
                if (trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if (trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        } 
        return balance;
    }
    isChainValid(){
        for (let i=1 ;i < this.chain.length; i ++){
            const currentBlock = this.chain[i];
            const previouBlock = this.chain[i-1];

            if (currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }
            if (currentBlock.previousHash !== previouBlock.hash){
                return false;
            } 
        }
        return true;
    }
}

let RajCoin = new Blockchain();
RajCoin.createTransaction ( new Transaction('address1', 'address2', 100));
RajCoin.createTransaction ( new Transaction('address2', 'address1', 50));

console.log("Starting the miner .....");
RajCoin.minePendingTransactions('test-address');
console.log("Balance of Test is ", RajCoin.getBalanceOfAddress("test-address"));


console.log("Starting the miner again.....");
RajCoin.minePendingTransactions('test-address');
console.log("Balance of Test is ", RajCoin.getBalanceOfAddress("test-address"));

console.log("Starting the miner again.....");
RajCoin.minePendingTransactions('test-address');
console.log("Balance of Test is ", RajCoin.getBalanceOfAddress("test-address"));

console.log("Starting the miner again.....");
RajCoin.minePendingTransactions('test-address');
console.log("Balance of Test is ", RajCoin.getBalanceOfAddress("test-address"));
// console.log("Mining Block 1");
// RajCoin.addblock(new Block(1,"02/01/2018",{amount: 4 }));
// console.log("Mining Block 2");
// RajCoin.addblock(new Block(2,"02/02/2018",{amount: 8 }));
