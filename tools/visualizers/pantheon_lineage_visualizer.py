import math
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, Wedge

class PantheonEntity:
    def __init__(self, id_bytes, role, lineage, domain, cognitive_state):
        self.id_bytes = id_bytes
        self.role = role
        self.lineage = lineage
        self.domain = domain
        self.cognitive_state = cognitive_state

def visualize_pantheon(pantheon):
    fig, ax = plt.subplots(figsize=(10, 10))
    ax.set_xlim(-1.2, 1.2)
    ax.set_ylim(-1.2, 1.2)
    ax.set_aspect("equal")
    ax.axis("off")

    # Center root
    root = Circle((0, 0), 0.12, color="#6a0dad", alpha=0.8)
    ax.add_patch(root)
    ax.text(0, 0, "GENESIS", ha="center", va="center", color="white", fontsize=12)

    n = len(pantheon)
    radius = 0.75

    for i, entity in enumerate(pantheon):
        angle = (2 * math.pi / n) * i
        x = radius * math.cos(angle)
        y = radius * math.sin(angle)

        # Node
        node = Circle((x, y), 0.10, color="#4b0082", alpha=0.8)
        ax.add_patch(node)

        # Role label
        ax.text(x, y, entity.role, ha="center", va="center", fontsize=8, color="white")

        # Lineage arc (density = lineage entropy)
        entropy = sum(entity.lineage) % 360
        arc = Wedge((x, y), 0.15, 0, entropy, color="#9370db", alpha=0.4)
        ax.add_patch(arc)

        # Cognitive state ring
        cog = sum(entity.cognitive_state) % 360
        ring = Wedge((x, y), 0.20, 0, cog, color="#ba55d3", alpha=0.3)
        ax.add_patch(ring)

        # Connection line
        ax.plot([0, x], [0, y], color="#8a2be2", alpha=0.3)

    plt.title("Pantheon Lineage Map", fontsize=16, color="#4b0082")
    plt.savefig("pantheon_lineage_map.png", dpi=150, bbox_inches="tight")
    print("Saved lineage map to pantheon_lineage_map.png")


# Example usage
if __name__ == "__main__":
    pantheon = [
        PantheonEntity(
            id_bytes=[i] * 32,
            role=f"ROLE-{i}",
            lineage=[i, i+1, i+2],
            domain="GENESIS",
            cognitive_state=[i, i+1]
        )
        for i in range(9)
    ]

    visualize_pantheon(pantheon)
