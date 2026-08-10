import hashlib
from dataclasses import dataclass
from typing import List, Tuple

VECTOR_LEN = 27
MAX_SYMBOL = 26
MAX_STATE = 2


@dataclass
class SymbolState:
    symbol: int  # 0–26
    state: int   # 0–2


@dataclass
class Address:
    vector: List[SymbolState]

    def encode(self) -> bytes:
        if len(self.vector) != VECTOR_LEN:
            raise ValueError("invalid vector length")
        out = bytearray()
        for s in self.vector:
            if not (0 <= s.symbol <= MAX_SYMBOL):
                raise ValueError("invalid symbol")
            if not (0 <= s.state <= MAX_STATE):
                raise ValueError("invalid state")
            out.append(s.symbol)
            out.append(s.state)
        return bytes(out)

    @classmethod
    def decode(cls, data: bytes) -> "Address":
        if len(data) != VECTOR_LEN * 2:
            raise ValueError("invalid length")
        vec: List[SymbolState] = []
        for i in range(0, len(data), 2):
            sym = data[i]
            st = data[i + 1]
            if sym > MAX_SYMBOL or st > MAX_STATE:
                raise ValueError("invalid symbol/state")
            vec.append(SymbolState(symbol=sym, state=st))
        return cls(vector=vec)

    def hash(self) -> bytes:
        return hashlib.sha256(self.encode()).digest()

    def checksum64(self) -> int:
        h = self.hash()
        return int.from_bytes(h[:8], "little")


def from_ints(symbols: List[int], states: List[int]) -> Address:
    if len(symbols) != VECTOR_LEN or len(states) != VECTOR_LEN:
        raise ValueError("invalid vector length")
    vec = []
    for s, st in zip(symbols, states):
        if not (0 <= s <= MAX_SYMBOL):
            raise ValueError("symbol out of range")
        if not (0 <= st <= MAX_STATE):
            raise ValueError("state out of range")
        vec.append(SymbolState(symbol=s, state=st))
    return Address(vector=vec)


def encode_pair_list(pairs: List[Tuple[int, int]]) -> bytes:
    if len(pairs) != VECTOR_LEN:
        raise ValueError("invalid vector length")
    addr = Address(vector=[SymbolState(symbol=s, state=st) for s, st in pairs])
    return addr.encode()
