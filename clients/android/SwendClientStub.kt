package com.pqr.info.client

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * 🌀 SwendClientStub
 *
 * Exposes core Swarm interaction APIs to Android client contexts (e.g. Kotlin-based application).
 * Routes deliberations, registers capabilities, and commits status reports via the gRPC/REST proxy.
 */
class SwendClientStub(private val apiHost: String = "10.0.2.2", private val apiPort: Int = 8196) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    private val mediaTypeJson = "application/json; charset=utf-8".toMediaType()
    private val baseURL = "http://$apiHost:$apiPort/REST/2.0"

    /**
     * Registers this Android node with the Swarm Control Plane.
     * Exposes mobile-specific capabilities like EMULATOR_CONTROL or MOBILE_LEDGER.
     */
    fun registerNode(nodeId: String, capabilities: List<String>): JSONObject {
        val payload = JSONObject().apply {
            put("AgentType", "android_client")
            put("OS", "android")
            put("NodeID", nodeId)
            put("Capabilities", JSONObject(mapOf("list" to capabilities)))
        }

        val request = Request.Builder()
            .url("$baseURL/agent/register")
            .post(payload.toString().toRequestBody(mediaTypeJson))
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Registration failed: ${response.message}")
            return JSONObject(response.body?.string() ?: "{}")
        }
    }

    /**
     * Periodically reports node metrics and consensus state to Starbirth validator council.
     */
    fun startHeartbeatEmitter(nodeId: String, intervalMs: Long = 10000): Flow<JSONObject> = flow {
        while (true) {
            val payload = JSONObject().apply {
                put("agent_id", nodeId)
                put("status", "active")
                put("battery_level", 94) // Simulated telemetry
                put("timestamp", System.currentTimeMillis())
            }

            val request = Request.Builder()
                .url("$baseURL/agent/$nodeId/heartbeat")
                .post(payload.toString().toRequestBody(mediaTypeJson))
                .build()

            try {
                client.newCall(request).execute().use { response ->
                    val resBody = response.body?.string() ?: "{}"
                    emit(JSONObject(resBody))
                }
            } catch (e: Exception) {
                emit(JSONObject().put("error", e.message))
            }
            kotlinx.coroutines.delay(intervalMs)
        }
    }.flowOn(Dispatchers.IO)

    /**
     * Submits a newly verified ledger mutation proposal back to the swarm consensus.
     */
    fun submitMutation(proposer: String, targetKey: String, value: String): JSONObject {
        val payload = JSONObject().apply {
            put("proposer_agent_id", proposer)
            put("target_key", targetKey)
            put("proposed_value", value)
            put("change_reason", "Android client sensor submission")
        }

        val request = Request.Builder()
            .url("$baseURL/mutation/propose")
            .post(payload.toString().toRequestBody(mediaTypeJson))
            .build()

        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Mutation proposal failed: ${response.message}")
            return JSONObject(response.body?.string() ?: "{}")
        }
    }
}
