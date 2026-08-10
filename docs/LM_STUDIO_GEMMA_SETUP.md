# Gemma-4-e4b Setup Guide for LM Studio (Quantasona Configuration)

This guide provides instructions for setting up the local Gemma-4-e4b inference environment for SWEND agent orchestration.

## 1. Install LM Studio
Download LM Studio from the official site and install it normally on Windows.

After installation:
1. Launch LM Studio.
2. Open **Settings → Models**.
3. Ensure **CUDA** or **DirectML** backend is available.
4. Restart LM Studio once so it initializes GPU/NPU backends cleanly.

---

## 2. Download Gemma-4-e4b
Inside LM Studio:
1. Go to **Models → Download Models**.
2. Search for: `google/gemma-4-e4b`.
3. Download the **Q4_K_M** or **Q4_K_S** quantization.

*Note: This model requires 16–24 GB VRAM (depending on quantization) and a stable pagefile (16–32 GB recommended).*

---

## 3. Configure LM Studio for Gemma-4-e4b
Open **Settings → Inference** and apply the following:

### CPU / GPU Settings
- **GPU Backend:** CUDA (or DirectML for Ryzen NPU stability)
- **GPU Layers:** Max (auto)
- **CPU Threads:** **3**
- **Batch Size:** Auto
- **Context Overflow:** **Truncate Middle**

### Sampling Settings
Apply the following parameters for stable agent-mode behavior:

| Setting | Value |
|--------|--------|
| Temperature | **1.0** |
| Top-K | **64** |
| Top-P | **0.95** |
| Min-P | **0.05** |
| Repeat Penalty | **1.1** |
| Presence Penalty | **0** |
| Frequency Penalty | **0** |
| Structured Output | **Off** |

---

## 4. Enable the Local Server (for Brain-Agent Mode)
Go to **Settings → Developer → Local Server** and enable:
- **Start server automatically**
- **Allow local requests**
- **Port:** **4111** (standard port mapping)

LM Studio will expose the endpoint at:
```http
http://localhost:4111/v1/chat/completions
```

---

## 5. Test Gemma in Brain-Agent Mode
Send the following JSON request to the completions endpoint:
```json
{
  "model": "google/gemma-4-e4b",
  "messages": [
    {
      "role": "user",
      "content": "system: you are in brain agent mode. respond with internal reasoning and planning."
    }
  ]
}
```
Verify that the output contains structured plans and internal chain-of-thought traces.

---

## 6. Troubleshooting "Ghost VRAM" Context Leaks
If you encounter VRAM context leaks:
1. **Reset GPU Driver**: Press `Win + Ctrl + Shift + B`.
2. **Kill Orphaned Processes**: Run in PowerShell (Admin):
   ```powershell
   taskkill /IM "lmstudio.exe" /F
   taskkill /IM "python.exe" /F
   taskkill /IM "node.exe" /F
   taskkill /IM "llama.cpp*" /F
   ```
3. **Increase Pagefile**: Set Initial size to **16 GB** and Max size to **32 GB**.

---

## 7. NPU Stability Mode (Optional)
If CUDA becomes unstable:
- Switch the backend to **DirectML**.
- Reduce GPU layers slightly.
- Keep CPU threads at **3**.
