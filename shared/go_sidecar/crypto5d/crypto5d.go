package crypto5d

type FiveDAddress struct {
	Packed [16]byte `json:"packed"`
	Base27 string   `json:"base27"`
	X      uint32
	Y      uint32
	Z      uint32
	Phi    uint16
	Lambda uint16
}

// Stub for Offset
func Offset(addr FiveDAddress, dx, dy, dz int) FiveDAddress {
    return FiveDAddress{
        X: uint32(int(addr.X) + dx),
        Y: uint32(int(addr.Y) + dy),
        Z: uint32(int(addr.Z) + dz),
        Phi: addr.Phi,
        Lambda: addr.Lambda,
    }
}
