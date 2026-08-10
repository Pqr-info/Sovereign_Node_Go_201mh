package com.pqr.info.client

import io.grpc.ManagedChannelBuilder
import swend.epistemic.EpistemicDelta
import swend.epistemic.MeshDeltaServiceGrpc
import swend.epistemic.SubmitAck

class AndroidMeshClient(
    host: String = "10.0.2.2", // Android emulator -> host machine
    port: Int = 50051
) {
    private val channel = ManagedChannelBuilder
        .forAddress(host, port)
        .usePlaintext()
        .build()

    private val stub = MeshDeltaServiceGrpc.newBlockingStub(channel)

    fun submit(delta: EpistemicDelta): SubmitAck {
        return stub.submitDelta(delta)
    }
}
