# Owners Portal Authentication

The `/owners` page is protected with password authentication to restrict access to authorized users only.

## How It Works

- **Password Hashing**: Passwords are hashed using SHA-256 for security
- **Session Storage**: Authentication persists in browser session storage
- **Build-Time Configuration**: Password hash is embedded at build time from environment variables
- **No Server Required**: Works with static site deployment (no SSR needed)

## Security Features

1. **Password is never stored in plain text** - Only the SHA-256 hash is used
2. **Session-based auth** - Authentication clears when browser session ends
3. **Not linked in navigation** - Page is only accessible via direct URL
4. **robots.txt** - Configured to prevent search engine indexing of the owners portal

## Setup Instructions

### Step 1: Generate Password Hash

Use the included script to generate a secure hash:

```bash
node scripts/generate-password-hash.js "your-secure-password"
```

This will output something like:
```
OWNERS_PASSWORD_HASH=sha256-abc123def456...
```

### Step 2: Add to Environment Variables

Create or update your `.env` file:

```bash
# Copy from .env.example if needed
cp .env.example .env

# Edit .env and add your password hash
nano .env
```

Add the generated hash:
```
OWNERS_PASSWORD_HASH=sha256-your_generated_hash_here
```

### Step 3: Build the Site

The password hash is embedded at build time:

```bash
npm run build
```

### Step 4: Deploy

Deploy the `dist/` directory to your hosting provider. The authentication will work automatically.

## Usage

1. Navigate to `https://your-domain.com/owners`
2. Enter your password (the one you used to generate the hash)
3. Click "ACCESS PORTAL"
4. If correct, you'll see the Owners Portal content
5. Authentication persists for the browser session

## Changing the Password

1. Generate a new hash with the script:
   ```bash
   node scripts/generate-password-hash.js "new-password"
   ```

2. Update `OWNERS_PASSWORD_HASH` in your `.env` file

3. Rebuild and redeploy:
   ```bash
   npm run build
   # Deploy the dist/ folder
   ```

## Additional Security Recommendations

### 1. Search Engine Protection

The project already includes a `public/robots.txt` configuration that prevents search engines from indexing the `/owners` path. If you customize `public/robots.txt`, make sure you keep a rule that disallows crawling of `/owners`.

### 2. Use Strong Passwords

- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, and symbols
- Don't reuse passwords from other services

### 3. Environment Variable Security

- **Never commit `.env` files** - They are in `.gitignore`
- **Use different passwords for production and staging**
- **Rotate passwords periodically** (every 3-6 months)

### 4. Consider IP Whitelisting

If your hosting provider supports it, add IP whitelisting for additional security:
- Configure at your hosting provider (Netlify, Vercel, etc.)
- Whitelist only your office/home IP addresses

### 5. Monitor Access

- Check your hosting provider's analytics
- Look for unusual access patterns to `/owners`
- Consider adding analytics tracking for the page

## Limitations

⚠️ **IMPORTANT SECURITY NOTE**: This authentication is implemented entirely on the client-side by comparing the user-entered password hash against `OWNERS_PASSWORD_HASH` embedded into the static HTML/JS. This only hides the portal content in the DOM and **does not enforce any server-side access control**.

**An attacker can bypass this by:**
- Viewing the page source to see the password hash
- Manipulating the DOM (e.g., calling `showPortal()` or changing styles)
- Modifying the client script to skip authentication
- Brute-forcing the SHA-256 hash (fast hashing algorithm)

**This authentication provides:**
- Protection against casual visitors
- Search engine crawling prevention
- Simple access control for non-sensitive content

**Do NOT use this for:**
- Protecting truly sensitive data
- Production security requirements
- Compliance-required access control
- Multi-user access management

Since this is client-side authentication on a static site:

1. **Password hash is in source code** - Anyone with access to the built HTML can see the hash
2. **SHA-256 is not password-secure** - Fast hashing makes brute-force attacks feasible
3. **No server-side enforcement** - Authentication can be bypassed via browser dev tools
4. **Session-only persistence** - Users must re-authenticate in new sessions

## When to Upgrade

Consider server-side authentication (SSR/SSG with auth middleware) if:

- You need truly secure authentication
- Multiple users need different access levels
- You want persistent authentication across sessions
- You're storing sensitive data

For those cases, consider:
- Astro + Auth.js (formerly NextAuth)
- Netlify Identity
- Auth0 or similar service
- Custom backend with JWT tokens

## Troubleshooting

### "Invalid access code" error

- **Check password**: Make sure you're using the exact password you hashed
- **Verify hash**: Regenerate the hash and compare with `.env`
- **Rebuild**: Password is embedded at build time, rebuild after changing

### Password field not showing

- **JavaScript disabled**: Authentication requires JavaScript
- **Browser compatibility**: Requires modern browser with Web Crypto API
- **Console errors**: Check browser dev tools for JavaScript errors

### Authentication not persisting

- **Session storage**: Clear browser session storage
- **Private mode**: Authentication won't persist in incognito/private mode
- **Different tabs**: Each session may behave differently depending on browser

## Example: Complete Setup

```bash
# 1. Generate password hash
node scripts/generate-password-hash.js "MySecureP@ssw0rd123"

# 2. Copy output to .env
echo 'OWNERS_PASSWORD_HASH=sha256-generated_hash' >> .env

# 3. Build the site
npm run build

# 4. Preview locally (optional)
npm run preview

# 5. Deploy
# Upload dist/ folder to your hosting provider
```

## Support

For issues or questions about the Owners Portal authentication, check:
- [GitHub Issues](https://github.com/bran8912-ctrl/Matrix-Hub.org/issues)
- [README.md](../README.md) - Main project documentation
- [USAGE.md](../USAGE.md) - General usage instructions
