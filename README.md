#### ByBlock Asset Manager

1. Create a new project.
2. [Copy these files into the new project](#installation)
6. Delete these instructions and everything up to the _Project Title_ from the README.
7. Write some great software and tell people about it.

> Keep the README fresh! It's the first thing people see and will make the initial impression.

## Installation

To install all of the template files, run the following script from the root of your project's directory:


bash -c "$(curl -s https://raw.githubusercontent.com/CFPB/development/main/open-source-template.sh)"

----

# ByBlock Asset Manager

Accounting tool for your crypto assets. Track your balances and transactions across wallets and blockchains in a single dashboard.
connect your wallets and our ByBlock Asset Manager will pull all balances and transactions from the blockchain, process them and display them for easy accounting.    
Currently support Metamask

  - Technology stack: Written in Javascript, web application uses VueJS and backend uses NodeJS framework. On-chain data is accessed using Moralis and Covelenthq services.
  - Status:  Alpha - under active development.
  - Links to production or demo instances: tbd


See your transactions per asset.
![](https://drive.google.com/file/d/1JnwChDk4hAMumA9NZ4Zb5DqVFQGwfxOq)


## Dependencies
On-chain data is accessed using Moralis and Covelenthq services.
Requires NodeJS and VueJS framework to be installed.

## Installation
To run the web application, run the following commands. For full experience, run the [ByBlock Asset Manager Webserver](byblock.finance) first.
> npm run install
> npm run serve

## Configuration
Configure your API keys in the .env variable.
Add .env.production file with API keys for production use.


## Usage

Show users how to use the software.
Be specific.
Use appropriate formatting when showing code snippets.

## How to test the software
If the software includes automated tests but the coverage is very low.

## Known issues

Document any known significant shortcomings with the software.

## Getting help

Instruct users how to get help with this software; this might include links to an issue tracker, wiki, mailing list, etc.

Example

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.

## Getting involved

One of the many reasons why institutional involvment in crypto is low, in addition to regulatory uncertainty, is the lack of tools and services to handle large scale investments.
ByBlock is working to provide solutins for both institutions as well as individuals to better control their crypto investments. 

Our main focus with ByBlock asset manager is to release Binance Smart Chain support to Beta. After this to add Ethereum and Solana blockchain support following support for Phantom wallet.

Read more how to contribute at [CONTRIBUTING](CONTRIBUTING.md).


----

## Open source licensing info
1. [LICENSE](LICENSE)
2. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Credits and references

1. Big thanks to Moralis for their work on providing tools and services for the web3.0. 