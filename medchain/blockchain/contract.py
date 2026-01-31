from web3 import Web3
import json
import os

RPC_URL = os.getenv("POLYGON_RPC_URL")
PRIVATE_KEY = os.getenv("BLOCKCHAIN_PRIVATE_KEY")
ACCOUNT = os.getenv("BLOCKCHAIN_ACCOUNT")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

w3 = Web3(Web3.HTTPProvider(RPC_URL))

with open("blockchain/abi.json") as f:
    ABI = json.load(f)

contract = w3.eth.contract(
    address=Web3.to_checksum_address(CONTRACT_ADDRESS),
    abi=ABI
)

def add_record_on_chain(patient, doctor, cid, file_hash):
    nonce = w3.eth.get_transaction_count(ACCOUNT)

    tx = contract.functions.addRecord(
        patient,
        doctor,
        cid,
        file_hash
    ).build_transaction({
        "from": ACCOUNT,
        "nonce": nonce,
        "gas": 300000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    return tx_hash.hex()
