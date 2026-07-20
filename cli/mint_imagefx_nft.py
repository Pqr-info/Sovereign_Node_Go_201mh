import argparse
import time
import json
from substrateinterface import SubstrateInterface, Keypair
from substrateinterface.exceptions import SubstrateRequestException

def main():
    parser = argparse.ArgumentParser(description="ImageFX NFT Minting CLI")
    parser.add_argument("--url", default="ws://127.0.0.1:9944", help="Substrate node WebSocket URL")
    parser.add_argument("--suri", default="//Alice", help="Secret URI of the minter account (e.g. //Alice)")
    parser.add_argument("--hash", required=True, help="0x-prefixed hex string of the image hash (32 bytes)")
    parser.add_argument("--prompt", required=True, help="The prompt used to generate the image")
    parser.add_argument("--aspect", default="square", choices=["square", "widescreen", "portrait"], help="Aspect ratio")
    parser.add_argument("--enhance", action="store_true", help="Whether the detail enhancer was used")
    parser.add_argument("--copyright", default="Copyright 2026 pqr.info", help="Copyright text")
    parser.add_argument("--engine", type=int, default=1, help="Render engine version")
    
    args = parser.parse_args()

    # Aspect ratio mapping: 0=square, 1=widescreen, 2=portrait
    aspect_map = {"square": 0, "widescreen": 1, "portrait": 2}
    aspect_ratio_idx = aspect_map[args.aspect]

    print(f"Connecting to Substrate node at {args.url}...")
    try:
        substrate = SubstrateInterface(url=args.url)
    except ConnectionRefusedError:
        print("Failed to connect to the Substrate node. Is it running?")
        return

    keypair = Keypair.create_from_uri(args.suri)
    print(f"Using minter account: {keypair.ss58_address}")

    metadata = {
        "image_hash": args.hash,
        "prompt": args.prompt.encode('utf-8'),
        "aspect_ratio": aspect_ratio_idx,
        "enhance_detail": args.enhance,
        "timestamp": int(time.time()),
        "creator": keypair.ss58_address,
        "copyright_text": args.copyright.encode('utf-8'),
        "render_engine_version": args.engine
    }
    
    print("\nPreparing to mint NFT with metadata:")
    print(json.dumps({k: str(v) for k, v in metadata.items()}, indent=2))
    
    call = substrate.compose_call(
        call_module='ImageFXNFT',
        call_function='mint',
        call_params={
            'metadata': metadata
        }
    )

    extrinsic = substrate.create_signed_extrinsic(call=call, keypair=keypair)

    print("\nSubmitting extrinsic to the chain...")
    try:
        receipt = substrate.submit_extrinsic(extrinsic, wait_for_inclusion=True)
        print(f"✅ Extrinsic included in block: {receipt.block_hash}")
        if receipt.is_success:
            print("🎉 NFT Successfully Minted!")
        else:
            print("❌ Extrinsic failed:")
            print(receipt.error_message)
            
    except SubstrateRequestException as e:
        print(f"Failed to submit extrinsic: {e}")

if __name__ == "__main__":
    main()
