const SHA256 = require("crypto-js/sha256")

let timestamp = new Date().toString()

class Block {
    constructor(index, timestamp, data, previousHash="") {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.calculateHash()
        }

        console.log(`Block Mined : ${this.hash}`)
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()]
        this.difficulty = 4
    }

    createGenesis() {
        return new Block(0, timestamp, "Genesis ", "0")
    }

    latestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.latestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    checkValid() {
        for (let i = 1; i<this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]
            if (currentBlock.hash !== currentBlock.calculateHash()) return false
            if (currentBlock.previousHash !== previousBlock.hash) return false
        }

        return true
    }
}

let testBlockChain = new BlockChain()

console.log("Mining some blocks")

testBlockChain.addBlock( new Block(1, timestamp, "Block1"))
console.log("Mining some blocks")

testBlockChain.addBlock( new Block(1, timestamp, "Block2"))

console.log(JSON.stringify(testBlockChain, null, 4))
console.log(`Is valid blockchain ${testBlockChain.checkValid().toString()}`)