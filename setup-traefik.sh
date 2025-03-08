#!/bin/bash

# Permissão de execução: chmod +x setup-traefik.sh

# Criar diretório para certificados
mkdir -p ./ambiente/certs
cd ./ambiente/certs

# Baixar mkcert
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert

# Instalar CA local
./mkcert -install

# Gerar certificados para domínios locais
./mkcert -cert-file local-cert.pem -key-file local-key.pem \
    "dev.localhost" \
    "*.dev.localhost" \
    "event-service.dev.localhost" \
    "email-service.dev.localhost" \
    "rabbitmq.dev.localhost"

echo "✅ Certificados gerados com sucesso!"
ls -l local-cert.pem local-key.pem

# Voltar para o diretório anterior
cd ..

# Criar arquivo de configuração dinâmica do Traefik
cat <<EOF > traefik_dynamic.yml
tls:
  certificates:
    - certFile: "/etc/traefik/certs/local-cert.pem"
      keyFile: "/etc/traefik/certs/local-key.pem"
EOF

echo "✅ Arquivo traefik_dynamic.yml gerado com sucesso!"
