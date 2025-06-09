# Build the image
docker build -t your-registry/k8s-toolkit:v1.0.0 .

# Tag for latest
docker tag your-registry/k8s-toolkit:v1.0.0 your-registry/k8s-toolkit:latest

# Push to registry
docker push your-registry/k8s-toolkit:v1.0.0
docker push your-registry/k8s-toolkit:latest


# Deploy the application
kubectl apply -f k8s-manifests/deployment.yaml

# Check deployment status
kubectl get pods -n k8s-toolkit

# Check service
kubectl get svc -n k8s-toolkit

# Port forward for testing
kubectl port-forward -n k8s-toolkit service/k8s-toolkit-service 8080:80


# Local development
npm install
npm run dev

# Build and test
docker build -t k8s-toolkit:dev .
docker run -p 3000:3000 k8s-toolkit:dev

# Deploy to staging/production
docker build -t your-registry/k8s-toolkit:v1.0.1 .
docker push your-registry/k8s-toolkit:v1.0.1
kubectl set image deployment/k8s-toolkit k8s-toolkit=your-registry/k8s-toolkit:v1.0.1 -n k8s-toolkit