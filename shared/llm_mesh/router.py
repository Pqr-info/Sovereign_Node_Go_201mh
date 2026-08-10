import os
import aiohttp
import asyncio
import json

class LLMMeshRouter:
    def __init__(self):
        self.lmstudio_base_url = "http://localhost:1234/v1"
        self.gemma_base_url = os.getenv("GEMMA_API_BASE", "http://localhost:8000/v1")
        
        # We can implement dynamic balancing here based on the requested capabilities
        # e.g., code generation might go to Qwen3, general chat to Gemma-4
    
    async def route_inference(self, messages, task_type="chat", model_preference=None):
        """
        Dynamically route the inference task to the most appropriate node in the mesh.
        task_type: "chat" or "code"
        """
        # Determine target based on preference or task type
        target = "gemma4"
        if model_preference:
            target = model_preference
        elif task_type == "code":
            target = "qwen3"
            
        if target == "qwen3":
            return await self._call_lmstudio(messages)
        else:
            return await self._call_gemma(messages)

    async def _call_lmstudio(self, messages):
        url = f"{self.lmstudio_base_url}/chat/completions"
        payload = {
            "model": "qwen/qwen3-coder-next",
            "messages": messages,
            "temperature": 0.7
        }
        timeout = aiohttp.ClientTimeout(total=3600)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            try:
                async with session.post(url, json=payload) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        return {
                            "source": "max-qwen3-lmstudio",
                            "response": data["choices"][0]["message"]["content"]
                        }
                    else:
                        error_text = await resp.text()
                        return {"error": f"LMStudio API error: {resp.status} - {error_text}"}
            except Exception as e:
                import traceback
                traceback.print_exc()
                return {"error": f"Connection to LMStudio failed: {repr(e)}"}

    async def _call_gemma(self, messages):
        url = f"{self.gemma_base_url}/chat/completions"
        payload = {
            "model": "gemma-4",
            "messages": messages,
            "temperature": 0.7
        }
        async with aiohttp.ClientSession() as session:
            try:
                async with session.post(url, json=payload) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        return {
                            "source": "gemma4-node",
                            "response": data["choices"][0]["message"]["content"]
                        }
                    else:
                        error_text = await resp.text()
                        return {"error": f"Gemma API error: {resp.status} - {error_text}"}
            except Exception as e:
                return {"error": f"Connection to Gemma failed: {str(e)}"}

# Example usage
async def main():
    router = LLMMeshRouter()
    
    print("Testing code task routing (should hit Max/Qwen3):")
    res = await router.route_inference([{"role": "user", "content": "Write a python script"}], task_type="code")
    print(res)

if __name__ == "__main__":
    asyncio.run(main())
