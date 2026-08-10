import asyncio
import sys
import os

# Add the directory to sys.path to ensure we can import router
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from router import LLMMeshRouter

async def test_qwen_max():
    router = LLMMeshRouter()
    router.lmstudio_base_url = "http://127.0.0.1:1234/v1"
    
    prompt = """
Write a highly optimized Python class for a Trie (prefix tree) that supports the following operations:
1. `insert(word)`: Inserts a string into the trie.
2. `search(word)`: Returns true if the string is in the trie (as a whole word).
3. `starts_with(prefix)`: Returns true if there is any string in the trie that starts with the given prefix.
4. `find_words_with_prefix(prefix)`: Returns a list of all words in the trie that start with the given prefix.

Ensure the code includes type hints and docstrings.
"""
    messages = [
        {"role": "system", "content": "You are Qwen-Coder-30b Expert."},
        {"role": "user", "content": prompt}
    ]
    
    print("Sending request to LLMMeshRouter...")
    result = await router.route_inference(messages, task_type="code")
    
    print("Response from Router:")
    print("Source:", result.get("source"))
    if "error" in result:
        print("Error:", result["error"])
    else:
        print("Response Content:\n", result.get("response"))

if __name__ == "__main__":
    asyncio.run(test_qwen_max())
