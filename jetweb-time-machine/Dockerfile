# ------------------------------------------------------------
# Jetweb Time Machine Sovereign Build Host
# Substrate 27 + Timeslips Pallet + Rust Toolchain
# ------------------------------------------------------------

FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# ------------------------------------------------------------
# Install system dependencies
# ------------------------------------------------------------
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    clang \
    cmake \
    pkg-config \
    libssl-dev \
    llvm \
    libclang-dev \
    build-essential \
    protobuf-compiler \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# Install Rust + nightly toolchain + wasm target
# ------------------------------------------------------------
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

RUN rustup default 1.82.0
RUN rustup target add wasm32-unknown-unknown
RUN rustup component add rust-src

# ------------------------------------------------------------
# Install Substrate prerequisites
# ------------------------------------------------------------
RUN cargo install --force wasm-gc

# ------------------------------------------------------------
# Create workspace directory
# ------------------------------------------------------------
WORKDIR /jetweb

# ------------------------------------------------------------
# Copy node-template + pallets
# ------------------------------------------------------------
COPY substrate-node-template /jetweb/node-template

# ------------------------------------------------------------
# Build the node (Timeslips pallet included)
# ------------------------------------------------------------
WORKDIR /jetweb/node-template
RUN cargo build --release

# ------------------------------------------------------------
# Runtime command: run the sovereign chain
# ------------------------------------------------------------
CMD ["./target/release/solochain-template-node", "--chain", "sovereign-27", "--rpc-port", "9944", "--rpc-external", "--rpc-cors", "all"]
