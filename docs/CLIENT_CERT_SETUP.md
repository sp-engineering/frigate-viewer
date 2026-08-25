# Client Certificate Authentication Setup Guide

This guide explains how to configure the Frigate Viewer app to use client certificate authentication (mutual TLS/mTLS) with your Frigate server.

## Overview

If your Frigate server requires client certificate authentication (mTLS), the Frigate Viewer app can be configured to automatically present your client certificate during the connection handshake. This provides an additional layer of security through mutual authentication.

## Prerequisites

- A valid client certificate (`.p12`/`.pfx`, `.pem`, or `.crt` format)
- The private key associated with the certificate
- Access to your device's certificate management

## Android Setup

### Step 1: Install the Client Certificate

1. **Obtain your certificate files:**
   - You should have a certificate file (e.g., `client.p12`, `client.pfx`, or `client.pem`)
   - Make sure you have the private key (usually in `.key` format or embedded in `.p12`)

2. **Install on Android:**
   - Transfer the certificate file to your Android device
   - Open **Settings** → **Security** → **Install from storage** (or similar, varies by device/Android version)
   - Select your certificate file
   - Enter any required password for the certificate
   - Confirm installation
   - The certificate will be stored in your device's Keystore

3. **Verify Installation:**
   - Go to **Settings** → **Security** → **Trusted Credentials**
   - Your certificate should appear in the list

### Step 2: Configure in Frigate Viewer

1. Open the **Frigate Viewer** app
2. Go to **Settings** → **Add Server** (or edit existing server)
3. Fill in the server details (host, port, protocol, authentication method)
4. Scroll down to the **"Client Certificate (mTLS)"** section
5. In the **"Certificate"** dropdown, select your installed certificate
6. If your certificate is password-protected, enter the password in the **"Certificate Password"** field
7. Tap **"Add Server"** or **"Save"**

The app will now use your client certificate when communicating with the Frigate server.

## iOS Setup

### Step 1: Install the Client Certificate

iOS handles certificates differently than Android. You can install certificates through several methods:

#### Method 1: Via Mail (Recommended for `.p12`)
1. Email yourself the `.p12` file
2. Open the email on your iPhone
3. Tap the attachment to open it
4. Choose to "Open in"
5. Tap "Install" when the certificate appears
6. Follow the prompts to install

#### Method 2: Via MDM or Website
- If provided by your Frigate server administrator, follow their specific installation instructions

#### Method 3: Via Configuration Profile
- If provided as a `.mobileconfig` file, open it with your iPhone and follow the installation prompts

### Step 2: Trust the Certificate

1. Go to **Settings** → **General** → **VPN & Device Management**
2. Locate your certificate and verify it's listed as "Installed"
3. If there's a "Trust" option, enable it for the certificate

### Step 3: Configure in Frigate Viewer

1. Open the **Frigate Viewer** app
2. Go to **Settings** → **Add Server** (or edit existing server)
3. Fill in the server details (host, port, protocol, authentication method)
4. Scroll down to the **"Client Certificate (mTLS)"** section
5. In the **"Certificate"** dropdown, select your installed certificate
6. If your certificate is password-protected, enter the password
7. Tap **"Add Server"** or **"Save"**

## Troubleshooting

### Certificate Not Appearing in the List

**Android:**
- Verify the certificate is actually installed in Settings → Security → Trusted Credentials
- Make sure it's a client certificate (with a private key), not just a CA certificate
- Try reinstalling the certificate

**iOS:**
- Check Settings → General → VPN & Device Management
- Ensure the certificate was imported correctly
- The certificate must include the private key (`.p12` format recommended)

### Connection Fails After Setting Certificate

- **Verify the certificate is valid:** The certificate must match what the Frigate server expects
- **Check the certificate password:** If you entered a wrong password, the connection will fail
- **Test the certificate independently:** Use an external tool (e.g., `openssl`, `curl`) to verify the certificate works with your server
- **Check server logs:** Your Frigate server logs might contain information about certificate validation failures

### "Certificate Not Found" Error

- The certificate may have been uninstalled or removed from the Keystore/Keychain
- Reinstall the certificate following the instructions above
- If the error persists, try clearing the app's cache and reconfiguring the server

## Generating a Client Certificate (For Server Administrators)

If you're setting up mTLS on your Frigate server, here's how to generate a client certificate:

### Using OpenSSL

```bash
# Generate a private key and CSR
openssl req -new -newkey rsa:2048 -keyout client.key -out client.csr -subj "/CN=frigate-client"

# Sign the CSR with your CA
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365

# Create a .p12 file for mobile devices
openssl pkcs12 -export -in client.crt -inkey client.key -out client.p12 -name "Frigate Client"
```

## Advanced Configuration

### Certificate Rotation

If you need to update your certificate:
1. Install the new certificate on your device
2. In the app, go to the server settings
3. Select the new certificate from the dropdown
4. Save the changes

### Multiple Servers with Different Certificates

The app supports configuring different certificates for different servers:
1. Install all required certificates on your device
2. For each server in the app, select the appropriate certificate
3. Each server will use its designated certificate when connecting

### Disabling Client Certificate Authentication

If you want to temporarily disable client certificate authentication:
1. Go to the server settings
2. In the Client Certificate section, select the first option: "-- Select a Certificate --"
3. Clear the selection and save
4. The server will connect without using a client certificate

## Security Best Practices

- **Protect your certificates:** Keep your `.p12`/`.pfx` files secure
- **Use strong passwords:** If your certificate file has a password, use a strong one
- **Verify certificate validity:** Before installing, verify the certificate comes from a trusted source
- **Rotate certificates periodically:** Update your client certificates regularly for security
- **Monitor access:** Check your Frigate server logs for unauthorized certificate usage

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Enable debug logging (if available in the app settings)
3. Open an issue on [GitHub](https://github.com/sp-engineering/frigate-viewer/issues) with:
   - Your iOS/Android version
   - App version
   - Error messages from logs
   - (Do NOT share certificate details or passwords)

## References

- [OWASP mTLS Guide](https://owasp.org/www-community/attacks/Man-in-the-middle_attack)
- [RFC 8446 - TLS 1.3](https://tools.ietf.org/html/rfc8446)
- [OpenSSL Documentation](https://www.openssl.org/docs/)
