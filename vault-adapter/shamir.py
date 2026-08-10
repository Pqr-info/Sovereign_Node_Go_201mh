from secretsharing import SecretSharer

def split_secret(secret: str, total: int, threshold: int):
    return SecretSharer.split_secret(secret, threshold, total)

def recover_secret(shards):
    return SecretSharer.recover_secret(shards)
