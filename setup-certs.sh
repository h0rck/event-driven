
# Permissão de execução tem que rodar isso 
# chmod +x setup-certs.sh

# Criar diretório para certificados
mkdir -p ./ambiente/certs
cd ./ambiente/certs

# Baixar mkcert
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert

# Instalar CA local
./mkcert -install

# Gerar certificados apenas para .dev.localhost
./mkcert -cert-file local-cert.pem -key-file local-key.pem \
    "dev.localhost" \
    "*.dev.localhost" \
    "user-service.dev.localhost"

echo "✅ Certificados gerados com sucesso!"
ls -l local-cert.pem local-key.pem