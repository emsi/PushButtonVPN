#!/usr/bin/env bash

apt-get update
apt-get install -y pptpd

echo "
localip 10.176.0.254
remoteip 10.176.0.1-100
" >> /etc/pptpd.conf

echo "
vpn	pptpd	vpnsecretpass	*
" >> /etc/ppp/chap-secrets

echo "
ms-dns 8.8.8.8
ms-dns 8.8.4.4
" >> /etc/ppp/pptpd-options

echo "
net.ipv4.ip_forward=1
" >> /etc/sysctl.conf

echo 1 > /proc/sys/net/ipv4/conf/all/forwarding

iptables -t nat -A POSTROUTING -s 10.176.0.0/24	-j MASQUERADE

service pptpd restart
