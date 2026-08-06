import asyncio
import sys
import os

# Add the directory to sys.path to ensure we can import router
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shared', 'llm_mesh'))
from router import LLMMeshRouter

async def ask_mesh():
    router = LLMMeshRouter()
    router.lmstudio_base_url = "http://192.168.12.234:1234/v1"
    
    with open("C:/Users/theal/.gemini/antigravity/brain/174beb6c-e8d5-46c2-936c-f1e37efe7d49/implementation_plan.md", "r", encoding="utf-8") as f:
        plan = f.read()
        
    prompt = f"""
We are implementing QRI-001 (Quantum-Resilient Identity & Session Layer) for our SpaceBook 5D NPU mesh.
Here is the implementation plan:

{plan}

Please review this plan and answer the Open Questions:
1. MPC Key Rotation (edge-to-edge vs stratum-mediated)
2. ZKP Framework selection (arkworks vs threshold signatures) for mobile nodes.
"""
    messages = [
        {"role": "system", "content": "You are a senior cryptography architect."},
        {"role": "user", "content": prompt}
    ]
    
    print("Asking Qwen3...")
    result_qwen = await router.route_inference(messages, task_type="code")
    with open("qwen3_qri_response.txt", "w", encoding="utf-8") as f:
        f.write(result_qwen.get("response", str(result_qwen)))
        
    print("Asking Gemma on Max...")
    result_gemma = await router.route_inference(messages, task_type="chat")
    with open("gemma_qri_response.txt", "w", encoding="utf-8") as f:
        f.write(result_gemma.get("response", str(result_gemma)))

if __name__ == "__main__":
    asyncio.run(ask_mesh())
