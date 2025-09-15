export interface NetplanExample {
    id: string;
    title: string;
    description: string;
    category: 'Basic' | 'Advanced' | 'Bonding' | 'VLAN' | 'Bridge';
    yaml: string;
}

export const NETPLAN_EXAMPLES: NetplanExample[] = [
    {
        id: 'basic-dhcp',
        title: 'Basic DHCP Configuration',
        description: 'Simple DHCP configuration for a single interface',
        category: 'Basic',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true
      dhcp6: true`
    },
    {
        id: 'static-ip',
        title: 'Static IP Configuration',
        description: 'Static IP with DNS servers',
        category: 'Basic',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - "192.168.1.100/24"
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]`
    },
    {
        id: 'multiple-interfaces',
        title: 'Multiple Interfaces',
        description: 'Configure multiple network interfaces',
        category: 'Basic',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true
    eth1:
      addresses:
        - "10.0.0.100/24"
      nameservers:
        addresses: [10.0.0.1]`
    },
    {
        id: 'bond-active-backup',
        title: 'Bond Active-Backup',
        description: 'Active-backup bonding for high availability',
        category: 'Bonding',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
    eth1:
      dhcp4: false
  bonds:
    bond0:
      dhcp4: true
      interfaces:
        - eth0
        - eth1
      parameters:
        mode: active-backup
        primary: eth0
        mii-monitor-interval: 100`
    },
    {
        id: 'bond-802-3ad',
        title: 'Bond 802.3ad (LACP)',
        description: 'Link aggregation for increased bandwidth',
        category: 'Bonding',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
    eth1:
      dhcp4: false
  bonds:
    bond0:
      addresses:
        - "192.168.1.100/24"
      interfaces:
        - eth0
        - eth1
      parameters:
        mode: 802.3ad
        lacp-rate: fast
        mii-monitor-interval: 100`
    },
    {
        id: 'vlan-config',
        title: 'VLAN Configuration',
        description: 'VLAN tagging configuration on ethernet interface',
        category: 'VLAN',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
  vlans:
    eth0.100:
      id: 100
      link: eth0
      addresses:
        - "192.168.100.10/24"
    eth0.200:
      id: 200
      link: eth0
      addresses:
        - "192.168.200.10/24"`
    },
    {
        id: 'bridge-config',
        title: 'Bridge Configuration',
        description: 'Bridge for virtualization or containers',
        category: 'Bridge',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
  bridges:
    br0:
      dhcp4: true
      interfaces:
        - eth0
      parameters:
        stp: true
        forward-delay: 4`
    },
    {
        id: 'advanced-static',
        title: 'Advanced Static Configuration',
        description: 'Static config with custom MTU and DNS',
        category: 'Advanced',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - "10.0.0.100/24"
        - "10.0.0.101/24"
      mtu: 9000
      nameservers:
        addresses: [1.1.1.1, 1.0.0.1, 8.8.8.8]
        search: [local.domain, example.com]
      dhcp4: false
      optional: true`
    },
    {
        id: 'complex-multi-setup',
        title: 'Complex Multi-Setup',
        description: 'Bonding, VLAN, and bridge combination',
        category: 'Advanced',
        yaml: `network:
  version: 2
  ethernets:
    eth0:
      dhcp4: false
    eth1:
      dhcp4: false
    eth2:
      dhcp4: false
  bonds:
    bond0:
      interfaces:
        - eth0
        - eth1
      parameters:
        mode: 802.3ad
        lacp-rate: fast
        mii-monitor-interval: 100
  vlans:
    bond0.100:
      id: 100
      link: bond0
  bridges:
    br0:
      interfaces:
        - bond0.100
        - eth2
      addresses:
        - "192.168.100.10/24"
      parameters:
        stp: true
        forward-delay: 4`
    },
    {
        id: 'upstream-downstream',
        title: 'Link-Local Interfaces',
        description: 'Configuration with upstream DHCP and downstream link-local addresses',
        category: 'Basic',
        yaml: `network:
  version: 2
  ethernets:
    ens3: #upstream
      dhcp4: true
      dhcp4-overrides:
        use-domains: false
      dhcp6: false
      link-local: []
    ens8: #downstream
      dhcp4: false
      link-local: [ipv4]`
    }
];