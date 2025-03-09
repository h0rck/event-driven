# Criar diretório para certificados e configurações
mkdir -p ./traefik/certs
mkdir -p ./traefik/config
cd ./traefik/certs

# Baixar mkcert
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert

# Instalar CA local
./mkcert -install

# Gerar certificados para domínios locais
./mkcert -cert-file local-cert.pem -key-file local-key.pem \
    "dev.localhost" \
    "*.dev.localhost" 
    # "event-service.dev.localhost" \
    # "email-service.dev.localhost" \
    # "rabbitmq.dev.localhost" \
    # "monitor-service.dev.localhost" \
    # "monitor.dev.localhost"

echo "✅ Certificados gerados com sucesso!"

# Criar arquivo de configuração principal do Traefik
cat <<EOF > ../config/traefik.yml
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    filename: /etc/traefik/config/dynamic.yml

api:
  dashboard: true
  insecure: true
EOF

# Criar arquivo de configuração dinâmica
cat <<EOF > ../config/dynamic.yml
tls:
  certificates:
    - certFile: "/etc/traefik/certs/local-cert.pem"
      keyFile: "/etc/traefik/certs/local-key.pem"
  stores:
    default:
      defaultCertificate:
        certFile: "/etc/traefik/certs/local-cert.pem"
        keyFile: "/etc/traefik/certs/local-key.pem"
EOF

echo "✅ Arquivos de configuração gerados com sucesso!"
