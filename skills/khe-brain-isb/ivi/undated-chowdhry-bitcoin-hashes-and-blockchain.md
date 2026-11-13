---
title: "ivi: Bitcoin from numbers to blockchain, Prof Bhagwan Chowdhry"
speaker: "Prof Bhagwan Chowdhry"
organisation: "ivi, as listed in the programme speaker list"
date: "unknown"
kind: "class"
transcript_quality: "fair, the lecture is followable but board work is lost and some numbers are garbled"
---

# Bitcoin from numbers to blockchain, Prof Bhagwan Chowdhry

Prof Bhagwan Chowdhry gave a blackboard lecture that builds Bitcoin from first principles: why anything has value, how numbers are written, what a hash is, how blocks are chained, and how public and private keys give ownership. He taught through stories and a live hashing demo. The recording also contains a stretch of an unrelated podcast interview before the lecture, which is not part of the class and is left out. The recording is undated.

## What was said

### Value comes from agreement

- Prof Chowdhry opens by asking why a currency note has value when it is only a piece of paper.
- His plan for the lecture is to create numbers that are in limited supply and then get enough people to agree that those numbers are special.
- He says Bitcoin is nothing but an agreement among enough people that certain numbers are special.
- He says it does not matter that a finance minister does not want Bitcoin, because enough people do.
- He says Bitcoin was literally created out of nothing.

### Ownership is knowing a number

- His story compares three people with 10 gold coins each: one carries them, one keeps them in a bank locker, and one hides them at ten random places.
- He says all three own something of equal value, and the third owns it because he alone knows the locations.
- A location is a GPS position, which he says is nothing but a number, so the number itself has become valuable.
- In the story, when someone else learns the locations and moves the coins, ownership has transferred. He says this is how an exchange takes place.
- He says the gold underneath is immaterial. If people agree that certain locations have value, that is all that is needed.
- He says safety comes from making the hiding space very large and the number of hidden points relatively few, like hide and seek on a bigger and bigger ground.

### Number systems

- He says the decimal system has ten symbols because humans count on ten fingers, and ten was not a necessary choice.
- He says binary works just as well with only two symbols, and every decimal number maps to a binary one.
- He says computers use binary because it is easy to build switches with two positions, on and off.
- He points to Morse code and village drums as two-symbol systems that are enough to carry language.
- He credits Claude Shannon, whom he calls the father of information science, with showing that any logical statement can be represented as a series of 1s and 0s.
- He quotes Alan Turing as saying that a long enough tape of 1s and 0s can represent any computer.
- Hexadecimal uses 16 symbols, the ten digits plus A to F. He says the more symbols a system uses, the fewer digits a number needs.

### How big 256 binary digits is

- He works with numbers 256 binary digits long, which gives 2 to the power 256 possible values.
- Using the shortcut that 2 to the power 10 is about 10 to the power 3, he puts 2 to the power 256 at about 10 to the power 77.
- For scale he gives the grains of sand on all beaches as 10 to the power 16 and the atoms in the universe as 10 to the power 79.

### Everything interesting is a number

- He says any book, bank statement or financial record can be written as a number, because any language can.
- He says people can be written as numbers too, because DNA is a number system with four symbols.
- He says the count of all interesting objects is tiny next to the space of 256-digit numbers.
- His analogy is Aadhaar: a 12-digit number gives a trillion possibilities, numbers are assigned randomly, and a brother's number tells you nothing about his sister's.

### SHA-256 hashes

- He says a hash is an algorithm that takes any message and converts it into a 256-digit binary number, and he names it Secure Hash Algorithm 256.
- He calls the hash a fingerprint of a document.
- He says the same message always gives the same hash, and he shows this by typing his own name into a hashing tool.
- He shows that changing one capital letter to lower case changes the hash completely.
- He says the function is one way and cannot be inverted to recover the message.
- He says even an empty message has a hash.
- A 256-digit binary number collapses to 64 hexadecimal digits, which is how hashes are usually written.
- He says a hash is not encryption. An encrypted message can be deciphered and holds the whole message, while a hash is confined to 256 digits and cannot contain it.

### Proving you have a document

- His example is a 2016 tweet by Julian Assange, labelled a pre-commitment and addressed to John Kerry, containing a 64-digit hexadecimal number.
- He says publishing the hash proved Assange held a document without revealing it, because Kerry could hash his own copy and see whether it matched.
- He applies this to academic transcripts: the institute publishes the hash, the applicant sends a digital copy, and the receiving university computes the hash and checks it.
- He says an applicant could still hack the institute's server and change both the grade and the hash, which is why the hash is put on a blockchain.

### Blocks, nonces and mining

- He describes a block as a stack of transactions, like a shared digital ledger that everyone keeps.
- Each block holds a block number, the transactions and an extra number called a nonce.
- The rule he sets in his demo is that a block is valid only when its hash starts with four zeros.
- Because hashes behave randomly, he says the only way to find a working nonce is brute force, trying number after number. He says this search is what mining is.
- Whoever finds the nonce first is rewarded, which he says is there to give people an incentive to play.
- The result is synchronised across all computers in the game, so everyone carries the same ledger.

### Why the chain cannot be changed

- Each new block also stores the previous block's hash, and he says this is what links the blocks into a chain.
- If someone edits a transaction in an old block, that block's hash no longer matches, and neither does any block after it.
- To cheat, a person must recompute every later block by brute force, which is expensive, and also convince everyone else that the new chain is the right one.
- He says the result is consensus, and that what is written in a block cannot be changed.

### Public and private keys

- He starts with a letter-shift cipher and says its weakness is that the key has to be sent to the other person too.
- He credits three people in the 1970s, naming Diffie and Hellman, with the idea of a pair of linked keys.
- One key of the pair encrypts, and the same key cannot decrypt. Only the other key of the pair can.
- A person publishes the public key and keeps the private key secret.
- To send a private message you encrypt it with the recipient's public key, and only the recipient's private key opens it. He says even the sender cannot decrypt it afterwards.
- He says this idea made internet payments possible, and that UPI payments rely on it.
- To prove who sent a message, the sender encrypts it a second time with their own private key. If it opens with the sender's public key, it came from the sender.

### How Bitcoin uses all of this

- He says the blockchain does not record a name. It records that the coins belong to a public key.
- Only the person holding the matching private key can prove the coins are theirs, which he compares to knowing the GPS location in his gold story.
- He says the first block was mined by Bitcoin's creator, Satoshi Nakamoto, and credited 50 coins to a public key.
- He says every bitcoin in existence was mined at some point and there is no other way to create one.
- He gives the total supply as 21 million bitcoins, after which no more are created, and says this is what makes supply limited.
- A transfer is a message written into a block saying the owner of certain coins is passing some to another key.
- He says an attempt to spend the same coins again fails because everyone checks the ledger.

### Beyond currency

- He says each block has some spare space where anything can be written, and whatever is written there becomes permanent because the chain has value and nobody will destroy it.
- He says an institute can secure a transcript by attaching it to a Bitcoin transaction.
- He says once documents can be stored, computer programs can be stored too, and that leads to smart contracts, which execute automatically.
- He names Ethereum as the currency built on the idea of storing programs and not only static documents.

## Examples and cases used

- Julian Assange's 2016 pre-commitment tweet: a published hash proves possession of a document without revealing it.
- Aadhaar: a random number from a large space identifies a person, and one number gives no clue to another.
- University transcripts: a published hash lets anyone verify a digital copy.
- Satoshi Nakamoto: he says he publicly nominated Nakamoto for the Nobel Prize in 2016, and that a prize speech could be authenticated by signing it with Nakamoto's private key.
- Claude Shannon and Alan Turing: the basis for treating all logic and all computers as 1s and 0s.

## Numbers given

- 2 to the power 256, about 10 to the power 77: the size of the space of SHA-256 hash values, by his shortcut.
- 10 to the power 16: his figure for grains of sand on all beaches.
- 10 to the power 79: the figure used in class for atoms in the universe.
- 64: hexadecimal digits in a SHA-256 hash.
- 12 digits, a trillion possibilities: the Aadhaar number.
- 50 bitcoins: the reward credited in the first blocks.
- 21 million: total bitcoins that will ever be created.

## Not covered

- The price of Bitcoin, how to buy or hold it, and whether it is a good investment.
- Mining economics, energy use, halving of the reward and how difficulty adjusts.
- Regulation and tax treatment of crypto in India.
- Smart contracts and Ethereum were named and left for another time.
