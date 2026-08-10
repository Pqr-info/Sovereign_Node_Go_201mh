import json
from substrate27 import from_ints

with open("test_vector.json") as f:
    v = json.load(f)

addr = from_ints(v["symbols"], v["states"])
print("Python Hash:", addr.hash().hex())
