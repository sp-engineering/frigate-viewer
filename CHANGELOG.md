# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **Client Certificate Authentication (mTLS) Support**
  - Android: Native Keystore integration for client certificates
  - iOS: Native Keychain integration for client certificates
  - Per-server client certificate configuration
  - Automatic certificate validation and error handling
  - Support for password-protected certificates
  - Comprehensive setup guide for users and administrators
  - Full test coverage for certificate operations

### Technical Changes

- New native modules:
  - `ClientCertModule.java` (Android) - Keystore access and HTTP requests with client certs
  - `ClientCertModule.swift` (iOS) - Keychain access and HTTP requests with client certs
- New TypeScript helpers:
  - `clientCertificates.ts` - Cross-platform abstraction layer
  - `httpWithClientCert.ts` - HTTP client with certificate support
- Updated `Server` interface to include optional `clientCertConfig`
- Enhanced `ServerForm` with certificate selection UI
- Added OkHttp 4.11.0 dependency for Android HTTP requests with certificates

### Documentation

- Added comprehensive Client Certificate Setup Guide (`docs/CLIENT_CERT_SETUP.md`)
- Updated README with mTLS feature highlights
- Included platform-specific setup instructions
- Added troubleshooting and security best practices

### Testing

- Unit tests for `ClientCertificateManager`
- Redux state tests for certificate configuration
- Mocked native module tests
- Error handling validation

### Breaking Changes

None. This feature is entirely optional and backward-compatible.

### Migration

No migration required. Existing server configurations will continue to work unchanged. Client certificate authentication is opt-in through the server settings.

### Notes for Maintainers

- This PR adds two new native modules that need to be maintained alongside the existing codebase
- The Android implementation uses OkHttp for HTTP requests with client certificates
- The iOS implementation uses URLSession with custom delegate for certificate handling
- All new code is documented with JSDoc/KDoc comments
- Feature is designed to work seamlessly alongside existing authentication methods

---

## Version History

(Previous versions would be listed here)
