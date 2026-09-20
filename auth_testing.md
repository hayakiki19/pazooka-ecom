# Auth-Gated Testing Playbook (PAZOOKA)

## Step 1: Create Test User & Session
```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({ user_id: userId, email: 'test.user.' + Date.now() + '@example.com', name: 'Test User', picture: null, created_at: new Date() });
db.user_sessions.insertOne({ user_id: userId, session_token: sessionToken, expires_at: new Date(Date.now() + 7*24*60*60*1000), created_at: new Date() });
print('Session token: ' + sessionToken);
"
```

## Step 2: Test Backend API
```bash
curl -X GET "https://<app>/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser Testing
```javascript
await page.context.add_cookies([{ name: "session_token", value: "TOKEN", domain: "<app>", path: "/", httpOnly: true, secure: true, sameSite: "None" }]);
// OR localStorage.setItem("pazooka_token", TOKEN) — frontend sends Bearer header
```

## Rules
- Users have custom `user_id` (UUID); Mongo `_id` never exposed (`{"_id": 0}` projection)
- Sessions in `user_sessions`, 7-day expiry, timezone-aware compare (naive Mongo datetimes get `.replace(tzinfo=timezone.utc)`)
- Auth check: cookie `session_token` first, then `Authorization: Bearer` header (no HTTPAuthorizationCredentials dependency)
- OAuth callback: detect `session_id` via `useLocation().hash` during render (not useEffect, not window.location.hash)
- AuthProvider skips /auth/me when hash contains session_id=; AuthCallback uses useRef processed flag
- Clean test data: `db.users.deleteMany({email: /test\.user\./}); db.user_sessions.deleteMany({session_token: /test_session/})`
