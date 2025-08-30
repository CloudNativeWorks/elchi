# Success Notification Sistemi - Kullanım Kılavuzu

## Genel Bakış

Success notification sistemi, API işlemlerinde başarılı durumları otomatik olarak algılar ve modern glassmorphism tasarımla yeşil notification gösterir. Sistem:

1. **Otomatik Success Mesaj Tespiti**: API response'larından success mesajlarını otomatik bulur
2. **Sayfa Bazlı Kontrol**: Hangi sayfalarda success notification gösterileceğini kontrol eder
3. **Duplicate Prevention**: Aynı mesajın birden fazla gösterilmesini engeller
4. **Modern UI**: Error ve warning notification'larla aynı glassmorphism tasarım

## Success Mesaj Path'leri

Sistem bu path'lerden success mesajlarını otomatik tespit eder:
```typescript
- responseData?.message
- responseData?.data?.message  
- responseData?.success_message
- responseData?.result?.message
- responseData?.response?.message
```

## API Kullanımı

### 1. useErrorHandler Hook ile

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

const { handleResponse, showSuccess } = useErrorHandler();

// Manuel success notification
showSuccess('Operation completed successfully!', 'Success');

// API response ile otomatik success handling (DEFAULT: success gösterilir)
const result = await someApiCall();
handleResponse(result, 
  (data) => console.log('Success callback'), 
  'Custom error message'
  // options parametresi verilmezse otomatik success gösterilir
);

// Özel success mesajı ile
handleResponse(result, 
  (data) => console.log('Success callback'), 
  'Custom error message',
  {
    customSuccessMessage: 'Custom success message', // Opsiyonel
    successTitle: 'Custom Title' // Opsiyonel
    // showAutoSuccess default true olduğu için yazılmasa da gösterilir
  }
);
```

### 2. API Hooks ile Otomatik Success (DEFAULT: true)

#### CustomApiMutation ile
```typescript
import { useCustomApiMutation } from '@/common/api';

// En basit kullanım - success otomatik gösterilir
const mutation = useCustomApiMutation({
  path: '/api/endpoint',
  method: 'POST',
  data: payload
  // showAutoSuccess default true olduğu için success otomatik gösterilir
});

// Özel success mesajı ile
const mutation = useCustomApiMutation({
  path: '/api/endpoint',
  method: 'POST',
  data: payload,
  customSuccessMessage: 'Configuration saved successfully!',
  successTitle: 'Configuration Updated'
});

// Kullanım
mutation.mutate(payload, {
  onSuccess: (data) => {
    // Success notification otomatik gösterildi
    // Ek işlemler burada yapılabilir
  }
});
```

#### CustomMutation ile  
```typescript
import { useCustomMutation } from '@/common/api';

// En basit kullanım - success otomatik gösterilir
const mutation = useCustomMutation({
  // ... diğer parametreler
  // showAutoSuccess default true - success otomatik gösterilir
});

// Özel mesaj ile
const mutation = useCustomMutation({
  // ... diğer parametreler
  customSuccessMessage: 'Resource created successfully!',
  successTitle: 'Success'
});
```

### 3. Success Notification'ı Bastırma

Success notification göstermek istemiyorsanız:

```typescript
// YÖNTEM 1: showAutoSuccess: false
const mutation = useCustomApiMutation({
  path: '/api/endpoint', 
  method: 'POST',
  data: payload,
  showAutoSuccess: false // Success notification gösterilmez
});

// YÖNTEM 2: suppressSuccess: true (aynı etki)
const mutation = useCustomApiMutation({
  path: '/api/endpoint',
  method: 'POST', 
  data: payload,
  suppressSuccess: true // Success notification gösterilmez
});
```

## Örnek Kullanım Senaryoları

### 1. Dosya Yükleme
```typescript
const handleFileUpload = async (file: File) => {
  const { handleResponse } = useErrorHandler();
  
  try {
    const response = await uploadFile(file);
    handleResponse(response, 
      (data) => {
        // Success işlemleri
        refreshFileList();
      },
      'Upload failed',
      {
        // showAutoSuccess default true - yazmaya gerek yok
        customSuccessMessage: `File "${file.name}" uploaded successfully!`,
        successTitle: 'Upload Complete'
      }
    );
  } catch (error) {
    // Error otomatik handle edildi
  }
};
```

### 2. Form Kaydetme (En Basit)
```typescript
// En basit kullanım - success otomatik gösterilir
const saveFormMutation = useCustomApiMutation({
  path: '/api/forms',
  method: 'POST',
  data: formData,
  customSuccessMessage: 'Form data saved successfully!',
  successTitle: 'Saved'
  // showAutoSuccess yazmaya gerek yok - default true
});

const handleSave = () => {
  saveFormMutation.mutate(formData, {
    onSuccess: (data) => {
      // Success notification otomatik gösterildi
      form.resetFields();
      navigate('/forms');
    }
  });
};
```

### 3. Silent Operations (Success Göstermeme)
```typescript
// Background işlemler için success göstermeme
const backgroundSync = useCustomApiMutation({
  path: '/api/sync',
  method: 'POST', 
  data: {},
  showAutoSuccess: false // Sessiz işlem
});

// Periyodik data fetch için success göstermeme
const { data } = useCustomGetQuery({
  queryKey: 'periodic-data',
  path: '/api/data',
  showAutoSuccess: false // Periyodik işlemler için sessiz
});
```

## Mevcut Dosyalarda Success Notification'ları

Sistem analiz sonucuna göre aşağıdaki dosyalarda manuel success mesajları bulundu:

### Otomatik Success Gösterilmesi Önerilen Dosyalar:
- `src/pages/settings/CloudsConfig.tsx` - Cloud config save/delete
- `src/pages/settings/AI.tsx` - API key save/delete  
- `src/elchi/components/clients/ClientVersions.tsx` - Version install
- `src/pages/settings/Groups.tsx` - Group delete
- `src/pages/settings/users.tsx` - User delete
- `src/hooks/useJobOperations.ts` - Job operations

### Manuel Success Korunması Önerilen Dosyalar:
- `src/pages/logs/Logs.tsx` - Log analysis completion
- `src/pages/discovery/Discovery.tsx` - Copy to clipboard
- `src/hooks/useJobOperations.ts` - Job status updates

## Best Practices

1. **API Operations**: Tüm CRUD işlemlerde `showAutoSuccess: true` kullan
2. **User Feedback**: Kullanıcının hareketi sonrası success göster
3. **Background Tasks**: Arka plan işlemlerde `suppressSuccess: true` kullan
4. **Custom Messages**: Generic mesajlar yerine spesifik mesajlar kullan
5. **Consistent Titles**: Benzer işlemler için aynı title'ları kullan

## Migration Rehberi

Mevcut manuel success notification'ları otomatik sisteme geçirme:

```typescript
// ÖNCE (Manuel)
messageApi.success('Configuration saved successfully!');

// SONRA (Otomatik)  
const mutation = useCustomApiMutation({
  path: '/api/config',
  method: 'POST',
  data: config,
  showAutoSuccess: true,
  customSuccessMessage: 'Configuration saved successfully!'
});
```

Bu sistem sayesinde tüm projede tutarlı, modern ve kullanıcı dostu success notification deneyimi sağlanır.