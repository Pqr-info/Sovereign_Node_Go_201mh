**LPV-5D Signal Processing Unit**

LPV-5D Core Specifications Rev 1.0

DAL Blueprint and SysEx Matrix Serialization Pipeline

  -------------------------------------
  **Document Title**   **LPV-5D Core
                       Specifications
                       Rev 1.0 --- DAL
                       Blueprint and
                       SysEx Matrix
                       Serialization
                       Pipeline**
  -------------------- ----------------
  **System**           **LPV-5D Signal
                       Processing
                       Unit**

  **Document Status**  **APPROVED ---
                       Production
                       Release**

  **Authors**          **LPV
                       Engineering
                       Team**

  **Date**             **2026-08-06**

  **Classification**   **Internal ---
                       Engineering**

  **Specification      **1.0**
  Revision**           
  -------------------------------------

Revision History

  -------------------------------------------------
  **Rev**   **Date**     **Author**    **Change
                                       Summary**
  --------- ------------ ------------- ------------
  1.0       2026-08-06   LPV           Initial
                         Engineering   production
                         Team          release

  -------------------------------------------------

Table of Contents

**PART I --- Drift Arbitration Loop (DAL) Blueprint**

1\. Purpose and Scope

2\. Definitions and Acronyms

3\. DAL Architecture Overview

4\. Arbitration State Machine

4.1 State Definitions

4.2 State Transition Rules

5\. Macro-Rotation Sequences

5.1 MRS Catalogue

5.2 MRS Composition Rules

5.3 Angle Resolution Protocol

6\. Loop Timing and Arbitration Window

7\. Priority Arbitration Rules

7.1 Priority Token Assignment

7.2 Conflict Resolution

7.3 Priority Queue Schema

8\. DAL Invariants

**PART II --- SysEx Matrix Serialization Pipeline**

9\. Purpose and Scope

10\. SysEx Framing Specification

10.1 Packet Structure

10.2 Packet Type Registry

10.3 FLAGS Byte

10.4 CRC Specification

11\. Encoding and Data-Type Mappings

11.1 8-to-7 Encoding

11.2 Data-Type Encoding Table

11.3 Run-Length Compression

12\. Pipeline Stages

13\. SSM Snapshot Payload Schema

14\. Migration Rules

14.1 Versioning Policy

14.2 Migration Packet Format

14.3 Migration Procedures

14.4 Migration Version History

15\. Error Handling and FAULT Records

16\. Conformance Requirements

17\. Appendix A --- Drift Threshold Reference Values

18\. Appendix B --- Normative References

+----------------------------------------+
| PART I                                 |
|                                        |
| ---                                    |
|                                        |
| Drift Arbitration Loop (DAL) Blueprint |
+----------------------------------------+

1\. Purpose and Scope

The Drift Arbitration Loop (DAL) is the real-time, closed-loop control
mechanism responsible for detecting, classifying, and resolving
phase-drift events within the LPV-5D signal matrix. It operates
continuously across all active channels of the Signal State Matrix
(SSM), evaluating drift conditions on every Loop Tick and coordinating
the application of Macro-Rotation Sequences to restore signal vector
alignment within defined thresholds.

This specification defines the complete state machine governing DAL
operation, the catalogue and composition rules for Macro-Rotation
Sequences, priority arbitration rules for concurrent drift events, loop
timing constraints, formal invariants that **MUST** hold throughout all
DAL operation, and the interface contracts between the three tiers of
the DAL architecture.

The scope of this Part is limited to the internal operation of the DAL
subsystem as implemented within the LPV-5D Signal Processing Unit. All
modules interfacing with the DAL --- including host software,
configuration controllers, and downstream signal consumers --- **MUST**
conform to this specification. Requirements stated with the keywords
**MUST**, **SHALL**, **SHOULD**, **MAY**, **MUST NOT**, and **SHALL
NOT** are normative per RFC 2119.

2\. Definitions and Acronyms

  -------------------------------------
  **Term**         **Definition**
  ---------------- --------------------
  DAL              Drift Arbitration
                   Loop --- the
                   real-time feedback
                   control subsystem of
                   the LPV-5D
                   responsible for
                   detecting,
                   arbitrating, and
                   resolving
                   phase-drift events.

  Phase Drift      Accumulated angular
                   deviation of a
                   signal vector beyond
                   the configured drift
                   threshold, measured
                   in degrees.

  Arbitration      The discrete time
  Window           slice in which drift
                   candidates are
                   evaluated and
                   resolved. Nominally
                   1000 µs (4 Loop
                   Ticks).

  Macro-Rotation   A compound
                   multi-axis rotation
                   sequence applied to
                   a signal vector to
                   restore alignment to
                   within drift
                   thresholds.

  Rotation Frame   The coordinate frame
                   in which a
                   Macro-Rotation is
                   expressed; either
                   Global Rotation
                   Frame (GRF) or Local
                   Rotation Frame
                   (LRF).

  Drift Candidate  A signal vector that
                   has exceeded the
                   minor drift
                   threshold (δ_min)
                   but not yet the
                   critical drift
                   threshold (δ_crit).

  Priority Token   A monotonically
                   increasing 32-bit
                   unsigned integer
                   assigned to each
                   Drift Candidate at
                   detection time, used
                   for ordering
                   conflict resolution.

  Arbitration      A contiguous
  Epoch            sequence of
                   Arbitration Windows
                   sharing the same
                   base Rotation Frame.
                   Duration is
                   nominally 65,536
                   Loop Ticks (≈16.384
                   s).

  Loop Tick        The fundamental DAL
                   clock period,
                   nominally 250 µs.
                   All DAL timing is
                   expressed as an
                   integer multiple of
                   Loop Ticks.

  Hold Invariant   A formal constraint
                   that must hold
                   across all
                   Arbitration Windows
                   within an
                   Arbitration Epoch.

  GRF              Global Rotation
                   Frame --- the fixed
                   external coordinate
                   frame used as the
                   default reference
                   for Macro-Rotation
                   Sequences.

  LRF              Local Rotation Frame
                   --- a channel-local
                   coordinate frame,
                   specified by an
                   origin vector, used
                   for micro-trim and
                   post-correction
                   operations.

  SSM              Signal State Matrix
                   --- the shared data
                   structure
                   representing the
                   instantaneous state
                   of all active signal
                   channels in the
                   LPV-5D.

  CRC              Cyclic Redundancy
                   Check ---
                   specifically
                   CRC-16/CCITT-FALSE
                   as defined in
                   Section 10.4 of this
                   specification.
  -------------------------------------

3\. DAL Architecture Overview

The DAL is structured as a three-tier architecture. Each tier operates
as a distinct functional layer, with inter-tier communication performed
exclusively via in-process lock-free ring buffers of bounded capacity as
specified in Section 6.

Tier 1 --- Detection Layer

Tier 1 continuously samples the Signal State Matrix (SSM) at every Loop
Tick. It computes instantaneous drift magnitudes for all active channels
by comparing current signal vector orientations against reference
orientations. For each channel whose drift magnitude exceeds δ_min, Tier
1 constructs a Drift Candidate record and enqueues it into the
Arbitration Queue for consumption by Tier 2. Tier 1 also receives
residual drift reports from Tier 3 and updates the SSM accordingly.

Tier 2 --- Arbitration Layer

Tier 2 consumes Drift Candidate records from the Arbitration Queue
within each Arbitration Window. It applies priority ordering per Section
7, resolves conflicts between candidates targeting the same axis,
selects the appropriate Macro-Rotation Sequence (MRS) from the catalogue
defined in Section 5, and dispatches rotation commands to Tier 3. In the
event of a CRITICAL condition, Tier 2 preempts normal arbitration and
dispatches MRS-06 within the deadline defined in Section 6.

Tier 3 --- Execution Layer

Tier 3 receives rotation commands from Tier 2 and applies Macro-Rotation
Sequences to the target signal vectors. Upon completion of each MRS
execution, Tier 3 computes the residual drift for the affected
channel-axis pairs and reports both completion status and residual drift
values back to Tier 1 via the feedback ring buffer. Tier 3 enforces the
execution timeout defined in Section 6 and transitions to FAULT state on
timeout expiry.

+----------------------------------------------------------------------+
| NOTE:                                                                |
|                                                                      |
| Inter-tier communication is performed exclusively via in-process,    |
| lock-free ring buffers with bounded capacity. The Arbitration Queue  |
| (Tier 1 → Tier 2)                                                    |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| have a maximum capacity of 128 entries per INV-02. The feedback      |
| buffer (Tier 3 → Tier 1)                                             |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| have a maximum capacity of 64 entries. Buffer sizing constraints are |
| invariant and                                                        |
|                                                                      |
| **SHALL NOT**                                                        |
|                                                                      |
| be modified at runtime.                                              |
+----------------------------------------------------------------------+

4\. Arbitration State Machine

4.1 State Definitions

The DAL state machine comprises six states. Each state is identified by
a symbolic name and a numeric state ID. The following table defines the
entry conditions, exit conditions, and actions associated with each
state.

  ----------------------------------------------------------------------------
  **State**       **ID**   **Entry          **Exit            **Actions**
                           Condition**      Condition**       
  --------------- -------- ---------------- ----------------- ----------------
  **IDLE**        S0       System           Any Drift         None; Loop Ticks
                           initialization   Candidate         are consumed
                           complete; no     detected and      passively.
                           active Drift     enqueued.         Watchdog
                           Candidates                         **MUST** be
                           present in                         reset per
                           Arbitration                        INV-07.
                           Queue.                             

  **SCAN**        S1       One or more      Arbitration       Enumerate all
                           Drift Candidates Window expires;   queued Drift
                           enqueued in the  or CRITICAL event Candidates;
                           Arbitration      detected.         assign Priority
                           Queue.                             Tokens per
                                                              Section 7.1;
                                                              compute drift
                                                              magnitudes;
                                                              classify
                                                              candidates as
                                                              CRITICAL or
                                                              non-CRITICAL.

  **ARBITRATE**   S2       SCAN phase       Conflict          Apply priority
                           complete within  resolution        ordering per
                           the current      complete and MRS  Section 7.2;
                           Arbitration      selected; or      resolve axis
                           Window; no       CRITICAL event    conflicts;
                           CRITICAL event   detected.         select
                           pending.                           Macro-Rotation
                                                              Sequence;
                                                              prepare rotation
                                                              command for
                                                              dispatch to Tier
                                                              3.

  **EXECUTE**     S3       Macro-Rotation   Execution         Dispatch
                           Sequence         complete and      rotation
                           selected by Tier residual drift    commands to Tier
                           2; rotation      below δ_min; or   3; monitor
                           command          execution failure execution
                           dispatched to    or invariant      against T_exec
                           Tier 3.          violation.        timeout; enforce
                                                              Hold Invariants
                                                              per Section 8;
                                                              receive residual
                                                              drift report.

  **CRITICAL**    S4       Any channel\'s   Residual drift    Suspend normal
                           drift magnitude  below δ_min on    arbitration;
                           meets or exceeds all channels      dispatch MRS-06
                           δ_crit at any    following         within T_crit;
                           point in any     emergency         alert host
                           state.           macro-rotation;   system via
                                            or emergency      DAL_STATUS
                                            execution         packet; queue
                                            failure.          any additional
                                                              CRITICAL events
                                                              for sequential
                                                              processing.

  **FAULT**       S5       Execution        Manual reset or   Freeze SSM to
                           failure in S3 or power cycle only. last known-good
                           S4; invariant    This state is     snapshot; emit
                           violation per    terminal under    FAULT_RECORD
                           Section 8;       normal operation. SysEx packet;
                           watchdog expiry                    assert FAULT_N
                           in any non-FAULT                   signal on
                           state.                             hardware
                                                              interface. No
                                                              further
                                                              arbitration.
  ----------------------------------------------------------------------------

4.2 State Transition Rules

The following transition rules are normative. The DAL implementation
**MUST** enforce all transitions as specified. No transitions other than
those listed below are permitted.

  ---------------------------------
  **Transition**   **Trigger
                   Condition**
  ---------------- ----------------
  S0 → S1          Drift Candidate
                   detected and
                   enqueued in the
                   Arbitration
                   Queue from any
                   channel.

  S1 → S2          Arbitration
                   Window (T_arb)
                   expires with no
                   CRITICAL event
                   detected during
                   SCAN.

  S1 → S4          CRITICAL event
                   (drift magnitude
                   ≥ δ_crit)
                   detected on any
                   channel during
                   the SCAN phase.

  S2 → S3          Conflict
                   resolution
                   complete;
                   Macro-Rotation
                   Sequence
                   selected and
                   rotation command
                   prepared.

  S2 → S4          CRITICAL event
                   detected on any
                   channel during
                   the ARBITRATE
                   phase.

  S3 → S0          MRS execution
                   complete;
                   residual drift
                   on the affected
                   channel-axis
                   pair is below
                   δ_min;
                   Arbitration
                   Queue is empty.

  S3 → S1          MRS execution
                   complete;
                   residual drift
                   is above δ_min
                   but strictly
                   below δ_crit on
                   the affected
                   channel.

  S3 → S5          MRS execution
                   failure;
                   execution
                   timeout (T_exec)
                   exceeded; or any
                   invariant
                   violation per
                   Section 8.

  S4 → S0          Emergency MRS-06
                   execution
                   complete;
                   residual drift
                   on all channels
                   is below δ_min.

  S4 → S5          Emergency MRS-06
                   execution
                   failure; or
                   invariant
                   violation during
                   CRITICAL
                   handling.

  S5 → (any)       Terminal.
                   Transition out
                   of FAULT
                   requires manual
                   reset or power
                   cycle. Automated
                   transition is
                   not permitted.
  ---------------------------------

5\. Macro-Rotation Sequences

A Macro-Rotation Sequence (MRS) is an ordered tuple of elementary
rotations expressed in the form MRS(id, frame, axes, angles, duration),
where id is the unique numeric identifier, frame is the Rotation Frame
(GRF or LRF), axes is the ordered sequence of rotation axes, angles is
the set of nominal rotation angles in degrees, and duration is the
execution duration in Loop Ticks. Actual applied angles are resolved at
dispatch time per Section 5.3.

5.1 MRS Catalogue

The following eight MRS entries constitute the complete LPV-5D MRS
catalogue. The LPV-5D implementation **MUST** implement all eight
entries as specified. No entries **MAY** be omitted or substituted.

  ---------------------------------------------------------------------------------------------------
  **ID**   **Name**      **Frame**   **Axis       **Nominal Angle Set  **Duration   **Trigger
                                     Sequence**   (deg)**              (ticks)**    Condition**
  -------- ------------- ----------- ------------ -------------------- ------------ -----------------
  MRS-01   Minor Azimuth GRF         \[Z\]        \[±2.5\]             4            Single-channel
           Correction                                                               δ_min breach,
                                                                                    azimuth axis.

  MRS-02   Minor         GRF         \[Y\]        \[±2.5\]             4            Single-channel
           Elevation                                                                δ_min breach,
           Correction                                                               elevation axis.

  MRS-03   Compound      GRF         \[Z, Y\]     \[±5.0, ±2.5\]       8            Multi-channel
           Planar                                                                   δ_min breach,
           Correction                                                               planar deviation.

  MRS-04   Full Triaxial GRF         \[Z, Y, X\]  \[±7.5, ±5.0, ±2.5\] 16           Multi-channel
           Realignment                                                              drift across all
                                                                                    three axes.

  MRS-05   Local Frame   LRF         \[X, Y\]     \[±1.0, ±1.0\]       2            Post-correction
           Micro-Trim                                                               residual trim in
                                                                                    LRF context;
                                                                                    residual below
                                                                                    δ_trim.

  MRS-06   Emergency     GRF         \[X, Y, Z\]  \[0.0, 0.0, 0.0\]    32           CRITICAL state
           Full Reset                                                               (S4); absolute
                                                                                    zero-reference
                                                                                    realignment.

  MRS-07   Epoch         GRF         \[Z\]        \[epoch_delta\]      6            Arbitration Epoch
           Boundary Sync                                                            boundary
                                                                                    crossing;
                                                                                    synchronization
                                                                                    of Z-axis to
                                                                                    epoch reference.

  MRS-08   LRF-to-GRF    LRF→GRF     \[X, Y, Z\]  \[handoff_offset\]   12           Frame transition
           Handoff                                                                  on Epoch boundary
                                                                                    change from LRF
                                                                                    to GRF context.
  ---------------------------------------------------------------------------------------------------

5.2 MRS Composition Rules

The following rules govern the composition of multiple MRS entries
within a single Arbitration Window. All rules are normative.

1.  Sequences **MAY** be composed into a Composite MRS when two or more
    non-conflicting sequences are selected in the same Arbitration
    Window. Sequences are non-conflicting if they do not share an axis
    assignment within the same Loop Tick.

2.  Composite sequences **MUST** be expressed as the ordered
    concatenation of elementary MRS steps, with no overlap in axis
    assignment within the same Loop Tick interval.

3.  A Composite MRS **MUST NOT** exceed 64 Loop Ticks in total duration.
    If the sum of constituent durations exceeds 64 ticks, the
    lowest-priority constituent **SHALL** be deferred to the next
    Arbitration Window.

4.  Angle sets for composed sequences are summed per axis across all
    constituent MRS entries. The summed result on any single axis **MUST
    NOT** exceed ±45.0 degrees. Compositions that would exceed this
    limit **MUST** be rejected and the highest-priority constituent
    executed alone.

5.  In CRITICAL state (S4), MRS-06 preempts all other sequences
    unconditionally. No Composite MRS **SHALL** be formed during
    CRITICAL state. All pending composition candidates are discarded and
    re-evaluated upon return to S0 or S1.

5.3 Angle Resolution Protocol

The actual rotation angles applied by a given MRS are resolved at
dispatch time by Tier 2, using the current SSM snapshot and the active
Epoch context. The resolution protocol is defined by the following
pseudocode, which constitutes a normative description of the required
computation. Implementations **MUST** produce equivalent results.

function resolve_angles(mrs_id, ssm_snapshot, epoch_context):
base_angles = MRS_CATALOGUE\[mrs_id\].nominal_angles drift_vector =
ssm_snapshot.drift_vector_for(mrs_id) scale_factor =
clamp(drift_vector.magnitude / δ_crit, 0.0, 1.0) resolved = base_angles
\* scale_factor if epoch_context.frame == LRF: resolved =
transform_to_lrf(resolved, epoch_context.lrf_origin) assert all(abs(a)
\<= 45.0 for a in resolved), \"ANGLE_RANGE_VIOLATION\" return resolved

The assertion on the final line is normative: if any resolved angle
exceeds ±45.0 degrees, the dispatch **MUST** be aborted and a
FAULT_RECORD with fault code ANGLE_RANGE (0x0002) **SHALL** be emitted.
This constitutes a violation of INV-04.

6\. Loop Timing and Arbitration Window

All DAL timing is derived from the system master clock. The Loop Tick
period (T_tick) is the fundamental time unit. All other timing
parameters are expressed as multiples of T_tick. Implementations
**MUST** enforce all hard-limit tolerances; no runtime override of
hard-limit parameters is permitted.

  ----------------------------------------------------------------------
  **Parameter**   **Symbol**   **Nominal   **Tolerance**   **Notes**
                               Value**                     
  --------------- ------------ ----------- --------------- -------------
  Loop Tick       T_tick       250 µs      ±5 µs           Fundamental
  Period                                                   DAL clock.
                                                           **MUST** be
                                                           strictly
                                                           monotonic per
                                                           INV-01.

  Arbitration     T_arb        1000 µs (4  ±10 µs          Duration of a
  Window                       ticks)                      single SCAN +
                                                           ARBITRATE
                                                           cycle.
                                                           Includes both
                                                           S1 and S2
                                                           phases.

  Execution       T_exec       8000 µs (32 0 (hard limit)  Maximum
  Timeout                      ticks)                      allowed
                                                           duration for
                                                           any single
                                                           MRS
                                                           execution.
                                                           Expiry
                                                           triggers
                                                           FAULT
                                                           transition.

  CRITICAL        T_crit       500 µs (2   0 (hard limit)  Maximum
  Response                     ticks)                      elapsed time
  Deadline                                                 from CRITICAL
                                                           event
                                                           detection to
                                                           MRS-06
                                                           dispatch. See
                                                           INV-08.

  Epoch Duration  T_epoch      65,536      ±1 tick         Duration of
                               ticks                       one
                               (≈16.384 s)                 Arbitration
                                                           Epoch. Epoch
                                                           boundary
                                                           triggers
                                                           MRS-07 or
                                                           MRS-08 as
                                                           applicable.

  Watchdog Period T_wdog       2000 µs (8  0 (hard limit)  DAL watchdog
                               ticks)                      interval.
                                                           Watchdog
                                                           expiry from
                                                           any state
                                                           except FAULT
                                                           triggers
                                                           FAULT
                                                           transition
                                                           per INV-07.
  ----------------------------------------------------------------------

T_tick is derived from the system master clock via a phase-locked loop.
The derived T_tick **MUST** be resynchronized to the master clock
reference at each Epoch boundary to prevent accumulated drift of the DAL
clock relative to the system clock. Resynchronization **SHALL** be
completed before the first Loop Tick of the new Epoch is processed.

7\. Priority Arbitration Rules

7.1 Priority Token Assignment

Priority Tokens are assigned at Drift Candidate detection time by
Tier 1. The following rules govern token assignment and are normative:

- Priority Tokens are 32-bit unsigned integers, assigned as a
  monotonically increasing sequence beginning at 0x00000001 at system
  initialization.

- Each Drift Candidate detected by Tier 1 is assigned the next available
  Priority Token value at the moment the candidate is enqueued.

- In the event of simultaneous detection --- defined as two or more
  channels exceeding δ_min within the same Loop Tick --- candidates are
  assigned Priority Tokens in ascending channel index order (channel 0
  receives the lowest token value).

- Priority Token values wrap at 2^32^ − 1 (0xFFFFFFFF). Implementations
  **MUST** handle wrap-around using wrap-aware comparison arithmetic. A
  token value of T~a~ is considered earlier than T~b~ if (T_b - T_a) mod
  2\^32 \< 2\^31.

- Priority Token 0x00000000 is reserved and **SHALL NOT** be assigned to
  any Drift Candidate.

7.2 Conflict Resolution

A conflict occurs when two or more Drift Candidates within the same
Arbitration Window target the same rotation axis. The following conflict
resolution rules are normative and are applied in the order listed:

6.  **Priority Token Ordering:** Among conflicting candidates on the
    same axis, the candidate with the numerically lower Priority Token
    (earlier detection) takes precedence and is selected for MRS
    dispatch. The lower-priority candidate is deferred to the next
    Arbitration Window.

7.  **Magnitude Promotion Rule:** If the drift magnitudes of two
    conflicting candidates differ by a factor of 10× or greater, the
    candidate with the higher drift magnitude **MUST** be promoted
    regardless of Priority Token ordering. The promoted candidate is
    dispatched in the current window; the demoted candidate is
    re-enqueued with its original Priority Token preserved.

8.  **CRITICAL Serialization:** No more than one CRITICAL candidate
    (drift magnitude ≥ δ_crit) **MAY** be active at any time. Additional
    CRITICAL events detected while in CRITICAL state (S4) **SHALL** be
    enqueued and resolved sequentially in Priority Token order upon
    return to S0. Additional CRITICAL events **SHALL NOT** trigger
    nested CRITICAL processing.

7.3 Priority Queue Schema

The Arbitration Queue is implemented as a lock-free ring buffer of fixed
capacity 128 entries. Each entry in the queue is a DriftCandidate record
defined by the following structure. Implementations **MUST** use a
representation compatible with this schema; field ordering and alignment
**SHALL** be preserved as specified.

struct DriftCandidate { uint32_t priority_token; // Monotonic,
wrap-aware; assigned at detection uint8_t channel_id; // Channel index:
0--255 uint8_t axis_mask; // Bit flags: bit0 = X, bit1 = Y, bit2 = Z
float32_t drift_magnitude; // Absolute drift in degrees (Euclidean
magnitude) uint32_t detection_tick; // Loop Tick counter value at
detection time bool is_critical; // true if drift_magnitude \>= δ_crit
uint8_t mrs_candidate; // Suggested MRS ID from Tier 1 classification
uint8_t \_reserved\[2\]; // Padding; set to 0x00; ensures 16-byte
alignment };

The total size of a DriftCandidate record is 16 bytes. The Arbitration
Queue **MUST** be allocated as a contiguous block of 128 × 16 = 2048
bytes. Queue access **SHALL** be performed only via the lock-free
enqueue and dequeue operations; direct memory access to queue entries by
any layer other than Tier 1 (enqueue) and Tier 2 (dequeue) is not
permitted.

8\. DAL Invariants

The following invariants **MUST** hold at all times during DAL
operation. Violation of any invariant **SHALL** trigger an immediate,
unconditional transition to FAULT state (S5). Invariant checking is
performed continuously by the Tier 2 Arbitration Layer and by dedicated
monitoring logic in Tier 3.

+----------------------------------------------------------------------+
| **INV-01**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Monotonic Tick:                                                      |
|                                                                      |
| ∀ ticks t                                                            |
|                                                                      |
| i                                                                    |
|                                                                      |
| , t                                                                  |
|                                                                      |
| j                                                                    |
|                                                                      |
| : i                                                                  |
|                                                                      |
| \<                                                                   |
|                                                                      |
| j ⟹ t                                                                |
|                                                                      |
| i                                                                    |
|                                                                      |
| \<                                                                   |
|                                                                      |
| t                                                                    |
|                                                                      |
| j                                                                    |
|                                                                      |
| The Loop Tick counter is strictly monotonically increasing and       |
|                                                                      |
| **MUST NOT**                                                         |
|                                                                      |
| reset, wrap, or repeat within a single Arbitration Epoch. Wrap is    |
| only permissible at an Epoch boundary, and only after the new Epoch  |
| is confirmed to have started.                                        |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-02**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Bounded Queue Depth:                                                 |
|                                                                      |
| \|AQ\| ≤ 128 at all times, where AQ is the Arbitration Queue.        |
|                                                                      |
| Queue depth                                                          |
|                                                                      |
| **MUST NOT**                                                         |
|                                                                      |
| exceed 128 entries. On overflow (enqueue attempt when \|AQ\| = 128), |
| the oldest entry                                                     |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| be evicted and an OVERFLOW FAULT_RECORD                              |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| be emitted. The system                                               |
|                                                                      |
| **SHALL NOT**                                                        |
|                                                                      |
| transition to FAULT on overflow alone; the FAULT_RECORD serves as a  |
| non-fatal notification.                                              |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-03**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Single Active MRS:                                                   |
|                                                                      |
| At most one MRS                                                      |
|                                                                      |
| **MAY**                                                              |
|                                                                      |
| be in EXECUTE state per Arbitration Epoch at any instant. A          |
| Composite MRS counts as a single active MRS for the purpose of this  |
| invariant. Parallel execution of two or more MRS instances, whether  |
| elementary or composite, is a violation.                             |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-04**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Angle Range:                                                         |
|                                                                      |
| ∀ resolved rotation angles α : \|α\| ≤ 45.0°                         |
|                                                                      |
| No rotation command                                                  |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| be dispatched to Tier 3 that contains any angle component whose      |
| absolute value exceeds 45.0 degrees. The assertion in the            |
|                                                                      |
| resolve_angles                                                       |
|                                                                      |
| function (Section 5.3) is the normative enforcement point for this   |
| invariant.                                                           |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-05**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Residual Convergence:                                                |
|                                                                      |
| After at most 3 sequential executions of the same MRS for the same   |
| channel-axis pair, residual drift                                    |
|                                                                      |
| **MUST**                                                             |
|                                                                      |
| show a monotonically decreasing trend. If residual drift does not    |
| decrease after 3 sequential applications (i.e., residual             |
|                                                                      |
| n                                                                    |
|                                                                      |
| ≥ residual                                                           |
|                                                                      |
| n-1                                                                  |
|                                                                      |
| for any n ≤ 3), the candidate                                        |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| be promoted to CRITICAL status and a CONVERGENCE FAULT_RECORD        |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| be emitted.                                                          |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-06**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Epoch Frame Consistency:                                             |
|                                                                      |
| All MRS executions within a single Arbitration Epoch                 |
|                                                                      |
| **MUST**                                                             |
|                                                                      |
| use the same base Rotation Frame (GRF or LRF). The active frame is   |
| established at the start of each Epoch and                           |
|                                                                      |
| **SHALL NOT**                                                        |
|                                                                      |
| change during an Epoch. Frame transitions are only permitted at      |
| Epoch boundaries, enacted exclusively via MRS-07 (GRF epoch sync) or |
| MRS-08 (LRF-to-GRF handoff).                                         |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-07**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| Watchdog Reset:                                                      |
|                                                                      |
| The DAL watchdog timer                                               |
|                                                                      |
| **MUST**                                                             |
|                                                                      |
| be reset at least once within every T_wdog (2000 µs / 8 ticks)       |
| period while the DAL is in any state other than FAULT. Failure to    |
| reset the watchdog within T_wdog                                     |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| cause an immediate, unconditional transition to FAULT state. The     |
| watchdog is a hardware-backed timer and cannot be disabled by        |
| software.                                                            |
+----------------------------------------------------------------------+

+----------------------------------------------------------------------+
| **INV-08**                                                           |
|                                                                      |
| ---                                                                  |
|                                                                      |
| CRITICAL Deadline:                                                   |
|                                                                      |
| From the moment a CRITICAL event is detected (drift magnitude ≥      |
| δ_crit on any channel, in any state), the elapsed time to MRS-06     |
| dispatch                                                             |
|                                                                      |
| **MUST NOT**                                                         |
|                                                                      |
| exceed T_crit (500 µs / 2 ticks). Failure to meet this deadline      |
| constitutes a CRITICAL_TIMEOUT fault and                             |
|                                                                      |
| **SHALL**                                                            |
|                                                                      |
| trigger an immediate transition to FAULT state.                      |
+----------------------------------------------------------------------+

+-------------------------------------+
| PART II                             |
|                                     |
| ---                                 |
|                                     |
| SysEx Matrix Serialization Pipeline |
+-------------------------------------+

9\. Purpose and Scope

The SysEx Matrix Serialization Pipeline (SMSP) is the component of the
LPV-5D Signal Processing Unit responsible for encoding, transmitting,
decoding, and validating the Signal State Matrix (SSM) and associated
DAL control data as MIDI System Exclusive (SysEx) byte streams. The SMSP
provides the sole normative interface between the LPV-5D device and
external host systems for all signal state and control data exchange.

This specification defines the complete SysEx packet framing format,
encoding rules and data-type mappings, the six-stage serialization
pipeline, the SSM snapshot payload schema, schema migration rules, error
handling, and FAULT record encoding for all LPV-5D SysEx data. All SysEx
producers and consumers operating with the LPV-5D --- including host
software, configuration tools, diagnostic utilities, and firmware update
agents --- **MUST** conform to this specification.

This Part is complementary to Part I: the SMSP carries DAL state
information defined in Part I as SysEx payloads. DAL concepts referenced
in this Part are fully defined in Sections 1 through 8.

10\. SysEx Framing Specification

10.1 Packet Structure

All LPV-5D SysEx communications use the following fixed packet framing.
The structure is defined both by the byte-layout description below and
the accompanying field table. In all cases of ambiguity, the byte-layout
description is authoritative.

Byte 0 : 0xF0 (SysEx Start --- MIDI standard) Byte 1--3 : 0x00 0x21 0x4C
(LPV Manufacturer ID, 3-byte extended) Byte 4 : 0x5D (Device ID: LPV-5D)
Byte 5 : VERSION\[7:0\] (Specification version, currently 0x01) Byte 6 :
PKT_TYPE\[7:0\] (Packet type; see Table 10.2) Byte 7--8 :
SEQ_NUM\[15:0\], big-endian (Packet sequence number; wraps at 0xFFFF)
Byte 9--10 : PAYLOAD_LEN\[15:0\], big-endian (Payload byte count, excl.
framing) Byte 11 : FLAGS\[7:0\] (Bit flags; see Table 10.3) Byte 12..N :
PAYLOAD\[0..PAYLOAD_LEN-1\] (7-bit clean encoded payload) Byte N+1--N+2:
CRC16\[15:0\], big-endian (CRC-16/CCITT-FALSE over bytes 1..N; split
into two 7-bit groups: bits\[14:7\] and bits\[6:0\]) Byte N+3 : 0xF7
(SysEx End --- MIDI standard)

+----------------------------------------------------------------------+
| NOTE:                                                                |
|                                                                      |
| All payload bytes                                                    |
|                                                                      |
| **MUST**                                                             |
|                                                                      |
| be 7-bit clean (values 0x00--0x7F inclusive). Native 8-bit data      |
| values are encoded into the payload region using the 8-to-7 encoding |
| scheme defined in Section 11.1. Bytes 0x00 and 0xF7 are excluded     |
| from the payload region by MIDI protocol constraints. The SysEx      |
| Start (0xF0) and End (0xF7) bytes are not subject to 7-bit payload   |
| encoding and are transmitted as raw MIDI status bytes.               |
+----------------------------------------------------------------------+

  -------------------------------------------------------------
  **Byte       **Field       **Width**     **Description**
  Position**   Name**                      
  ------------ ------------- ------------- --------------------
  0            SYSEX_START   1 byte        Fixed 0xF0. MIDI
                                           SysEx start
                                           delimiter.

  1--3         MFR_ID        3 bytes       LPV Manufacturer ID:
                                           0x00 0x21 0x4C
                                           (3-byte extended
                                           format per MIDI
                                           spec).

  4            DEVICE_ID     1 byte        Fixed 0x5D.
                                           Identifies the
                                           LPV-5D device model.

  5            VERSION       1 byte        Specification
                                           version. Currently
                                           0x01. Receivers
                                           **MUST** reject
                                           packets with
                                           unrecognised VERSION
                                           values.

  6            PKT_TYPE      1 byte        Packet type
                                           identifier. See
                                           Section 10.2.

  7--8         SEQ_NUM       2 bytes       Packet sequence
                                           number, big-endian,
                                           wrapping at 0xFFFF.
                                           Receivers **SHALL**
                                           detect and report
                                           sequence gaps.

  9--10        PAYLOAD_LEN   2 bytes       Length of the
                                           encoded payload in
                                           bytes, big-endian,
                                           excluding all
                                           framing bytes.

  11           FLAGS         1 byte        Packet control
                                           flags. See Section
                                           10.3.

  12..N        PAYLOAD       PAYLOAD_LEN   Encoded payload;
                             bytes         7-bit clean. Content
                                           per PKT_TYPE.

  N+1--N+2     CRC16         2 bytes       CRC-16/CCITT-FALSE
                                           over bytes 1..N;
                                           7-bit-clean split
                                           encoding. See
                                           Section 10.4.

  N+3          SYSEX_END     1 byte        Fixed 0xF7. MIDI
                                           SysEx end delimiter.
  -------------------------------------------------------------

10.2 Packet Type Registry

  ---------------------------------------------------------------
  **PKT_TYPE       **Hex**      **Description**   **Direction**
  Name**                                          
  ---------------- ------------ ----------------- ---------------
  SSM_SNAPSHOT     0x01         Full Signal State Device → Host
                                Matrix snapshot;  
                                all active        
                                channels.         

  SSM_DELTA        0x02         Incremental SSM   Device → Host
                                delta; changed    
                                channels only     
                                since last        
                                snapshot.         

  DAL_COMMAND      0x03         DAL control       Host → Device
                                command issued by 
                                host (e.g., force 
                                state, override   
                                threshold).       

  DAL_STATUS       0x04         DAL status        Device → Host
                                report; current   
                                state, epoch,     
                                tick count.       

  MRS_DISPATCH     0x05         Notification of   Device → Host
                                Macro-Rotation    
                                Sequence          
                                dispatch;         
                                includes MRS ID   
                                and resolved      
                                angles.           

  MRS_RESULT       0x06         Macro-Rotation    Device → Host
                                Sequence          
                                execution result; 
                                includes residual 
                                drift.            

  EPOCH_BOUNDARY   0x07         Epoch boundary    Device → Host
                                notification;     
                                includes new      
                                epoch number and  
                                frame.            

  CONFIG_WRITE     0x08         Write a           Host → Device
                                configuration     
                                parameter to the  
                                device.           

  CONFIG_ACK       0x09         Acknowledgement   Device → Host
                                of a CONFIG_WRITE 
                                or successful     
                                migration.        

  FAULT_RECORD     0x0A         Fault record      Device → Host
                                emission on any   
                                fault condition.  
                                See Section 15.   

  HEARTBEAT        0x0B         Keepalive /       Bidirectional
                                watchdog ping.    
                                **MUST** be       
                                transmitted at    
                                least once per    
                                T_wdog.           

  MIGRATION        0x0C         Schema migration  Host → Device
                                payload. See      
                                Section 14.       

  RESERVED         0x0D--0x7F   Reserved for      ---
                                future LPV        
                                specification     
                                use. Receivers    
                                **MUST** discard  
                                silently.         
  ---------------------------------------------------------------

10.3 FLAGS Byte

The FLAGS byte (Byte 11) carries per-packet control information. Bits
are assigned as follows. Reserved bits **MUST** be set to 0 by senders
and **SHALL** be ignored by receivers.

  ----------------------------------------
  **Bit**   **Name**     **Description**
  --------- ------------ -----------------
  7         FRAG         Packet is a
                         fragment of a
                         larger logical
                         message.
                         Additional
                         fragments follow.
                         **MUST** be set
                         on all fragments
                         except the last.

  6         LAST_FRAG    This packet is
                         the final
                         fragment of a
                         fragmented
                         logical message.
                         **MUST** be set
                         on the last
                         fragment. **MUST
                         NOT** be set if
                         FRAG is clear
                         (unfragmented
                         packets).

  5         ACK_REQ      Sender requests
                         explicit
                         acknowledgement
                         of this packet.
                         Receiver
                         **SHALL** respond
                         with a CONFIG_ACK
                         or equivalent
                         within the
                         retransmission
                         timeout defined
                         in Section 12
                         (Stage 6).

  4         CRITICAL     Payload is
                         associated with a
                         CRITICAL state
                         event. Receiver
                         **SHALL**
                         prioritise
                         processing of
                         packets with this
                         flag set.

  3         COMPRESSED   Payload has been
                         run-length
                         compressed per
                         Section 11.3
                         prior to 8-to-7
                         encoding.
                         Receiver **MUST**
                         decompress after
                         7-to-8 decoding.

  2         ENCRYPTED    Reserved for
                         future encryption
                         support. **MUST**
                         be set to 0 in
                         Specification
                         Version 0x01.
                         Receivers
                         **SHALL** reject
                         packets with this
                         bit set in
                         Version 0x01.

  1--0      RESERVED     Reserved.
                         **MUST** be set
                         to 0. Receivers
                         **SHALL** ignore.
  ----------------------------------------

10.4 CRC Specification

The LPV-5D SysEx packet integrity check uses CRC-16/CCITT-FALSE with the
following fixed parameters:

  ---------------------------
  **Parameter**   **Value**
  --------------- -----------
  Polynomial      0x1021

  Initial Value   0xFFFF

  Input           None
  Reflection      (false)

  Output          None
  Reflection      (false)

  Final XOR       None
                  (0x0000)
  ---------------------------

The CRC is computed over all bytes from Byte 1 (first octet of the
Manufacturer ID) through the last byte of the encoded payload (Byte N),
inclusive. Byte 0 (0xF0) and the CRC and SysEx End bytes themselves are
excluded from the CRC computation.

The 16-bit CRC value is split into two 7-bit-clean bytes for insertion
into the packet. Bits \[14:7\] of the CRC are placed in Byte N+1; bits
\[6:0\] are placed in Byte N+2. Each byte **MUST** be in the range
0x00--0x7F. Receivers **MUST** verify the CRC and **SHALL** discard
packets with a CRC mismatch, emitting a CRC_MISMATCH FAULT_RECORD (fault
code 0x0006).

11\. Encoding and Data-Type Mappings

11.1 8-to-7 Encoding

All native 8-bit data values within the SysEx payload region are encoded
using the 8-to-7 scheme to ensure 7-bit cleanliness as required by MIDI.
The encoding groups input bytes in sets of 7 and prepends a prefix byte
that carries the MSB of each input byte. This increases the byte count
of any 7-byte block by one byte (to 8 bytes). The normative pseudocode
for encoding and decoding is as follows:

function encode_8to7(input_bytes): output = \[\] for chunk in
groupby(input_bytes, size=7): prefix = 0x00 for i, b in
enumerate(chunk): prefix \|= ((b \>\> 7) & 0x01) \<\< i
output.append(prefix & 0x7F) // MSB prefix byte; always 7-bit clean
output.extend(b & 0x7F for b in chunk) // 7-bit LSB of each byte return
output function decode_7to8(input_bytes): output = \[\] for chunk in
groupby(input_bytes, size=8): prefix = chunk\[0\] for i, b in
enumerate(chunk\[1:\]): output.append(b \| (((prefix \>\> i) & 0x01)
\<\< 7)) return output

Incomplete final chunks (fewer than 7 input bytes) are encoded using
only the bits required; the prefix byte reflects only the MSBs of the
bytes present in the chunk. Decoders **MUST** handle partial final
chunks correctly using PAYLOAD_LEN to determine the exact byte count.

11.2 Data-Type Encoding Table

The following table defines the mapping from LPV-5D logical data types
to their on-wire encoded representations within SysEx payloads. All
values are 8-to-7 encoded as part of Stage 5 (Framing) of the SMSP
pipeline. The widths given below are native (pre-encoding) widths.

  -----------------------------------------------------------
  **LPV-5D   **Native   **Encoded           **Notes**
  Type**     Width**    Representation**    
  ---------- ---------- ------------------- -----------------
  uint8      8 bits     1 byte; 8to7        General-purpose
                        encoded.            unsigned byte.

  uint16     16 bits    2 bytes,            General unsigned
                        big-endian; 8to7    16-bit integer.
                        encoded.            

  uint32     32 bits    4 bytes,            Used for Priority
                        big-endian; 8to7    Token, tick
                        encoded.            counters, epoch
                                            numbers,
                                            migration IDs.

  int16      16 bits    2 bytes, big-endian Signed 16-bit
                        two\'s complement;  integer.
                        8to7 encoded.       

  float32    32 bits    IEEE 754            Used for drift
                        single-precision, 4 magnitudes,
                        bytes big-endian;   rotation angles,
                        8to7 encoded.       threshold values,
                                            and LRF origin
                                            vectors.

  bool       8 bits     0x00 = false; 0x01  Upper 7 bits of
                        = true; 8to7        the decoded byte
                        encoded.            are ignored on
                                            receive; only bit
                                            0 is significant.

  string     Variable   uint8 length prefix Maximum 127
                        (max 127), followed characters.
                        by UTF-8 encoded    Length prefix
                        character bytes;    encodes the
                        entire field 8to7   number of UTF-8
                        encoded.            bytes, not
                                            characters.

  enum8      8 bits     uint8 encoding of   Enumeration
                        the enumeration     values are fixed
                        value; 8to7         constants defined
                        encoded.            in the relevant
                                            section. Unknown
                                            values **SHALL**
                                            be rejected.
  -----------------------------------------------------------

11.3 Run-Length Compression

When the COMPRESSED flag (bit 3 of the FLAGS byte) is set, the payload
is run-length encoded (RLE) prior to 8-to-7 encoding. The RLE scheme is
as follows. Both literal runs and repeated-byte runs are expressed in
terms of raw (pre-8to7) bytes.

- **Literal Run:** A sequence of 1 to 63 non-repeating bytes is preceded
  by a length byte in the range \[0x01, 0x3F\], indicating the number of
  literal bytes that follow.

- **Repeated Run:** A run of 2 to 64 identical bytes is encoded as two
  bytes: a control byte 0x40 \| (count − 1) (range \[0x41, 0x7F\])
  followed by the repeated byte value.

- **Compression Benefit Requirement:** Compressed payloads **MUST NOT**
  exceed the size of the uncompressed payload. If RLE encoding produces
  a result equal to or larger than the uncompressed payload, the
  uncompressed payload **MUST** be used and the COMPRESSED flag **MUST**
  be cleared before framing.

12\. Pipeline Stages

The SMSP is implemented as a six-stage sequential pipeline. Stages are
executed in the order given below for each outbound packet. Inbound
packets traverse stages in reverse order (Stage 6 → Stage 1). The
pipeline is executed in the context of the LPV-5D firmware serialization
task, which runs at lower priority than the DAL Tier 1 and Tier 2 tasks.

9.  **Stage 1 --- Capture**\
    *Input:* Live SSM and DAL state in shared memory.\
    *Output:* Frozen snapshot struct.\
    *Key Operation:* The SSM is read using a seqlock protocol to obtain
    a consistent, torn-read-free snapshot. If a torn read is detected
    (seqlock sequence number changed during read), the read is retried.
    The maximum retry count is 8; on exhaustion, the Stage 1 read is
    deferred to the next serialization cycle. The captured snapshot is
    timestamped with the Loop Tick counter value at the moment the
    consistent read succeeds.

10. **Stage 2 --- Delta Computation** (SSM_DELTA packets only)\
    *Input:* Current snapshot from Stage 1; previous transmitted
    snapshot from the last-snapshot buffer.\
    *Output:* Delta record containing only changed channel entries.\
    *Key Operation:* Bitwise diff is performed on each ChannelEntry
    between the current and previous snapshot. Only entries for which
    any field differs are included in the delta record. If no channels
    have changed, the packet **MAY** be suppressed at the
    implementation\'s discretion. This stage is bypassed for
    SSM_SNAPSHOT and all other packet types.

11. **Stage 3 --- Serialization**\
    *Input:* Snapshot or delta record from Stage 1 or Stage 2.\
    *Output:* Raw (8-bit) payload byte buffer.\
    *Key Operation:* All fields of the snapshot or delta record are
    marshalled into a flat byte buffer in field-declaration order using
    the data-type encodings specified in Section 11.2. Field ordering is
    normative and **MUST** be preserved exactly as defined in Section
    13.

12. **Stage 4 --- Compression** (conditional)\
    *Input:* Raw payload buffer from Stage 3.\
    *Output:* Compressed payload buffer (or pass-through if compression
    does not reduce size).\
    *Key Operation:* RLE compression per Section 11.3 is applied to the
    raw payload buffer. If the compressed size is strictly less than the
    raw size, the COMPRESSED flag is set in the FLAGS byte and the
    compressed buffer is passed to Stage 5. Otherwise, the raw buffer is
    passed unchanged and the COMPRESSED flag is cleared.

13. **Stage 5 --- Framing**\
    *Input:* Payload buffer from Stage 4; packet type, current sequence
    number, flags byte.\
    *Output:* Complete SysEx packet byte stream, ready for
    transmission.\
    *Key Operation:* The SysEx header (Bytes 0--11) is prepended. The
    8-to-7 encoding scheme of Section 11.1 is applied across the entire
    payload buffer. The CRC-16/CCITT-FALSE is computed over Bytes 1
    through N per Section 10.4 and appended as two 7-bit-clean bytes.
    The SysEx End byte (0xF7) is appended. The sequence number is
    incremented (wrapping at 0xFFFF) after successful framing.

14. **Stage 6 --- Transmission**\
    *Input:* Complete SysEx packet byte stream from Stage 5.\
    *Output:* Bytes transmitted to the MIDI output port; transmission
    status returned to caller.\
    *Key Operation:* The packet is written to the MIDI output port. An
    inter-packet gap of at minimum 1 ms **MUST** be enforced between
    successive SysEx packets. If the ACK_REQ flag is set, the
    transmitter awaits acknowledgement with a timeout of 10 ms per
    attempt. On timeout, the packet is retransmitted up to a maximum of
    3 times. After 3 failed retransmission attempts, a FAULT_RECORD with
    fault code SEQ_GAP (0x0007) **SHALL** be emitted and the packet is
    discarded.

13\. SSM Snapshot Payload Schema

The SSM_SNAPSHOT packet (PKT_TYPE 0x01) carries a complete serialized
representation of the Signal State Matrix. The payload schema is defined
below. Fields are serialized in the order listed, with no padding or
alignment bytes between fields in the payload. All fields are encoded
using the data-type mappings of Section 11.2.

  ----------------------------------------------------------------
  **Field**                   **Type**           **Description**
  --------------------------- ------------------ -----------------
  schema_version              uint8              Schema version of
                                                 this payload.
                                                 Currently 0x01.
                                                 Receivers
                                                 **MUST** reject
                                                 payloads with
                                                 schema_version
                                                 greater than
                                                 their supported
                                                 maximum.

  epoch_number                uint32             Current
                                                 Arbitration Epoch
                                                 number at capture
                                                 time.

  tick_count                  uint32             Loop Tick counter
                                                 value at the time
                                                 the consistent
                                                 SSM snapshot was
                                                 captured (Stage
                                                 1).

  channel_count               uint8              Number of active
                                                 channels
                                                 represented in
                                                 this snapshot.
                                                 Valid range:
                                                 1--255.

  dal_state                   enum8              Current DAL state
                                                 at capture time:
                                                 S0=0x00, S1=0x01,
                                                 S2=0x02, S3=0x03,
                                                 S4=0x04, S5=0x05.

  drift_threshold_min         float32            Configured value
                                                 of δ_min in
                                                 degrees. See
                                                 Appendix A.

  drift_threshold_crit        float32            Configured value
                                                 of δ_crit in
                                                 degrees. See
                                                 Appendix A.

  rotation_frame              enum8              Active Rotation
                                                 Frame for the
                                                 current Epoch:
                                                 GRF=0x00,
                                                 LRF=0x01.

  lrf_origin\[3\]             float32\[3\]       LRF origin vector
                                                 \[X, Y, Z\] in
                                                 degrees. All
                                                 values are 0.0
                                                 when
                                                 rotation_frame is
                                                 GRF.

  channels\[channel_count\]   ChannelEntry\[\]   Array of
                                                 per-channel data
                                                 entries. Contains
                                                 exactly
                                                 channel_count
                                                 entries in
                                                 channel_id
                                                 ascending order.
                                                 Schema defined
                                                 below.
  ----------------------------------------------------------------

The ChannelEntry sub-record schema is defined by the following
structure. Fields are serialized in the order given, with no inter-field
padding.

struct ChannelEntry { uint8_t channel_id; // Channel index: 0--255
uint8_t axis_mask; // Active axis flags: bit0=X, bit1=Y, bit2=Z
float32_t drift_vector\[3\]; // Per-axis drift in degrees \[X, Y, Z\]
float32_t drift_magnitude; // Euclidean magnitude of drift_vector, in
degrees uint8_t mrs_last_applied; // MRS ID of the most recently applied
sequence (0x00 = none) uint8_t convergence_count; // Number of
sequential MRS applications for this channel // on the current dominant
axis; resets at δ \< δ_min bool is_critical; // true if drift_magnitude
\>= δ_crit at capture time uint8_t \_reserved; // Reserved; set to 0x00
};

14\. Migration Rules

14.1 Versioning Policy

The SMSP schema version is an 8-bit field with valid values in the range
0x01--0x7F. Values 0x00 and 0x80--0xFF are reserved and **SHALL NOT** be
used. The schema version is incremented on any backwards-incompatible
change to any payload schema defined in this specification. Minor
additions that do not break existing decoders (for example, adding
optional fields at the end of a payload under a new PKT_TYPE) are
tracked via a minor version in device configuration only and do not
increment the schema_version field.

Devices **MUST** reject packets with a schema_version field value
greater than their supported maximum schema version, emitting a
FAULT_RECORD with fault code MIGRATION_FAIL (0x0008) to indicate the
version incompatibility.

14.2 Migration Packet Format

Schema migration is performed via the MIGRATION packet type (PKT_TYPE
0x0C). The MIGRATION payload carries one or more field transform
operations to be applied atomically to the device\'s current schema. The
payload schema is as follows:

  --------------------------------------------------------
  **Field**         **Type**             **Description**
  ----------------- -------------------- -----------------
  from_version      uint8                Source schema
                                         version. **MUST**
                                         match the
                                         device\'s current
                                         schema version;
                                         rejected
                                         otherwise.

  to_version        uint8                Target schema
                                         version after
                                         migration.
                                         **MUST** equal
                                         from_version + 1.

  migration_id      uint32               Unique migration
                                         identifier
                                         assigned by LPV
                                         Engineering. Used
                                         for ordering and
                                         idempotency
                                         checking.

  transform_count   uint8                Number of
                                         FieldTransform
                                         entries in this
                                         migration
                                         payload.

  transforms\[\]    FieldTransform\[\]   Ordered list of
                                         transform_count
                                         FieldTransform
                                         records. Applied
                                         in array order.
  --------------------------------------------------------

The FieldTransform record schema is as follows:

struct FieldTransform { uint8_t transform_type; // Transform operation
code: // 0x01 = ADD_FIELD // 0x02 = REMOVE_FIELD // 0x03 = RENAME_FIELD
// 0x04 = RETYPE_FIELD // 0x05 = REORDER_FIELD // 0x06 = SPLIT_FIELD //
0x07 = MERGE_FIELD uint8_t field_id; // Numeric field ID in the source
schema. uint8_t target_field_id; // Numeric field ID in the target
schema (applicable // for RENAME, RETYPE, REORDER, SPLIT, MERGE).
uint8_t param_len; // Length in bytes of the params field. uint8_t
params\[param_len\]; // Transform-specific parameters (type-dependent).
};

14.3 Migration Procedures

The following migration procedures are normative. All numbered items
constitute **MUST**-level requirements unless otherwise stated.

15. Before applying any migration, the device **MUST** capture and
    persistently store a full SSM_SNAPSHOT at the current schema version
    as a rollback point. The rollback snapshot **MUST** be retained
    until the migration is confirmed successful.

16. Migrations **MUST** be applied in ascending migration_id order. An
    out-of-order migration packet (migration_id less than or equal to
    the last applied migration_id) **MUST** be rejected with a
    FAULT_RECORD emitted for the out-of-order packet.

17. A migration from schema version V to V+N (N \> 1) **MUST** be
    decomposed into N sequential single-version migrations (V→V+1,
    V+1→V+2, ..., V+N-1→V+N). Multi-step migrations **SHALL NOT** be
    delivered in a single MIGRATION packet.

18. The ADD_FIELD transform **MUST** specify a default value in its
    params field. The default value **SHALL** be applied to all existing
    records in the schema at the time of migration.

19. The REMOVE_FIELD transform **MUST** be preceded by a minimum
    deprecation period of 2 complete Arbitration Epochs, during which
    the field is marked deprecated in the active schema but continues to
    be emitted. The deprecation period **MUST** be enforced at the host
    level before issuing the REMOVE_FIELD migration.

20. The RETYPE_FIELD transform **MUST** include a conversion function
    identifier in its params field. The device **MUST** have the
    identified conversion function available in its firmware. If the
    identified function is not available, the migration **MUST** be
    rejected with a FAULT_RECORD.

21. On migration failure at any FieldTransform step, the device **MUST**
    roll back to the stored rollback snapshot, emit a FAULT_RECORD with
    the relevant migration_id and the zero-based index of the failing
    transform, and re-enter operation at the schema version of the
    rollback snapshot.

22. Successful completion of all transform steps in a migration **MUST**
    be acknowledged with a CONFIG_ACK packet whose payload includes the
    new schema version (to_version).

23. Migration packets **MUST NOT** be applied while the DAL is in
    CRITICAL state (S4) or FAULT state (S5). A MIGRATION packet received
    during these states **SHALL** be queued and applied after the DAL
    returns to S0, or rejected with a FAULT_RECORD at the host\'s
    discretion.

24. All migration operations are idempotent. Re-applying a migration
    whose migration_id has already been successfully applied **MUST** be
    treated as a no-op. The device **MUST NOT** emit a FAULT_RECORD for
    a duplicate migration_id; it **SHALL** respond with a CONFIG_ACK
    containing the current schema version.

14.4 Migration Version History

  ---------------------------------------------------------------------
  **Migration   **From       **To        **Date**     **Description**
  ID**          Version**    Version**                
  ------------- ------------ ----------- ------------ -----------------
  M-0001        ---          0x01        2026-08-06   Initial
                (baseline)                            production
                                                      schema. Baseline
                                                      for all future
                                                      migrations. No
                                                      transforms
                                                      applied;
                                                      establishes
                                                      migration_id
                                                      sequence origin.

  ---------------------------------------------------------------------

15\. Error Handling and FAULT Records

The FAULT_RECORD packet (PKT_TYPE 0x0A) is emitted by the device
whenever a fault condition is detected, whether or not the fault results
in a DAL state transition to FAULT (S5). FAULT_RECORD packets are
emitted on a best-effort basis; if the MIDI output port is unavailable,
the record is written to the on-device fault log. The FAULT_RECORD
payload schema is as follows:

  -------------------------------------------------
  **Field**            **Type**   **Description**
  -------------------- ---------- -----------------
  fault_code           uint16     Numeric fault
                                  code identifying
                                  the fault type.
                                  See Fault Code
                                  Registry below.

  fault_source         enum8      Subsystem
                                  reporting the
                                  fault: 0x01=DAL,
                                  0x02=SMSP,
                                  0x03=SYSTEM.

  epoch_number         uint32     Arbitration Epoch
                                  number at the
                                  time the fault
                                  was detected.

  tick_count           uint32     Loop Tick counter
                                  value at the time
                                  the fault was
                                  detected.

  dal_state_at_fault   enum8      DAL state at the
                                  moment of fault
                                  detection
                                  (S0=0x00 ...
                                  S5=0x05).

  invariant_id         uint8      Numeric ID of the
                                  violated
                                  invariant (1--8
                                  per Section 8).
                                  0x00 if no
                                  invariant was
                                  violated.

  migration_id         uint32     migration_id of
                                  the active
                                  migration at
                                  fault time.
                                  0x00000000 if no
                                  migration was in
                                  progress.

  detail_len           uint8      Length of the
                                  detail string
                                  field in bytes
                                  (0--127).

  detail               string     Human-readable
                                  ASCII description
                                  of the fault
                                  condition. Length
                                  given by
                                  detail_len.
                                  **MUST** be
                                  present even if
                                  empty
                                  (detail_len=0).
  -------------------------------------------------

Fault Code Registry

  ----------------------------------------------
  **Code Name**      **Hex**   **Description**
  ------------------ --------- -----------------
  OVERFLOW           0x0001    Arbitration Queue
                               overflow. Oldest
                               entry evicted.
                               Non-fatal;
                               FAULT_RECORD
                               emitted for
                               logging.

  ANGLE_RANGE        0x0002    Resolved rotation
                               angle out of
                               ±45.0° range
                               (INV-04
                               violation). MRS
                               dispatch aborted.

  WATCHDOG           0x0003    DAL watchdog
                               timer expired
                               without being
                               reset within
                               T_wdog (INV-07
                               violation). DAL →
                               FAULT.

  CONVERGENCE        0x0004    MRS convergence
                               failure after 3
                               sequential
                               applications
                               without residual
                               decrease (INV-05
                               violation).

  FRAME_VIOLATION    0x0005    Epoch frame
                               consistency
                               violation: MRS
                               attempted with
                               incorrect
                               Rotation Frame
                               (INV-06
                               violation).

  CRC_MISMATCH       0x0006    Received SysEx
                               packet CRC does
                               not match
                               computed CRC.
                               Packet discarded.

  SEQ_GAP            0x0007    Sequence number
                               gap detected in
                               received packet
                               stream,
                               indicating packet
                               loss.

  MIGRATION_FAIL     0x0008    Migration
                               transform
                               application
                               failure, version
                               rejection, or
                               unavailable
                               conversion
                               function.
                               Rollback
                               executed.

  INVARIANT          0x0009    DAL invariant
                               violation
                               (general).
                               Specific
                               invariant
                               identified by
                               invariant_id
                               field. DAL →
                               FAULT.

  CRITICAL_TIMEOUT   0x000A    CRITICAL response
                               deadline (T_crit)
                               exceeded; MRS-06
                               not dispatched
                               within 2 ticks
                               (INV-08
                               violation). DAL →
                               FAULT.
  ----------------------------------------------

16\. Conformance Requirements

An LPV-5D implementation is considered conformant to this specification
if and only if it satisfies all **MUST** and **SHALL** requirements
stated throughout this document. **SHOULD** requirements represent
strong recommendations; deviation from a **SHOULD** requirement is
permitted only with documented technical justification. **MAY**
requirements are optional.

The following table provides a conformance summary checklist for
implementation verification. It does not replace or supersede the
normative requirements in the referenced sections; in all cases the
referenced sections are authoritative.

  -----------------------------------------------------
  **Requirement    **Key MUST           **Reference**
  Area**           Requirements**       
  ---------------- -------------------- ---------------
  DAL State        Implement all 6      Section 4
  Machine          states (S0--S5) and  
                   all 11 defined       
                   transitions exactly  
                   as specified. No     
                   additional states or 
                   transitions are      
                   permitted.           

  Macro-Rotation   Implement all 8 MRS  Section 5
  Sequences        entries (MRS-01      
                   through MRS-08) in   
                   the catalogue. Apply 
                   composition rules    
                   including the        
                   64-tick limit, ±45°  
                   angle cap, and       
                   CRITICAL preemption. 

  Loop Timing      Meet all six timing  Section 6
                   parameters within    
                   stated tolerances.   
                   Hard-limit           
                   parameters (T_exec,  
                   T_crit, T_wdog)      
                   admit zero           
                   tolerance.           
                   Resynchronize T_tick 
                   at each Epoch        
                   boundary.            

  Priority         Implement monotonic  Section 7
  Arbitration      Priority Token       
                   assignment with      
                   wrap-aware           
                   comparison. Apply    
                   conflict resolution  
                   rules in order:      
                   Priority Token       
                   ordering, then       
                   magnitude promotion  
                   (10× rule), then     
                   CRITICAL             
                   serialization.       

  DAL Invariants   Enforce all 8        Section 8
                   invariants (INV-01   
                   through INV-08)      
                   continuously.        
                   Transition           
                   immediately to FAULT 
                   (S5) on any          
                   invariant violation. 
                   Emit a FAULT_RECORD  
                   for each violation.  

  SysEx Framing    Implement all 12     Section 10
                   packet types in the  
                   registry. Apply      
                   CRC-16/CCITT-FALSE   
                   with correct         
                   parameters over      
                   bytes 1..N. Enforce  
                   7-bit cleanliness    
                   across the entire    
                   payload region.      

  8-to-7 Encoding  Apply 8-to-7         Section 11.1
                   encoding to all      
                   payload bytes before 
                   framing. Correctly   
                   decode received      
                   7-to-8 payloads.     
                   Handle partial final 
                   chunks per           
                   PAYLOAD_LEN.         

  Pipeline Stages  Implement all 6      Section 12
                   pipeline stages in   
                   the specified order. 
                   Enforce inter-packet 
                   gap ≥ 1 ms. Enforce  
                   maximum 3            
                   retransmission       
                   attempts with 10 ms  
                   timeout per attempt. 

  SSM Snapshot     Serialize all fields Section 13
  Schema           in the order         
                   declared in Section  
                   13. Reject received  
                   snapshots with       
                   schema_version       
                   exceeding the        
                   supported maximum.   
                   Include all          
                   channel_count        
                   ChannelEntry         
                   records.             

  Migration        Enforce migration_id Section 14
                   ordering; reject     
                   out-of-order         
                   migrations. Capture  
                   rollback snapshot    
                   before each          
                   migration. Enforce   
                   2-Epoch deprecation  
                   for REMOVE_FIELD.    
                   Treat duplicate      
                   migration_id as a    
                   no-op. Do not apply  
                   migrations in        
                   CRITICAL or FAULT    
                   state.               
  -----------------------------------------------------

17\. Appendix A --- Drift Threshold Reference Values

The following table lists the standard drift threshold reference values
for the LPV-5D. These values represent the production default
configuration. Configuration overrides via CONFIG_WRITE **MAY** be
applied subject to the constraint that δ_trim \< δ_convergence \< δ_min
\< δ_crit at all times. Violation of this ordering **SHALL** cause the
CONFIG_WRITE to be rejected.

  ---------------------------------------------------------
  **Symbol**      **Value**   **Units**   **Description**
  --------------- ----------- ----------- -----------------
  δ_min           0.5         degrees     Minor drift
                                          threshold.
                                          Signals exceeding
                                          δ_min are
                                          classified as
                                          Drift Candidates
                                          and enqueued for
                                          arbitration.

  δ_crit          5.0         degrees     Critical drift
                                          threshold.
                                          Signals meeting
                                          or exceeding
                                          δ_crit trigger
                                          the CRITICAL
                                          state transition
                                          (S4) and MRS-06
                                          dispatch.

  δ_convergence   0.1         degrees     Residual drift
                                          magnitude
                                          considered fully
                                          converged. MRS
                                          execution is
                                          considered
                                          successful when
                                          residual drift
                                          falls below this
                                          value.

  δ_trim          0.05        degrees     Micro-trim
                                          threshold.
                                          Residual drift
                                          below δ_trim in
                                          LRF context
                                          triggers MRS-05
                                          micro-trim
                                          sequence for
                                          final alignment.
  ---------------------------------------------------------

18\. Appendix B --- Normative References

The following documents are normative references for this specification.
Implementations **MUST** conform to the referenced standards where
applicable.

  ------------------------------------------
  **Reference**        **Description**
  -------------------- ---------------------
  RFC 2119             Bradner, S., \"Key
                       words for use in RFCs
                       to Indicate
                       Requirement Levels,\"
                       BCP 14, RFC 2119,
                       March 1997. The
                       normative keywords
                       MUST, SHALL, SHOULD,
                       MAY, MUST NOT, and
                       SHALL NOT used
                       throughout this
                       specification are
                       defined by RFC 2119.

  MIDI 1.0             MIDI Manufacturers
  Specification        Association (MMA),
                       \"MIDI 1.0 Detailed
                       Specification,\"
                       Document Version
                       4.2.1 (1983,
                       updated). Defines the
                       System Exclusive
                       message format, SysEx
                       start (0xF0) and end
                       (0xF7) delimiters,
                       7-bit data payload
                       constraints, and
                       Manufacturer ID
                       structure referenced
                       in Section 10.

  IEEE 754-2019        IEEE, \"IEEE Standard
                       for Floating-Point
                       Arithmetic,\" IEEE
                       Std 754-2019. Defines
                       the single-precision
                       binary floating-point
                       format (binary32)
                       used for the float32
                       data type throughout
                       this specification,
                       including drift
                       magnitudes, rotation
                       angles, and threshold
                       values.

  CRC-16/CCITT-FALSE   ECMA-182, \"Data
                       Interchange on 12,7
                       mm 48-Track Magnetic
                       Tape Cartridges,\"
                       December 1992. The
                       CRC-16/CCITT-FALSE
                       algorithm (polynomial
                       0x1021, initial value
                       0xFFFF, no
                       reflection, no final
                       XOR) used in Section
                       10.4 is catalogued in
                       the CRC RevEng
                       catalogue as
                       \"CRC-16/IBM-3740\"
                       and is defined
                       normatively in
                       ECMA-182.
  ------------------------------------------

*--- End of Document ---*\
LPV-5D Core Specifications Rev 1.0 \| 2026-08-06 \| Internal ---
Engineering \| LPV Engineering Team
