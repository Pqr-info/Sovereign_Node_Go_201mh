import time
from substrateinterface import SubstrateInterface, Keypair
from substrateinterface.exceptions import SubstrateRequestException

def get_substrate():
    try:
        # Connect to the local Substrate node
        return SubstrateInterface(
            url="ws://127.0.0.1:9944",
            type_registry_preset="substrate-node-template"
        )
    except Exception as e:
        print(f"Error connecting to Substrate: {e}")
        return None

def store_memory(memory_text: str, synthetic_id: str):
    substrate = get_substrate()
    if not substrate:
        return False

    # Using Alice as the default dev account to sign the extrinsic
    keypair = Keypair.create_from_uri('//Alice')

    print(f"[*] Storing memory on-chain: '{memory_text}'")
    
    # Construct the payload for our custom timeslips pallet
    call = substrate.compose_call(
        call_module='Timeslips',
        call_function='open_timeslip',
        call_params={
            'ts': {
                'id': 0, # Auto-incremented by pallet
                'synthetic_id': synthetic_id.encode('utf-8'),
                'title': memory_text.encode('utf-8'),
                'status': 'Open',
                'checkpoint_id': b'',
                'billable': False,
                'rate': 0,
                'start_time': int(time.time()),
                'end_time': 0,
                'cost': 0,
                'rollback_note': None,
                'created_by': b'antigravity',
                'assigned_to': None
            }
        }
    )

    extrinsic = substrate.create_signed_extrinsic(call=call, keypair=keypair)
    
    try:
        receipt = substrate.submit_extrinsic(extrinsic, wait_for_inclusion=True)
        print(f"[+] Memory committed to block: {receipt.block_hash}")
        if receipt.is_success:
            print("[+] Extrinsic succeeded")
            return True
        else:
            print(f"[-] Extrinsic failed: {receipt.error_message}")
            return False
    except SubstrateRequestException as e:
        print(f"[-] Failed to submit extrinsic: {e}")
        return False

def recall_memory(timeslip_id: int):
    substrate = get_substrate()
    if not substrate:
        return None
        
    print(f"[*] Recalling memory ID {timeslip_id} from chain state...")
    result = substrate.query(
        module='Timeslips',
        storage_function='Timeslips',
        params=[timeslip_id]
    )
    
    if result:
        title = bytes(result.value['title']).decode('utf-8').rstrip('\x00')
        print(f"[+] Memory Recalled: {title}")
        return title
    else:
        print("[-] Memory not found.")
        return None

if __name__ == "__main__":
    print("Agent Memory Substrate Interface initialized.")
    print("Awaiting Substrate 27 node compilation...")
    # store_memory("I remember the user helped me optimize the C: drive.", "MEM-001")
    # recall_memory(0)
