# API Error Duplicate Notifications Analysis

This report identifies ONLY API error handling that creates duplicate notifications. Validation messages have been excluded. These API error handlers should be removed since the API module already has automatic error handling via interceptors.

## Files with Duplicate API Error Handling

### 1. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/elchi/components/clients/deploy/DeployServiceDialog.tsx`

**API Hooks Used:** `useCustomGetQuery`

**Duplicate API Error Handlers:**
```typescript
// Line 266
messageApi.error(result.error);

// Line 274
messageApi.error('Operation failed. Please try again.');
```

---

### 2. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/CloudsConfig.tsx`

**API Hooks Used:** Direct `api` usage

**Duplicate API Error Handlers:**
```typescript
// Line 96
messageApi.error('Failed to fetch cloud configurations');

// Line 131
messageApi.error(error.response?.data?.message || 'Failed to save cloud configuration');

// Line 147
messageApi.error(error.response?.data?.message || 'Failed to delete cloud configuration');
```

---

### 3. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/Tokens.tsx`

**API Hooks Used:** `useCustomGetQuery`, `useCustomApiMutation`

**Duplicate API Error Handlers:**
```typescript
// Line 70
messageApi.error(error.response?.data?.message || 'Token not created!');

// Line 74
messageApi.error(error.response?.data?.message || 'Token not created!');

// Line 99
messageApi.error(error.response?.data?.message || 'Failed to delete token!');

// Line 103
messageApi.error(error.response?.data?.message || 'Failed to delete token!');

// Line 118
messageApi.error(error?.message || 'Failed to delete discovery token!');

// Line 128
messageApi.error(error?.message || 'Failed to generate discovery token!');
```

---


### 4. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/elchi/components/scenarios/ScenarioDashboard.tsx`

**API Hooks Used:** `useScenarioAPI`

**Duplicate API Error Handlers:**
```typescript
// Line 321
message.error(result.message || 'Import failed');
```

---

### 5. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/AI.tsx`

**API Hooks Used:** `useCustomGetQuery`, `useCustomApiMutation`

**Duplicate API Error Handlers:**
```typescript
// Line 119
messageApi.error(error?.response?.data?.message || error?.message || 'Failed to save OpenRouter API key!');

// Line 145
messageApi.error(error?.response?.data?.message || 'Failed to delete OpenRouter API key!');

// Line 217
messageApi.error(error?.response?.data?.message || error?.message || 'Failed to update AI model!');
```

---


### 6. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/operations/clients.tsx`

**API Hooks Used:** `useCustomGetQuery`, `useCustomApiMutation`

**Manual Error Notifications:**
```typescript
// Line 125
messageApi.error(errorMessage);
```


---


### 7. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/elchi/components/clients/ClientVersions.tsx`

**API Hooks Used:** Uses `api` directly

**Manual Error Notifications:**
```typescript
// Line 108
messageApi.error(responseData.error || responseData.envoy_version?.error_message || 'Failed to get versions');

// Line 113
messageApi.error(`Failed to get versions: ${error.message || 'Unknown error'}`);

// Line 199
messageApi.error(responseData.error || responseData.envoy_version?.error_message || 'Failed to install version');

// Line 203
messageApi.error(`Failed to install version: ${error.message || 'Unknown error'}`);
```


---

### 8. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/Groups.tsx`

**API Hooks Used:** Uses `api` directly 

**Manual Error Notifications:**
```typescript
// Line 53
messageApi.error(`Failed to delete group: ${error.response?.data?.["message"]}`);

// Line 55
messageApi.error(`Failed to delete group: ${error.message}`);
```


---

### 9. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/users.tsx`

**API Hooks Used:** Uses `api` directly

**Manual Error Notifications:**
```typescript
// Line 55
messageApi.error(`Failed to delete user: ${error.response?.data?.["message"]}`);

// Line 57
messageApi.error(`Failed to delete user: ${error.message}`);
```


---

### 10. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/Projects.tsx`

**API Hooks Used:** Uses `api` directly

**Manual Error Notifications:**
```typescript
// Line 51
messageApi.error(`Failed to delete project: ${error.response?.data?.["message"]}`);

// Line 53
messageApi.error(`Failed to delete project: ${error.message}`);
```


---

### 11. `/Users/spehlivan/Documents/CloudNativeWorks/elchi/src/pages/settings/RegistryInfo.tsx`

**API Hooks Used:** Uses `api` directly

**Manual Error Notifications:**
```typescript
// Line 216
messageApi.error(`Failed to clear snapshot: ${error.message || 'Unknown error'}`);

// Line 249
messageApi.error(errorMsg);

// Line 275
messageApi.error(errorMsg);
```


## Summary

**Total Files with Duplicate API Error Handling:** 11 files

1. DeployServiceDialog.tsx (2 duplicates)
2. CloudsConfig.tsx (3 duplicates)
3. Tokens.tsx (6 duplicates)
4. ScenarioDashboard.tsx (1 duplicate)
5. AI.tsx (3 duplicates)
6. clients.tsx (1 duplicate)
7. ClientVersions.tsx (4 duplicates)
8. Groups.tsx (2 duplicates)
9. users.tsx (2 duplicates)
10. Projects.tsx (2 duplicates)
11. RegistryInfo.tsx (3 duplicates)

**Total Duplicate Error Handlers to Remove:** ~29 instances

## Action Required

All the error handlers listed above should be removed since the API interceptor in `src/common/api.tsx` already handles these errors automatically with `showErrorNotification()`.

**Note:** Validation messages (like "Please enter email", "Please select file") have been excluded from this list and should be kept.