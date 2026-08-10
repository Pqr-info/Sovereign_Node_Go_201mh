#!/bin/bash
set -e

echo "Downloading CoreDNS..."
wget -qO coredns.tgz https://github.com/coredns/coredns/releases/download/v1.11.1/coredns_1.11.1_linux_amd64.tgz
tar -xzf coredns.tgz
mv coredns /usr/local/bin/
rm coredns.tgz

echo "Creating config directories..."
mkdir -p /etc/coredns

echo "Writing Corefile..."
cat > /etc/coredns/Corefile << 'EOF'
. {
    forward . 8.8.8.8 1.1.1.1
    log
    errors
}
pqr.info {
    file /etc/coredns/pqr.info.db
    log
    errors
}
EOF

echo "Writing zone file..."
cat > /etc/coredns/pqr.info.db << 'EOF'
$ORIGIN pqr.info.
@   3600 IN SOA zeta.pqr.info. admin.pqr.info. (
                2026080601 ; serial
                7200       ; refresh
                3600       ; retry
                1209600    ; expire
                3600       ; minimum
)
@   3600 IN NS zeta.pqr.info.
zeta 3600 IN A 176.9.116.146
max  3600 IN A 192.168.12.234
ted  3600 IN A 10.240.18.54
EOF

echo "Creating systemd service..."
cat > /etc/systemd/system/coredns.service << 'EOF'
[Unit]
Description=CoreDNS DNS server
Documentation=https://coredns.io
After=network.target

[Service]
PermissionsStartOnly=true
LimitNOFILE=1048576
LimitNPROC=512
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
User=root
ExecStart=/usr/local/bin/coredns -conf /etc/coredns/Corefile
ExecReload=/bin/kill -SIGUSR1 $MAINPID
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

echo "Starting CoreDNS..."
systemctl daemon-reload
systemctl enable coredns
systemctl restart coredns

echo "Checking status..."
systemctl status coredns --no-pager
