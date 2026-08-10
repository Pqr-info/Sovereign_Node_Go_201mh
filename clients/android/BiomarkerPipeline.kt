package com.pqr.info.client

import com.pqr.info.client.AndroidMeshClient
import com.pqr.info.client.BiomarkerModel
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import swend.epistemic.EpistemicDelta
import kotlin.math.sqrt

class BiomarkerPipeline(
    private val scope: CoroutineScope,
    private val biomarkerModel: BiomarkerModel,
    private val meshClient: AndroidMeshClient
) {

    private val mfccWindow = ArrayList<FloatArray>()
    private var lastEmbedding: FloatArray? = null

    fun start(featureFrames: Flow<FloatArray>) {
        scope.launch {
            featureFrames.collectLatest { frame ->
                mfccWindow.add(frame)
                if (mfccWindow.size >= 32) {
                    val embedding = biomarkerModel.infer(mfccWindow)
                    val delta = buildDelta(embedding)
                    meshClient.submit(delta)
                    mfccWindow.clear()
                }
            }
        }
    }

    private fun buildDelta(embedding: FloatArray): EpistemicDelta {
        val sigmaId = hashEmbedding(embedding)
        val semanticWeight = computeDeviation(embedding, lastEmbedding)
        lastEmbedding = embedding

        return EpistemicDelta.newBuilder()
            .setSigmaId("android://biomarker/$sigmaId")
            .setSemanticWeight(semanticWeight)
            .setConfidence(0.9)
            .setProvenance("android-node-001")
            .setTimestamp(System.currentTimeMillis().toString())
            .setDeltaTypeValue(1)      // OBSERVATION
            .setRelationTypeValue(3)   // INTRODUCES
            .setDeltaId("delta-" + System.currentTimeMillis())
            .build()
    }

    private fun hashEmbedding(vec: FloatArray): String {
        var h = 1125899906842597L
        for (v in vec) {
            val bits = java.lang.Float.floatToIntBits(v)
            h = 31 * h + bits
        }
        return h.toString(16)
    }

    private fun computeDeviation(cur: FloatArray, prev: FloatArray?): Double {
        if (prev == null || prev.size != cur.size) return 0.0
        var sum = 0.0
        for (i in cur.indices) {
            val d = (cur[i] - prev[i]).toDouble()
            sum += d * d
        }
        return sqrt(sum)
    }
}
