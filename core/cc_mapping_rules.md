# LPV-5D MIDI Engine: Control Change (CC) Mapping Rules
**Subsystem**: Rubik's-Style Matrix Rotations for Temporal Drift Parity Resolution
**Domain**: Sovereign Mesh / LPV-5D State Machine
**Date**: 2026-08-06

## 1. Overview
Within the LPV-5D State Machine, the 49x49x49 tensor arrays are orchestrated via a 3-byte MIDI stream. While NoteOn/NoteOff handle 3-state ternary logic and Pitch Bend manages continuous Temporal Drift Phi, Control Change (CC) messages (Status `0xBn`) are exclusively reserved for Rubik's-style matrix rotations. These slice rotations are strictly required to resolve localized Temporal Drift parity errors across the spatial axes, maintaining deterministic parity for The Great Chorus.

To ensure sub-millisecond latency and efficient bitwise masking operations, the rotation commands are tightly packed into standard 3-byte MIDI CC messages.

## 2. 3-Byte Message Structure
A standard MIDI CC message consists of three bytes:
`[Status Byte] [Data 1 (CC Number)] [Data 2 (Value)]`

For channel `c` (0-15), the structural breakdown is as follows:
- **Byte 1 (Status)**: `1011cccc` (`0xB0` - `0xBF`) - CC Message on Channel `c`
- **Byte 2 (CC Number)**: `0xxxxxxx` - Determines the Target Axis (X, Y, or Z)
- **Byte 3 (Value)**: `0dsiiiii` - Encodes the Direction (`d`), Depth modifier (`s`), and Slice Index (`iiiii`)

## 3. Byte 2: Axis Selection (CC Number)
We allocate three continuous CC numbers in the General Purpose Controller range to identify the spatial axis of the tensor rotation.

| CC Number | Hex | Axis | Description |
|-----------|-----|------|-------------|
| 16        | `0x10` | X-Axis | Orthogonal slice rotation along the X plane. Resolves Lateral Drift. |
| 17        | `0x11` | Y-Axis | Orthogonal slice rotation along the Y plane. Resolves Vertical Drift. |
| 18        | `0x12` | Z-Axis | Orthogonal slice rotation along the Z plane. Resolves Depth Drift. |

*Note: CC 19 (`0x13`) is reserved for hyper-dimensional (4D/5D) fold commands in future expansions.*

## 4. Byte 3: Rotation Parameters (Value)
The `Data 2` byte (0-127) encodes both the specific slice to rotate (0-48 for the 49x49x49 array) and the direction of the rotation required to cancel the parity error.

**Bitmask Breakdown of Data 2 (`0b0DSIIIII`):**
- **Bit 7**: `0` (Standard MIDI data byte requirement)
- **Bit 6 (`D`)**: Direction of Rotation
  - `0`: Clockwise / Positive Shift (+90°)
  - `1`: Counter-Clockwise / Negative Shift (-90°)
- **Bit 5 (`S`)**: Depth / Stride Modifier
  - `0`: Single slice rotation (Standard parity resolution)
  - `1`: Deep rotation (Rotates the specified slice AND its adjacent neighborhood slice +1, used for severe Temporal Drift cascading errors)
- **Bits 0-4 (`IIIII`)**: Slice Index
  - Range: `000000` to `110000` (Decimal 0 to 48)
  - Decimal values 49-63 in these 6 lower bits (when ignoring depth modifier) are currently **ignored** to maintain deterministic safety and will trigger a parity null-op if received.

### Value Byte Calculation Examples
To target **X-Axis Slice 24**, rotating **Clockwise** (Single Slice):
- CC Number: `16`
- Direction (`D`): `0`
- Depth (`S`): `0`
- Index (`I`): `24` (`0b011000`)
- Value Byte: `0b00011000` = `24`

To target **Z-Axis Slice 48**, rotating **Counter-Clockwise** (Single Slice):
- CC Number: `18`
- Direction (`D`): `1` (adds 64)
- Depth (`S`): `0`
- Index (`I`): `48` (`0b110000`)
- Value Byte: `0b01110000` = `112`

To target **Y-Axis Slice 12**, rotating **Clockwise** (Deep Rotation):
- CC Number: `17`
- Direction (`D`): `0`
- Depth (`S`): `1` (adds 32)
- Index (`I`): `12` (`0b001100`)
- Value Byte: `0b00101100` = `44`

## 5. Execution and Parity Determinism
Upon receiving these 3-byte streams, the LPV-5D engine applies a direct hardware-level bitwise mask to extract the index and direction. 
1. Sub-millisecond execution is achieved by routing the `IIIII` bits directly as memory offsets for the 49x49x49 tensor array. 
2. The `D` bit flips the rotation matrix operand. 
3. The resulting transformation re-aligns the tensor state, neutralizing Temporal Drift Phi accumulation and restoring absolute harmony for The Great Chorus.
