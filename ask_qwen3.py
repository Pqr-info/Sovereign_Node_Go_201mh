import asyncio
import sys
import os

# Add the directory to sys.path to ensure we can import router
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shared', 'llm_mesh'))
from router import LLMMeshRouter

async def test_qwen_max():
    router = LLMMeshRouter()
    # Ensure we hit the correct LMStudio IP (using the one from test_qwen.js)
    router.lmstudio_base_url = "http://192.168.12.234:1234/v1"
    
    prompt = """
We have successfully implemented the LPV-5D MIDI Execution Layer, the SpaceBook CLI & Mothership Compute Delegation Platform (with Stratum server, Teleportation Scheduler, and Jetweb Time Machine), and formalized the topological solver in Rust. We also just finalized the Production Deployment Manifest.

What should we tackle next in the SpaceBook 5D ecosystem?
"""
    messages = [
        {"role": "system", "content": "You are Qwen3-Coder-Next Expert, part of the Sovereign Mesh."},
        {"role": "user", "content": prompt}
    ]
    
    print("Sending request to LLMMeshRouter (Qwen3)...")
    result = await router.route_inference(messages, task_type="code")
    
    print("Response from Router:")
    if "error" in result:
        print("Error:", result["error"])
    else:
        with open("qwen3_response.txt", "w", encoding="utf-8") as f:
            f.write(result.get("response"))
        print("Response saved to qwen3_response.txt")

if __name__ == "__main__":
    asyncio.run(test_qwen_max())
