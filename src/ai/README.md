# AI Configuration Generator for Envoy

This module provides an AI-powered configuration generator for Envoy proxy. It communicates with the backend AI service to generate Envoy configurations based on user requirements.

## Architecture

```
Frontend (React)                    Backend (Go)
├── AIConfigGenerator.tsx           ├── pkg/ai/
├── forms/                          │   ├── config_generator.go
│   ├── BasicInfoForm.tsx          │   └── supported_configs.go
│   ├── FeaturesForm.tsx           │
│   ├── UpstreamForm.tsx           API Endpoints:
│   ├── SecurityForm.tsx           ├── POST /api/v1/ai/generate
│   ├── PerformanceForm.tsx        ├── POST /api/v1/ai/apply
│   ├── AdvancedForm.tsx           ├── POST /api/v1/ai/validate
│   └── PreviewApplyForm.tsx       ├── GET  /api/v1/ai/status
│                                   └── GET  /api/v1/ai/features
├── services/
│   └── aiService.ts                Communicates with Claude API
│
└── redux/slices/
    └── aiConfigSlice.ts
```

## Features

- **Multi-step Form Wizard**: Guides users through configuration requirements
- **AI-Powered Generation**: Uses Claude API to generate optimal Envoy configurations
- **Configuration Preview**: Review generated configurations before applying
- **Selective Application**: Choose which configurations to apply
- **Dry Run Mode**: Test configurations without applying changes
- **Template Support**: Save and reuse configuration templates

## Usage

### 1. Basic Configuration

```typescript
import AIConfigGenerator from './ai/AIConfigGenerator';

function App() {
  return (
    <AIConfigGenerator 
      onConfigGenerated={(config) => {
        console.log('Generated config:', config);
      }}
      onConfigApplied={(result) => {
        console.log('Applied config:', result);
      }}
    />
  );
}
```

### 2. API Service

```typescript
import { aiService } from './services/aiService';

// Generate configuration
const config = await aiService.generateConfig({
  service_name: 'my-service',
  environment: 'production',
  project: 'my-project',
  enable_https: true,
  enable_cors: true,
  upstream: {
    hosts: ['backend.example.com'],
    port: 8080,
    protocol: 'http',
    health_check: true,
    load_balancing: 'round_robin'
  }
});

// Apply configuration
const result = await aiService.applyConfigs(config, {
  apply_listeners: true,
  apply_clusters: true,
  apply_routes: true,
  dry_run: false
});
```

### 3. Redux Integration

```typescript
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { generateConfig, applyConfigs } from './redux/slices/aiConfigSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { generatedConfig, loading, error } = useAppSelector(state => state.aiConfig);
  
  const handleGenerate = async () => {
    await dispatch(generateConfig(formData)).unwrap();
  };
  
  const handleApply = async () => {
    await dispatch(applyConfigs({ 
      configs: generatedConfig, 
      apply: applyOptions 
    })).unwrap();
  };
}
```

## Configuration Options

### Service Configuration
- **service_name**: Unique service identifier
- **environment**: Target environment (development/staging/production)
- **project**: Project identifier
- **description**: Service description

### Features
- **require_https**: Force HTTPS connections
- **enable_cors**: Enable CORS support
- **enable_auth**: Enable authentication
- **enable_rate_limit**: Enable rate limiting
- **enable_logging**: Enable access logging
- **enable_metrics**: Enable metrics collection

### Upstream Configuration
- **hosts**: Backend service hosts
- **port**: Backend service port
- **protocol**: Communication protocol (http/https/grpc)
- **health_check**: Enable health checking
- **load_balancing**: Load balancing strategy

### Security Configuration
- **auth_type**: Authentication type (jwt/basic/oauth2)
- **allowed_origins**: CORS allowed origins
- **rbac_rules**: RBAC rule definitions
- **tls**: TLS configuration

### Performance Configuration
- **rate_limit**: Request rate limiting
- **timeout**: Connection and request timeouts
- **retry**: Retry configuration

## Environment Setup

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Configure backend URL:
```env
VITE_API_BASE_URL=http://localhost:8080
```

3. Ensure backend is running with AI service configured

## Testing

Run the test suite to verify integration:

```javascript
// In browser console
import { testAIService } from './src/services/aiService.test';
await testAIService.runAll();
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running
   - Check `VITE_API_BASE_URL` in `.env`
   - Ensure CORS is configured on backend

2. **Configuration Generation Failed**
   - Check Claude API key in backend
   - Verify request parameters are valid
   - Check backend logs for AI service errors

3. **Apply Configuration Failed**
   - Ensure user has proper permissions
   - Verify MongoDB connection in backend
   - Check resource conflicts

## Development

### Adding New Form Fields

1. Update types in `types/aiConfig.ts`
2. Add form controls in appropriate form component
3. Update Redux slice if needed
4. Update backend types to match

### Extending AI Capabilities

1. Update prompt in backend `config_generator.go`
2. Add new supported configurations in `supported_configs.go`
3. Update frontend types and forms accordingly

## API Reference

### POST /api/v1/ai/generate
Generate Envoy configuration using AI

### POST /api/v1/ai/apply
Apply generated configurations to system

### POST /api/v1/ai/validate
Validate configuration request

### GET /api/v1/ai/status
Get AI service status

### GET /api/v1/ai/features
Get supported features and options