package com.pqr.info.client

import io.grpc.ManagedChannelBuilder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import swend.epistemic.MeshDeltaServiceGrpc
import swend.epistemic.StreamRequest

class AndroidMeshStream(
    host: String = "10.0.2.2",
    port: Int = 50051
) {
    private val channel = ManagedChannelBuilder
        .forAddress(host, port)
        .usePlaintext()
        .build()

    private val stub = MeshDeltaServiceGrpc.newBlockingStub(channel)

    suspend fun stream(onDelta: (String) -> Unit) = withContext(Dispatchers.IO) {
        val req = StreamRequest.newBuilder().build()
        val stream = stub.streamDeltas(req)

        while (true) {
            val delta = stream.next()
            onDelta("Collapse: ${delta.sigmaId} (conf=${delta.confidence})")
        }
    }
}
