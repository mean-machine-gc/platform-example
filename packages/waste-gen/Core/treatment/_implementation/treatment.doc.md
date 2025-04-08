# 📘 Treatment Workflow Documentation

## ⚙️ Workflow: create treatment

### 🔹 Command
```ts
'create-treatment-wf'
```
### ✅ Event
```ts
AGG<'initial', {         treatement: { treatmentType: TreatmentType }     }>
```
### 🧱 New Aggregate Tag: `unknown``

### 🔒 Business Rule Failures
- `AGG<'created', {
        treatement: CreatedTreatment
    }>`

---

## ⚙️ Workflow: load treatment

### 🔹 Command
```ts
'load-treatment-wf'
```
### ✅ Event
```ts
AGG<'can-load', {         treatement: CreatedTreatment     }>
```
### 🧱 New Aggregate Tag: `unknown``

### 🔒 Business Rule Failures
- `AGG<'loading', {
        treatement: LoadingTreatment
    }>`

---

## ⚙️ Workflow: start treatment

### 🔹 Command
```ts
'start-treatment-wf'
```
### ✅ Event
```ts
AGG<'can-start', {         treatement: ReadyToStartTreatment     }>
```
### 🧱 New Aggregate Tag: `unknown``

### 🔒 Business Rule Failures
- `AGG<'started', {
        treatement: InProgressTreatment
    }>`

---

## ⚙️ Workflow: complete treatment

### 🔹 Command
```ts
'complete-treatment-wf'
```
### ✅ Event
```ts
AGG<'can-complete', {         treatement: InProgressTreatment     }>
```
### 🧱 New Aggregate Tag: `unknown``

### 🔒 Business Rule Failures
- `AGG<'completed', {
        treatement: CompletedTreatment
    }>`

---

