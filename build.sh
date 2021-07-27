
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 405896327846.dkr.ecr.ap-southeast-1.amazonaws.com
rm -rf dist
npm run build:prod
docker build -t fe_address_system .
docker tag fe_address_system:latest 405896327846.dkr.ecr.ap-southeast-1.amazonaws.com/fe_address_system:1.1.6
docker push 405896327846.dkr.ecr.ap-southeast-1.amazonaws.com/fe_address_system:1.1.6